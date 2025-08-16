import React, { useCallback, useEffect, useState } from "react";
import {User} from "../../../types";
import UserListComponent from "../Components/UserListComponent";
import UserDetailCard from "../Components/UserDetailCard";
import RegisterUserCard from "../Components/RegisterUserCard";
import { UserFormData } from "../types";
import { BASE_URL } from "../../../config";

export default function UserPage(){

    const [users,SetUsers] = useState<User[]>([]);
    const [loading,SetLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [UserDrawerOpen,setUserDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRoles,SetSelectedRoles] = useState<string[]>([]);

    const [editableUser,SetEditableUser]=useState<User|null>(null);

    const [formErrors,SetFormErrors] = useState<Record<string,string>>({});

    useEffect(()=>{
      
      fetchUsers();

    },[]);

    const fetchUsers = async () =>{

      console.log(BASE_URL);

        try{
            SetLoading(true);
            setError(null);
            const response = await fetch(`${BASE_URL}/api/User/GetUser`);

            if(!response.ok){
              throw new Error('HTTP error');
            }

            const responseJson = await response.json();

            if(responseJson.success == true){

              const fetchedUsers = responseJson?.resData?.[0] || [];
              console.log(fetchedUsers);
              console.log(fetchedUsers);
              SetUsers(fetchedUsers);

            }else{

              setError(responseJson.description);
            
            }

        }catch(err:any){

        }finally{

        }
      }


    useEffect(()=>{
      SetEditableUser(selectedUser);
    },[selectedUser])

    useEffect(() => {
    if (selectedUser?.userRoles && Array.isArray(selectedUser.userRoles)) {
      SetSelectedRoles(selectedUser.userRoles); // directly set string array
    } else {
      SetSelectedRoles([]);
    }
  }, [selectedUser]);

    const handleUserFieldChane = (field:keyof User,value:any)=>{
      if(!editableUser)return;
      SetEditableUser({...editableUser,[field]:value});
    }

    const handleRegisterUserSubmit = useCallback(async(formData:UserFormData)=>{

      try{
        
        const res = await fetch(`${BASE_URL}/api/User/RegisterUser`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(formData)

        });

        const json = await res.json();
        console.log("register response:", json);

        if (res.ok && json.success) {
          // Update list (use API response if available)
          const newUser = json.resData || formData;

          SetFormErrors({});

        // setUsers(prev => [...prev, newUser]);
        } else {
          // handle API-level error
          console.error("Register error:", json.description || json);
          //alert(json.description || "Registration failed");

          const errorMap:Record<string,string>={};

          json.errors?.forEach((err:{description:string})=>{
            if (err.description.toLowerCase().includes("user name")) {
            errorMap.userName = err.description;
            } else if (err.description.toLowerCase().includes("email")) {
              errorMap.email = err.description;
            } else if (err.description.toLowerCase().includes("display name")) {
              errorMap.displayName = err.description;
            }
          });

          SetFormErrors(errorMap);

        }

        }catch(err){
          console.error(err);
          alert("Error in back end");
        }

    },[]);

    // Handler to save the edited user (call API)
  const saveUserChanges = async () => {
    if (!editableUser) return;

    console.log(editableUser);

    try {
      const response = await fetch(`${BASE_URL}/api/User/UpdateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableUser),
      });

      console.log(response.json());

      if (!response.ok) {
        alert("Update failed");
        throw new Error("Failed to update user");
        
      }

      alert("Success");
      fetchUsers();
     

    } catch (error) {

      alert(error);

      console.log(error);

      alert("Error saving user changes");
    }
  };


  const saveRolesForUser = async () => {
      if (!selectedUser) return;

      try {
        const response = await fetch(
          `${BASE_URL}/api/User/SaveUserRoles`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: selectedUser.id,
              roles: selectedRoles,
            }),
          }
        );

        const result = await response.json();
        if (!response.ok || !result.success) {
          alert("Failed to update roles: " + (result.description || ""));
          return;
        }

        alert("Roles updated successfully!");
        fetchUsers(); // refresh users list after success
      } catch (err) {
        console.error(err);
        alert("Error saving roles.");
      }
    };

    const selectedUse=(user)=>{

        setSelectedUser(user);



      console.log(selectedUser)
    } 

    return (
    <div style={{ height: "100%", background: "white" }} className="flex flex-col md:flex-row h-full">

      {/* Single grid with 12 columns */}
      <div className="grid grid-cols-12 gap-4 w-full h-full">

        {/* User List (4/12) */}
        <div className="col-span-12 md:col-span-3 border-r-2 border-gray-400 overflow-y-auto thin-scrollbar h-full">
          <UserListComponent users={users} onUserClick={(user) => selectedUse(user)} />
        </div>

        {/* User Detail (5/12) */}
        <div className="col-span-12 md:col-span-6 p-4 h-full overflow-auto">
          <UserDetailCard
          onFieldChange={handleUserFieldChane} 
          onSave={saveUserChanges}
          selectedRoles={selectedRoles}
          onSelectedRolesChange={(newRoles:string[])=>SetSelectedRoles(newRoles)}
          user={selectedUser} 
          onSaveRoles={saveRolesForUser}
          
          />
        </div>

        {/* Register User Card (3/12) */}
        <div className="col-span-12 md:col-span-3 h-full overflow-auto border-l-2 border-gray-400 thin-scrollbar">
          <RegisterUserCard onSubmit={handleRegisterUserSubmit} errors={formErrors}/>
        </div>

      </div>

    </div>
  );


}