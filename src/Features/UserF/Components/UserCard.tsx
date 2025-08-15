import { Drawer,
    Box,
     Card,
      Grid,
       Avatar,
        Typography,
         Chip,
          CardContent

    } from "@mui/material";
import { User } from "../../../types";
import { UserStatus, userStatusMeta } from "../Constants/UserStatusMeta";

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
                        src={user.url || "https://randomuser.me/api/portraits/men/31.jpg"}
                        sx={{ width: 36, height: 36 }}
                      />
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        
                        <Typography variant="subtitle1">{user.displayName}</Typography>
                         {/* <Typography variant="h6">{user.status}</Typography> */}

                         <Typography
                            variant="body2"
                            className={`${userStatusMeta[user.status as UserStatus].colorClass} text-xs px-2 py-1 rounded-full`}
                          >
                            {userStatusMeta[user.status as UserStatus].label}
                          </Typography>
                       
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {user.email}
                      </Typography>

                      {/* Dynamic User Roles */}
                      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                      {user.userRoles?.map((role, index) => {
                        // Split role into words, take first letter of each, capitalize and join
                        const acronym = role
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase())
                          .join('');
                        return <Chip key={index} label={acronym} color="primary" size="small" />;
                      })}
                    </Box>

                    </Grid>

                   
                  </Grid>
                </CardContent>
                
            </Card>

        </Box>
    )
}

