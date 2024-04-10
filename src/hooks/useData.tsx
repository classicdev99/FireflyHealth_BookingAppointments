// this file is used to create a context for the data that is fetched from the server
// it is used to provide the data to the components that need it
// it also provides a hook to access the data
// as a summary, all data fetching is done here and exported for use in all other components

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Clinician, Patient, Appointment, Availability } from "@prisma/client"
import axios from '../lib/axios.config';


interface IDataContext {
    clinicians: Clinician[];
    patients: Patient[];
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    setAvailabilities: React.Dispatch<React.SetStateAction<Availability[]>>;
    availabilities: Availability[];
    fetchingData: boolean;
}

const DataContext = createContext<IDataContext | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {

    // state to store the data fetched from the server
    const [clinicians, setClinicians] = useState<Clinician[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [fetchingData, setFetchingData] = useState(true);


    // fetch all data from the server and store it in the state
    useEffect(() => {
        const fetchClinicians = async () => {
            const response = await axios.get<Clinician[]>("/clinicians");
            setClinicians(response.data);
        };

        const fetchPatients = async () => {
            const response = await axios.get<Patient[]>("/patients");
            setPatients(response.data);
        };

        const fetchAppointments = async () => {
            const response = await axios.get<Appointment[]>("/appointments");
            setAppointments(response.data);
        };

        const fetchAvailabilities = async () => {
            const response = await axios.get<Availability[]>("/availabilities");
            setAvailabilities(response.data);
        };

        // execute all the fetch functions in parallel
        const fetchData = async () => {
            await Promise.all([
                fetchClinicians(),
                fetchPatients(),
                fetchAppointments(),
                fetchAvailabilities(),
            ]);
            setFetchingData(false);
        };

        fetchData();
    }, []);
    return (
        // provide the data to the children
        <DataContext.Provider value={{
            clinicians, patients, appointments, availabilities,
            fetchingData,
            setAvailabilities, setAppointments
        }}>
            {children}
        </DataContext.Provider>
    );
}


// hook to access the data from outside this file
export default function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}