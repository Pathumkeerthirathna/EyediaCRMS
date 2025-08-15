import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

type ResetPasswordFormProps = {
  onPasswordSubmit: (id:string,userName: string,newPassword: string, confirmPassword: string) => void;
  loading?: boolean;
  error?: string | null;
  existingUserName:string
  id:string
};

export default function ResetPasswordForm({ onPasswordSubmit, loading = false, error,existingUserName,id }: ResetPasswordFormProps) {
  const [userName, setUserName] = useState(existingUserName);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  console.log(existingUserName);
  console.log(id);

  useEffect(() => {
    setUserName(existingUserName);
  }, [existingUserName]);
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

     if (!userName) {
        setLocalError("Username is required.");
        return;
      }

    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

setUserName(""); // restore original username
    setNewPassword("");
    setConfirmPassword("");

    onPasswordSubmit(id,userName,newPassword, confirmPassword);

    
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {localError && (
        <Typography color="error" variant="body2">
          {localError}
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <TextField
        label="user name"
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
        fullWidth
        autoComplete="off"
      />
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        fullWidth
        autoComplete="off"
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        fullWidth
        autoComplete="new-password"
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Resetting..." : "Reset"}
      </Button>
    </Box>
  );
}
