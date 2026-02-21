
import React from 'react';
import { SpecialtyType, UserRole, Clinic, User, Patient, DynamicField, Appointment, ClinicalService } from './types';

export const THEMES = {
  [SpecialtyType.GENERAL]: 'text-blue-500 bg-blue-500',
  [SpecialtyType.CARDIOLOGY]: 'text-emerald-500 bg-emerald-500',
  [SpecialtyType.DERMATOLOGY]: 'text-amber-500 bg-amber-500',
  [SpecialtyType.PSYCHOLOGY]: 'text-indigo-500 bg-indigo-500',
};

export const SPECIALTY_FIELDS: Record<SpecialtyType, DynamicField[]> = {
  [SpecialtyType.GENERAL]: [
    { id: 'temperature', label: 'Temperatura (°C)', type: 'number', placeholder: '36.5' },
    { id: 'weight', label: 'Peso (kg)', type: 'number', placeholder: '70' }
  ],
  [SpecialtyType.CARDIOLOGY]: [
    { id: 'bp_sys', label: 'Pressão Sistólica (mmHg)', type: 'number', placeholder: '120' },
    { id: 'bp_dia', label: 'Pressão Diastólica (mmHg)', type: 'number', placeholder: '80' },
    { id: 'heart_rate', label: 'Freq. Cardíaca (bpm)', type: 'number', placeholder: '72' }
  ],
  [SpecialtyType.DERMATOLOGY]: [
    { id: 'lesion_location', label: 'Localização da Lesão', type: 'text', placeholder: 'Ex: Face anterior da coxa' },
    { id: 'lesion_appearance', label: 'Aspecto Visual', type: 'textarea', placeholder: 'Cor, bordas, textura, relevo...' },
    { id: 'evolution_time', label: 'Tempo de Evolução', type: 'text', placeholder: 'Ex: 2 semanas' }
  ],
  [SpecialtyType.PSYCHOLOGY]: [
    { id: 'mood_rating', label: 'Nível de Humor (1-10)', type: 'number', placeholder: '7' },
    { id: 'sleep_quality', label: 'Qualidade do Sono', type: 'text', placeholder: 'Ex: Sono fragmentado' },
    { id: 'anxiety_level', label: 'Nível de Ansiedade', type: 'text', placeholder: 'Ex: Elevado em situações sociais' }
  ]
};

export const MOCK_CLINIC: Clinic = {
  id: 'clinic-1',
  name: 'MedCore Premium Health',
  cnpj: '12.345.678/0001-90',
  specialty: SpecialtyType.DERMATOLOGY,
  themeColor: '#415A77'
};

export const MOCK_USER: User = {
  id: 'u-1',
  name: 'Dr. Roberto Almeida',
  role: UserRole.ADMIN,
  clinicId: 'clinic-1',
  email: 'roberto@medcore.com'
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    name: 'Ana Silva',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    phone: '(11) 98765-4321',
    email: 'ana.silva@email.com',
    history: ['Consulta Geral - 12/01/2024', 'Exame de Sangue - 05/02/2024']
  },
  {
    id: 'p-2',
    name: 'João Pereira',
    cpf: '987.654.321-11',
    birthDate: '1985-11-20',
    phone: '(11) 91234-5678',
    email: 'joao.p@email.com',
    history: ['Check-up Cardíaco - 20/12/2023']
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a-1',
    patientId: 'p-1',
    doctorId: 'u-1',
    clinicId: 'clinic-1',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    type: 'TELEMEDICINE',
    status: 'CONFIRMED'
  },
  {
    id: 'a-2',
    patientId: 'p-2',
    doctorId: 'u-1',
    clinicId: 'clinic-1',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:30',
    type: 'IN_PERSON',
    status: 'SCHEDULED'
  }
];

export const MOCK_SERVICES: ClinicalService[] = [
  { id: 's-1', name: 'Consulta Médica Particular', category: 'CONSULTA', price: 450.00, duration: 45, status: 'ACTIVE' },
  { id: 's-2', name: 'Eletrocardiograma (ECG)', category: 'EXAME', price: 180.00, duration: 20, status: 'ACTIVE' },
  { id: 's-3', name: 'Biópsia de Pele', category: 'PROCEDIMENTO', price: 320.00, duration: 30, status: 'ACTIVE' },
  { id: 's-4', name: 'Retorno de Consulta', category: 'CONSULTA', price: 0.00, duration: 20, status: 'ACTIVE' },
  { id: 's-5', name: 'Avaliação Estética', category: 'CONSULTA', price: 150.00, duration: 30, status: 'ACTIVE' },
];
