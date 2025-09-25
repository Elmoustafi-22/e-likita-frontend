import { useState } from "react";
import { createPatient, createConsultation } from "../utils/api";
import type { IPatient, ISymptom, IFollowUp } from "../types";

interface FollowUpsProps {
  nextStep: () => void;
  prevStep: () => void;
  setFollowUpsData: (data: IFollowUp[]) => void;
  patientData: Omit<IPatient, '_id'>;
  symptomsData: ISymptom;
  setConsultationId: (id: string) => void;
}

const FollowUps = ({
  nextStep,
  prevStep,
  setFollowUpsData,
  patientData,
  symptomsData,
  setConsultationId,
}: FollowUpsProps) => {
  const [painLocation, setPainLocation] = useState("");
  const [painDescription, setPainDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    const followUpsData = [
      {
        question: "Abdominal Pain",
        answer: `Location: ${painLocation}, Description: ${painDescription}`,
      },
    ];
    setFollowUpsData(followUpsData);

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
      };
      console.log(consultationData)
      const consultation = await createConsultation(consultationData);
      setConsultationId(consultation._id);
      nextStep();
    } catch (error) {
      console.error("Failed to create consultation", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body">
      <h2 className="text-2xl font-bold mb-4 font-heading">Follow-up Questions</h2>
      <h3 className="font-bold mb-2 font-heading">Questions about: Abdominal Pain</h3>
      {loading && <p>Submitting data, please wait...</p>}
      <div className="mb-4">
        <p>Where is the pain located?</p>
        <div className="flex flex-col">
          <label className="flex items-center">
            <input
              type="radio"
              name="painLocation"
              value="upper-right"
              onChange={(e) => setPainLocation(e.target.value)}
              className="mr-2"
            />
            upper-right
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painLocation"
              value="upper-left"
              onChange={(e) => setPainLocation(e.target.value)}
              className="mr-2"
            />
            upper-left
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painLocation"
              value="lower-right"
              onChange={(e) => setPainLocation(e.target.value)}
              className="mr-2"
            />
            lower-right
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painLocation"
              value="lower-left"
              onChange={(e) => setPainLocation(e.target.value)}
              className="mr-2"
            />
            lower-left
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painLocation"
              value="center"
              onChange={(e) => setPainLocation(e.target.value)}
              className="mr-2"
            />
            center
          </label>
        </div>
      </div>
      <div>
        <p>How would you describe the pain?</p>
        <div className="flex flex-col">
          <label className="flex items-center">
            <input
              type="radio"
              name="painDescription"
              value="cramping"
              onChange={(e) => setPainDescription(e.target.value)}
              className="mr-2"
            />
            cramping
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painDescription"
              value="sharp"
              onChange={(e) => setPainDescription(e.target.value)}
              className="mr-2"
            />
            sharp
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painDescription"
              value="dull"
              onChange={(e) => setPainDescription(e.target.value)}
              className="mr-2"
            />
            dull
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="painDescription"
              value="burning"
              onChange={(e) => setPainDescription(e.target.value)}
              className="mr-2"
            />
            burning
          </label>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg font-body"
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
    </div>
  );
};

export default FollowUps;