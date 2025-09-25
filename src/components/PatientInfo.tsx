import { useState } from "react";
import type { IPatient } from "../types";
import Stepper from "./Stepper";
import { motion } from "motion/react";

interface PatientInfoProps {
  nextStep: () => void;
  prevStep: () => void;
  patientData: Omit<IPatient, '_id'>;
  setPatientData: (data: Omit<IPatient, '_id'>) => void;
}

const steps = [
  "Introduction",
  "Patient Info",
  "Symptoms",
  "Follow-up",
  "Summary",
];

const PatientInfo = ({
  nextStep,
  prevStep,
  patientData,
  setPatientData,
}: PatientInfoProps) => {
  const [formData, setFormData] = useState(patientData);
  const [errors, setErrors] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: ""
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        medicalHistory: checked
          ? [...(prev.medicalHistory || []), value]
          : (prev.medicalHistory || []).filter((item) => item !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
      // Clear error when field is being edited
      if (errors[name as keyof typeof errors]) {
        setErrors({
          ...errors,
          [name]: ""
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: !formData.fullName ? "Full name is required" : "",
      age: !formData.age ? "Age is required" : "",
      gender: !formData.gender ? "Gender is required" : "",
      phone: !formData.phone ? "Phone number is required" : ""
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleNext = () => {
    if (validateForm()) {
      setPatientData(formData);
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stepper currentStep={2} steps={steps} />
      <h2 className="text-2xl font-bold font-heading mb-4">Patient Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body">
        <div className="md:col-span-1">
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="Enter your full name as it appears on your ID"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div className="md:col-span-1">
          <label className="block mb-2">Age</label>
          <input
            title="number"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${errors.age ? "border-red-500" : ""}`}
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>
        <div className="md:col-span-1">
          <label className="block mb-2">Gender</label>
          <select
            title="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${errors.gender ? "border-red-500" : ""}`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
        <div className="md:col-span-1">
          <label className="block mb-2">Phone Number</label>
          <input
            title="Phone number"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2">Medical History</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Diabetes",
              "High Blood Pressure",
              "Heart Disease",
              "Asthma",
              "Known Allergies",
            ].map((condition) => (
              <div key={condition} className="flex items-center">
          <input
            type="checkbox"
            id={condition}
            name="medicalHistory"
            value={condition}
            checked={formData.medicalHistory?.includes(condition)}
            onChange={handleChange}
            className="mr-2 w-5 h-5 hover:border-blue-500 hover:border-2"
          />
          <label htmlFor={condition}>{condition}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2">Current Medications</label>
          <textarea
            title="current medications"
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          ></textarea>
        </div>
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
    </motion.div>
  );
};

export default PatientInfo;
