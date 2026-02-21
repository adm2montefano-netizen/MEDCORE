
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Shield, Zap, Layout, PlayCircle, Video, Sparkles, Lock, Globe, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onLogin: (email: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div className="min-h-screen bg-petrol-neutral text-petrol-dark selection:bg-petrol-vibrant/20 scroll-smooth">
      {/* Dynamic Background Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-petrol-soft/30 blur-[120px] rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-petrol-medium/20 blur-[100px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass border-b border-petrol-dark/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-petrol-vibrant rounded-2xl flex items-center justify-center shadow-lg shadow-petrol-vibrant/20 group-hover:scale-110 transition-transform">
              <span className="font-bold text-white text-xl">M</span>
            </div>
            <span className="text-xl font-bold font-outfit tracking-tight text-petrol-dark">MedCore</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-semibold text-petrol-medium hover:text-petrol-vibrant transition-colors">Plataforma</a>
            <a href="#solutions" className="text-sm font-semibold text-petrol-medium hover:text-petrol-vibrant transition-colors">Especialidades</a>
            <a href="#pricing" className="text-sm font-semibold text-petrol-medium hover:text-petrol-vibrant transition-colors">Planos</a>
            <div className="h-6 w-px bg-petrol-dark/10"></div>
            <button className="px-6 py-2.5 bg-petrol-dark text-white rounded-2xl text-sm font-bold hover:bg-petrol-vibrant transition-all shadow-lg shadow-petrol-dark/10">
              Demo Grátis
            </button>
          </nav>

          <button className="md:hidden p-2 text-petrol-dark">
            <Layout size={24} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-44 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-petrol-vibrant/10 border border-petrol-vibrant/20 text-petrol-vibrant text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} className="animate-pulse" />
              Powered by Advanced Medical AI
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-outfit font-extrabold leading-[1.05] text-petrol-dark text-balance">
              Gestão Médica <span className="text-petrol-vibrant">Inteligente</span> para Clínicas Premium.
            </h1>
            
            <p className="text-xl text-petrol-medium font-medium leading-relaxed max-w-xl text-balance">
              Uma experiência Apple-style para o seu dia a dia clínico. Unificamos prontuário, telemedicina e IA em uma interface fluida e minimalista.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-petrol-vibrant rounded-[2rem] font-bold text-white hover:bg-petrol-dark transition-all flex items-center gap-3 shadow-2xl shadow-petrol-vibrant/30 group">
                Explorar Soluções <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white/50 backdrop-blur-md border border-petrol-dark/10 rounded-[2rem] font-bold text-petrol-dark hover:bg-white transition-all flex items-center gap-3 shadow-lg shadow-petrol-dark/5">
                <PlayCircle size={22} /> Assistir Vídeo
              </button>
            </div>

            <div className="pt-8 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-12 h-12 rounded-2xl border-4 border-petrol-neutral object-cover shadow-sm" alt="User" />
                ))}
              </div>
              <div className="h-10 w-px bg-petrol-dark/10"></div>
              <div className="text-sm">
                <p className="font-bold text-petrol-dark">+2.500 Médicos</p>
                <p className="text-petrol-medium font-medium">Digitalizados pela MedCore</p>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            {/* Login Card */}
            <div className="glass p-10 rounded-[3rem] border border-white/60 shadow-2xl relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-petrol-soft via-petrol-vibrant to-petrol-medium"></div>
              
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-petrol-dark font-outfit mb-2">Bem-vindo ao Futuro</h2>
                <p className="text-petrol-medium font-medium">Acesse sua central de inteligência clínica.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-petrol-medium uppercase tracking-[0.2em] ml-2">E-mail Profissional</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.roberto@clinica.com"
                    className="w-full bg-white/50 border border-petrol-dark/10 rounded-[1.5rem] px-6 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/30 focus:bg-white transition-all font-medium placeholder:text-petrol-soft/60"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-2">
                    <label className="block text-[11px] font-black text-petrol-medium uppercase tracking-[0.2em]">Senha</label>
                    <a href="#" className="text-[10px] font-bold text-petrol-vibrant hover:underline uppercase tracking-wider">Esqueceu?</a>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-white/50 border border-petrol-dark/10 rounded-[1.5rem] px-6 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/30 focus:bg-white transition-all font-medium placeholder:text-petrol-soft/60"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-petrol-soft">
                      <Lock size={18} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded-lg border-petrol-dark/10 text-petrol-vibrant focus:ring-petrol-vibrant" />
                  <label htmlFor="remember" className="text-sm font-medium text-petrol-medium cursor-pointer">Manter conectado</label>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-petrol-dark text-white rounded-[1.5rem] font-bold hover:bg-petrol-vibrant transition-all shadow-xl shadow-petrol-dark/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Entrar no MedCore <ArrowRight size={20} />
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-petrol-dark/5 flex flex-col gap-4">
                <button className="w-full py-4 bg-petrol-neutral border border-petrol-dark/5 rounded-[1.5rem] text-sm font-bold text-petrol-dark hover:bg-white transition-all flex items-center justify-center gap-3">
                  <Globe size={18} className="text-petrol-medium" /> Acessar via CRM Digital
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-petrol-vibrant/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 glass p-6 rounded-[2rem] border border-white/60 shadow-2xl animate-float z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-petrol-dark uppercase tracking-widest">Segurança HIPAA</p>
                  <p className="text-[10px] text-petrol-medium font-bold">Proteção de Dados Médicos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl lg:text-5xl font-outfit font-extrabold text-petrol-dark mb-6 tracking-tight">
              Uma plataforma, infinitas possibilidades.
            </h2>
            <p className="text-lg text-petrol-medium font-medium leading-relaxed">
              O MedCore foi construído do zero para ser intuitivo. Esqueça sistemas complexos dos anos 2000; entre na nova era da medicina digital.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Prontuário Visionário', 
                desc: 'Editor rico com atalhos de voz e preenchimento automático via IA médica.', 
                icon: Layout,
                color: 'petrol-vibrant'
              },
              { 
                title: 'Telemedicina Nativa', 
                desc: 'Vídeo em alta definição integrado ao histórico do paciente. Sem apps extras.', 
                icon: Video,
                color: 'petrol-dark'
              },
              { 
                title: 'Agenda Inteligente', 
                desc: 'IA que otimiza seus horários e reduz faltas com lembretes via WhatsApp Business.', 
                icon: Zap,
                color: 'petrol-medium'
              },
              { 
                title: 'Análise de Exames', 
                desc: 'Upload de imagens com auxílio de IA para destacar pontos críticos no laudo.', 
                icon: Shield,
                color: 'petrol-soft'
              },
              { 
                title: 'Painel Financeiro', 
                desc: 'Controle total de glosas, convênios e faturamento particular em tempo real.', 
                icon: Smartphone,
                color: 'petrol-vibrant'
              },
              { 
                title: 'White-Label Total', 
                desc: 'O MedCore se adapta à sua especialidade com campos e cores customizáveis.', 
                icon: Sparkles,
                color: 'petrol-dark'
              },
            ].map((item, idx) => (
              <div key={idx} className="glass p-10 rounded-[2.5rem] border border-white hover:border-petrol-vibrant/30 transition-all hover:shadow-2xl group cursor-pointer bg-white/40">
                <div className={`w-16 h-16 bg-${item.color}/10 text-${item.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-petrol-dark mb-4 font-outfit">{item.title}</h3>
                <p className="text-petrol-medium font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-petrol-dark/5 bg-white/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-petrol-dark rounded-xl flex items-center justify-center">
              <span className="font-bold text-white text-sm">M</span>
            </div>
            <span className="text-lg font-bold font-outfit text-petrol-dark">MedCore SaaS</span>
          </div>
          
          <div className="flex gap-10">
            <a href="#" className="text-sm font-bold text-petrol-medium hover:text-petrol-vibrant transition-colors">Termos</a>
            <a href="#" className="text-sm font-bold text-petrol-medium hover:text-petrol-vibrant transition-colors">Privacidade</a>
            <a href="#" className="text-sm font-bold text-petrol-medium hover:text-petrol-vibrant transition-colors">LGPD</a>
            <a href="#" className="text-sm font-bold text-petrol-medium hover:text-petrol-vibrant transition-colors">Suporte</a>
          </div>

          <div className="text-sm font-bold text-petrol-soft">
            © 2026 MedCore Intelligence Systems é marca registrada da Montplanner Sistemas ® Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
