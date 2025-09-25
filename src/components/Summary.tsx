import { useEffect, useState } from "react";
import { getConsultationSummary } from "../utils/api";
import type { IConsultation } from "../types";

interface SummaryProps {
  prevStep: () => void;
  consultationId: string;
  setStep: (step: number) => void;
}

const Summary = ({ prevStep, consultationId, setStep }: SummaryProps) => {
  const [summary, setSummary] = useState<IConsultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getConsultationSummary(consultationId);
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [consultationId]);

  if (loading) {
    return <div className="font-body">Loading...</div>;
  }

  if (!summary) {
    return <div className="font-body">Failed to load summary.</div>;
  }

  return (
    <div className="font-body">
      <h2 className="text-2xl font-bold mb-4 font-heading">Consultation Summary</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2 font-heading">Patient Information</h3>
        <p>
          <strong>Name:</strong> {summary.patient.fullName}
        </p>
        <p>
          <strong>Age:</strong> {summary.patient.age}
        </p>
        <p>
          <strong>Gender:</strong> {summary.patient.gender}
        </p>
        <p>
          <strong>Phone:</strong> {summary.patient.phone}
        </p>
        <p>
          <strong>Medical History:</strong> {summary.patient.medicalHistory?.map((s) => s).join(", ") || "None"}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2 font-heading">Symptoms Reported</h3>
        <p>
          <strong>Primary Symptoms:</strong>{" "}
          {summary.symptoms.map((s) => s.symptoms.join(", ")).join("; ")}
        </p>
        <p>
          <strong>Duration:</strong>{" "}
          {summary.symptoms.map((s) => s.duration).join(", ")}
        </p>
        <p>
          <strong>Pain Level:</strong>{" "}
          {summary.symptoms.map((s) => s.severity).join(", ")}/10
        </p>
        <p>
          <strong>Additional Details:</strong>{" "}
          {summary.symptoms.map((s) => s.additionalDetails).join(", ")}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2 font-heading">Risk Assessment</h3>
        <p className="capitalize">
          <strong>{summary.riskAssessment?.level} Risk</strong>
        </p>
        <ul className="list-disc list-inside">
          {summary.riskAssessment?.factors.map((factor, index) => (
            <li key={index}>{factor}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2 font-heading">Recommendations</h3>
        <ul className="list-disc list-inside">
          {summary.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2 font-heading">Next Actions</h3>
        <ul className="list-disc list-inside">
          {summary.nextActions?.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p>
          <strong>Consultation Time:</strong>{" "}
          {new Date(summary.createdAt!).toLocaleString()} (Duration:{" "}
          {summary.consultationDuration} minutes)
        </p>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg font-body"
        >
          Back
        </button>
        <div>
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 font-body"
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
    </div>
  );
};

export default Summary;
