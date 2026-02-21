
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const data = [
  { name: 'Seg', consultas: 12, faturamento: 2400 },
  { name: 'Ter', consultas: 19, faturamento: 3800 },
  { name: 'Qua', consultas: 15, faturamento: 3000 },
  { name: 'Qui', consultas: 22, faturamento: 4400 },
  { name: 'Sex', consultas: 18, faturamento: 3600 },
  { name: 'Sáb', consultas: 8, faturamento: 1600 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-outfit font-bold text-petrol-dark">Olá, Dr. Roberto</h2>
          <p className="text-slate-500">Aqui está o resumo da sua clínica hoje, 24 de Maio.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-petrol-dark/5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-600">8 pacientes aguardando</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pacientes', value: '1.284', trend: '+12%', icon: Users, color: 'blue' },
          { label: 'Consultas Hoje', value: '24', trend: '+5%', icon: Calendar, color: 'emerald' },
          { label: 'Faturamento Mês', value: 'R$ 48.200', trend: '+18%', icon: DollarSign, color: 'indigo' },
          { label: 'Taxa Retenção', value: '94%', trend: '-2%', icon: TrendingUp, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/40 hover:shadow-xl transition-all bg-white/60">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-petrol-vibrant/5 text-petrol-vibrant shadow-sm`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments Chart */}
        <div className="glass p-8 rounded-3xl border border-white/40 bg-white/60 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-outfit text-petrol-dark">Fluxo de Consultas</h3>
            <select className="bg-petrol-neutral border border-petrol-dark/5 rounded-lg px-3 py-1 text-xs focus:outline-none text-petrol-dark">
              <option>Esta Semana</option>
              <option>Mês Passado</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 68, 107, 0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#3F6FA1', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#3F6FA1', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(46, 68, 107, 0.1)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#2E446B' }}
                />
                <Bar dataKey="consultas" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#2C5F9E' : '#D9E1E6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Line Chart */}
        <div className="glass p-8 rounded-3xl border border-white/40 bg-white/60 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-outfit text-petrol-dark">Desempenho Financeiro</h3>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-petrol-vibrant"></span> Faturamento
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 68, 107, 0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3F6FA1', fontSize: 12 }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(46, 68, 107, 0.1)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#2C5F9E" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#2C5F9E', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
