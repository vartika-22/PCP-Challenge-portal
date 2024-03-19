import React from 'react';

import {

  Modal,

  Typography,

  Box,

  Button,

} from '@mui/material';

 

function InstructionsPopup({ onClose }) {

  const modalStyle = {

    position: 'absolute',

    width: '60%',

    top: '50%',

    left: '50%',

    transform: 'translate(-50%, -50%)',

    backgroundColor: 'white',

    boxShadow: 24,

    p: 4,

    borderRadius: '10px',

  };

 

  const handleClose = () => {

    onClose(); // Call the provided onClose function to close the modal

  };

 

  return (

    <Modal open={true} onClose={handleClose}>

      <Box sx={modalStyle}>

        <Typography variant="h5" gutterBottom>

          General Instructions

        </Typography>

        <Typography variant="body1" paragraph>

        This exam consists of a series of questions that you need to answer. Each question carries 1 mark, and there are <strong>no negative marks</strong> for incorrect answers. Ensure you have a stable internet connection throughout the exam. Make sure your camera is functioning properly and is turned on during the entire duration of the exam. Do not navigate to other tabs or applications while taking the exam.

        </Typography>

        <Typography variant="body1" paragraph>

        You are required to answer all questions. <strong>All questions are mandatory.</strong> Answer each question to the best of your knowledge. You will earn <strong>1 mark for each correct answer.</strong>

        </Typography>

        <Typography variant="h5" gutterBottom>

        Time Management

      </Typography>

      <Typography variant="body1" paragraph>

        The total time allocated for the exam is [insert time duration]. Manage your time wisely to attempt all questions within the given time frame.

      </Typography>

      <Typography variant="h5" gutterBottom>

        Submission

      </Typography>

      <Typography variant="body1" paragraph>

        Once you have completed answering all questions, <strong>click on the "Submit" button.</strong> You will not be able to make any changes after submission, so review your answers before submitting.

      </Typography>

        <Button variant="contained" style={{backgroundColor:"#ab1212",color:"white`"}} onClick={handleClose}>

          Close

        </Button>

      </Box>

    </Modal>

  );

}

 

export default InstructionsPopup;

 