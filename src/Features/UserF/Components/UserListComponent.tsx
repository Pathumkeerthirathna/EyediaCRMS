import Drawer from '@mui/material/Drawer';
import {Box,OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import UserCard from "../Components/UserCard";
import {User} from "../../../types";

type Props = {
    users:User[];
    onUserClick : (user:User)=>void;
}

export default function UserListComponet({users,onUserClick}){

  

return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',   // Must work inside h-full wrapper
        minHeight: 0,     // Crucial for scroll to work
      }}
    >
      {/* Search */}
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
            px: 1,
            py: 0.5,
          }}
        />
      </Box>

      {/* Scrollable List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          minHeight: 0, // 🔥 This ensures scrollable flex child works
        }}
      >
        
        {users.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            No users available.
          </Box>
        ) : (
          users.map((user) => (

             <>
             <div key={user.id} onClick={() => onUserClick(user)}>
              <UserCard user={user} />
            </div>
              </>
        ))
        )}


      </Box>

     
    </Box>
  );

}