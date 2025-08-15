import { Card, CardContent, Typography, TextField, Box, Divider } from "@mui/material";

const SupportNotes = () => {
  const existingNote = "Customer mentioned app crash on login.";
  const existingResolution = "Cleared local storage and guided to reinstall the app.";

  return (
    <Card elevation={2} className="w-full bg-white">
      <CardContent>
        {/* <Typography variant="h6" gutterBottom>
          Support Notes
        </Typography> */}

        {/* Existing Note */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Support Notes
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {existingNote}
          </Typography>
        </Box>

        {/* Note Update */}
        {/* <TextField
          fullWidth
          label="Update Note"
          defaultValue={existingNote}
          multiline
          rows={3}
          variant="outlined"
          sx={{ mb: 3 }}
        /> */}

        <Divider sx={{ my: 2 }} />

        {/* Existing Resolution Summary */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Resolution Summary
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {existingResolution}
          </Typography>
        </Box>

        {/* Resolution Update */}
        {/* <TextField
          fullWidth
          label="Update Resolution Summary"
          defaultValue={existingResolution}
          multiline
          rows={3}
          variant="outlined"
        /> */}
      </CardContent>
    </Card>
  );
};

export default SupportNotes;
