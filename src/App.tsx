import { useState } from "react";
import FollowUps from "./components/FollowUps";
import Introduction from "./components/Introduction";
import PatientInfo from "./components/PatientInfo";
import Summary from "./components/Summary";
import Symptoms from "./components/Symptoms";
import type { IPatient, ISymptom, IFollowUp } from "./types";

const App = () => {
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState<Omit<IPatient, '_id'>>({
    fullName: "",
    age: "" as unknown as number,
    gender: "",
    phone: "",
    medicalHistory: [],
    currentMedications: "",
  });
  const [symptomsData, setSymptomsData] = useState<ISymptom>({
    symptoms: [],
    duration: "",
    severity: 0,
    additionalDetails: "",
  });
  const [followUpsData, setFollowUpsData] = useState<IFollowUp[]>([]);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="bg-gray-100 min-h-screen font-body">
      <header className="bg-blue-600 text-white text-center p-4">
        <h1 className="text-2xl font-bold font-heading">
          e-Likita Hospital Consultation Assistant
        </h1>
        <p>Healthcare Assistant Guided Triage</p>
      </header>
      <main className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between mb-8">
            <div
              className={`w-1/5 text-center p-2 rounded-lg ${
                step === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <span className="font-heading">Intro</span>
            </div>
            <div
              className={`w-1/5 text-center p-2 rounded-lg ${
                step === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <span className="font-heading">Patient Info</span>
            </div>
            <div
              className={`w-1/5 text-center p-2 rounded-lg ${
                step === 3 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <span className="font-heading">Symptoms</span>
            </div>
            <div
              className={`w-1/5 text-center p-2 rounded-lg ${
                step === 4 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <span className="font-heading">Follow-ups</span>
            </div>
            <div
              className={`w-1/5 text-center p-2 rounded-lg ${
                step === 5 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <span className="font-heading">Summary</span>
            </div>
          </div>
          {step === 1 && <Introduction nextStep={nextStep} />}
          {step === 2 && (
            <PatientInfo
              nextStep={nextStep}
              prevStep={prevStep}
              patientData={patientData}
              setPatientData={setPatientData}
            />
          )}
          {step === 3 && (
            <Symptoms
              nextStep={nextStep}
              prevStep={prevStep}
              symptomsData={symptomsData}
              setSymptomsData={setSymptomsData}
            />
          )}
          {step === 4 && (
            <FollowUps
              nextStep={nextStep}
              prevStep={prevStep}
              setFollowUpsData={setFollowUpsData}
              patientData={patientData}
              symptomsData={symptomsData}
              setConsultationId={setConsultationId}
            />
          )}
          {step === 5 && consultationId && (
            <Summary
              prevStep={prevStep}
              consultationId={consultationId}
              setStep={setStep}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
