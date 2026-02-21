
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  Calendar, 
  ChevronRight,
  Filter,
  Download,
  Plus
} from 'lucide-react';

const financialHistory = [
  { name: 'Jan', faturamento: 32000, despesas: 12000 },
  { name: 'Fev', faturamento: 38000, despesas: 14000 },
  { name: 'Mar', faturamento: 35000, despesas: 13500 },
  { name: 'Abr', faturamento: 45000, despesas: 15000 },
  { name: 'Mai', faturamento: 48200, despesas: 16200 },
  { name: 'Jun', faturamento: 51000, despesas: 17500 },
];

const expenseDistribution = [
  { name: 'Salários', value: 45, color: '#2C5F9E' },
  { name: 'Insumos', value: 20, color: '#3F6FA1' },
  { name: 'Marketing', value: 15, color: '#8FB3C9' },
  { name: 'Aluguel/Util.', value: 20, color: '#2E446B' },
];

const transactions = [
  { id: 'tx-1', patient: 'Ana Silva', service: 'Consulta Particular', value: 450.00, status: 'PAID', date: '24/05/2024' },
  { id: 'tx-2', patient: 'João Pereira', service: 'Eletrocardiograma', value: 280.00, status: 'PAID', date: '24/05/2024' },
  { id: 'tx-3', patient: 'Maria Souza', service: 'Retorno Convênio (Unimed)', value: 120.00, status: 'PENDING', date: '23/05/2024' },
  { id: 'tx-4', patient: 'Ricardo Lima', service: 'Procedimento Dermatológico', value: 1250.00, status: 'OVERDUE', date: '15/05/2024' },
  { id: 'tx-5', patient: 'Carla Dias', service: 'Consulta Particular', value: 450.00, status: 'PAID', date: '23/05/2024' },
];

const FinancialPanel: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-outfit font-bold text-petrol-dark">Painel Financeiro</h2>
          <p className="text-slate-500">Gestão completa de faturamento, glosas e fluxo de caixa.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} /> Exportar Relatório
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-petrol-vibrant text-white rounded-xl text-sm font-bold hover:bg-petrol-medium transition-all shadow-lg shadow-petrol-vibrant/20">
            <Plus size={18} /> Nova Transação
          </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Receita Mensal', value: 'R$ 48.200', trend: '+14.5%', icon: DollarSign, color: 'petrol-vibrant' },
          { label: 'Lucro Líquido', value: 'R$ 32.000', trend: '+12.3%', icon: TrendingUp, color: 'emerald-500' },
          { label: 'Contas a Receber', value: 'R$ 8.450', trend: '-2.1%', icon: CreditCard, color: 'petrol-medium' },
          { label: 'Despesas Gerais', value: 'R$ 16.200', trend: '+5.4%', icon: FileText, color: 'rose-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/60 bg-white/60 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-100 text-petrol-vibrant`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-petrol-dark font-outfit">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Flow Chart */}
        <div className="lg:col-span-8 glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold font-outfit text-petrol-dark">Fluxo de Caixa</h3>
              <p className="text-xs text-slate-400 font-medium">Histórico de faturamento vs. despesas (6 meses)</p>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-1.5 rounded-lg bg-petrol-neutral text-petrol-dark text-xs font-bold hover:bg-petrol-ui transition-all">Este Semestre</button>
               <button className="px-4 py-1.5 rounded-lg text-slate-400 text-xs font-bold hover:text-petrol-dark transition-all">Este Ano</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialHistory}>
                <defs>
                  <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C5F9E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2C5F9E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDesp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 68, 107, 0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 12 }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="faturamento" stroke="#2C5F9E" strokeWidth={3} fillOpacity={1} fill="url(#colorFat)" />
                <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDesp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-6 justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-petrol-dark">
              <span className="w-3 h-3 rounded-full bg-petrol-vibrant"></span> Faturamento
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-petrol-dark">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span> Despesas
            </div>
          </div>
        </div>

        {/* Expenses Pie Chart */}
        <div className="lg:col-span-4 glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold font-outfit text-petrol-dark mb-6">Distribuição de Gastos</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {expenseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Gastos</span>
                <span className="text-xl font-bold text-petrol-dark font-outfit">100%</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {expenseDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-petrol-dark">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold font-outfit text-petrol-dark">Transações Recentes</h3>
            <p className="text-xs text-slate-500 font-medium">Últimos 30 dias de movimentações na clínica.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select className="pl-10 pr-4 py-2 bg-petrol-neutral rounded-xl text-xs font-bold text-petrol-dark focus:outline-none border border-slate-200">
                <option>Todos Status</option>
                <option>Pago</option>
                <option>Pendente</option>
                <option>Atrasado</option>
              </select>
            </div>
            <button className="p-2.5 bg-petrol-neutral rounded-xl text-petrol-dark hover:bg-petrol-ui transition-all">
               <Calendar size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left border-b border-slate-200/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Paciente</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Serviço / Procedimento</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Data</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Valor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-petrol-vibrant/5 transition-all group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-petrol-dark">{tx.patient}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-slate-600">{tx.service}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-slate-500">{tx.date}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-petrol-dark">R$ {tx.value.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      tx.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 
                      tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 
                      'bg-rose-500/10 text-rose-600'
                    }`}>
                      {tx.status === 'PAID' ? 'Recebido' : tx.status === 'PENDING' ? 'Pendente' : 'Atrasado'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 rounded-xl hover:bg-white text-slate-400 hover:text-petrol-dark transition-all shadow-sm opacity-0 group-hover:opacity-100">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/30 text-center">
           <button className="text-xs font-bold text-petrol-vibrant hover:underline uppercase tracking-widest">Ver Todo Histórico de Transações</button>
        </div>
      </div>
    </div>
  );
};

export default FinancialPanel;
