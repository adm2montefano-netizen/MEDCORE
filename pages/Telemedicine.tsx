
import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Clock, 
  Copy, 
  ExternalLink, 
  Shield, 
  Activity,
  CheckCircle2,
  VideoOff,
  Mic,
  Search,
  Filter,
  Wifi,
  BellRing,
  Link as LinkIcon,
  Plus,
  Zap,
  Share2
} from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import TeleconsultationCall from '../components/TeleconsultationCall';

interface TelemedAppointment {
  id: string;
  patient: any;
  time: string;
  status: 'WAITING' | 'CONFIRMED' | 'OFFLINE' | 'COMPLETED';
  link: string;
  signalStrength?: number;
}

interface TelemedicineProps {
  onStartConsultation: () => void;
}

const Telemedicine: React.FC<TelemedicineProps> = ({ onStartConsultation }) => {
  const [appointments, setAppointments] = useState<TelemedAppointment[]>([
    { id: 'tm-1', patient: MOCK_PATIENTS[0], time: '14:30', status: 'WAITING', link: 'medcore.live/call-782-ana', signalStrength: 5 },
    { id: 'tm-2', patient: MOCK_PATIENTS[1], time: '15:15', status: 'CONFIRMED', link: 'medcore.live/call-192-joao', signalStrength: 4 },
    { id: 'tm-3', patient: { name: 'Maria Souza', history: ['Ansiedade - 20/04/2024'] }, time: '16:00', status: 'OFFLINE', link: 'medcore.live/call-554-maria' },
  ]);
  const [activeCall, setActiveCall] = useState<TelemedAppointment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Instant Link Generator State
  const [instantLink, setInstantLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateInstantLink = () => {
    setIsGeneratingLink(true);
    // Simulate a secure generation process
    setTimeout(() => {
      const uniqueId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const uuid = window.crypto?.randomUUID?.()?.split('-')[0] || uniqueId;
      const link = `https://medcore.live/instant-${uuid}`;
      setInstantLink(link);
      setIsGeneratingLink(false);
    }, 800);
  };

  const handleStartCall = (appt: TelemedAppointment) => {
    setActiveCall(appt);
  };

  const handleCloseCall = (finalNotes?: string) => {
    if (activeCall) {
      setAppointments(prev => prev.map(a => 
        a.id === activeCall.id ? { ...a, status: 'COMPLETED' } : a
      ));
    }
    setActiveCall(null);
  };

  if (activeCall) {
    return <TeleconsultationCall appointment={activeCall} onClose={handleCloseCall} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-outfit font-bold text-petrol-dark tracking-tight">Centro de Teleconsulta</h2>
          <p className="text-slate-500 font-medium">Fila virtual segura com criptografia ponta-a-ponta.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-petrol-vibrant/10 bg-white shadow-sm">
             <div className="relative">
                <Activity size={18} className="text-petrol-vibrant animate-pulse" />
                <div className="absolute inset-0 bg-petrol-vibrant/20 blur-md rounded-full"></div>
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-petrol-dark">Canal: <span className="text-emerald-500">Criptografado</span></span>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-petrol-vibrant/10 rounded-xl">
                   <Users size={22} className="text-petrol-vibrant" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-petrol-dark">Fila de Espera</h3>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <BellRing size={12} className="animate-bounce" /> {appointments.filter(a => a.status === 'WAITING').length} Pacientes Online
             </div>
          </div>

          <div className="space-y-4">
             {appointments.map((appt) => (
               <div key={appt.id} className={`glass p-6 rounded-[2.5rem] border border-white bg-white/60 hover:shadow-2xl hover:bg-white transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 ${appt.status === 'COMPLETED' ? 'opacity-60 grayscale' : ''}`}>
                  <div className="flex items-center gap-6">
                     <div className="relative shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-all ${appt.status === 'COMPLETED' ? 'bg-slate-200 text-slate-500' : 'bg-petrol-dark text-white group-hover:scale-105 group-hover:rotate-2'}`}>
                           {appt.patient.name.charAt(0)}
                        </div>
                        {appt.status === 'WAITING' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full animate-pulse shadow-lg"></div>
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1.5">
                           <h4 className="font-bold text-xl text-petrol-dark tracking-tight">{appt.patient.name}</h4>
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${
                              appt.status === 'WAITING' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/10' :
                              appt.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/10' :
                              'bg-slate-100 text-slate-400'
                           }`}>
                              {appt.status === 'WAITING' ? 'Na sala de espera' : appt.status === 'CONFIRMED' ? 'Agendado' : appt.status === 'COMPLETED' ? 'Atendido' : 'Desconectado'}
                           </span>
                        </div>
                        <div className="flex items-center gap-5 text-xs font-semibold text-slate-500">
                           <span className="flex items-center gap-2"><Clock size={15} className="text-petrol-soft" /> {appt.time}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className="flex items-center gap-2">
                              <Shield size={15} className="text-emerald-500" /> AES-256 P2P
                           </span>
                           {appt.signalStrength && (
                              <>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-1.5 text-slate-400">
                                   <Wifi size={15} className={appt.signalStrength > 3 ? "text-emerald-500" : "text-amber-500"} /> 
                                   <span className="text-[10px] font-bold uppercase">Sinal {appt.signalStrength}/5</span>
                                </span>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <button 
                        onClick={() => handleCopyLink(appt.link, appt.id)}
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-petrol-vibrant hover:bg-white hover:border-petrol-vibrant/30 transition-all flex items-center gap-2 shadow-sm"
                        title="Copiar Link da Chamada"
                     >
                        {copiedId === appt.id ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                     </button>
                     <button 
                        onClick={() => handleStartCall(appt)}
                        disabled={appt.status === 'OFFLINE' || appt.status === 'COMPLETED'}
                        className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl ${
                           appt.status === 'WAITING' 
                             ? 'bg-petrol-vibrant text-white hover:bg-petrol-dark shadow-petrol-vibrant/30 active:scale-95' 
                             : 'bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed'
                        }`}
                     >
                        {appt.status === 'COMPLETED' ? <CheckCircle2 size={18} /> : <Video size={18} />}
                        {appt.status === 'WAITING' ? 'Atender Agora' : appt.status === 'COMPLETED' ? 'Finalizado' : 'Indisponível'}
                     </button>
                  </div>
               </div>
             ))}
          </div>

          <div className="p-12 rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/20 text-center space-y-4">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-slate-200 shadow-sm">
                <VideoOff size={36} />
             </div>
             <div>
                <p className="text-base font-bold text-slate-500 font-outfit">Fim da Fila de Espera</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Não há mais pacientes aguardando teleatendimento no momento.</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           {/* Link Generator */}
           <div className="glass p-8 rounded-[3rem] border border-white bg-white/80 shadow-2xl space-y-6 relative overflow-hidden group">
              <div className="flex items-center gap-3 relative z-10">
                 <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Zap size={20} className="text-indigo-600" />
                 </div>
                 <h3 className="text-lg font-bold font-outfit text-petrol-dark">Sala Instantânea</h3>
              </div>
              
              <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">
                Gere um link temporário para consultas de encaixe ou urgências fora da agenda.
              </p>

              <div className="space-y-4 relative z-10">
                {instantLink ? (
                  <div className="animate-in zoom-in-95 duration-300">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <LinkIcon size={16} className="text-petrol-medium shrink-0" />
                        <span className="text-[10px] font-bold text-slate-600 truncate">{instantLink}</span>
                      </div>
                      <button 
                        onClick={() => handleCopyLink(instantLink, 'instant')}
                        className={`shrink-0 p-2 rounded-lg transition-all ${copiedId === 'instant' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-200 text-slate-500'}`}
                      >
                        {copiedId === 'instant' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setInstantLink(null)}
                        className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                       >
                         Novo Link
                       </button>
                       <button 
                        onClick={() => handleStartCall({ id: 'instant-call', patient: { name: 'Paciente Externo' }, time: 'Agora', status: 'WAITING', link: instantLink })}
                        className="flex-1 py-3 bg-petrol-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-petrol-vibrant transition-all flex items-center justify-center gap-2"
                       >
                         <Video size={14} /> Entrar
                       </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={generateInstantLink}
                    disabled={isGeneratingLink}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {isGeneratingLink ? (
                      <Activity size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={18} /> Criar Sala Segura
                      </>
                    )}
                  </button>
                )}
              </div>
           </div>

           <div className="glass p-8 rounded-[3rem] border border-white bg-petrol-dark shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 blur-3xl rounded-full transition-transform group-hover:scale-125 duration-1000"></div>
              <div className="relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-petrol-soft">
                    <Shield size={28} />
                 </div>
                 <h4 className="text-2xl font-bold font-outfit mb-3">Privacidade Médica</h4>
                 <p className="text-sm text-petrol-soft leading-relaxed mb-8 font-medium">
                    Todas as sessões do MedCore utilizam o protocolo WebRTC com criptografia de ponta-a-ponta, garantindo que o vídeo nunca passe por nossos servidores de forma descriptografada.
                 </p>
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Normas HIPAA/LGPD
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;
