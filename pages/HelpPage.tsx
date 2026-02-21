
import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  PlayCircle, 
  ExternalLink,
  LifeBuoy,
  FileText,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Geral',
    questions: [
      { q: 'Como faço para cadastrar um novo paciente?', a: 'Vá até o menu "Pacientes" na barra lateral e clique no botão "+" azul no topo da lista de pacientes.' },
      { q: 'O sistema funciona offline?', a: 'O MedCore é uma plataforma baseada em nuvem, por isso requer uma conexão ativa com a internet para garantir a sincronização de dados e segurança LGPD.' },
    ]
  },
  {
    category: 'Atendimento & Telemedicina',
    questions: [
      { q: 'Como iniciar uma teleconsulta?', a: 'No módulo de "Teleconsulta", você verá a fila de pacientes. Clique em "Atender Agora" para abrir a sala virtual segura.' },
      { q: 'Como usar a Inteligência Artificial para resumos?', a: 'Durante o atendimento, clique no botão "Resumir com IA" localizado acima do campo de evolução. A IA analisará suas notas e gerará um resumo profissional.' },
    ]
  },
  {
    category: 'Financeiro & Assinatura',
    questions: [
      { q: 'Como altero meu plano de assinatura?', a: 'Acesse o menu "Assinatura" na barra lateral. Lá você encontrará as opções de migração entre os planos Starter, Pro e Enterprise.' },
      { q: 'Onde encontro minhas notas fiscais de serviço?', a: 'No menu "Assinatura", existe uma aba de "Histórico de Faturas" onde todos os comprovantes e XMLs podem ser baixados.' },
    ]
  }
];

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header com Busca */}
      <header className="text-center max-w-3xl mx-auto space-y-6 pt-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-petrol-vibrant/10 rounded-full text-petrol-vibrant border border-petrol-vibrant/20">
          <LifeBuoy size={18} className="animate-spin-slow" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Centro de Suporte MedCore</span>
        </div>
        <h2 className="text-5xl font-outfit font-extrabold text-petrol-dark tracking-tight leading-[1.1]">Como podemos ajudar você hoje?</h2>
        <p className="text-slate-500 font-medium text-lg">Pesquise em nossa base de conhecimento ou fale com um especialista.</p>
        
        <div className="relative group max-w-2xl mx-auto pt-4">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petrol-vibrant transition-colors" size={24} />
          <input 
            type="text"
            placeholder="Ex: 'como emitir nota fiscal', 'atender paciente'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[2.5rem] pl-16 pr-6 py-6 text-lg focus:outline-none focus:ring-4 focus:ring-petrol-vibrant/10 transition-all shadow-xl shadow-slate-200/50"
          />
        </div>
      </header>

      {/* Canais de Suporte Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {[
          { icon: MessageCircle, label: 'WhatsApp Suporte', detail: 'Atendimento em tempo real', action: 'Chamar agora', color: 'emerald' },
          { icon: Mail, label: 'E-mail Técnico', detail: 'Resposta em até 4h úteis', action: 'Enviar e-mail', color: 'petrol-vibrant' },
          { icon: Phone, label: 'Central 0800', detail: 'Seg a Sex, 08h às 18h', action: 'Ligar agora', color: 'indigo' },
        ].map((channel, i) => (
          <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 hover:shadow-2xl transition-all group cursor-pointer text-center flex flex-col items-center">
            <div className={`w-16 h-16 rounded-3xl bg-${channel.color === 'petrol-vibrant' ? 'petrol-vibrant' : channel.color + '-500'}/10 text-${channel.color === 'petrol-vibrant' ? 'petrol-vibrant' : channel.color + '-500'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <channel.icon size={32} />
            </div>
            <h3 className="text-xl font-bold font-outfit text-petrol-dark mb-2">{channel.label}</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">{channel.detail}</p>
            <button className="text-xs font-black uppercase tracking-widest text-petrol-vibrant hover:underline">{channel.action}</button>
          </div>
        ))}
      </div>

      {/* FAQ & Documentação */}
      <div className="grid lg:grid-cols-12 gap-10 pt-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="text-petrol-vibrant" size={24} />
            <h3 className="text-2xl font-bold font-outfit text-petrol-dark">Perguntas Frequentes (FAQ)</h3>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((section, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 py-2">{section.category}</h4>
                {section.questions.map((item, qIdx) => {
                  const id = `${sIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className="glass rounded-[1.5rem] border border-white/60 overflow-hidden bg-white/40 hover:bg-white/60 transition-all shadow-sm">
                      <button 
                        onClick={() => toggleFaq(id)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-bold text-petrol-dark text-sm pr-4">{item.q}</span>
                        {isOpen ? <ChevronUp size={18} className="text-petrol-vibrant" /> : <ChevronDown size={18} className="text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Base de Conhecimento */}
          <div className="glass p-8 rounded-[3rem] border border-white/60 bg-white/60 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-outfit text-petrol-dark flex items-center gap-2">
              <BookOpen className="text-indigo-500" size={22} /> Documentação
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Guia de Implementação', type: 'PDF', icon: FileText },
                { label: 'Tutoriais em Vídeo', type: 'MP4', icon: PlayCircle },
                { label: 'Manual do Administrador', type: 'WEB', icon: ExternalLink },
                { label: 'Segurança e LGPD', type: 'DOC', icon: ShieldCheck },
              ].map((doc, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 bg-white/50 border border-slate-100 rounded-2xl hover:border-petrol-vibrant/20 hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-petrol-vibrant transition-colors">
                      <doc.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-petrol-dark">{doc.label}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-300 group-hover:text-petrol-vibrant transition-colors">{doc.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="glass p-8 rounded-[3rem] border border-white/60 bg-petrol-dark text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold font-outfit text-lg">Status Global</h4>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Operacional</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-medium text-petrol-soft uppercase tracking-widest">
                  <span>Banco de Dados</span>
                  <span className="text-emerald-400">99.9%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-medium text-petrol-soft uppercase tracking-widest">
                  <span>API & Telemedicina</span>
                  <span className="text-emerald-400">100%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-medium text-petrol-soft uppercase tracking-widest">
                  <span>IA Assistant</span>
                  <span className="text-emerald-400">99.8%</span>
                </div>
              </div>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Ver Histórico de Incidentes
              </button>
            </div>
          </div>

          {/* News Card */}
          <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
              <Zap size={120} />
            </div>
            <div className="relative z-10">
              <div className="px-3 py-1 bg-white/20 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit mb-4">Novidade v2.4</div>
              <h4 className="text-xl font-bold font-outfit mb-2">Treinamento de Equipe</h4>
              <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                Agende uma consultoria gratuita de 30 minutos para sua recepção e otimize o uso do MedCore.
              </p>
              <button className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:underline">
                Agendar Consultoria <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Support Message */}
      <div className="text-center pt-10 space-y-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <CheckCircle2 size={24} />
        </div>
        <p className="text-slate-400 font-bold text-sm tracking-tight">Sua satisfação e conformidade são nossas prioridades.</p>
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">MedCore Intelligence Systems • 2024</p>
      </div>
    </div>
  );
};

export default HelpPage;
