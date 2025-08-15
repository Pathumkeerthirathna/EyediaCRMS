import React, { useState } from "react";
import { Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ResetPasswordForm from "./Forms/FrmResetPassword";

type ResetPasswordDrawerProps = {
  open: boolean;
  onClose: () => void;
  userName:string
  id:string
};


export default function ResetPasswordDrawerComponent({ open, onClose,userName,id }: ResetPasswordDrawerProps) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatedUserName,SetUserName] = useState(userName||"");

    // Handle password submit from form
    const handlePasswordSubmit = async (id:string,updatedUserName: string, newPassword: string, confirmPassword: string) => {
        
        setLoading(true);
        setError(null);

        const body = {
            id: id,
            userName: updatedUserName,
            password:newPassword
        }

        console.log(body);

       // On success, close drawer
        onClose();

        try {

            const response = await fetch(
          "https://localhost:7050/api/User/UpdateAccountSettings",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        // Simulate API delay
        await new Promise((res) => setTimeout(res, 1000));

        

        } catch (err) {

        setError("Failed to reset password. Please try again.");

        } finally {

            setLoading(false);
        }

    };

  return (
    <Drawer
       anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
            paper: {
                sx: {
                    top: 350, // space from top
                    right:5,
                    height: 'auto',
                    width: 300,
                    position: 'fixed', 
                    borderRadius: 5,         // or full radius on all corners
                    
                }
            }
        }}
            
            >
            <div 
            style=
            {{ 
                width: 300,
                padding: 16,
                paddingTop: 20, // this adds 200px space inside the drawer content from top
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Account Settings</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                </div>

                <div style={{ marginTop: 20, flexGrow: 1 }}>
                
                <ResetPasswordForm
                    onPasswordSubmit={handlePasswordSubmit}
                    loading={loading}
                    error={error}
                    existingUserName={userName}
                    id={id}
                />
                </div>
            </div>
    </Drawer>
  );
}
