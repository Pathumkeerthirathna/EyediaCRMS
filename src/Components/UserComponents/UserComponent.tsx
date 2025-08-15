import { Drawer,
    Box,
     Card,
      Grid,
       Avatar,
       Typography,
       Chip,
        CardContent, 
        Checkbox
    } from "@mui/material";
import { User } from "../../types";

type Props = {
  user: User;
};

export default function UserComponent({user}:Props){


    return(
        <Box sx={{minWidth:275}}>

            <Card variant="outlined"
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
                        alt={user.displayName}
                        src={user.url || "https://via.placeholder.com/150"}
                        sx={{ width: 56, height: 56 }}
                      />
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="h6">{user.displayName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          (Last Active: 2025-08-06 13:57)
                        </Typography>
                      </Box>

                      <Chip
                        label={"Admin"}
                        color={"warning"}
                        size="small"
                        sx={{ mt: 1 }}
                      />

                      <Chip
                        label={"Marketing officer"}
                        color={"primary"}
                        size="small"
                        sx={{ mt: 1 }}
                      />

                      <Box mt={2}>
                        <Typography variant="subtitle2" color="text.info">
                          Access From: 08:00
                        </Typography>
                        <Typography variant="subtitle2" color="text.info">
                          Access To: 17:00
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Right-aligned Checkbox */}
                    <Grid item xs="auto" sx={{ ml: "auto" }}>
                      <Checkbox />
                    </Grid>
                  </Grid>
                </CardContent>
                
            </Card>

        </Box>
    )
}

