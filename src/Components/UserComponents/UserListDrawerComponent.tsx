import React from 'react';
import Drawer from '@mui/material/Drawer';
import {Box,Button,TextField,OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UserComponent from "./UserComponent";
import {User} from "../../types";

type Props = {
  open: boolean;
  onClose: () => void;
  users: User[];
};

export default function UserListDrawerComponent({ open, onClose, users }: Props) {
    


  return (
    <Drawer 
    anchor="right" open={open} onClose={onClose}
    slotProps={{
        paper:{
          sx:{
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            overflow: 'hidden',
            width: 500,
            top: '138px',
            height: 'calc(100vh - 148px)',
            position: 'fixed',
            right: 20,
            scrollbarWidth:'thin',
            scrollbarColor: '#999 transparent', 
          }
        }
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >


         <Box sx={{
            position: 'relative',
            height: 48,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            flexShrink: 0,
          }}>

            <IconButton onClick={onClose} 
    sx={{ position: 'absolute', top: 8, right: 8 }}
    aria-label="Close">
              <CloseIcon />
            </IconButton>

            
          </Box>

          {/* 🔍 Search Field with Icon and Rounded Corners */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          
          <OutlinedInput
            placeholder="Search users..."
            fullWidth
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            }
            sx={{
              borderRadius: '999px',
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#888',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f51b5',
              },
              px: 1,
              py: 0.5,
            }}
          />
        </Box>

        <Box sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  p: 2,
                }}>
          {users.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            No support tickets available.
          </Box>
        ) : (
          users.map((user) => (
            <UserComponent key={user.id} user={user} />
          ))
        )}
        </Box>

        {/* Footer with Select Button */}
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'background.paper',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 999, textTransform: 'none' }}
          >
            Select
          </Button>
        </Box>

      </Box>
    </Drawer>
  );
}
