import { useState } from "react";
import { createPatient, createConsultation } from "../utils/api";
import type { IPatient, ISymptom, IFollowUp } from "../types";
import Stepper from "./Stepper";
import { motion } from "motion/react";

interface FollowUpsProps {
  nextStep: () => void;
  prevStep: () => void;
  setFollowUpsData: (data: IFollowUp[]) => void;
  patientData: Omit<IPatient, '_id'>;
  symptomsData: ISymptom;
  setConsultationId: (id: string) => void;
}

const steps = [
  "Introduction",
  "Patient Info",
  "Symptoms",
  "Follow-up",
  "Summary",
];

// Configuration for symptom-specific follow-up questions
const followUpConfig: Record<string, { title: string; questions: any[] }> = {
  "Abdominal Pain": {
    title: "Abdominal Pain",
    questions: [
      {
        text: "Where is the pain located?",
        key: "location",
        options: ["upper-right", "upper-left", "lower-right", "lower-left", "center"],
        type: "radio",
      },
      {
        text: "How would you describe the pain?",
        key: "description",
        options: ["cramping", "sharp", "dull", "burning"],
        type: "radio",
      },
    ],
  },
  "Severe Headache": {
    title: "Severe Headache",
    questions: [
      {
        text: "Where is the headache located?",
        key: "location",
        options: ["forehead", "temples", "back of head", "all over"],
        type: "radio",
      },
      {
        text: "How would you describe the headache?",
        key: "description",
        options: ["throbbing", "dull ache", "sharp/stabbing", "pressure"],
        type: "radio",
      },
    ],
  },
  "Chest Pain": {
    title: "Chest Pain",
    questions: [
        {
            text: "Where is the pain located?",
            key: "location",
            options: ["center", "left-side", "right-side", "radiates to arm/jaw"],
            type: "radio",
        },
        {
            text: "How would you describe the pain?",
            key: "description",
            options: ["pressure/tightness", "sharp", "burning", "dull ache"],
            type: "radio",
        }
    ]
  }
};

const FollowUps = ({
  nextStep,
  prevStep,
  setFollowUpsData,
  patientData,
  symptomsData,
  setConsultationId,
}: FollowUpsProps) => {
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relevantSymptoms = symptomsData.symptoms?.filter(symptom => followUpConfig[symptom]) || [];

  const handleAnswerChange = (symptomTitle: string, questionKey: string, value: string) => {
    setFollowUpAnswers(prev => ({
        ...prev,
        [symptomTitle]: {
            ...prev[symptomTitle],
            [questionKey]: value,
        }
    }));
  };

  const handleNext = async () => {
    setError(null);
    setLoading(true);

    const formattedFollowUps = Object.entries(followUpAnswers).map(([symptom, answers]) => {
        const answerString = Object.entries(answers)
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join(', ');
        return {
            question: symptom,
            answer: answerString,
        };
    });

    setFollowUpsData(formattedFollowUps);

    try {
      const patient = await createPatient(patientData);

      const consultationData = {
        patient: patient.data._id,
        symptoms: [
          {
            symptoms: symptomsData.symptoms,
            duration: symptomsData.duration,
            severity: symptomsData.severity,
            additionalDetails: symptomsData.additionalDetails,
          },
        ],
        painLevel: symptomsData.severity,
        additionalDetails: symptomsData.additionalDetails,
        followUps: formattedFollowUps, // Include follow-up data in the consultation
      };

      const consultation = await createConsultation(consultationData);
      setConsultationId(consultation._id);
      nextStep();
    } catch (err) {
      console.error("Failed to create consultation", err);
      setError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-body"
    >
      <Stepper currentStep={4} steps={steps} />
      <h2 className="text-2xl font-bold mb-4 font-heading">Follow-up Questions</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg mt-4">Submitting data, please wait...</p>
        </div>
      ) : (
        <>
          {relevantSymptoms.length > 0 ? (
            relevantSymptoms.map(symptom => {
              const config = followUpConfig[symptom];
              return (
                <div key={config.title} className="mb-6 p-4 border rounded-lg">
                  <h3 className="font-bold mb-2 font-heading">Questions about: {config.title}</h3>
                  {config.questions.map(q => (
                    <div key={q.key} className="mb-4">
                      <p>{q.text}</p>
                      <div className="flex flex-col">
                        {q.options.map((option: string) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name={`${config.title}-${q.key}`}
                              value={option}
                              checked={followUpAnswers[config.title]?.[q.key] === option}
                              onChange={(e) => handleAnswerChange(config.title, q.key, e.target.value)}
                              className="mr-2"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            <p>No specific follow-up questions are needed for the selected symptoms. Click Next to proceed.</p>
          )}

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
              disabled={loading}
            >
              {loading ? "Submitting..." : "Next"}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FollowUps;