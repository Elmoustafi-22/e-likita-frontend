import Stepper from "./Stepper";
import { motion } from "motion/react";

interface IntroductionProps {
  nextStep: () => void;
}

const steps = [
  "Introduction",
  "Patient Info",
  "Symptoms",
  "Follow-up",
  "Summary",
];

const Introduction = ({ nextStep }: IntroductionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-body"
    >
      <Stepper currentStep={1} steps={steps} />
      <h2 className="text-2xl font-bold mb-4 font-heading">
        Welcome to e-Likita Hospital Consultation Assistant
      </h2>
      <p className="mb-4">
        This guided consultation will help assess your symptoms and provide
        appropriate healthcare recommendations.
      </p>
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
        <p>
          <span className="font-bold">Important:</span> This tool is for
          guidance only and does not replace professional medical advice. In
          case of emergency, call emergency services immediately.
        </p>
      </div>
      <div>
        <h3 className="font-bold mb-2 font-heading">What to Expect:</h3>
        <ul className="list-disc list-inside">
          <li>5-step guided consultation process</li>
          <li>Symptom assessment and risk evaluation</li>
          <li>Personalized healthcare recommendations</li>
          <li>Printable summary for your records</li>
        </ul>
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={nextStep}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Introduction;
