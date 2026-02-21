
import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar as CalendarIcon, 
  Filter, 
  Download, 
  Plus, 
  Search,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

const flowData = [
  { day: '01/05', entrada: 2400, saida: 800 },
  { day: '05/05', entrada: 3800, saida: 1200 },
  { day: '10/05', entrada: 3000, saida: 2400 },
  { day: '15/05', entrada: 5200, saida: 1500 },
  { day: '20/05', entrada: 4100, saida: 1800 },
  { day: '25/05', entrada: 6800, saida: 2200 },
  { day: '30/05', entrada: 5900, saida: 1400 },
];

const categoryData = [
  { name: 'Consultas', value: 35000, color: '#2C5F9E' },
  { name: 'Exames', value: 12000, color: '#3F6FA1' },
  { name: 'Procedimentos', value: 8500, color: '#8FB3C9' },
  { name: 'Convênios', value: 15000, color: '#2E446B' },
];

const transactions = [
  { id: 'TX-901', description: 'Repasse Unimed - Abril', category: 'Convênio', type: 'IN', amount: 8450.00, date: '25/05/2024', status: 'PAID' },
  { id: 'TX-902', description: 'Aluguel Sala 402', category: 'Infraestrutura', type: 'OUT', amount: 3200.00, date: '24/05/2024', status: 'PAID' },
  { id: 'TX-903', description: 'Consulta Particular - Ana Silva', category: 'Consulta', type: 'IN', amount: 450.00, date: '24/05/2024', status: 'PAID' },
  { id: 'TX-904', description: 'Insumos Hospitalares (MedSul)', category: 'Insumos', type: 'OUT', amount: 1240.50, date: '23/05/2024', status: 'PENDING' },
  { id: 'TX-905', description: 'Limpeza e Manutenção', category: 'Serviços', type: 'OUT', amount: 800.00, date: '22/05/2024', status: 'OVERDUE' },
  { id: 'TX-906', description: 'Exame Bioimpedância - João P.', category: 'Exame', type: 'IN', amount: 280.00, date: '22/05/2024', status: 'PAID' },
];

const CashFlow: React.FC = () => {
  const [activeRange, setActiveRange] = useState('Este Mês');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-outfit font-bold text-petrol-dark tracking-tight">Fluxo de Caixa</h2>
          <p className="text-slate-500">Monitoramento em tempo real de entradas, saídas e previsibilidade financeira.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white/50 border border-slate-200 rounded-xl p-1 shadow-sm">
            {['Este Mês', 'Últimos 90 dias'].map((range) => (
              <button 
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeRange === range ? 'bg-petrol-dark text-white shadow-md' : 'text-slate-500 hover:text-petrol-dark'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-petrol-vibrant text-white rounded-xl text-sm font-bold hover:bg-petrol-dark transition-all shadow-lg shadow-petrol-vibrant/20">
            <Plus size={18} /> Lançar Movimento
          </button>
        </div>
      </header>

      {/* Financial Health Score / Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'Saldo Atual', value: 'R$ 64.280', sub: 'Disponível em conta', icon: Wallet, color: 'petrol-vibrant' },
             { label: 'Entradas Previstas', value: 'R$ 12.450', sub: 'A receber este mês', icon: TrendingUp, color: 'emerald-500' },
             { label: 'Saídas Previstas', value: 'R$ 4.820', sub: 'Contas a pagar', icon: TrendingDown, color: 'rose-500' },
           ].map((stat, i) => (
             <div key={i} className="glass p-6 rounded-[2rem] border border-white/60 bg-white/60 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                   <div className={`p-3 rounded-2xl bg-slate-100 text-${stat.color}`}>
                      <stat.icon size={24} />
                   </div>
                   <button className="text-slate-300 hover:text-petrol-dark"><MoreVertical size={16} /></button>
                </div>
                <div className="mt-6">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h3 className="text-2xl font-bold text-petrol-dark font-outfit">{stat.value}</h3>
                   <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.sub}</p>
                </div>
             </div>
           ))}
        </div>
        <div className="glass p-6 rounded-[2rem] border border-white/60 bg-petrol-dark shadow-xl text-white flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-petrol-soft">Saúde Financeira</span>
              </div>
              <h4 className="text-lg font-bold font-outfit">Excelente</h4>
              <p className="text-xs text-petrol-soft leading-relaxed mt-1">Sua liquidez cobre 4.2 meses de custos fixos operacionais.</p>
           </div>
           <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold">Burn Rate: <span className="text-rose-400">R$ 15k/mês</span></span>
              <ArrowUpRight size={18} className="text-emerald-400" />
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Flow Chart */}
        <div className="lg:col-span-8 glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-bold font-outfit text-petrol-dark">Fluxo de Entradas vs. Saídas</h3>
                 <p className="text-xs text-slate-400 font-medium">Visualização diária da movimentação de caixa.</p>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-petrol-vibrant">
                    <span className="w-2 h-2 rounded-full bg-petrol-vibrant"></span> Receitas
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-500">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Despesas
                 </div>
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C5F9E" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2C5F9E" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 68, 107, 0.05)" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="entrada" stroke="#2C5F9E" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                  <Area type="monotone" dataKey="saida" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="lg:col-span-4 glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm">
           <h3 className="text-xl font-bold font-outfit text-petrol-dark mb-8">Origem das Receitas</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#2E446B', fontSize: 12, fontWeight: 700 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4 mt-6">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-500">
                   <span>{item.name}</span>
                   <span className="text-petrol-dark">R$ {(item.value/1000).toFixed(1)}k</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="glass rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3">
              <Clock size={24} className="text-petrol-vibrant" />
              <h3 className="text-xl font-bold font-outfit text-petrol-dark">Últimos Lançamentos</h3>
           </div>
           <div className="flex gap-4">
              <div className="relative group">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-petrol-vibrant" />
                 <input type="text" placeholder="Buscar lançamento..." className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs border border-transparent focus:bg-white focus:border-slate-200 focus:outline-none w-64 transition-all" />
              </div>
              <button className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:text-petrol-dark transition-all">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left border-b border-slate-200/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Data</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição / Categoria</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Valor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-petrol-vibrant/5 transition-all group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-600">{tx.date}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{tx.id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-petrol-dark">{tx.description}</p>
                    <p className="text-[10px] text-petrol-soft font-black uppercase tracking-widest mt-0.5">{tx.category}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                       {tx.type === 'IN' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`font-bold text-lg ${tx.type === 'IN' ? 'text-petrol-dark' : 'text-slate-600'}`}>
                      {tx.type === 'OUT' && '- '}R$ {tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {tx.status === 'PAID' ? <CheckCircle2 size={14} className="text-emerald-500" /> : tx.status === 'PENDING' ? <Clock size={14} className="text-amber-500" /> : <AlertCircle size={14} className="text-rose-500" />}
                       <span className={`text-[10px] font-black uppercase tracking-widest ${
                         tx.status === 'PAID' ? 'text-emerald-600' : tx.status === 'PENDING' ? 'text-amber-600' : 'text-rose-600'
                       }`}>
                         {tx.status === 'PAID' ? 'Liquidado' : tx.status === 'PENDING' ? 'Pendente' : 'Atrasado'}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 rounded-xl hover:bg-white text-slate-300 hover:text-petrol-dark transition-all shadow-sm opacity-0 group-hover:opacity-100">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/30 text-center">
           <button className="text-xs font-bold text-petrol-vibrant hover:underline uppercase tracking-widest">Visualizar Relatório Mensal Detalhado</button>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;
