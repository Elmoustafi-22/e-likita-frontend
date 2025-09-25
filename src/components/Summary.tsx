import { useEffect, useState } from "react";
import { getConsultationSummary } from "../utils/api";
import type { IConsultation } from "../types";
import Stepper from "./Stepper";
import { motion } from "motion/react";

interface SummaryProps {
  prevStep: () => void;
  consultationId: string;
  setStep: (step: number) => void;
}

const steps = [
  "Introduction",
  "Patient Info",
  "Symptoms",
  "Follow-up",
  "Summary",
];

const Summary = ({ prevStep, consultationId, setStep }: SummaryProps) => {
  const [summary, setSummary] = useState<IConsultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getConsultationSummary(consultationId);
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [consultationId]);

  if (loading) {
    return (
      <div>
        <Stepper currentStep={5} steps={steps} isFinished={false} />
        <div className="font-body text-center p-8">Loading Summary...</div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Stepper currentStep={5} steps={steps} isFinished={false} />
        <div className="text-center p-8">
          <h3 className="text-xl font-bold text-red-600 mb-4">Failed to Load Summary</h3>
          <p className="text-gray-600 mb-6">There was a network error. Please check your connection and try again later.</p>
          <button
            onClick={() => setStep(1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-body hover:bg-blue-600"
          >
            Go Back Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-body"
    >
      <Stepper currentStep={5} steps={steps} isFinished={!loading && !!summary} />
      <h2 className="text-2xl font-bold mb-4 font-heading">Consultation Summary</h2>
      
      {/* Patient Information */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2 font-heading">Patient Information</h3>
        <p><strong>Name:</strong> {summary.patient.fullName}</p>
        <p><strong>Age:</strong> {summary.patient.age}</p>
        <p><strong>Gender:</strong> {summary.patient.gender}</p>
        <p><strong>Phone:</strong> {summary.patient.phone}</p>
        <p><strong>Medical History:</strong> {summary.patient.medicalHistory?.join(", ") || "None"}</p>
      </div>

      {/* Symptoms Reported */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2 font-heading">Symptoms Reported</h3>
        {summary.symptoms.map((s, index) => (
          <div key={index} className="mb-2">
            <p><strong>Primary Symptoms:</strong> {s.symptoms.join(", ")}</p>
            <p><strong>Duration:</strong> {s.duration}</p>
            <p><strong>Pain Level:</strong> {s.severity}/10</p>
            {s.additionalDetails && <p><strong>Additional Details:</strong> {s.additionalDetails}</p>}
          </div>
        ))}
      </div>

      {/* Risk Assessment */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <h3 className="font-bold mb-2 font-heading">Risk Assessment</h3>
        <p className="capitalize"><strong>Level:</strong> {summary.riskAssessment?.level} Risk</p>
        <p><strong>Factors:</strong></p>
        <ul className="list-disc list-inside ml-4">
          {summary.riskAssessment?.factors.map((factor, index) => (
            <li key={index}>{factor}</li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
        <h3 className="font-bold mb-2 font-heading">Recommendations</h3>
        <ul className="list-disc list-inside ml-4">
          {summary.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Next Actions */}
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
        <h3 className="font-bold mb-2 font-heading">Next Actions</h3>
        <ul className="list-disc list-inside ml-4">
          {summary.nextActions?.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>

      {/* Consultation Time */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm text-gray-600">
        <p>
          <strong>Consultation Time:</strong>{" "}
          {new Date(summary.createdAt!).toLocaleString()} (Duration:{" "}
          {summary.consultationDuration} minutes)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between mt-8">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg font-body w-full md:w-auto mb-2 md:mb-0"
        >
          Back
        </button>
        <div className="flex flex-col md:flex-row">
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg md:mr-2 font-body mb-2 md:mb-0"
          >
            Print/Save Summary
          </button>
          <button
            onClick={() => setStep(1)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-body"
          >
            Start New Consultation
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Summary;
