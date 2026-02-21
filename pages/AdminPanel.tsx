
import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Activity,
  UserCheck,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  Target,
  BarChart3,
  Cpu,
  History,
  LockKeyhole
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

const DOCTOR_PERFORMANCE = [
  { name: 'Dr. Roberto', consultas: 145, receita: 65200, eficiencia: 98 },
  { name: 'Dra. Helena', consultas: 128, receita: 54300, eficiencia: 92 },
  { name: 'Dr. Marcos', consultas: 98, receita: 41000, eficiencia: 88 },
  { name: 'Dra. Ana', consultas: 115, receita: 48900, eficiencia: 95 },
];

const STRATEGIC_DATA = [
  { month: 'Jan', ltv: 1200, cac: 300, net: 28000 },
  { month: 'Fev', ltv: 1250, cac: 280, net: 32000 },
  { month: 'Mar', ltv: 1300, cac: 310, net: 31000 },
  { month: 'Abr', ltv: 1350, cac: 290, net: 38000 },
  { month: 'Mai', ltv: 1420, cac: 270, net: 42000 },
];

const AdminPanel: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha padrão para demo: 1234
    if (password === '1234') {
      setIsLocked(false);
      setError(false);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isLocked) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center animate-in fade-in duration-700">
        <div className="glass p-12 rounded-[3.5rem] border border-white shadow-2xl w-full max-w-md text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
          
          <div className="mx-auto w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mb-6 shadow-inner animate-pulse">
            <LockKeyhole size={40} />
          </div>

          <div>
            <h2 className="text-3xl font-bold font-outfit text-petrol-dark mb-2">Acesso Restrito ADM</h2>
            <p className="text-slate-500 text-sm font-medium">Esta seção contém dados financeiros e estratégicos sensíveis da clínica.</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block text-left ml-2">Senha de Alta Gestão</label>
              <input 
                type="password" 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none transition-all ${
                  error ? 'border-rose-500 animate-shake' : 'border-slate-100 focus:border-amber-500'
                }`}
              />
              {error && <p className="text-xs text-rose-500 font-bold mt-2 animate-in fade-in">Acesso negado. Senha incorreta.</p>}
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-petrol-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-petrol-vibrant transition-all shadow-xl shadow-petrol-dark/20 flex items-center justify-center gap-3 active:scale-95"
            >
              Desbloquear Painel <ShieldCheck size={18} />
            </button>
          </form>

          <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest pt-4">Autenticação Criptografada AES-256</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Acesso de Gestão</div>
            <h2 className="text-4xl font-outfit font-bold text-petrol-dark tracking-tight">Estratégico ADM</h2>
          </div>
          <p className="text-slate-500 font-medium">Visão holística de rentabilidade, performance e crescimento.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsLocked(true)}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase text-slate-500 hover:text-petrol-dark hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
          >
            <Lock size={16} /> Bloquear Painel
          </button>
          <button className="px-6 py-3 bg-petrol-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-petrol-dark/20 hover:bg-petrol-vibrant transition-all flex items-center gap-2">
             <TrendingUp size={16} /> Relatórios Avançados
          </button>
        </div>
      </header>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'LTV (Lifetime Value)', value: 'R$ 1.420', trend: '+8.4%', icon: Target, color: 'petrol-vibrant' },
          { label: 'CAC Médio', value: 'R$ 270', trend: '-12.0%', icon: UserCheck, color: 'emerald-500' },
          { label: 'Margem de Lucro', value: '38.4%', trend: '+2.1%', icon: Activity, color: 'indigo-500' },
          { label: 'Custo de Pessoal', value: 'R$ 12.8k', trend: '+4.2%', icon: Users, color: 'rose-500' },
        ].map((kpi, i) => (
          <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-slate-100 text-${kpi.color} shadow-inner`}>
                   <kpi.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black tracking-widest ${kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                   {kpi.trend}
                </div>
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{kpi.label}</p>
             <h3 className="text-3xl font-bold text-petrol-dark font-outfit">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Net Profit & LTV/CAC Trends */}
        <div className="lg:col-span-8 glass p-10 rounded-[3rem] border border-white/60 bg-white/60 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-bold font-outfit text-petrol-dark">Tendências Estratégicas</h3>
                 <p className="text-xs text-slate-400 font-medium">Correlação entre custo de aquisição e lucro líquido.</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-petrol-vibrant">
                    <span className="w-2.5 h-2.5 rounded-full bg-petrol-vibrant"></span> Lucro Líquido
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> LTV
                 </div>
              </div>
           </div>
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={STRATEGIC_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 68, 107, 0.05)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  />
                  <Line type="monotone" dataKey="net" stroke="#2C5F9E" strokeWidth={4} dot={{ r: 6, fill: '#2C5F9E', strokeWidth: 2, stroke: '#fff' }} />
                  <Line type="monotone" dataKey="ltv" stroke="#f59e0b" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Doctor Performance */}
        <div className="lg:col-span-4 glass p-10 rounded-[3rem] border border-white/60 bg-white/60 shadow-sm">
           <h3 className="text-xl font-bold font-outfit text-petrol-dark mb-8">Receita por Profissional</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DOCTOR_PERFORMANCE} layout="vertical" margin={{ left: -10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#2E446B', fontSize: 12, fontWeight: 700 }} />
                  <Tooltip />
                  <Bar dataKey="receita" radius={[0, 10, 10, 0]} barSize={25}>
                    {DOCTOR_PERFORMANCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#2C5F9E' : '#D9E1E6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4 mt-8">
              {DOCTOR_PERFORMANCE.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-petrol-dark font-bold text-xs">{doc.name.split(' ')[1].charAt(0)}</div>
                      <div>
                        <p className="text-xs font-bold text-petrol-dark">{doc.name}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{doc.consultas} Atendimentos</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-petrol-dark">R$ {(doc.receita/1000).toFixed(1)}k</p>
                      <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase">
                         <Activity size={10} /> {doc.eficiencia}% Efic.
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Security Audit Log */}
        <div className="glass p-10 rounded-[3rem] border border-white/60 bg-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold font-outfit text-petrol-dark flex items-center gap-2">
               <History className="text-petrol-vibrant" size={24} /> Log de Auditoria ADM
            </h3>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Sistema Auditado</span>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Dr. Roberto', action: 'Visualizou Fluxo de Caixa Completo', time: '14:22', ip: '192.168.1.45' },
              { user: 'Dr. Roberto', action: 'Alterou Repasse de Médicos', time: '12:05', ip: '192.168.1.45' },
              { user: 'Julia (Gerente)', action: 'Exportou Relatório de Faturamento', time: '11:40', ip: '192.168.1.12' },
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-petrol-vibrant group-hover:scale-150 transition-transform"></div>
                  <div>
                    <p className="text-sm font-bold text-petrol-dark">{log.action}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{log.user} • IP: {log.ip}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-300 group-hover:text-petrol-vibrant transition-colors">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Predictive Analytics */}
        <div className="glass p-10 rounded-[3rem] border border-white/60 bg-petrol-dark text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 border border-white/10">
                      <Cpu size={28} />
                   </div>
                   <h4 className="text-2xl font-bold font-outfit">IA Preditiva Médica</h4>
                </div>
                <p className="text-sm text-petrol-soft leading-relaxed mb-8">
                  Com base nos dados atuais, a IA projeta um crescimento de <strong>12.5%</strong> no faturamento líquido para o próximo trimestre, impulsionado pela redução de 5% na taxa de cancelamentos.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-petrol-soft font-black uppercase tracking-widest mb-1">Previsão Junho</p>
                      <p className="text-xl font-bold text-emerald-400">R$ 52.4k</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-petrol-soft font-black uppercase tracking-widest mb-1">Meta Anual</p>
                      <p className="text-xl font-bold text-amber-400">82% Atingida</p>
                   </div>
                </div>
              </div>
              <button className="w-full mt-10 py-4 bg-white text-petrol-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-2xl">
                 Rodar Nova Simulação de Cenário
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
