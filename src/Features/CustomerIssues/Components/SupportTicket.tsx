import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Avatar,
  Chip
} from '@mui/material';

const statusMap = {
  1: { label: "Assigned", color: "info" },
  2: { label: "In Progress", color: "primary" },
  3: { label: "Awaiting Customer", color: "warning" },
  4: { label: "Resolved", color: "success" },
  5: { label: "Escalated", color: "error" },
  6: { label: "Verified", color: "success" },
  7: { label: "Closed", color: "default" },
} as const;

type StatusKey = keyof typeof statusMap; // 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface SupportTicketData {
  id: number;
  userName: string;
  assignedAt: string; // date string
  status: StatusKey;
  avatarUrl?: string;
  note: string;
  resolutionSummary: string;
}

type Props = {
  ticket: SupportTicketData;
};

export default function SupportTicket({ ticket }: Props) {
  
  const statusInfo = statusMap[ticket.status] ?? { label: "Unknown", color: "default" };

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card 
      variant="outlined"
       sx={{
         mb: 2,
         borderRadius:4,
         overflow:'hidden'
          }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-start">
            {/* Avatar */}
            <Grid item>
              <Avatar
                alt={ticket.userName}
                src={ticket.avatarUrl || "https://via.placeholder.com/150"}
                sx={{ width: 56, height: 56 }}
              />
            </Grid>

            {/* Main Content */}
            <Grid item xs>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="h6">{ticket.userName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  (Assigned at: {ticket.assignedAt})
                </Typography>
              </Box>

              <Chip
                label={statusInfo.label}
                color={statusInfo.color as
                  | "default"
                  | "primary"
                  | "secondary"
                  | "error"
                  | "info"
                  | "success"
                  | "warning"
                }
                size="small"
                sx={{ mt: 1 }}
              />

              <Box mt={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resolution Summary:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {ticket.resolutionSummary}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          
        </CardActions>

        
      </Card>
    </Box>
  );
}
