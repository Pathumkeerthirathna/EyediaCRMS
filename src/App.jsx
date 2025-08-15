import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Components/Login";
import MainLayout from "./Pages/Layout/MainLayout";
import AuthLayout from "./Pages/Layout/AuthLayout";

import Prospect from "./Pages/Prospect/Prospect";
import { SnackbarProvider } from "./Snackbars/SnackbarContext";
import { CustomerIssuesPage } from "./Features/CustomerIssues/Pages/CustomerIssuePage";
import UserPage  from "./Features/UserF/Pages/UserPage";

//icons
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const apiUrl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiUrl);

function App() {
  return (
    <Router>
        <SnackbarProvider>
      <Routes>
        {/* Public routes (auth) */}
        <Route element={<AuthLayout/>}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* Private routes (main layout) */}
        <Route element={<MainLayout />}>
          
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Prospect" element={<Prospect />} />
              <Route path="/customer/issues" element={<CustomerIssuesPage />} />
              <Route path="/Account/users" element={<UserPage />} />

        </Route>


      </Routes>
      </SnackbarProvider>
    </Router>
  );
}



export default App;


