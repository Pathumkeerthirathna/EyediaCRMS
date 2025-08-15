import React, { useState } from "react";
import { UserFormData } from "../../types";


type UserFormProps={
  onSubmit:(data:UserFormData)=>void | Promise<void>;
  errors:Record<string,string>;
}


export default function UserForm({onSubmit,errors}:UserFormProps) {
  const [form, setForm] = useState({
    userName: "",
    displayName: "",
    email:"",
    accessFrom: "",
    accessTo: "",
    phoneNumber: "",
    twoFactorEnabled: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Submit logic here
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-2"
    >
      {/* User Name */}
      <div>
        <label htmlFor="userName" className="block font-medium text-gray-700">
          User Name
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
          {errors.userName && <p className="text-red-600 text-sm">{errors.userName}</p>}
      </div>

      {/* Display Name */}
      <div>
        <label
          htmlFor="displayName"
          className="block font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.displayName && <p className="text-red-600 text-sm">{errors.displayName}</p>}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="displayName"
          className="block font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>

      

      {/* Access From */}
      <div>
        <label htmlFor="accessFrom" className="block font-medium text-gray-700">
          Access From
        </label>
        <input
          type="time"
          id="accessFrom"
          name="accessFrom"
          value={form.accessFrom}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Access To */}
      <div>
        <label htmlFor="accessTo" className="block font-medium text-gray-700">
          Access To
        </label>
        <input
          type="time"
          id="accessTo"
          name="accessTo"
          value={form.accessTo}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="block font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="+1 234 567 890"
        />
      </div>

      {/* Two Factor Enabled */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="twoFactorEnabled"
          name="twoFactorEnabled"
          checked={form.twoFactorEnabled}
          onChange={handleChange}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
        />
        <label
          htmlFor="twoFactorEnabled"
          className="font-medium text-gray-700 select-none"
        >
          Two Factor Enabled
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
