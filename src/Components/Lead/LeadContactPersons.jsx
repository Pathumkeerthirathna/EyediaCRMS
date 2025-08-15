import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { EnumGender, EnumTitle } from "../../Constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

import { useSnackbar } from "../../Snackbars/SnackbarContext";


const apiUrl = import.meta.env.VITE_API_URL;


//values for the form 
const defaultValues = {
  leadID: "",
  name: "",
  designation: "",
  gender: "",
  title: "",
  nic: "",
  birthDate: "",
  contact01: "",
  contact02: "",
  email01: "",
  email02: "",
  isDefault: false,
  status: 0,
};


//form to add new contact persons
  export const AddLeadContactPersons = ({onClose, leadID, onLeadContactPersonAdded, editLeadContactPerson, scrollRef}) => {

 //snackbars
 const { showMessage } = useSnackbar();


    const {
      register,
      handleSubmit,
      reset,
      setValue,
      control,
      formState: { errors },
    } = useForm({defaultValues,});

    useEffect(() => {
      setValue("leadID", leadID);
  
      if (editLeadContactPerson) {
        Object.entries(editLeadContactPerson).forEach(([key, value]) => {
          if (defaultValues.hasOwnProperty(key)) {
            setValue(key, value);
          }
        
        });
      }
    }, [leadID, editLeadContactPerson, setValue]); //set the ProspectID in the field inside the form and editing 
  
    const onSubmit = async (data) => {

      if (editLeadContactPerson && !editLeadContactPerson.id) {
        alert("Missing contact person for update.");
        return;
      }


      const leadContactData = 
       [{
        id: editLeadContactPerson?.id || "string", // use existing id if editing
        leadID: data.leadID,
        name: data.name,
        designation: data.designation,
        gender: data.gender, 
        title: data.title,
        nic: data.nic,
        birthDate: data.birthDate? new Date(data.birthDate).toISOString() : null,
        contact01: data.contact01,
        contact02: data.contact02,
        email01: data.email01,
        email02: data.email02,
        isDefault: data.isDefault,
        status: 0,
      }];
      

    
      try {
        if (editLeadContactPerson) {
          // edit
          await UpdateLeadContactPerson.updateLeadContactPerson(leadContactData);
          alert("Contact Person updated successfully!");
          showMessage('Contact Person updated successfully!', 'success');

        } else {
          // add new
          await axios.post(`${apiUrl}/api/Lead/AddContactPerson`, leadContactData, {
            leadID: data.leadID,
            // cPersons: [leadContactData],
          }, {
            headers: { "Content-Type": "application/json" },
          });
          alert("Contact Person added successfully!");
          showMessage('Contact Person added successfully!', 'success');
        }
    
        reset();
        onLeadContactPersonAdded();
        onClose();
    
      } catch (error) {
        console.error("Form submission error:", error);
        showMessage(error.message || 'Error submitting form', 'error');
        alert(editLeadContactPerson ? "Failed to update contact person." : "Failed to register contact person.");
      }
    };
    

    return (
         <div 
           ref={scrollRef}
           className="contact-person-form-container w-100 ml-6 bg-blue-50 p-4 rounded"> {/* form to add new contact persons for prospects */}
             <form onSubmit={handleSubmit(onSubmit)}>
  
  
                 <div className="form-group text-gray-600 ml-3 mt-3">
                    <label htmlFor="name">Name</label>
                       <input 
                       {...register("name", { required: "Name is required" })} 
                       id="name" 
                       className="p-2 rounded mr-3" 
                       placeholder="Name" />
                 </div>
                 {errors.name && (
                 <p className="text-red-500 text-sm mt-1 ml-38 mb-2">{errors.name.message}</p>
                 )} {/* error message to validate the name */}
  
                 <div className="form-group text-gray-600 ml-3">
                     <label htmlFor="designation">Designation</label>
                     <input 
                     {...register("designation")} 
                     id="designation" 
                     className="p-2 rounded mr-3" 
                     placeholder="Designation" />
                 </div>

                 {/* show these fields when editing */}
                 {editLeadContactPerson && (
                  <>
                  <div className="form-group text-gray-600">
                    <label htmlFor="gender">Gender</label>
                      <select 
                      {...register("gender")} 
                      id="gender" 
                      className="p-2 rounded mr-3">
                      <option value="">Select Gender</option>
                      {Object.entries(EnumGender).map(([key, label]) => (
                      <option key={key} value={label}>
                      {label}
                      </option>
                     ))}
                      </select>
                 </div>

                 <div className="form-group text-gray-600">
                   <label htmlFor="title">Title</label>
                     <select 
                     {...register("title")} 
                     id="title" 
                     className="p-2 rounded mr-3">
                     <option value="">Select Title</option>
                     {Object.entries(EnumTitle).map(([key, label]) => (
                     <option key={key} value={label}>
                      {label}
                      </option>
                     ))}
                     </select>
                 </div>
                  </>
                 )
                  }

                 <div className="form-group text-gray-600 ml-3">
                     <label htmlFor="nic">NIC</label>
                       <input 
                       {...register("nic", { required: "NIC is required" })} 
                       id="nic" 
                       className="p-2 rounded mr-3" 
                       placeholder="NIC" />
                 </div>
                 {errors.nic && (
                 <p className="text-red-500 text-sm mt-1 ml-38 mb-2">{errors.nic.message}</p>
                 )} {/* error message to validate the nic */}

                 {/* show these fields when editing */}
                  {editLeadContactPerson && (
                  <>
                  <div className="form-group text-gray-600">
                    <label htmlFor="birthDate">Date of Birth</label>
                      <Controller
                      control={control}
                      name="birthDate"
                      render={({ field }) => (
                          <DatePicker
                          id="birthDate"
                          placeholderText="Select Birth Date"
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="yyyy-MM-dd"
                          className="p-2 rounded w-full mr-3"
                          maxDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          />
                          )}
                      />
                   </div>
                  </>
                  )}
  

                 <div className="form-group text-gray-600 ml-3">
                     <label htmlFor="contact01">Contact 01</label>
                       <input 
                       {...register("contact01", { required: "Atleast one contact is required",
                       minLength: {
                       value: 10,
                       message: "Contact must be 10 characters long",}, 
                       maxLength: {
                       value: 10,
                       message: "Contact must be 10 characters long",},
                       pattern: {
                       value: /^[0-9]+$/,
                       message: "Contact must contain only numbers",},
                       })} 
                       id="contact01" 
                       className="p-2 rounded mr-3" 
                       placeholder="Contact 01" />
                 </div>
                 {errors.contact01 && (
                 <p className="text-red-500 text-sm mt-1 ml-38 mb-2">{errors.contact01.message}</p>
                 )}
  
                 <div className="form-group text-gray-600 ml-3">
                    <label htmlFor="contact02">Contact 02</label>
                       <input 
                       {...register("contact02",{
                       minLength: {
                       value: 10,
                       message: "Contact must be 10 characters long",}, 
                       maxLength: {
                       value: 10,
                       message: "Contact must be 10 characters long",},
                       pattern: {
                       value: /^[0-9]+$/,
                       message: "Contact must contain only numbers",},  
                       })} 
                       id="contact02" 
                       className="p-2 rounded mr-3" 
                       placeholder="Contact 02" />
                 </div>
                 {errors.contact02 && (
                 <p className="text-red-500 text-sm mt-1 ml-38 mb-2">{errors.contact02.message}</p>
                 )} 
  
                 <div className="form-group text-gray-600 ml-3">
                    <label htmlFor="email01">Email 01</label>
                       <input 
                       {...register("email01", { required: "Atleast one email is required", 
                       pattern: {
                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                       message: "Please enter a valid email address",},
                       })} 
                       id="email01" 
                       className="p-2 rounded mr-3" 
                       placeholder="Email 01" />
                 </div>
                 {errors.email01 && (
                 <p className="text-red-500 text-sm mt-1 ml-38 mb-2">{errors.email01.message}</p>
                 )}
  
                 <div className="form-group text-gray-600 ml-3">
                    <label htmlFor="email02">Email 02</label>
                       <input 
                       {...register("email02",{
                       pattern: {
                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                       message: "Please enter a valid email address",}, 
                       })} 
                       id="email02" 
                       className="p-2 rounded mr-3" 
                       placeholder="Email 02" />
                 </div>
                 {errors.email02 && (
                 <p className="text-red-500 text-sm mt-1 ml-38 mb-2">{errors.email02.message}</p>
                 )}
  
                 <div className="form-group text-gray-600 ml-3">
                     <label htmlFor="isDefault">Is Default?</label>
                       <input 
                       type="checkbox" 
                       {...register("isDefault")} 
                       id="isDefault" 
                       className="mr-41"/>
                 </div>
  
                 <div className="flex mt-4">
                   <button
                     type="button"
                     onClick={onClose}
                     style={{
                     width: '5rem',
                     height: '2rem',
                     minWidth: '5rem',
                     borderRadius: '6px',
                     backgroundColor: 'darkred',
                     marginLeft: '11rem',
                     marginTop: '1rem',
                     textTransform: 'none',
                     padding: 0,
                     color: 'white',
                     cursor: 'pointer'}}>Close
                   </button>
  
                   <button 
                   type="submit" 
                   style={{
                   width: '4rem',
                   height: '2rem',
                   minWidth: '5rem',
                   borderRadius: '10px',
                   backgroundColor: 'darkblue',
                   marginLeft: '1rem',
                   marginTop: '1rem',
                   textTransform: 'none',
                   padding: 0,
                   color: 'white',
                   border: 'none',
                   cursor: 'pointer'}}>Save
                   </button>
                 </div>
             </form>
         </div>
    );
  };

