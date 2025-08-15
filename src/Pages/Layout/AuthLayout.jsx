// Pages/Layout/AuthLayout.jsx
import { Outlet } from "react-router-dom";
import Login from "../../Components/Login";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen min-w-screen bg-gray-100">
      {/* Center the card */}
      <div className="m-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
}
