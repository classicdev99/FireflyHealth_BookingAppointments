import { CalendarToday } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Card, Divider, Grid, Radio, Snackbar, Typography } from "@mui/material";
import type { Appointment } from "@prisma/client";
import React, { useEffect, useState, useMemo } from "react";
import useData from "../../hooks/useData";
import axios from "../../lib/axios.config";


export const AppointmentsIndex: React.FC = () => {
  const { fetchingData, clinicians, availabilities, patients, appointments } = useData();
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);
  const [selectedClinicians, setSelectedClinicians] = useState<number[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [selectedAvailabilityGroups, setSelectedAvailabilityGroups] = useState<{
    id: string;
    start: string;
  }[]>([]);

  // group availabilities by day
  const groupedAvailabilities = useMemo(() => {
    return availabilities.reduce((acc, availability) => {
      const date = new Date(availability.start).toLocaleDateString();
      if (!acc.find(group => group.id === date)) {
        acc.push({
          id: date,
          start: new Date(availability.start).toISOString()
        });
      }
      return acc;
    }, [] as { id: string, start: string }[]);
  }, [availabilities]);


  // filter appointments based on selected filters
  useEffect(() => {
    setFilteredAppointments(appointments.filter(appointment => {
      if (selectedClinicians.length > 0 && !selectedClinicians.includes(appointment.clinician_id)) {
        return false;
      }
      if (selectedPatients.length > 0 && !selectedPatients.includes(appointment.patient_id)) {
        return false;
      }
      if (selectedAvailabilityGroups.length > 0 && !selectedAvailabilityGroups.find(group => new Date(appointment.start).toLocaleDateString() === group.id)) {
        return false;
      }
      return true;
    }));
  }, [selectedClinicians, selectedPatients, selectedAvailabilityGroups, appointments]);

  return (
    <>

      {
        fetchingData ?
          <Typography>Loading...</Typography> :
          <Box display={"flex"} flexDirection={"row"}>

            <Box p={"8px"} px={2.5} display={"flex"} flexDirection={"column"} gap={5}>
              {/* clinicians available */}
              <Box>
                <Typography variant="h6" paddingBottom={1}>Clinicians</Typography>
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  {clinicians.map(clinician => (
                    <Box key={clinician.id}
                      display={"flex"} alignItems={"center"}
                    >
                      <Radio
                        checked={selectedClinicians.includes(clinician.id)}
                        onClick={() => {
                          if (selectedClinicians.includes(clinician.id)) {
                            setSelectedClinicians(selectedClinicians.filter(id => id !== clinician.id));
                          } else {
                            setSelectedClinicians([...selectedClinicians, clinician.id]);
                          }
                        }}
                        value={clinician.id}
                        name="clinician"
                        inputProps={{ 'aria-label': clinician.id.toString() }}
                      />
                      <Typography
                        sx={{
                          textDecoration: 'underline',
                          color: "#1976d2"
                        }}
                      >{clinician.first_name} {clinician.last_name}</Typography>
                    </Box>

                  ))}
                </Box>
              </Box>

              {/* date groups */}
              <Box>
                <Typography variant="h6" paddingBottom={1}>Dates</Typography>
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  {groupedAvailabilities.map(availability => (
                    <Box key={availability.id}
                      display={"flex"} alignItems={"center"}
                    >
                      <Radio
                        checked={selectedAvailabilityGroups.map(group => group.id).includes(availability.id)}
                        onClick={() => {
                          if (selectedAvailabilityGroups.map(group => group.id).includes(availability.id)) {
                            setSelectedAvailabilityGroups(selectedAvailabilityGroups.filter(group => group.id !== availability.id));
                          } else {
                            setSelectedAvailabilityGroups([...selectedAvailabilityGroups, availability]);
                          }
                        }}
                        value={availability.id}
                        name="availability"
                        inputProps={{ 'aria-label': availability.id.toString() }}
                      />
                      <Typography
                        sx={{
                          textDecoration: 'underline',
                          color: "#1976d2"
                        }}
                      >{
                          // display in format : Tuesday, 12 October
                          new Date(availability.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                        }</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* patients available */}
              <Box>
                <Typography variant="h6" paddingBottom={1}>Patients</Typography>
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  {patients.map(patient => (
                    <Box key={patient.id}
                      display={"flex"} alignItems={"center"}
                    >
                      <Radio
                        checked={selectedPatients.includes(patient.id)}
                        onClick={() => {
                          if (selectedPatients.includes(patient.id)) {
                            setSelectedPatients(selectedPatients.filter(id => id !== patient.id));
                          } else {
                            setSelectedPatients([...selectedPatients, patient.id]);
                          }
                        }}
                        value={patient.id}
                        name="patient"
                        inputProps={{ 'aria-label': patient.id.toString() }}
                      />
                      <Typography
                        sx={{
                          textDecoration: 'underline',
                          color: "#1976d2"
                        }}
                      >{patient.first_name} {patient.last_name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Divider orientation={"vertical"} flexItem sx={{
              backgroundColor: "#e0e0e0",
              width: 2,
            }} />

            {/* showing filtered appointments */}
            <Box pl={"24px"} pt={"8px"}>
              <Typography variant="h4">All Appointments</Typography>
              {
                appointments.length > 0 ?
                  <Box
                    display={"grid"} gap={"24px"} pt={"16px"}
                    sx={{
                      gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        lg: 'repeat(2, 1fr)',
                        xl: 'repeat(3, 1fr)',
                      },
                    }}
                  >
                    {
                      filteredAppointments.map(appointment => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    }

                  </Box>
                  :
                  <Card sx={{
                    padding: 2,
                    marginTop: 2,
                    border: "1px solid #ccc",
                    borderRadius: .5,
                    boxShadow: "none"
                  }}>No appointments found</Card>
              }
            </Box>

          </Box >
      }
    </>
  )
};


const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const { clinicians, patients, setAppointments } = useData();
  const [cancellingAppointment, setCancellingAppointment] = useState(false);

  // showing notifications to the user after a successful or failed operation
  const [showSnackbar, setShowSnackbar] = useState<{
    show: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info"
  } | null>();

  // a function for cancelling an appointment
  const cancelAppointment = async () => {
    setCancellingAppointment(true);
    try {
      await axios.delete(`/appointments/${appointment.id}`);
      setShowSnackbar({
        show: true,
        message: "Appointment cancelled successfully",
        severity: "success"
      });
      // remove the appointment from the list after 3 seconds
      setTimeout(() => {
        setAppointments((prev) => prev.filter(app => app.id !== appointment.id));
      }, 3000);
    } catch (e) {
      console.error(e);
      setShowSnackbar({
        show: true,
        message: "Failed to cancel appointment",
        severity: "error"
      });
    } finally {
      setCancellingAppointment(false);
    }
  }

  return (
    <Grid item>
      <Card sx={{
        padding: 2,
        minWidth: 320,
        border: "1px solid #ccc",
        borderRadius: .5,
        boxShadow: "none"
      }}>
        <Box display={"flex"} gap={"12px"}>
          <Avatar sx={{
            bgcolor: "#ebc3a2",
            padding: 3
          }}>
            <CalendarToday
              fontSize="small"
              sx={{
                color: "#db8a4f"
              }}
            />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {new Date(appointment.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
            <Typography
              variant="subtitle2"
              color="#777777"
            >
              {/* format dates*/}
              {new Date(appointment.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(new Date(appointment.start).getTime() + 30 * 60000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </Typography>
          </Box>
        </Box>

        {/* clinician and patient details */}
        <Box mt={"24px"}>
          <Typography variant="subtitle1">
            {/* find the clinician associated with this appointment */}
            Clinician: {clinicians.find(clinician => clinician.id === appointment.clinician_id)?.first_name} {clinicians.find(clinician => clinician.id === appointment.clinician_id)?.last_name}
          </Typography>
          <Typography variant="subtitle1">
            {/* find patient associated with this appointment */}
            Patient: {patients.find(patient => patient.id === appointment.patient_id)?.first_name} {patients.find(patient => patient.id === appointment.patient_id)?.last_name}
          </Typography>
        </Box>

        <Button
          disabled={cancellingAppointment}
          variant="contained"
          color="primary"
          sx={{
            marginTop: 2,
            textTransform: 'none',
            boxShadow: 0
          }}
          onClick={cancelAppointment}
        >
          Cancel
        </Button>
      </Card>

      {/* notify the user for successful or failed results */}
      <Snackbar open={Boolean(showSnackbar?.show)} autoHideDuration={6000} onClose={() => setShowSnackbar(null)}>
        <Alert
          onClose={() => setShowSnackbar(null)}
          severity={showSnackbar?.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {showSnackbar?.message}
        </Alert>
      </Snackbar>
    </Grid>
  )
}