//to show the updated list of contact persons after adding new
export const RefreshLeadContactPersons = () => {
  const [leadContactPersons, setLeadContactPersons] = useState([]);

  //call the api related to prospect contact list
  useEffect(() => {
    const getLeadContactPerson = async () => {

      console.log("Fetching contact person data...");
      

      try {
        const response = await fetch(`${apiUrl}/api/Lead/GetLeadContactPerson`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(null),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Contact person data fetched successfully.");
        
        console.log(data);
        

        setLeadContactPersons(data.resData || []);

      } catch (error) {
        console.error("Error fetching contact person data:", error);
      }
    };

    getLeadContactPerson();
  }, []);

  return(
    <>
    </>
  );
};

//update existing contact persons
export const UpdateLeadContactPerson = {
  updateLeadContactPerson: async (leadContactData) => {

    const arr = [
      leadContactData
    ]

    console.log(arr);
    try {
      const response = await axios.put(
        `${apiUrl}/api/Lead/UpdateContactPerson`, leadContactData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating lead contact person:", error);
      showMessage(error.message || 'Error updating lead contact person', 'error');
      throw error;
    }
  },  
};

//deactivate contact persons 
export const DeleteLeadContactPerson = {
  deactivateLeadContactPerson: async (leadContactPersons) => {

    try{
      const deactivatePerson = {
        ...leadContactPersons, 
        status: 1, //status shud be 1 to deactivate the contact person
      };

      const response = await axios.put(
        `${apiUrl}/api/Lead/UpdateContactPerson`,
        [deactivatePerson],
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Contact person deactivated successfully:", response.data);
      showMessage('Contact person deactivated successfully!', 'success');
      
      return response.data;
   
    }catch(error){
      console.error("Error deactivating contact person:", error);
      showMessage(error.message || 'Error deactivating contact person', 'error');
      throw error;
    }
  },
};