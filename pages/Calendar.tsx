
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Video, 
  Users, 
  Clock, 
  Calendar as CalendarIcon, 
  X, 
  Search, 
  CheckCircle2, 
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { Appointment, Patient, User } from '../types';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_USER } from '../constants';

const Calendar: React.FC = () => {
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Appointment Form State
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    type: 'IN_PERSON' as 'IN_PERSON' | 'TELEMEDICINE'
  });

  const timeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  const filteredAppointments = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointments.filter(a => a.date === dateStr);
  }, [appointments, selectedDate]);

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.patientId) return;

    const appointment: Appointment = {
      id: `a-${Date.now()}`,
      patientId: newAppt.patientId,
      doctorId: MOCK_USER.id,
      clinicId: MOCK_USER.clinicId,
      date: newAppt.date,
      startTime: newAppt.startTime,
      type: newAppt.type,
      status: 'SCHEDULED'
    };

    setAppointments([...appointments, appointment]);
    setIsModalOpen(false);
    setNewAppt({ ...newAppt, patientId: '' });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] overflow-hidden animate-in fade-in duration-500">
      {/* Calendar Header */}
      <div className="glass p-5 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setView('day')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${view === 'day' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white'}`}
            >
              Dia
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${view === 'week' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white'}`}
            >
              Semana
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => changeDate(-1)} className="p-2.5 hover:bg-white/5 rounded-xl text-gray-400 transition-all border border-transparent hover:border-white/10">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-xl font-bold font-outfit text-white min-w-[180px] text-center">
              {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => changeDate(1)} className="p-2.5 hover:bg-white/5 rounded-xl text-gray-400 transition-all border border-transparent hover:border-white/10">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
          Novo Agendamento
        </button>
      </div>

      {/* Main Calendar View */}
      <div className="flex-1 glass rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl bg-white/[0.01]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 gap-1 relative">
            {timeSlots.map((time, idx) => {
              const appt = filteredAppointments.find(a => a.startTime === time);
              const patient = MOCK_PATIENTS.find(p => p.id === appt?.patientId);
              
              return (
                <div key={time} className="group flex items-start gap-6 py-4 border-b border-white/[0.03] last:border-0 min-h-[100px] transition-all relative">
                  <div className="w-16 text-right">
                    <span className="text-sm font-bold text-gray-600 group-hover:text-blue-400 transition-colors">{time}</span>
                  </div>
                  
                  <div className="flex-1 relative">
                    {appt ? (
                      <div 
                        className={`p-5 rounded-3xl border transition-all cursor-pointer group/card animate-in slide-in-from-left-4 duration-300 flex items-center justify-between ${
                          appt.type === 'TELEMEDICINE' 
                            ? 'bg-blue-600/10 border-blue-500/30 hover:border-blue-500/60 shadow-lg shadow-blue-600/5' 
                            : 'bg-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-600/5'
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner transition-transform group-hover/card:scale-105 ${
                            appt.type === 'TELEMEDICINE' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                          }`}>
                            {patient?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg tracking-tight">{patient?.name}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-gray-400">
                               <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> {appt.startTime}</span>
                               <span className="text-gray-700">•</span>
                               <span className="flex items-center gap-1.5">
                                 {appt.type === 'TELEMEDICINE' ? (
                                   <><Video size={14} className="text-blue-400" /> Telemedicina</>
                                 ) : (
                                   <><Users size={14} className="text-emerald-400" /> Presencial</>
                                 )}
                               </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                             {appt.status === 'CONFIRMED' ? 'Confirmado' : 'Agendado'}
                           </div>
                           <button className="p-2.5 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition-all">
                             <ArrowRight size={20} />
                           </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setNewAppt({ ...newAppt, startTime: time });
                          setIsModalOpen(true);
                        }}
                        className="w-full h-12 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-gray-800 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-600/5 transition-all group/btn"
                      >
                        <Plus size={20} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:scale-125 transition-all" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Calendar Footer Info */}
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-8">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-600/30"></span> Telemedicina
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-sm shadow-emerald-600/30"></span> Presencial
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span> Disponível
           </div>
        </div>
      </div>

      {/* Modal: Agendar Consulta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0D1B2A]/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass w-full max-w-xl rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="text-2xl font-bold font-outfit text-white">Agendar Consulta</h3>
                <p className="text-sm text-gray-500 mt-1">Marque um novo horário na agenda da clínica.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddAppointment} className="p-8 space-y-6">
              <div className="space-y-5">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Selecionar Paciente</label>
                  <select 
                    required
                    value={newAppt.patientId}
                    onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none"
                  >
                    <option value="" className="bg-[#1B263B]">Selecione um paciente...</option>
                    {MOCK_PATIENTS.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#1B263B]">{p.name} ({p.cpf})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Data</label>
                    <input 
                      type="date" 
                      required
                      value={newAppt.date}
                      onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Horário</label>
                    <select 
                      value={newAppt.startTime}
                      onChange={e => setNewAppt({...newAppt, startTime: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none"
                    >
                      {timeSlots.map(t => (
                        <option key={t} value={t} className="bg-[#1B263B]">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Modalidade de Atendimento</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setNewAppt({...newAppt, type: 'IN_PERSON'})}
                        className={`p-5 rounded-3xl border transition-all flex flex-col items-center gap-3 ${
                          newAppt.type === 'IN_PERSON' 
                            ? 'bg-emerald-500/10 border-emerald-500/50 ring-4 ring-emerald-500/10 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                        }`}
                      >
                         <Users size={28} />
                         <span className="text-xs font-bold uppercase tracking-widest">Presencial</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewAppt({...newAppt, type: 'TELEMEDICINE'})}
                        className={`p-5 rounded-3xl border transition-all flex flex-col items-center gap-3 ${
                          newAppt.type === 'TELEMEDICINE' 
                            ? 'bg-blue-500/10 border-blue-500/50 ring-4 ring-blue-500/10 text-blue-400' 
                            : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                        }`}
                      >
                         <Video size={28} />
                         <span className="text-xs font-bold uppercase tracking-widest">Telemedicina</span>
                      </button>
                   </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-white/10 rounded-2xl font-bold text-gray-400 hover:bg-white/5 transition-all uppercase tracking-widest text-[11px]"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                >
                  <CheckCircle2 size={18} /> Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
