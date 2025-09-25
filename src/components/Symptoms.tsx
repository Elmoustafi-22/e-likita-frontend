import { useState } from "react";
import type { ISymptom } from "../types";
import { FaExclamationTriangle } from "react-icons/fa";
import Stepper from "./Stepper";

interface SymptomsProps {
  nextStep: () => void;
  prevStep: () => void;
  symptomsData: ISymptom;
  setSymptomsData: (data: ISymptom) => void;
}

const steps = [
  "Introduction",
  "Patient Info",
  "Symptoms",
  "Follow-up",
  "Summary",
];

const Symptoms = ({
  nextStep,
  prevStep,
  setSymptomsData,
  symptomsData,
}: SymptomsProps) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    symptomsData.symptoms || []
  );
  const [duration, setDuration] = useState(symptomsData.duration || "");
  const [painLevel, setPainLevel] = useState(symptomsData.severity || 0);
  const [additionalDetails, setAdditionalDetails] = useState(
    symptomsData.additionalDetails || ""
  );
  const [urgencyMessage, setUrgencyMessage] = useState("");

  const symptomsList = [
    "Chest Pain",
    "Fever/High Temperature",
    "Severe Headache",
    "Difficulty Breathing",
    "Abdominal Pain",
    "Nausea/Vomiting",
    "Diarrhea",
    "Cough",
    "Sore Throat",
    "Fatigue/Weakness",
    "Dizziness",
    "Skin Rash",
    "Joint Pain",
    "Back Pain",
    "Urinary Problems",
  ];

  const urgentSymptoms = [
    "Chest Pain",
    "Fever/High Temperature",
    "Severe Headache",
    "Difficulty Breathing",
  ];

  const handleSymptomChange = (symptom: string) => {
    const newSelectedSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter((s) => s !== symptom)
      : [...selectedSymptoms, symptom];
    setSelectedSymptoms(newSelectedSymptoms);

    const isUrgent = newSelectedSymptoms.some((s) =>
      urgentSymptoms.includes(s)
    );
    if (isUrgent) {
      setUrgencyMessage("Urgent medical attention is required. Call emergency");
    } else {
      setUrgencyMessage("");
    }
  };

  const handleNext = () => {
    const symptomsData = {
      symptoms: selectedSymptoms,
      duration,
      severity: painLevel,
      additionalDetails,
    };

    setSymptomsData(symptomsData);
    nextStep();
  };

  return (
    <div className="font-body">
      <Stepper currentStep={3} steps={steps} />
      <h2 className="text-2xl font-bold mb-4 font-heading">
        Symptom Assessment
      </h2>

      {urgencyMessage && (
        <div className="flex items-center gap-2 bg-red-100 p-3 rounded-lg mb-4">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <p className="text-red-600 font-bold font-body">{urgencyMessage}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body">
        {symptomsList.map((symptom) => (
          <div key={symptom} className="flex items-center">
            <input
              type="checkbox"
              id={symptom}
              checked={selectedSymptoms.includes(symptom)}
              onChange={() => handleSymptomChange(symptom)}
              className="mr-2 w-5 h-5 accent-blue-500 cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor={symptom} className="font-body cursor-pointer">
              {symptom}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-body">
          How long have you been experiencing these symptoms?
        </label>
        <select
          title="duration"
          name="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded-lg font-body"
        >
          <option value="">Select duration</option>
          <option value="1-2 days">1-2 days</option>
          <option value="3-5 days">3-5 days</option>
          <option value="more than a week">more than a week</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-body">
          Pain Level (0 = No pain, 10 = Severe pain)
        </label>
        <input
          title="painlevel"
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(e) => setPainLevel(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="font-body">Pain Level: {painLevel}</p>
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-body">Additional Details</label>
        <textarea
          title="additional details"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          className="w-full p-2 border rounded-lg font-body"
        ></textarea>
      </div>
      <div className="flex flex-col md:flex-row justify-between mt-8">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg font-body mb-2 md:mb-0"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-body"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Symptoms;
