
import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { 
  Camera, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  X, 
  PenTool, 
  Eraser, 
  Download, 
  Sparkles,
  ClipboardCheck,
  Stethoscope,
  ChevronDown,
  Info,
  Copy,
  Plus,
  Trash2,
  Upload,
  Hand,
  Maximize,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Activity,
  Type,
  Volume2,
  Ear,
  Save,
  CheckCircle2,
  AlertCircle,
  Bell
} from 'lucide-react';
import { generateMedicalSummary, analyzeMedicalImage } from '../services/gemini';
import { SpecialtyType, DynamicField } from '../types';
import { SPECIALTY_FIELDS } from '../constants';

interface ConsultationProps {
  specialty: SpecialtyType;
}

const Consultation: React.FC<ConsultationProps> = ({ specialty }) => {
  const [isTelemed, setIsTelemed] = useState(true);
  const [anamnesis, setAnamnesis] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Dynamic fields state
  const fields = useMemo(() => SPECIALTY_FIELDS[specialty] || [], [specialty]);
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
  const [lastSavedValues, setLastSavedValues] = useState<string>('');

  // Annotation Canvas Logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#2C5F9E');
  const [brushSize, setBrushSize] = useState(5);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'pan'>('pen');
  const [bgImage, setBgImage] = useState<string>('https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1200');
  
  // Zoom and Pan State
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initialize Voice Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        if (isListening) recognitionRef.current.start();
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isListening]);

  const handleVoiceCommand = (text: string) => {
    let processedText = text;
    const lowerText = text.toLowerCase();

    if (lowerText.includes("finalizar ditado") || lowerText.includes("concluir ditado")) {
      setIsListening(false);
      recognitionRef.current?.stop();
      return;
    }

    if (lowerText === "limpar campo" || lowerText === "apagar tudo") {
      setAnamnesis('');
      return;
    }

    processedText = processedText
      .replace(/ponto final/gi, '.')
      .replace(/vírgula/gi, ',')
      .replace(/ponto de interrogação/gi, '?')
      .replace(/ponto de exclamação/gi, '!')
      .replace(/novo parágrafo/gi, '</p><p>')
      .replace(/nova linha/gi, '<br>');

    if (lowerText.startsWith("negrito ")) {
      processedText = `<strong>${processedText.replace(/negrito /i, '')}</strong>`;
    } else if (lowerText.startsWith("itálico ")) {
      processedText = `<em>${processedText.replace(/itálico /i, '')}</em>`;
    }

    setAnamnesis(prev => prev + (prev.endsWith(' ') ? '' : ' ') + processedText);
  };

  const toggleVoiceDictation = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleDynamicChange = (id: string, value: string) => {
    setDynamicValues(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgImage(event.target.result as string);
          clearCanvas();
          resetView();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const exportAnnotatedImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tCtx = tempCanvas.getContext('2d');
      
      if (tCtx) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = bgImage;
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            const hRatio = tempCanvas.width / img.width;
            const vRatio = tempCanvas.height / img.height;
            const ratio = Math.min(hRatio, vRatio);
            const centerShiftX = (tempCanvas.width - img.width * ratio) / 2;
            const centerShiftY = (tempCanvas.height - img.height * ratio) / 2;
            
            tCtx.fillStyle = '#fff';
            tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tCtx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
            tCtx.drawImage(canvas, 0, 0);
            resolve(null);
          };
          img.onerror = reject;
        });

        const link = document.createElement('a');
        link.download = `medcore-exame-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error("Export failed", error);
      alert("Erro ao exportar imagem.");
    }
  };

  const handleAIImageAnalysis = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsAnalyzingImage(true);
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = bgImage;
        await new Promise((resolve) => {
          img.onload = () => {
            tCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            tCtx.drawImage(canvas, 0, 0);
            resolve(null);
          };
        });
        
        const dataUrl = tempCanvas.toDataURL('image/png');
        const analysis = await analyzeMedicalImage(dataUrl);
        
        // Structured clinical formatting for the record
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const formattedAnalysis = `
          <p><br></p>
          <div style="background-color: #f0f7ff; border: 1.5px solid #2C5F9E; border-radius: 12px; padding: 16px; margin: 10px 0;">
            <p style="margin-bottom: 8px;"><strong style="color: #2C5F9E; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">
              <span style="font-size: 14px;">✦</span> Análise Auxiliar de Imagem (IA) - ${timestamp}
            </strong></p>
            <p style="color: #1e293b; font-size: 14px; line-height: 1.6; margin: 0;">
              ${analysis.replace(/\n/g, '<br>')}
            </p>
            <p style="margin-top: 8px; font-size: 10px; color: #64748b; font-style: italic;">
              * Esta análise é um suporte à decisão clínica e deve ser validada pelo médico responsável.
            </p>
          </div>
          <p><br></p>
        `;

        setAnamnesis(prev => prev + formattedAnalysis);
        setNotification({ message: 'Análise de imagem inserida no prontuário com sucesso!', type: 'success' });
      }
    } catch (error) {
      console.error("Analysis failed", error);
      setNotification({ message: 'Falha ao processar análise de imagem. Tente novamente.', type: 'error' });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const zoomSpeed = 0.0015;
    const delta = -e.deltaY;
    const newScale = Math.min(Math.max(scale + delta * zoomSpeed * scale, 0.5), 15);
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const scaleRatio = newScale / scale;
    setOffset(prev => ({
      x: mouseX - (mouseX - prev.x) * scaleRatio,
      y: mouseY - (mouseY - prev.y) * scaleRatio,
    }));
    setScale(newScale);
  };

  const getInternalCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startInteraction = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setLastMousePos({ x, y });
    if (activeTool === 'pan' || e.button === 1) {
      setIsPanning(true);
      e.preventDefault();
    } else {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { x: internalX, y: internalY } = getInternalCoords(x, y);
      ctx.beginPath();
      ctx.moveTo(internalX, internalY);
    }
  };

  const stopInteraction = () => {
    setIsDrawing(false);
    setIsPanning(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const performInteraction = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    if (isPanning) {
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x, y });
    } else if (isDrawing) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { x: internalX, y: internalY } = getInternalCoords(x, y);
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = drawingColor;
      }
      ctx.lineTo(internalX, internalY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(internalX, internalY);
    }
  };

  const saveDynamicFieldsToRecord = () => {
    let hasData = false;
    let formattedFields = `<p><br></p><div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px;">
      <p style="margin-bottom: 12px;"><strong style="color: #2C5F9E; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Dados Estruturados (${specialty})</strong></p>
      <ul style="margin: 0; padding-left: 18px; color: #475569; font-size: 13px;">`;
    
    fields.forEach(field => {
      const val = dynamicValues[field.id];
      if (val) {
        hasData = true;
        formattedFields += `<li style="margin-bottom: 4px;"><strong>${field.label}:</strong> ${val}</li>`;
      }
    });

    formattedFields += '</ul></div><p><br></p>';
    
    if (hasData) {
      setAnamnesis(prev => prev + formattedFields);
      const snapshot = JSON.stringify(dynamicValues);
      setLastSavedValues(snapshot);
      setNotification({ message: 'Dados estruturados consolidados com sucesso!', type: 'success' });
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const handleAISummary = async () => {
    setIsGenerating(true);
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = anamnesis;
      const plainTextAnamnesis = tempDiv.textContent || tempDiv.innerText || "";
      const dynamicContext = fields.map(f => `${f.label}: ${dynamicValues[f.id] || 'Não informado'}`).join('\n');
      const fullKeywords = `Notas principais: ${plainTextAnamnesis}\nCampos específicos (${specialty}):\n${dynamicContext}`;
      const summary = await generateMedicalSummary(fullKeywords);
      const formattedSummary = `<p><br></p><p><span style="color: #2C5F9E;"><strong>--- RESUMO INTELIGENTE IA ---</strong></span></p><p>${summary.replace(/\n/g, '<br>')}</p>`;
      setAnamnesis(prev => prev + formattedSummary);
      setNotification({ message: 'Resumo inteligente gerado e anexado.', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Erro ao gerar resumo assistido.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const isFieldsDirty = useMemo(() => {
    return JSON.stringify(dynamicValues) !== lastSavedValues && Object.values(dynamicValues).some(v => v !== '');
  }, [dynamicValues, lastSavedValues]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 overflow-hidden relative">
      
      {/* Dynamic Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-12 z-[100] animate-in slide-in-from-right-8 fade-in duration-500`}>
          <div className={`glass p-4 pr-6 rounded-2xl border flex items-center gap-4 shadow-2xl ${
            notification.type === 'success' ? 'bg-emerald-50/90 border-emerald-200' : 'bg-rose-50/90 border-rose-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${
                notification.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {notification.type === 'success' ? 'Sucesso' : 'Atenção'}
              </p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-2 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Active Session Header */}
      <div className="glass p-4 rounded-2xl flex items-center justify-between border-slate-200/50 shadow-sm bg-white/70">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-petrol-dark text-white flex items-center justify-center font-bold text-lg shadow-md">AS</div>
          <div>
            <h3 className="font-bold text-petrol-dark text-lg">Ana Silva</h3>
            <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Em Atendimento • 12:45
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end px-4 border-r border-slate-200">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Especialidade</span>
            <span className="text-sm font-bold text-petrol-vibrant">{specialty}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsTelemed(!isTelemed)} 
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                isTelemed 
                  ? 'bg-petrol-vibrant/10 border-petrol-vibrant/20 text-petrol-vibrant' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              {isTelemed ? <Video size={16} /> : <Stethoscope size={16} />}
              {isTelemed ? 'Telemedicina' : 'Presencial'}
            </button>
            <button className="px-6 py-2.5 bg-rose-500 rounded-xl text-xs font-bold shadow-lg shadow-rose-500/10 hover:bg-rose-600 transition-all text-white">Finalizar Atendimento</button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Side: Video/Image Tools */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-full overflow-hidden">
          {isTelemed ? (
            <div className="relative flex-1 glass rounded-3xl border border-slate-200/50 overflow-hidden bg-slate-900 shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="https://picsum.photos/1280/720?random=patient" className="w-full h-full object-cover opacity-90" alt="Patient" />
                {!isCamOff && (
                  <div className="absolute bottom-6 right-6 w-56 aspect-video rounded-2xl border-2 border-white/50 overflow-hidden shadow-2xl ring-4 ring-black/10">
                    <img src="https://picsum.photos/320/240?random=doctor" className="w-full h-full object-cover" alt="Doctor" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 glass rounded-3xl border border-white/30 shadow-2xl bg-white/40">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full transition-all flex items-center justify-center ${isMuted ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/20 hover:bg-white/30 text-slate-800'}`}>
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button onClick={() => setIsCamOff(!isCamOff)} className={`p-4 rounded-full transition-all flex items-center justify-center ${isCamOff ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/20 hover:bg-white/30 text-slate-800'}`}>
                  {isCamOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
                <div className="w-px h-8 bg-slate-800/20 mx-2"></div>
                <button className="px-6 py-3 bg-petrol-vibrant rounded-2xl text-sm font-bold text-white hover:bg-petrol-medium transition-all shadow-lg shadow-petrol-vibrant/20">Compartilhar Tela</button>
              </div>
            </div>
          ) : (
            <div className="flex-1 glass rounded-3xl border border-slate-200/50 overflow-hidden flex flex-col shadow-lg bg-white/80">
              <div className="p-5 border-b border-slate-200/50 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-4">
                  <h4 className="font-bold flex items-center gap-2 text-petrol-dark whitespace-nowrap">
                    <Stethoscope size={20} className="text-petrol-vibrant" /> Visualizador de Imagem
                  </h4>
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tamanho</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={brushSize} 
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-24 h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-petrol-vibrant"
                    />
                    <span className="text-[10px] font-bold text-petrol-dark w-4">{brushSize}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 mr-2">
                      <button onClick={() => { setActiveTool('pen'); setDrawingColor('#2C5F9E'); }} className={`w-8 h-8 rounded-lg ${drawingColor === '#2C5F9E' && activeTool === 'pen' ? 'ring-2 ring-petrol-dark scale-110 shadow-md' : 'opacity-60'} bg-petrol-vibrant transition-all m-1`}></button>
                      <button onClick={() => { setActiveTool('pen'); setDrawingColor('#ef4444'); }} className={`w-8 h-8 rounded-lg ${drawingColor === '#ef4444' && activeTool === 'pen' ? 'ring-2 ring-petrol-dark scale-110 shadow-md' : 'opacity-60'} bg-rose-500 transition-all m-1`}></button>
                      <button onClick={() => { setActiveTool('pen'); setDrawingColor('#10b981'); }} className={`w-8 h-8 rounded-lg ${drawingColor === '#10b981' && activeTool === 'pen' ? 'ring-2 ring-petrol-dark scale-110 shadow-md' : 'opacity-60'} bg-emerald-500 transition-all m-1`}></button>
                    </div>
                    <button onClick={() => setActiveTool('pen')} className={`p-2.5 rounded-xl transition-all ${activeTool === 'pen' ? 'bg-petrol-vibrant text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`} title="Caneta"><PenTool size={20} /></button>
                    <button onClick={() => setActiveTool('eraser')} className={`p-2.5 rounded-xl transition-all ${activeTool === 'eraser' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`} title="Borracha"><Eraser size={20} /></button>
                    <button onClick={() => setActiveTool('pan')} className={`p-2.5 rounded-xl transition-all ${activeTool === 'pan' ? 'bg-petrol-dark text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`} title="Mover"><Hand size={20} /></button>
                    <button onClick={clearCanvas} className="p-2.5 hover:bg-rose-100 hover:text-rose-500 rounded-xl text-slate-400 transition-all"><Trash2 size={20} /></button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button onClick={exportAnnotatedImage} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-petrol-dark transition-all"><Download size={20} /></button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-petrol-vibrant/10 border border-petrol-vibrant/20 text-petrol-vibrant hover:bg-petrol-vibrant hover:text-white rounded-xl transition-all text-xs font-bold"><Upload size={16} /> Abrir Exame</button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
              
              <div 
                ref={containerRef}
                onWheel={handleWheel}
                onMouseDown={startInteraction}
                onMouseUp={stopInteraction}
                onMouseMove={performInteraction}
                onMouseLeave={stopInteraction}
                className={`flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center select-none cursor-${isPanning ? 'grabbing' : activeTool === 'pan' ? 'grab' : 'crosshair'}`}
              >
                <div style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0', transition: isPanning ? 'none' : 'transform 0.05s ease-out' }} className="relative flex items-center justify-center pointer-events-none shadow-2xl">
                  <img src={bgImage} alt="Medical Exam" className="max-w-none w-[800px] h-[600px] object-contain bg-white" />
                  <canvas ref={canvasRef} width={800} height={600} className="absolute inset-0 pointer-events-auto" />
                </div>
                <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                  <div className="flex flex-col gap-1 p-1.5 glass rounded-2xl shadow-xl border border-white/50">
                    <button onClick={() => setScale(s => Math.min(s * 1.3, 15))} className="p-3 bg-white/80 hover:bg-white rounded-xl text-petrol-dark shadow-sm"><ZoomIn size={20} /></button>
                    <button onClick={() => setScale(s => Math.max(s / 1.3, 0.5))} className="p-3 bg-white/80 hover:bg-white rounded-xl text-petrol-dark shadow-sm"><ZoomOut size={20} /></button>
                  </div>
                  <button onClick={resetView} className="p-3 glass rounded-2xl text-petrol-dark hover:bg-white shadow-xl border border-white/50"><Maximize size={20} /></button>
                </div>
              </div>

              <div className="p-4 bg-white flex items-center justify-between border-t border-slate-200">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Info size={14} className="text-petrol-medium" /> 
                    Dica: Use a borracha para limpar anotações. Clique com o botão do meio para mover a imagem.
                  </div>
                </div>
                <button 
                  onClick={handleAIImageAnalysis}
                  disabled={isAnalyzingImage}
                  className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all px-6 py-2 rounded-xl border ${
                    isAnalyzingImage 
                      ? 'text-slate-400 bg-slate-50 border-slate-200' 
                      : 'text-petrol-vibrant hover:text-white hover:bg-petrol-vibrant border-petrol-vibrant/20 shadow-sm'
                  }`}
                >
                  {isAnalyzingImage ? (
                    <><Activity size={14} className="animate-spin" /> Processando Visão Computacional...</>
                  ) : (
                    <><Sparkles size={16} /> Identificar Pontos Críticos com IA</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Log / PEP */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex-1 glass rounded-3xl border border-slate-200/50 overflow-hidden flex flex-col shadow-lg bg-white/80">
            <div className="p-6 border-b border-slate-200/50 flex items-center justify-between bg-white/50">
              <h4 className="font-bold flex items-center gap-2 text-petrol-dark">
                <ClipboardCheck size={22} className="text-petrol-vibrant" /> Registro Clínico
              </h4>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleVoiceDictation}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                    isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:text-petrol-vibrant'
                  }`}
                  title="Ditar (VoicePEP™)"
                >
                  {isListening ? <Mic size={16} className="animate-bounce" /> : <Ear size={16} />}
                  {isListening ? 'Ouvindo...' : 'Ditar'}
                </button>
                <button 
                  onClick={handleAISummary}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-petrol-vibrant text-white rounded-xl text-xs font-bold hover:bg-petrol-medium transition-all disabled:opacity-50 shadow-md shadow-petrol-vibrant/20"
                >
                  <Sparkles size={16} /> {isGenerating ? 'Analisando...' : 'IA Resumo'}
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {fields.length > 0 && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/50 space-y-4 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-petrol-vibrant/10 text-petrol-vibrant flex items-center justify-center">
                        <Activity size={16} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-petrol-medium">
                        Campos Estruturados ({specialty})
                      </span>
                    </div>
                    <button 
                      onClick={saveDynamicFieldsToRecord}
                      disabled={!isFieldsDirty}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        isFieldsDirty 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-100 text-slate-400 opacity-60'
                      }`}
                    >
                      {isFieldsDirty ? <Save size={12} /> : <CheckCircle2 size={12} />} 
                      {isFieldsDirty ? 'Consolidar' : 'Sincronizado'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {fields.map((field) => (
                      <div key={field.id} className={field.type === 'textarea' ? 'col-span-full' : ''}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider">
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={dynamicValues[field.id] || ''}
                            onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-petrol-dark placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all resize-none min-h-[100px] font-medium"
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={dynamicValues[field.id] || ''}
                            onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-petrol-dark placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-bold"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {!isFieldsDirty && lastSavedValues && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md flex items-center gap-1 text-[8px] font-black uppercase border border-emerald-100">
                      <CheckCircle2 size={10} /> Consolidado no Prontuário
                    </div>
                  )}
                </div>
              )}

              <div className="rich-editor-container space-y-2">
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Evolução do Caso & Anamnese
                  </label>
                  {isListening && (
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-tighter animate-pulse flex items-center gap-1">
                      <Mic size={10} /> Ditado em Tempo Real
                    </span>
                  )}
                </div>
                <div className="min-h-[350px] flex flex-col group border border-slate-200 rounded-2xl overflow-hidden relative shadow-inner">
                  <ReactQuill 
                    theme="snow"
                    value={anamnesis}
                    onChange={setAnamnesis}
                    modules={quillModules}
                    placeholder="Inicie o ditado ou digite a evolução livre..."
                    className="flex-1 flex flex-col transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
                  Conduta & Prescrição
                </label>
                <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer min-h-[120px] flex items-center justify-center group">
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 group-hover:scale-110 group-hover:bg-petrol-vibrant/10 group-hover:text-petrol-vibrant transition-all">
                      <Plus size={20} />
                    </div>
                    <p className="text-xs text-slate-400 font-bold group-hover:text-slate-600 transition-colors uppercase tracking-widest">Adicionar Item</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-12">
                <button className="flex items-center justify-center gap-3 p-5 rounded-2xl border border-slate-200 bg-white hover:border-petrol-vibrant/50 hover:bg-petrol-vibrant/5 transition-all group shadow-sm">
                   <Download size={22} className="text-petrol-medium group-hover:scale-110 transition-transform" />
                   <span className="text-sm font-bold text-slate-600">Baixar Receita</span>
                </button>
                <button className="flex items-center justify-center gap-3 p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group shadow-sm">
                   <CheckCircle2 size={22} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                   <span className="text-sm font-bold text-slate-600">Assinar Digital</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
