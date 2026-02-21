
import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  CreditCard, 
  Clock, 
  Download, 
  ShieldCheck, 
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Star,
  Package,
  Server,
  Sparkles,
  Users
} from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '199',
    description: 'Essencial para consultórios individuais e novos médicos.',
    features: ['Até 50 pacientes', 'Telemedicina HD básica', 'Prontuário Digital', 'Suporte via Ticket'],
    popular: false,
    color: 'slate'
  },
  {
    id: 'pro',
    name: 'Pro Plus',
    price: '379',
    description: 'O padrão ouro para clínicas que buscam crescimento e IA.',
    features: ['Até 120 pacientes', 'IA Médica Avançada', 'Telemedicina P2P Criptografada', 'Gestão Financeira Completa', 'Suporte Prioritário 24/7'],
    popular: true,
    color: 'petrol-vibrant'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '449',
    description: 'Infraestrutura dedicada para redes de clínicas e hospitais.',
    features: ['Pacientes ilimitados', 'Customização White Label Total', 'API Pública de Integração', 'Backup em Tempo Real', 'Segurança Nível Bancário'],
    popular: false,
    color: 'petrol-dark'
  }
];

const BILLING_HISTORY = [
  { id: 'INV-001', date: '12 Mai, 2024', amount: '379,00', status: 'PAID', method: '•••• 4242' },
  { id: 'INV-002', date: '12 Abr, 2024', amount: '379,00', status: 'PAID', method: '•••• 4242' },
  { id: 'INV-003', date: '12 Mar, 2024', amount: '379,00', status: 'PAID', method: '•••• 4242' },
];

