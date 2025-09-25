
export interface IPatient {
  _id: string;
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  medicalHistory?: string[];
  currentMedications: string;
}

export interface ISymptom {
  symptoms: string[];
  duration: string;
  severity: number;
  additionalDetails?: string;
  timestamp?: number | string;
}

export interface IFollowUp {
  question: string;
  answer: string;
}

export interface IConsultation {
  _id: string;
  patient: IPatient;
  symptoms: ISymptom[];
  followUps: IFollowUp[];
  riskAssessment?: {
    level: "low" | "medium" | "high";
    factors: string[];
  };
  recommendations?: string[];
  nextActions?: string[];
  consultationDuration?: number;
  status: "ongoing" | "completed";
  createdAt?: string;
}
