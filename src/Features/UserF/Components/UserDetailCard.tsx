import React, { useEffect, useRef, useState } from "react";
import { Switch
    } from "@mui/material";

import {
  UserIcon,
  PhoneIcon,
  ClockIcon,
  LockOpenIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  KeyIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

import { User } from "../../../types";
import ResetPasswordDrawerComponent from "./ResetPasswordDrawerComponent";

type Props = {
    user:User | null;
    onFieldChange:(field:keyof User,value:any)=>void;
    onSave:()=>void;
    selectedRoles: string[];
    onSelectedRolesChange: (roles: string[]) => void;
    onSaveRoles?: () => void;
}

type Role = {id:string;name:string};

export default function  UserDetailCard({user,onFieldChange,onSave,selectedRoles,onSelectedRolesChange,onSaveRoles}:Props) {

  console.log("DEtails card",user?.userName);

    
    const [editableUser,SetEditableUser] = useState<User|null>(user);
    // Which field is currently being edited
    const [editingField, setEditingField] = useState<string | null>(null);
    const originalValuesRef = useRef<Partial<User>>({});
    
    const [userroles,SetUserRoles] = useState<Role[]>([]);
    const [loading,SetLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    const [lockoutEnabled, setLockoutEnabled] = useState(user?.lockoutEnabled??false);
    const [towFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [activeStatus,SetActiveStatus] = useState(false);
    const [accessFailedCount,SetAccessFailedCount] = useState(0);

    const [isDrawerOpen,setIsDrawerOpen] = useState(false);

    const [editingRoles,SetEditingRoles] = useState(false);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    useEffect(() => {
        
        const fetchUserRoles = async()=>{
       
        try{

            SetLoading(true);
            setError(null);
            const response = await fetch("https://localhost:7050/api/User/GetRole");

            if(!response.ok){
                        
                throw new Error('HTTP error');
            }

            const responseJson = await response.json();

            if(responseJson.success == true){
                
                const roles = responseJson?.resData?.[0]||[];

                SetUserRoles(roles);


            }else{

                setError(responseJson.description);

            }

        }catch(err:any){
            setError(err); 
        }finally{
            SetLoading(false);
        }
    }

    // Your fetch logic here
    fetchUserRoles();
    },[user]);

    useEffect(() => {

      if(user && user.id !== editableUser?.id){
         SetEditableUser(user);
      }

      if (user) {
        SetActiveStatus(user.status === 0);
        setEditingField(null);
        SetEditingRoles(false);
        setupAccessFailedCount(user.accessFailedCount)
        setLockoutEnabled(user.lockoutEnabled);
        setTwoFactorEnabled(user.twoFactorEnabled);

        
      } else {
        
        SetActiveStatus(false);
        SetEditableUser(null);
        setEditingField(null);
        SetEditingRoles(false);
        SetAccessFailedCount(0);
        setLockoutEnabled(false);
        setTwoFactorEnabled(false);
      }
    }, [user]);

    const toggleRole = (role: string) => {
        let newRoles: string[];
      if (selectedRoles.includes(role)) {
        newRoles = selectedRoles.filter(r => r !== role);
      } else {
        newRoles = [...selectedRoles, role];
      }
      onSelectedRolesChange(newRoles);
    };



  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a user to see details
      </div>
    );
  }
  
  //////////

  const setupActiveStatus = (isActive: boolean) => {
  
  SetActiveStatus(isActive);
  
  console.log("Active status changed:", isActive ? "Active (0)" : "Deactivated (1)");
  
  const newStatus = isActive ? 0 : 1;
    // If you want to update user status inside editableUser state:
    
    SetEditableUser(prev =>
      prev ? { ...prev, status: isActive ? 0 : 1 } : prev
    );

    onFieldChange("status", newStatus);

  };

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-"; // invalid date
  return date.toISOString().slice(0, 10);
}

const setupAccessFailedCount = (failedCount:number)=>{
  SetAccessFailedCount(failedCount);
}

const saveNonInputs = () => {
  if (!editableUser) return;
  onFieldChange("lockoutEnabled", lockoutEnabled);
  onFieldChange("twoFactorEnabled", towFactorEnabled);

  console.log("twoFactorEnabled", towFactorEnabled,"lockoutEnabled", lockoutEnabled)

  onSave();
};
 

  const handleLocalFieldChange = (field: keyof User, value: string | number | boolean | string[]) => {
  if (!editableUser) return;

  // Update local state immediately
  SetEditableUser({ 
    ...editableUser, 
    [field]: value 
  });

  // Optionally inform parent if needed
  //onFieldChange?.(field, value);
};

  const handleEdit = (field: keyof User) => {
    if (!editableUser) return;
    // Cast to any to satisfy TS
    originalValuesRef.current[field] = editableUser[field] as any; 
    setEditingField(field);
};

  // Cancel edit for field
  const cancelEdit = () => {
    // Reset editableUser field to original user value for that field
    if (user && editableUser && editingField) {
      SetEditableUser({ ...editableUser, [editingField]: user[editingField] });
    }
    setEditingField(null);
  };

  const saveField = (field: keyof User) => {
    if (!editableUser) return;
    onFieldChange(field, editableUser[field]);
    setEditingField(null);
  };

  // Save roles after editing
  const saveRoles = async () => {
    if (!editableUser) return;
    try {
      // Simulate API call to update roles
      // await api.updateUserRoles(editableUser.id, selectedRoles);
      console.log("Saving roles:", selectedRoles);
      SetEditingRoles(false);
    } catch {
      alert("Failed to save roles");
    }
  };

 

  
  const handleLockoutChange = (checked: boolean) => {
    setLockoutEnabled(checked);
    onFieldChange("lockoutEnabled", checked);
  };
  

  const handleChange = (field: "lockoutEnabled" | "twoFactorEnabled", value: boolean) => {
  if (field === "lockoutEnabled") {
    setLockoutEnabled(value);
    onFieldChange("lockoutEnabled", value);
    // API call for lockout
  } else {
    setTwoFactorEnabled(value);
    onFieldChange("twoFactorEnabled", value);
    // API call for 2FA
  }
};

  if (!editableUser) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a user to see details
      </div>
    );
  }

  // Helper component to render each editable field row
  const EditableField = ({


    icon: Icon,
    label,
    field,
    type = "text",
    
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    field: keyof User;
    type?: string;
  }) => (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-1">
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">{label}:</span>
      </div>

      {editingField === field ? (
        <div className="flex items-center gap-1">

          <input
            type={type}
            className="border-0 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 outline-none px-0 py-1 bg-transparent"
            value={(editableUser[field] as any) || ""}
            onChange={(e) => handleLocalFieldChange(field, e.target.value)}
          />

          <button
            onClick={() => saveField(field)}
            className="text-green-600 hover:text-green-800"
            title="Save"
          >

            <CheckIcon className="w-5 h-5" />

          </button>
          
          <button
            onClick={cancelEdit}
            className="text-red-600 hover:text-red-800"
            title="Cancel"
          >

            <XMarkIcon className="w-5 h-5" />

          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>
            {field === "status"
              ? editableUser.status === 0
                ? "Active"
                : "Deactivated"
              : editableUser[field]?.toString() || "-"}
          </span>
          <button
            onClick={() => handleEdit(field)}
            className="text-gray-400 hover:text-indigo-600"
            title="Edit"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );

  ////////////////

  return (

    <div className="h-full">
    {/* First row: full width */}
        {/* First row card */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12">
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-start space-x-4">
                    <img
                    src="https://randomuser.me/api/portraits/men/31.jpg"
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border"
                    />

                    <div>
                      <h2 className="text-xl font-semibold">{user.displayName}</h2>
                      <p className="text-sm text-gray-500">{user.email}</p>

                        {/* Action Buttons */}
                          {/* Action Buttons */}
                          <div className="flex space-x-2 mt-2">
                            {/* Reset Password */}
                            <button className="relative flex flex-col items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded group"
                            onClick={openDrawer}>
                              <KeyIcon className="w-5 h-5" />
                              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                Reset Logins
                              </span>
                            </button>

                          </div>

                    </div>
                </div>
              </div>
          </div>
        </div>

        {/* Second row cards */}
        <div className="grid grid-cols-12 gap-4 mt-5 ">
            {/* Left card (7 cols) */}
            <div className="col-span-12 md:col-span-7 ">
                
                <div className="bg-white shadow rounded-lg p-4 space-y-4 h-full">
                
                    <EditableField icon={UserIcon} label="Name" field="displayName" />
                    <EditableField icon={PhoneIcon} label="Phone" field="phoneNumber" />
                    <EditableField icon={ClockIcon} label="Access From" field="accessFrom" type="time" />
                    <EditableField icon={ClockIcon} label="Access To" field="accessTo" type="time" />
                    

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                        <LockOpenIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600 font-medium">Last Active:</span>
                        </div>
                        <span>{formatDate(user.lastActive)}</span>
                    </div>
                
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                        <LockOpenIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600 font-medium">Lockout Enabled:</span>
                        </div>
                        <span><input
                            type="checkbox"
                            checked={lockoutEnabled}
                            onChange={(e) => handleChange("lockoutEnabled", e.target.checked)}
                            className="w-5 h-4 accent-indigo-600 cursor-pointer"
                        /></span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                            <ShieldCheckIcon className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-600 font-medium">Two Factor Enabled:</span>
                        </div>
                        {/* <span>{user.twoFactorEnabled?"Yes":"No"}</span> */}
                        <span><input
                            type="checkbox"
                            checked={towFactorEnabled}
                            onChange={(e) => handleChange("twoFactorEnabled", e.target.checked)}
                            className="w-5 h-4 accent-indigo-600 cursor-pointer"
                        /></span>
                    </div>
                    <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-1">
                            <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-600 font-medium">Access Failed Count:</span>
                            </div>
                            <span className="inline-flex items-center space-x-1">
                            <span>{accessFailedCount}</span>
                            <button
                              type="button"
                              onClick={() => {
                                SetAccessFailedCount(0)
                              }}
                              className=" ml-1 text-gray-500 hover:text-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                              title="Reset Count"
                            >
                              <ArrowPathIcon className="w-4 h-4" />
                            </button>
                          </span>
                            
                            
                    </div>
                    
                    <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-1">
                            <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-600 font-medium">Active Status</span>
                            </div>
                            <span>
                              <Switch
                              checked={activeStatus}
                              onChange={(e) => setupActiveStatus(e.target.checked)}
                              color="success"
                            />
                            </span>
                    </div>
                    
                    
                    
                    <div className="mt-6 flex justify-end">

                        <button
                        onClick={saveNonInputs}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
                        title="Update user"
                        >
                        <ArrowPathIcon className="w-5 h-5" />
                        Save changes
                        </button>

                    </div>

                </div>
            </div>

            {/* Right card (5 cols) */}
            <div className="col-span-12 md:col-span-5">
                <div className="bg-white shadow rounded-lg p-4 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-2">
                    {userroles.map((role) => (
                    <label
                        key={role.id}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.name)}
                        onChange={() => toggleRole(role.name)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="select-none">{role.name}</span>
                    </label>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
                            title="Update user roles"
                            onClick={onSaveRoles}
                            >
                            <ArrowPathIcon className="w-5 h-5" />
                            Save changes
                        </button>
                </div>
                </div>
            </div>
        </div>

        <ResetPasswordDrawerComponent open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} userName={user.userName} id={user.id} />

    </div>


  );
}
