import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const CallLogSnackbar = ({ messageTrigger }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

 
  useEffect(() => {
    if (messageTrigger) {
      setMessage(messageTrigger);
      setOpen(true);
    }
  }, [messageTrigger]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
       <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%', opacity: '80%' }}
        >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CallLogSnackbar;
