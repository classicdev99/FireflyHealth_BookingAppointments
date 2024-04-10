const BACKEND_URL = "http://localhost:3001";

export const api = {
  fetchAvailabilities: () => fetch(BACKEND_URL + "/availabilities"),
  fetchAppointments: () => fetch(BACKEND_URL + "/appointments"),
  fetchClinicians: () => fetch(BACKEND_URL + "/clinicians"),
  fetchPatients: () => fetch(BACKEND_URL + "/patients"),
};
