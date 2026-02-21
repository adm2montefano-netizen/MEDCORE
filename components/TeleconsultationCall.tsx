
import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, X, 
  MessageSquare, ClipboardList, Zap, Sparkles, 
  Send, Shield, Maximize, Share2, Save, Activity,
  AlertCircle, ChevronRight, User, History, Plus,
  Volume2, VolumeX, RefreshCw, Settings, MoreHorizontal,
  CheckCircle2, Laptop, MonitorUp, Clock, ZoomIn, 
  Volume1, Volume
} from 'lucide-react';
import { generateMedicalSummary } from '../services/gemini';

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

interface TeleconsultationCallProps {
  appointment: any;
  onClose: (finalNotes?: string) => void;
}

const TeleconsultationCall: React.FC<TeleconsultationCallProps> = ({ appointment, onClose }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'chat' | 'prescriptions'>('notes');
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isVolumeMuted, setIsVolumeMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [notes, setNotes] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'patient', text: 'Bom dia, Doutor. Já estou conectado.', time: '14:30' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize WebRTC Media reacting to facingMode
  useEffect(() => {
    const initMedia = async () => {
      setIsConnecting(true);
      stopAllStreams();
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        });
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Try to apply hardware zoom if supported
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities() as any;
        if (capabilities.zoom) {
           await videoTrack.applyConstraints({ advanced: [{ zoom: zoomLevel }] } as any);
        }
        
        setTimeout(() => setIsConnecting(false), 1500);
      } catch (err) {
        console.error("Falha ao acessar dispositivos de mídia:", err);
        setIsConnecting(false);
      }
    };

    initMedia();

    return () => {
      stopAllStreams();
    };
  }, [facingMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const stopAllStreams = () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
  };

  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleCam = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isCamOff;
      });
      setIsCamOff(!isCamOff);
    }
  };

  const handleToggleZoom = async () => {
    const nextZoom = zoomLevel === 1 ? 2 : 1;
    setZoomLevel(nextZoom);
    
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
       const capabilities = videoTrack.getCapabilities() as any;
       if (capabilities.zoom) {
          try {
            await videoTrack.applyConstraints({ advanced: [{ zoom: nextZoom }] } as any);
          } catch(e) {
            console.warn("Hardware zoom not supported or failed, using CSS fallback.");
          }
       }
    }
  };

  const handleShareScreen = async () => {
    if (isSharingScreen) {
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsSharingScreen(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsSharingScreen(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        };
      } catch (err) {
        console.error("Erro no compartilhamento de tela:", err);
      }
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'doctor',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
    
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'patient',
        text: 'Certo, Doutor. Vou conferir as orientações agora.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const handleAiRefine = async () => {
    setIsAiProcessing(true);
    const summary = await generateMedicalSummary(notes || "Consulta em andamento.");
    const formattedAi = `<p><br></p><div style="background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-left: 4px solid #2C5F9E; border-radius: 12px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="color: #2C5F9E; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">IA Medical Assistant</span>
      </div>
      <p style="color: #2E446B; font-size: 14px; line-height: 1.6;">${summary}</p>
    </div><p><br></p>`;
    setNotes(prev => prev + formattedAi);
    setIsAiProcessing(false);
  };

  const handleAddPrescription = (medication: string) => {
    const prescriptionText = `<p><strong>✓ Prescrição Adicionada:</strong> ${medication} - Conforme indicação clínica.</p>`;
    setNotes(prev => prev + prescriptionText);
    setActiveTab('notes');
  };

  const handleFinalize = () => {
    setIsSaving(true);
    setTimeout(() => {
      stopAllStreams();
      onClose(notes);
      setIsSaving(false);
    }, 2000);
  };

  const getVolumeIcon = () => {
    if (isVolumeMuted || volume === 0) return <VolumeX size={26} />;
    if (volume < 30) return <Volume size={26} />;
    if (volume < 70) return <Volume1 size={26} />;
    return <Volume2 size={26} />;
  };

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950 flex animate-in fade-in duration-500 overflow-hidden font-sans">
      {/* Visualizer Area (Patient & Screen) */}
      <div className="flex-1 relative flex flex-col bg-black">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {isConnecting ? (
            <div className="flex flex-col items-center gap-6 text-white text-center animate-pulse">
              <div className="w-16 h-16 border-4 border-white/10 border-t-petrol-vibrant rounded-full animate-spin"></div>
              <div>
                <p className="text-xl font-outfit font-bold tracking-tight">Handshake Seguro...</p>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2">Sincronizando Mídia & Criptografia</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full group">
               <img 
                 src={`https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1280`} 
                 className="w-full h-full object-cover opacity-90 transition-opacity duration-1000" 
                 alt="Remote Stream" 
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
               
               {/* Overlay Data */}
               <div className="absolute top-10 left-10 flex flex-col gap-4 z-20">
                  <div className="flex items-center gap-4 px-5 py-2.5 glass-dark rounded-2xl border border-white/10 backdrop-blur-3xl">
                    <div className="flex gap-1 items-end h-3">
                      <div className="w-1 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Stream HD Ativo</span>
                  </div>
               </div>

               <div className="absolute bottom-32 left-10 text-white z-20 animate-in slide-in-from-left-4 duration-700">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-5xl font-black font-outfit drop-shadow-2xl tracking-tight">
                      {appointment.patient.name}
                    </h2>
                    <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md">Conectado</div>
                  </div>
                  <p className="text-sm text-white/50 font-medium flex items-center gap-2">
                    <Clock size={14} /> Duração da Sessão: 08:42
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* Doctor Preview (PIP) */}
        <div className={`absolute top-10 right-10 w-72 aspect-video rounded-[2.5rem] border-2 border-white/20 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] z-30 transition-all duration-700 group ${isCamOff ? 'bg-slate-900' : 'bg-black'}`}>
          {isCamOff ? (
             <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-3">
                <VideoOff size={40} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Câmera Desligada</span>
             </div>
          ) : (
             <video 
               ref={localVideoRef} 
               autoPlay 
               muted 
               playsInline 
               className={`w-full h-full object-cover transition-transform duration-500 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
               style={{ transform: `${facingMode === 'user' ? 'scale-x(-1)' : 'scale(1)'} scale(${zoomLevel})` }}
             />
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
             <button 
                onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')} 
                className="p-3 bg-white/20 hover:bg-white/40 rounded-2xl text-white backdrop-blur-xl transition-all shadow-lg"
                title="Trocar Câmera"
             >
                <RefreshCw size={22} className={isConnecting ? "animate-spin" : ""} />
             </button>
             <button 
                onClick={handleToggleZoom} 
                className={`p-3 rounded-2xl text-white backdrop-blur-xl transition-all shadow-lg ${zoomLevel > 1 ? 'bg-petrol-vibrant' : 'bg-white/20 hover:bg-white/40'}`}
                title="Alternar Zoom"
             >
                <span className="text-xs font-black">{zoomLevel}x</span>
             </button>
          </div>
          <div className="absolute bottom-4 left-6 px-3 py-1 bg-black/50 backdrop-blur-md rounded-xl text-[8px] text-white/80 font-black uppercase tracking-widest border border-white/5">Você</div>
        </div>

        {/* Floating Console */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-5 px-10 py-6 glass-dark rounded-[3.5rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] z-40 backdrop-blur-3xl bg-black/40">
          <div className="flex items-center gap-4 pr-8 border-r border-white/10">
            <button 
              onClick={handleToggleMic} 
              className={`p-5 rounded-full transition-all relative group ${isMuted ? 'bg-rose-500 text-white shadow-2xl shadow-rose-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title="Microfone"
            >
              {isMuted ? <MicOff size={26} /> : <Mic size={26} />}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/90 rounded-xl text-[9px] text-white font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                {isMuted ? 'Áudio Mutado' : 'Áudio Ativo'}
              </div>
            </button>

            <div className="relative" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
              <button 
                onClick={() => setIsVolumeMuted(!isVolumeMuted)}
                className={`p-5 rounded-full transition-all ${isVolumeMuted ? 'bg-rose-500 text-white shadow-2xl shadow-rose-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {getVolumeIcon()}
              </button>
              
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-6 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl h-32 flex flex-col items-center">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={isVolumeMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseInt(e.target.value));
                        setIsVolumeMuted(false);
                      }}
                      className="h-24 w-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-petrol-vibrant vertical-range"
                      style={{ writingMode: 'bt-lr' as any }}
                    />
                    <span className="text-[8px] font-black text-white/50 mt-2">{isVolumeMuted ? 0 : volume}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 px-2">
            <button 
              onClick={handleToggleCam} 
              className={`p-5 rounded-full transition-all ${isCamOff ? 'bg-rose-500 text-white shadow-2xl shadow-rose-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isCamOff ? <VideoOff size={26} /> : <Video size={26} />}
            </button>
            <button 
              onClick={handleShareScreen}
              className={`p-5 rounded-full transition-all ${isSharingScreen ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title="Compartilhar Tela"
            >
              <MonitorUp size={26} />
            </button>
          </div>

          <div className="w-px h-12 bg-white/10 mx-2"></div>

          <button 
            onClick={handleFinalize} 
            disabled={isSaving}
            className="flex items-center gap-4 px-10 py-5 bg-rose-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-[0_20px_50px_rgba(225,29,72,0.4)] group active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Activity size={20} className="animate-spin" /> : <PhoneOff size={20} className="group-hover:rotate-[135deg] transition-transform duration-500" />}
            {isSaving ? 'Processando...' : 'Encerrar Atendimento'}
          </button>
        </div>
      </div>

      {/* Doctor Workspace Sidebar */}
      <div className="w-[480px] bg-white flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.2)] z-50 border-l border-slate-100">
        <div className="flex p-3 bg-slate-50/50 border-b border-slate-100">
          {[
            { id: 'notes', label: 'Evolução', icon: ClipboardList },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'prescriptions', label: 'Receituário', icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-petrol-dark shadow-xl shadow-slate-200/40 border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} className={activeTab === tab.id ? 'text-petrol-vibrant' : ''} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar space-y-8 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-petrol-dark font-outfit">Relato Clínico Digital</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Sincronização em Tempo Real</p>
                </div>
                <button 
                  onClick={handleAiRefine}
                  disabled={isAiProcessing}
                  className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-petrol-vibrant px-5 py-3 rounded-2xl shadow-xl shadow-petrol-vibrant/20 hover:bg-petrol-dark transition-all disabled:opacity-50 active:scale-95"
                >
                  {isAiProcessing ? <Activity size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Inteligência Médica
                </button>
              </div>
              <div className="flex-1 flex flex-col border border-slate-100 rounded-[2rem] overflow-hidden min-h-[420px] shadow-inner bg-slate-50/30">
                <ReactQuill theme="snow" value={notes} onChange={setNotes} placeholder="Descreva os achados e condutas aqui..." className="flex-1" />
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
              <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar">
                <div className="flex justify-center mb-6">
                   <div className="px-5 py-2 bg-white rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 shadow-sm flex items-center gap-2">
                     <Shield size={12} className="text-emerald-500" /> Canal de Comunicação Seguro
                   </div>
                </div>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                      msg.sender === 'doctor' ? 'bg-petrol-vibrant text-white rounded-br-none shadow-2xl shadow-petrol-vibrant/20' : 'bg-white text-slate-700 rounded-bl-none shadow-sm border border-slate-100'
                    }`}>
                      <p className="font-medium">{msg.text}</p>
                      <p className={`text-[9px] mt-2 font-black uppercase ${msg.sender === 'doctor' ? 'text-white/40' : 'text-slate-300'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escreva para o paciente..."
                  className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-petrol-vibrant/20 font-medium placeholder:text-slate-400"
                />
                <button onClick={handleSendMessage} className="p-4 bg-petrol-vibrant text-white rounded-2xl hover:bg-petrol-dark transition-all shadow-xl shadow-petrol-vibrant/20 active:scale-95">
                  <Send size={22} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar bg-white">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Modelos Rápidos</h4>
                <button className="text-[10px] font-black text-petrol-vibrant uppercase hover:underline">Novo Modelo</button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Dipirona 500mg (Gts)', 'Amoxicilina 500mg', 'Loratadina 10mg', 'Paracetamol 750mg'].map(item => (
                  <button 
                    key={item} 
                    onClick={() => handleAddPrescription(item)}
                    className="p-6 text-left bg-slate-50 border border-slate-100 rounded-2xl hover:border-petrol-vibrant/40 hover:bg-white hover:shadow-xl transition-all group flex justify-between items-center"
                  >
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-petrol-soft shadow-sm group-hover:bg-petrol-vibrant group-hover:text-white transition-all">
                          <Zap size={20} />
                       </div>
                       <span className="text-base font-bold text-slate-700">{item}</span>
                    </div>
                    <Plus size={22} className="text-slate-300 group-hover:text-petrol-vibrant group-hover:rotate-90 transition-all" />
                  </button>
                ))}
              </div>

              <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-petrol-vibrant/20 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-1000"></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                     <Shield size={28} />
                  </div>
                  <div>
                     <h4 className="font-bold text-lg font-outfit">Assinatura Certificada</h4>
                     <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Padrão ICP-Brasil v3.0</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed relative z-10 font-medium">
                  Documentos assinados digitalmente possuem plena validade jurídica e são aceitos em todas as farmácias do território nacional.
                </p>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10">
                  Gerenciar Certificado (A1/A3)
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.03)]">
          <button 
            onClick={handleFinalize}
            disabled={isSaving}
            className="w-full py-5 bg-petrol-dark text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-petrol-vibrant transition-all shadow-2xl shadow-petrol-dark/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? <Activity size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? 'Gravando Histórico...' : 'Finalizar & Salvar Atendimento'}
          </button>
        </div>
      </div>
      
      <style>{`
        .vertical-range {
          -webkit-appearance: none;
          transform: rotate(-90deg);
          width: 80px !important;
        }
      `}</style>
    </div>
  );
};

export default TeleconsultationCall;