const Subscriptions: React.FC = () => {
  const [activePlanId, setActivePlanId] = useState('pro');
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Plan Summary */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-outfit font-bold text-petrol-dark tracking-tight">Gestão de Plano</h2>
          <p className="text-slate-500 font-medium">Controle sua infraestrutura digital e recursos de IA.</p>
        </div>
        
        <div className="flex bg-white/50 border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${!isAnnual ? 'bg-petrol-dark text-white shadow-lg' : 'text-slate-500 hover:text-petrol-dark'}`}
          >
            Mensal
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-petrol-dark text-white shadow-lg' : 'text-slate-500 hover:text-petrol-dark'}`}
          >
            Anual <span className="bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-lg text-[10px]">-20%</span>
          </button>
        </div>
      </header>

      {/* Usage Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Teleconsultas', used: 184, limit: 1000, unit: 'Chamadas', icon: Activity, color: 'petrol-vibrant' },
          { label: 'Armazenamento', used: 42.8, limit: 100, unit: 'GB', icon: Server, color: 'emerald-500' },
          { label: 'Tokens IA', used: 8200, limit: 10000, unit: 'Tokens', icon: Sparkles, color: 'indigo-500' },
          { label: 'Usuários', used: 8, limit: 20, unit: 'Ativos', icon: Users, color: 'amber-500' },
        ].map((usage, i) => (
          <div key={i} className="glass p-6 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-slate-100 text-${usage.color}`}>
                   <usage.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recurso</span>
             </div>
             <div>
                <div className="flex justify-between items-end mb-2">
                   <h4 className="text-sm font-bold text-slate-600">{usage.label}</h4>
                   <p className="text-xs font-bold text-petrol-dark">{usage.used} <span className="text-slate-400">/ {usage.limit} {usage.unit}</span></p>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div 
                      className={`h-full transition-all duration-1000 bg-${usage.color}`} 
                      style={{ width: `${(usage.used / usage.limit) * 100}%` }}
                   ></div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Pricing Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative glass p-10 rounded-[3.5rem] border transition-all duration-500 flex flex-col group ${
              activePlanId === plan.id 
                ? 'bg-white border-petrol-vibrant/30 shadow-2xl scale-[1.02] ring-4 ring-petrol-vibrant/5' 
                : 'bg-white/40 border-white/60 hover:border-slate-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-petrol-vibrant text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-petrol-vibrant/20">
                Plano Atual
              </div>
            )}
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className={`w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-petrol-vibrant`}>
                    <Package size={24} />
                 </div>
                 <h3 className="text-2xl font-bold font-outfit text-petrol-dark tracking-tight">{plan.name}</h3>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{plan.description}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-petrol-dark">R$</span>
                <span className="text-6xl font-black font-outfit text-petrol-dark tracking-tighter">
                  {isAnnual ? Math.round(parseInt(plan.price) * 0.8) : plan.price}
                </span>
                <span className="text-slate-400 font-bold">/mês</span>
              </div>
              {isAnnual && <p className="text-[10px] font-bold text-emerald-500 mt-2 uppercase">Faturado anualmente (Economia de R$ {parseInt(plan.price) * 2})</p>}
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-600">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setActivePlanId(plan.id)}
              disabled={activePlanId === plan.id}
              className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                activePlanId === plan.id 
                  ? 'bg-slate-100 text-slate-400 cursor-default' 
                  : 'bg-petrol-dark text-white hover:bg-petrol-vibrant shadow-petrol-dark/20'
              }`}
            >
              {activePlanId === plan.id ? 'Seu Plano Atual' : 'Migrar Plano'}
            </button>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
         {/* Payment Methods */}
         <div className="lg:col-span-5 glass p-10 rounded-[3rem] border border-white/60 bg-white/60 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold font-outfit text-petrol-dark flex items-center gap-2">
                  <CreditCard className="text-petrol-vibrant" size={24} /> Formas de Pagamento
               </h3>
               <button className="p-2.5 bg-petrol-vibrant/10 text-petrol-vibrant rounded-xl hover:bg-petrol-vibrant hover:text-white transition-all">
                  <Plus size={20} />
               </button>
            </div>

            <div className="space-y-4">
               <div className="p-6 rounded-3xl border-2 border-petrol-vibrant/30 bg-white shadow-lg flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[8px] font-black tracking-widest overflow-hidden relative">
                        VISA
                        <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/20 blur-lg"></div>
                     </div>
                     <div>
                        <p className="text-sm font-bold text-petrol-dark">Visa Platinum • 4242</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expira em 12/26</p>
                     </div>
                  </div>
                  <div className="px-3 py-1 bg-petrol-vibrant/10 text-petrol-vibrant text-[8px] font-black uppercase rounded-lg">Principal</div>
               </div>

               <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex items-center justify-between grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white text-[8px] font-black tracking-widest">
                        MASTER
                     </div>
                     <div>
                        <p className="text-sm font-bold text-petrol-dark">Mastercard • 8812</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expira em 08/25</p>
                     </div>
                  </div>
                  <button className="text-slate-300 hover:text-petrol-dark transition-all"><MoreVertical size={16} /></button>
               </div>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
               <ShieldCheck className="text-indigo-400 shrink-0" size={20} />
               <p className="text-[10px] text-indigo-400/80 font-medium leading-relaxed uppercase tracking-wider">
                  Suas transações são processadas em ambiente isolado com padrão PCI-DSS Nível 1. O MedCore não armazena o número completo do seu cartão.
               </p>
            </div>
         </div>

         {/* Invoicing History */}
         <div className="lg:col-span-7 glass p-10 rounded-[3rem] border border-white/60 bg-white/60 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold font-outfit text-petrol-dark flex items-center gap-2">
                  <Clock className="text-petrol-vibrant" size={24} /> Histórico de Faturas
               </h3>
               <button className="text-[10px] font-black text-petrol-vibrant uppercase tracking-widest hover:underline">Ver todas</button>
            </div>

            <div className="space-y-1">
               <div className="grid grid-cols-4 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <span>Fatura</span>
                  <span>Data</span>
                  <span>Valor</span>
                  <span className="text-right">Ação</span>
               </div>
               {BILLING_HISTORY.map((bill) => (
                 <div key={bill.id} className="grid grid-cols-4 px-6 py-6 items-center hover:bg-white rounded-2xl transition-all group border-b border-slate-50 last:border-0">
                    <span className="text-xs font-bold text-petrol-dark">{bill.id}</span>
                    <span className="text-xs font-medium text-slate-500">{bill.date}</span>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-petrol-dark">R$ {bill.amount}</span>
                       <span className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">{bill.method}</span>
                    </div>
                    <div className="flex justify-end">
                       <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-petrol-vibrant hover:bg-petrol-vibrant/10 rounded-xl transition-all shadow-sm">
                          <Download size={16} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Support CTA */}
      <div className="p-12 rounded-[3.5rem] bg-petrol-dark text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-petrol-vibrant/20 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <Star className="text-amber-400 fill-amber-400" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-petrol-soft">Parceiro Estratégico</span>
               </div>
               <h3 className="text-3xl font-bold font-outfit mb-4 tracking-tight">Precisa de um plano personalizado?</h3>
               <p className="text-petrol-soft font-medium leading-relaxed">
                  Para redes hospitalares ou clínicas com mais de 50 médicos, oferecemos consultoria dedicada e implantação on-site.
               </p>
            </div>
            <button className="px-10 py-5 bg-white text-petrol-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-petrol-soft transition-all shadow-2xl active:scale-95 whitespace-nowrap">
               Falar com Consultor
            </button>
         </div>
      </div>
    </div>
  );
};

export default Subscriptions;
