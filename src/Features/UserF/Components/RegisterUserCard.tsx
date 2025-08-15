import React from "react";
import UserForm from "./Forms/FrmAddNewUser"; // import the form component you created earlier
import { UserFormData } from "../types";

type RegisterUserCardProps={
  onSubmit:(data:UserFormData)=> void | Promise<void>;
  errors:Record<string,string>;
}

export default function RegisterUserCard({onSubmit,errors}:RegisterUserCardProps) {
  return (
    <div className="h-full flex flex-col bg-gray-100 px-1 py-1">
      <h1 className="text-2xl font-bold mb-6 text-center">Register User</h1>
        <div className="flex-grow overflow-auto thin-scrollbar">
          <UserForm onSubmit={onSubmit} errors={errors} />
        </div>
    </div>
  );
}
