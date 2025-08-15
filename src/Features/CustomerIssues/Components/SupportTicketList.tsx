import React from 'react';
import Drawer from '@mui/material/Drawer';
import {Box,Button} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SupportTicket, { SupportTicketData } from './SupportTicket';
import  { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import {User} from "../../../types";
import UserListComponent from "../../../Components/UserComponents/UserListDrawerComponent";

type Props = {
  open: boolean;
  onClose: () => void;
  tickets: SupportTicketData[];
};


const dummyUsers: User[] = [
  {
    id: "1",
    displayName: "John Doe",
    lastActive: "2025-08-05 14:20",
    accessFrom: "08:00",
    accessTo: "17:00",
    url: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "2",
    displayName: "Jane Smith",
    lastActive: "2025-08-06 09:10",
    accessFrom: "09:00",
    accessTo: "18:00",
    url: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "3",
    displayName: "Alice Johnson",
    lastActive: "2025-08-06 10:45",
    accessFrom: "07:30",
    accessTo: "16:30",
    url: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    id: "4",
    displayName: "Bob Williams",
    lastActive: "2025-08-06 11:15",
    accessFrom: "06:00",
    accessTo: "15:00",
    url: "https://randomuser.me/api/portraits/women/28.jpg",
  },
  {
    id: "5",
    displayName: "Charlie Brown",
    lastActive: "2025-08-06 08:25",
    accessFrom: "10:00",
    accessTo: "19:00",
    url: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    id: "6",
    displayName: "Diana Prince",
    lastActive: "2025-08-06 13:50",
    accessFrom: "11:00",
    accessTo: "20:00",
    url: "https://randomuser.me/api/portraits/women/19.jpg",
  },
  {
    id: "7",
    displayName: "Ethan Hunt",
    lastActive: "2025-08-06 15:00",
    accessFrom: "12:00",
    accessTo: "21:00",
    url: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: "8",
    displayName: "Fiona Glenanne",
    lastActive: "2025-08-06 16:30",
    accessFrom: "13:00",
    accessTo: "22:00",
    url: "https://randomuser.me/api/portraits/women/77.jpg",
  },
  {
    id: "9",
    displayName: "George Bailey",
    lastActive: "2025-08-06 17:10",
    accessFrom: "14:00",
    accessTo: "23:00",
    url: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    id: "10",
    displayName: "Hannah Baker",
    lastActive: "2025-08-06 18:45",
    accessFrom: "15:00",
    accessTo: "00:00",
    url: "https://randomuser.me/api/portraits/women/8.jpg",
  },
];

export default function SupportTicketList({ open, onClose, tickets }: Props) {

  const [UserDrawerOpen,setUserDrawerOpen] = useState(false);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            backgroundColor: 'background.paper',
            zIndex: 1,
          }}>

            <button
              onClick={() => setUserDrawerOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition flex items-center gap-2"
              aria-label="Add user"
            >
              <FaUserPlus className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Add User</span>
            </button>
            
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>

            
          </Box>

              {/* ✅ Scrollable Content */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  p: 2,
                }}
              >
                <UserListComponent
                  open={UserDrawerOpen}
                  onClose={() => setUserDrawerOpen(false)}
                  users={dummyUsers}
                />

                {tickets.length === 0 ? (
                  <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                    No support tickets available.
                  </Box>
                ) : (
                  tickets.map((ticket) => (
                    <SupportTicket key={ticket.id} ticket={ticket} />
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
                Update
              </Button>
            </Box>

      </Box>
    </Drawer>
  );
}
