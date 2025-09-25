
import axios from "axios";

const API_URL = "https://e-likita-backend-eedl.onrender.com/api";

export const createPatient = async (patientData: any) => {
  console.log(patientData)
  const response = await axios.post(`${API_URL}/patients`, patientData);
  return response.data;
};

export const createConsultation = async (consultationData: any) => {
  const response = await axios.post(
    `${API_URL}/consultations`,
    consultationData
  );
  return response.data;
};

export const addSymptomsToConsultation = async (
  consultationId: string,
  symptoms: any
) => {
  const response = await axios.post(
    `${API_URL}/consultations/${consultationId}/symptoms`,
    { symptoms }
  );
  return response.data;
};

export const addFollowUpsToConsultation = async (
  consultationId: string,
  followUps: any
) => {
  const response = await axios.post(
    `${API_URL}/consultations/${consultationId}/follow-ups`,
    { followUps }
  );
  return response.data;
};

export const getConsultationSummary = async (consultationId: string) => {
  const response = await axios.get(
    `${API_URL}/consultations/${consultationId}/summary`
  );
  return response.data;
};
