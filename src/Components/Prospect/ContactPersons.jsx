import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { EnumGender, EnumTitle } from "../../Constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";


const apiUrl = import.meta.env.VITE_API_URL;


//values for the form 
const defaultValues = {
  prospectID: "",
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
  export const SectionA = ({onClose, prospectID, onContactPersonAdded, editContactPerson, scrollRef}) => {
    const {
      register,
      handleSubmit,
      reset,
      setValue,
      control,
      formState: { errors },
    } = useForm({defaultValues,});

    useEffect(() => {
      setValue("prospectID", prospectID);
  
      if (editContactPerson) {
        Object.entries(editContactPerson).forEach(([key, value]) => {
          if (defaultValues.hasOwnProperty(key)) {
            setValue(key, value);
          }
        
        });
      }
    }, [prospectID, editContactPerson, setValue]); //set the ProspectID in the field inside the form and editing 
  
    const onSubmit = async (data) => {

      if (editContactPerson && !editContactPerson.id) {
        alert("Missing contact person for update.");
        return;
      }


      const contactData = {
        id: editContactPerson?.id || "string", // use existing id if editing
        prospectID: data.prospectID,
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
      };
      

    
      try {
        if (editContactPerson) {
          // edit
          await SectionC.updateContactPerson(contactData);
          alert("Contact Person updated successfully!");

        } else {
          // add new
          await axios.post(`${apiUrl}/api/Prospect/AddProspectContactPerson`, {
            prospectID: data.prospectID,
            cPersons: [contactData],
          }, {
            headers: { "Content-Type": "application/json" },
          });
          alert("Contact Person added successfully!");
        }
    
        reset();
        onContactPersonAdded();
        onClose();
    
      } catch (error) {
        console.error("Form submission error:", error);
        alert(editContactPerson ? "Failed to update contact person." : "Failed to register contact person.");
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
                 {editContactPerson && (
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
                  {editContactPerson && (
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
export const SectionB = () => {
  const [contactPersons, setContactPersons] = useState([]);

  //call the api related to prospect contact list
  useEffect(() => {
    const getProspectContactPerson = async () => {

      console.log("Fetching contact person data...");
      

      try {
        const response = await fetch(`${apiUrl}/api/Prospect/GetProspectContactPerson`, {
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
        

        setContactPersons(data.resData || []);

      } catch (error) {
        console.error("Error fetching contact person data:", error);
      }
    };

    getProspectContactPerson();
  }, []);

  return(
    <>
    </>
  );
};

//update existing contact persons
export const SectionC = {
  updateContactPerson: async (contactData) => {

    const arr = [
      contactData
    ]

    console.log(arr);
    try {
      const response = await axios.put(
        `${apiUrl}/api/Prospect/UpdateProspectContactPerson`,
        arr,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update API error:", error);
      throw error;
    }
  },  
};

//deactivate contact persons 
export const SectionD = {
  deactivateContactPerson: async (contactpersons) => {

    try{
      const deactivatePerson = {
        ...contactpersons, 
        status: 1, //status shud be 1 to deactivate the contact person
      };

      const response = await axios.put(
        `${apiUrl}/api/Prospect/UpdateProspectContactPerson`,
        [deactivatePerson],
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Contact person deactivated successfully:", response.data);
      
      return response.data;
   
    }catch(error){
      console.error("Error deactivating contact person:", error);
      throw error;
    }
  },
};