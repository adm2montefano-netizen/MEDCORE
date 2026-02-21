
import React, { useState } from 'react';
import { 
  FileSignature, 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  Gavel,
  ShieldCheck,
  Building,
  Calendar as CalendarIcon,
  ChevronRight,
  Printer,
  // Added missing TrendingUp import
  TrendingUp
} from 'lucide-react';

const MOCK_INVOICES = [
  { id: 'NF-8821', type: 'SAÍDA', client: 'Ana Silva', date: '24/05/2024', amount: 450.00, tax: 18.00, status: 'AUTORIZADA' },
  { id: 'NF-8822', type: 'SAÍDA', client: 'João Pereira', date: '24/05/2024', amount: 280.00, tax: 11.20, status: 'AUTORIZADA' },
  { id: 'NF-1045', type: 'ENTRADA', client: 'MedSul Insumos LTDA', date: '23/05/2024', amount: 1250.00, tax: 225.00, status: 'IMPORTADA' },
  { id: 'NF-8823', type: 'SAÍDA', client: 'Maria Souza', date: '23/05/2024', amount: 450.00, tax: 18.00, status: 'PENDENTE' },
  { id: 'NF-8819', type: 'SAÍDA', client: 'Ricardo Lima', date: '22/05/2024', amount: 1250.00, tax: 50.00, status: 'CANCELADA' },
];

const FiscalPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emitidas' | 'recebidas' | 'config'>('emitidas');
  const [isEmitting, setIsEmitting] = useState(false);

  const handleEmitInvoice = () => {
    setIsEmitting(true);
    setTimeout(() => setIsEmitting(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-outfit font-bold text-petrol-dark tracking-tight">Módulo Fiscal</h2>
          <p className="text-slate-500 font-medium">Controle de emissão, tributos e conformidade municipal/federal.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase text-slate-500 hover:text-petrol-dark hover:border-slate-300 transition-all shadow-sm">
            <Upload size={16} /> Importar XML
          </button>
          <button 
            onClick={handleEmitInvoice}
            disabled={isEmitting}
            className="flex items-center gap-2 px-6 py-3 bg-petrol-vibrant text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-petrol-vibrant/20 hover:bg-petrol-dark transition-all disabled:opacity-50"
          >
            {isEmitting ? <Clock className="animate-spin" size={16} /> : <Plus size={16} />}
            {isEmitting ? 'Transmitindo...' : 'Emitir NFS-e'}
          </button>
        </div>
      </header>

      {/* Fiscal KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Notas (Mês)', value: 'R$ 52.480', trend: '+12%', icon: FileText, color: 'petrol-vibrant' },
          { label: 'Imposto Provisório', value: 'R$ 4.280', trend: '+5%', icon: Gavel, color: 'rose-500' },
          { label: 'Alíquota Efetiva', value: '8.2%', trend: '-0.4%', icon: TrendingUp, color: 'emerald-500' },
          { label: 'Certificado Digital', value: 'Ativo', sub: 'Expira em 220 dias', icon: ShieldCheck, color: 'indigo-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-slate-100 text-${stat.color}`}>
                   <stat.icon size={22} />
                </div>
                {stat.trend && (
                  <span className={`text-[10px] font-black tracking-widest ${stat.trend.startsWith('+') ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {stat.trend}
                  </span>
                )}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-2xl font-bold text-petrol-dark font-outfit">{stat.value}</h3>
             {stat.sub && <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Invoices Table */}
        <div className="lg:col-span-8 glass rounded-[3rem] border border-white/60 bg-white/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('emitidas')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'emitidas' ? 'bg-white text-petrol-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Saídas (Vendas)
              </button>
              <button 
                onClick={() => setActiveTab('recebidas')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'recebidas' ? 'bg-white text-petrol-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Entradas (Insumos)
              </button>
            </div>
            
            <div className="flex gap-2">
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Nº da nota ou cliente..." className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs focus:outline-none w-48 focus:w-64 transition-all" />
              </div>
              <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-petrol-dark transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left">
                  <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Nota / Status</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Destinatário</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Data</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Valor / Imposto</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {MOCK_INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/40 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          inv.status === 'AUTORIZADA' ? 'bg-emerald-100 text-emerald-600' :
                          inv.status === 'CANCELADA' ? 'bg-rose-100 text-rose-600' :
                          inv.status === 'IMPORTADA' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                           {inv.status === 'AUTORIZADA' ? <CheckCircle2 size={16} /> : 
                            inv.status === 'CANCELADA' ? <AlertCircle size={16} /> : <Clock size={16} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-petrol-dark">{inv.id}</p>
                          <p className={`text-[8px] font-black uppercase tracking-widest ${
                            inv.status === 'AUTORIZADA' ? 'text-emerald-500' : 'text-amber-500'
                          }`}>{inv.status}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-petrol-dark">{inv.client}</p>
                      <p className="text-[9px] text-slate-400 font-medium">CPF/CNPJ: ***.***.***-**</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-medium text-slate-500">{inv.date}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-xs font-black text-petrol-dark">R$ {inv.amount.toFixed(2)}</p>
                      <p className="text-[9px] text-rose-500 font-bold">Imposto: R$ {inv.tax.toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-petrol-dark" title="Imprimir Danfe"><Printer size={14} /></button>
                         <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-petrol-dark" title="Baixar XML"><Download size={14} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/50 text-center">
            <button className="text-[10px] font-black text-petrol-vibrant uppercase tracking-widest hover:underline">Ver Histórico Fiscal Completo</button>
          </div>
        </div>

        {/* Fiscal Agenda & Deadlines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[3rem] border border-white/60 bg-white/60 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <CalendarIcon className="text-petrol-vibrant" size={24} />
               <h3 className="text-xl font-bold font-outfit text-petrol-dark">Agenda de Tributos</h3>
            </div>
            
            <div className="space-y-4">
               {[
                 { label: 'ISS (Mensal)', date: '20 Jun', status: 'WAITING', amount: 'R$ 1.842,00' },
                 { label: 'Simples Nacional (DAS)', date: '20 Jun', status: 'WAITING', amount: 'R$ 4.120,00' },
                 { label: 'PIS/COFINS', date: '25 Jun', status: 'WAITING', amount: 'R$ 940,00' },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-50 group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 font-bold text-[10px] group-hover:bg-petrol-dark group-hover:text-white transition-all">
                          {item.date.split(' ')[0]}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-petrol-dark">{item.label}</p>
                          <p className="text-[9px] text-slate-400 font-black tracking-widest">{item.amount}</p>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-200" />
                 </div>
               ))}
            </div>

            <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
               Gerar Guias do Mês
            </button>
          </div>

          <div className="glass p-8 rounded-[3rem] border border-white/60 bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 blur-3xl rounded-full transition-transform group-hover:scale-125 duration-1000"></div>
             <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                   <Building size={28} />
                </div>
                <h4 className="text-2xl font-bold font-outfit mb-3">Prefeitura de São Paulo</h4>
                <p className="text-sm text-indigo-100 leading-relaxed mb-6 font-medium">
                   O MedCore está conectado diretamente ao Webservice da prefeitura. Suas notas são transmitidas com protocolo de segurança SSL.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                   <CheckCircle2 size={16} /> Conexão Estabelecida
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiscalPanel;
