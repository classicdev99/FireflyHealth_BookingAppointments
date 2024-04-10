import React, { useState } from "react";
import useData from "../../hooks/useData";
import { Alert, Avatar, Box, Button, Card, FormControl, InputLabel, NativeSelect, Snackbar, Typography } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { Availability } from "@prisma/client";
import axios from "../../lib/axios.config";

export const AppointmentsNew: React.FC = () => {
  const { availabilities, appointments } = useData();

  return (
    <Box pt={"16px"} px={"24px"}>
      <Typography variant="h4" pb={"12px"}>Book Appointments</Typography>
      <Box
        display={"grid"} gap={"24px"}
        sx={{
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
        }}
      >
        {/* showing all availabilities that are not booked */}
        {availabilities.filter(availability => {
          return !appointments.some(appointment => appointment.availability_id === availability.id)
        }).length > 0 ?
          // filter availabilities that are not booked
          availabilities.filter(availability => {
            return !appointments.some(appointment => appointment.availability_id === availability.id)
          }).map(availability => (
            <AppointmentCard key={availability.id} availability={availability} />
          )) :
          <Card
            sx={{
              padding: 12
            }}
          >
            No Availabilities
          </Card>
        }
      </Box>
    </Box >
  )
};


const AppointmentCard = ({ availability }: { availability: Availability }) => {
  const { patients, clinicians, setAvailabilities } = useData();
  const [selectedPatient, setSelectedPatient] = useState(patients[0].id);
  const [creatingAppointment, setCreatingAppointment] = useState(false);

  // showing notifications to the user after a successful or failed operation
  const [showSnackbar, setShowSnackbar] = useState<{
    show: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info"
  } | null>();

  // a function for creating an appointment for a given availability and a selected patient
  const createAppointment = async () => {
    setCreatingAppointment(true);
    try {
      await axios.post("/appointments", {
        availability_id: availability.id,
        patient_id: selectedPatient,
        clinician_id: clinicians.find(clinician => clinician.id === availability.clinician_id)?.id,
        start: availability.start,
        status: "scheduled"
      });
      setShowSnackbar({
        show: true,
        message: "Appointment created successfully",
        severity: "success"
      });

      // remove the availability from the list after creating the appointment
      setTimeout(() => {
        setAvailabilities((prev) => prev.filter(avail => avail.id !== availability.id));
      }, 3000);

    } catch (error) {
      console.error(error);
    } finally {
      setCreatingAppointment(false);
    }
  }

  return (
    <Card
      sx={{
        padding: "12px",
        paddingTop: "16px",
        width: "100%",
        minWidth: "300px",
      }}
    >
      <Box display={"flex"} gap={"12px"}>
        <Avatar sx={{ bgcolor: "#f45626" }}>
          <CalendarToday />
        </Avatar>
        <Box>
          <Typography variant="subtitle1">
            {new Date(availability.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
          <Typography
            variant="subtitle2"
            color="#777777"
          >
            {new Date(availability.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(availability.end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
          </Typography>
        </Box>
      </Box>

      <Box mt={"24px"}>

        {/* choosing which patient to create the reservation for */}
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Choose Patient
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: 'name',
              id: 'uncontrolled-native',
            }}
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(Number(e.target.value))}
          >
            {
              patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.first_name} {patient.last_name}</option>
              ))
            }
          </NativeSelect>
        </FormControl>

        {/* showing which clinician you are creating an appointment for */}
        <FormControl fullWidth
          sx={{
            marginTop: "20px"
          }}
        >
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Choose Clinician
          </InputLabel>
          <NativeSelect
            defaultValue={clinicians.find(clinician => clinician.id === availability.clinician_id)?.id}
            inputProps={{
              name: 'name',
              id: 'uncontrolled-native',
            }}
          >

            {/* only one option since the availability is associated to a single clinician */}
            <option
              value={clinicians.find(clinician => clinician.id === availability.clinician_id)?.id}
            >
              {clinicians.find(clinician => clinician.id === availability.clinician_id)?.first_name} {clinicians.find(clinician => clinician.id === availability.clinician_id)?.last_name
              }
            </option>

          </NativeSelect>
        </FormControl>
      </Box>

      <Button
        onClick={createAppointment}
        disabled={creatingAppointment}
        variant="contained"
        sx={{
          marginTop: "20px",
          backgroundColor: "primary.main",
          color: "#fff",
        }}
      >
        Book
      </Button>

      {/* showing notification to the user after successful or failed operation */}
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
    </Card >
  )
}