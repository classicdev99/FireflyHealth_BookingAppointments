import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Intro: React.FC = () => {
  return (
    <>
      <Typography variant="h3">
        Welcome to Firefly's Take Home Interview
      </Typography>
      <Box my={3}>
        <Typography variant="h6">
          To complete this project, you'll add a few more features:
        </Typography>
        <ul>
          <Typography component="li">
            The user should be able to see which availability slots are
            available for booking
          </Typography>
          <Typography component="li">
            The user should be able to book an available appointment slot for a
            patient and clinician combination
          </Typography>
          <Typography component="li">
            The user should be able to see booked appointments for a given
            clinician, date and patient combination
          </Typography>
          <Typography component="li">
            Finally, the user should be able to cancel a booked appointment.
          </Typography>
        </ul>
      </Box>

      <Link to="/appointments">
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Go to Appointments &rarr;
        </Button>
      </Link>
    </>
  );
};
