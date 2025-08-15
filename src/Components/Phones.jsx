import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { EnumContactType } from "../Constants";

const apiUrl = import.meta.env.VITE_API_URL;

//values for the form
const defaultValues =
  {
    prospectID: "",
    phone: "",
    isDefault: false,
    phoneType: 0,
    status: 0,
  };


// Section1: Form to add a new phone
export const Section1 = ({ onClose, prospectID, onProspectPhoneAdded, editProspectPhone, scrollRef}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({defaultValues,});

  useEffect(() => {
    setValue("prospectID", prospectID);

    if (editProspectPhone)
      Object.entries(editProspectPhone).forEach(([key, value]) => {
    if (defaultValues.hasOwnProperty(key)) {
        setValue(key, value);
      }
    });
  }, [prospectID, editProspectPhone, setValue]); //set the ProspectID in the field inside the form and editing 

  const onSubmit = async (data) => {
    if (editProspectPhone && !editProspectPhone.id) {
      alert("Missing phone for update");
      return;
    }

    const phoneData = 
      [{
        id: editProspectPhone?.id || "string", 
        prospectID: data.prospectID,
        phone: data.phone,
        isDefault: data.isDefault,
        phoneType: parseInt(data.phoneType),
        status: 0,
      }];

    // const arr = [
    //   phoneData
    // ]

    console.log("Submitting phone data:", phoneData);

    try {
      if (editProspectPhone){
        //edit 
        await Section3.updateProspectPhone(phoneData);
        alert("Prospect phone updated successfully!");
      }else{
        //add new phone
        await axios.post(
          `${apiUrl}/api/Prospect/AddProspectPhone`, phoneData,{
            prospectID: data.prospectID,
          },{
            headers: {
              "Content-Type": "application/json"},
          });
          alert("Prospect phone added successfully!");
      }
        reset();
        onClose();
        onProspectPhoneAdded();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(editProspectPhone? "failed to update prospect phone" : "Failed to add prospect phone");
    }
  };

  //   try {
  //     const response = await axios.post(
  //       `${apiUrl}/api/Prospect/AddProspectPhone`,phoneData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("Server response:", response.data);
  //     alert("Prospect phone added successfully!");

  //     reset();
  //     onClose();
  //     onProspectPhoneAdded();
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("Failed to add prospect phone");
  //   }
  // };

  return (
    <>
    <div 
    ref={scrollRef}
    className="add-prospect-phone-form-container w-100 mr-2 ml-6 bg-blue-50 p-4 rounded">
      <form onSubmit={handleSubmit(onSubmit)}>

           <div className="form-group text-gray-600 ml-5 mt-6">
             <label htmlFor="phone">Phone</label>
               <input
                {...register("phone", { required: true })}
                id="phone"
                className="p-2 rounded mr-2 w-full"
                placeholder="Phone"
               />
           </div>
           {errors.phone && <p className="text-red-500 text-sm ml-30 mb-2">Phone is required</p>}

           <div className="form-group text-gray-600 ml-5">
             <label htmlFor="phoneType" className="mr-5">Phone Type</label>
               <select
               {...register("phoneType", { required: true })}
               id="phoneType"
               className="p-2 rounded mr-1 ml-2 w-90"
               defaultValue=""
              >
              <option value="" disabled>Select a phone type</option>
              {Object.entries(EnumContactType).map(([key, label]) => (
              <option key={key} value={key}>
              {label}
             </option>
            ))}
              </select>
           </div>
           {errors.phoneType && <p className="text-red-500 text-sm">Phone type is required</p>}

           <div className="form-group text-gray-600 ml-6">
             <label htmlFor="isDefault">Is Default?</label>
               <input
               type="checkbox"
               {...register("isDefault")}
               id="isDefault"
               className="mr-0"
               />
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
                marginLeft: '12rem',
                marginTop: '1rem',
                textTransform: 'none',
                padding: 0,
                color: 'white',
                cursor: 'pointer',
            }}>
                Close
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
                  cursor: 'pointer',
                }}>
                Save
               </button>
           </div>
      </form>
    </div>
      
    </>
  );
};

// Section2: To show the updated list of phones after adding new
export const Section2 = () => {
  const [phoneData, setPhoneData] = useState([]);

  useEffect(() => {
    const getProspectPhones = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/Prospect/GetProspectPhone`, {
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

        console.log(data);
        

        setPhoneData(data.resData || []);

        
      } catch (error) {
        console.error("Error fetching prospect phone data:", error);
      }
    };

    getProspectPhones();
  }, []);
};

//section3: To update the phone data
export const Section3 = {
  updateProspectPhone: async (phoneData) => {

    const arr = [
      phoneData
    ]

    console.log(arr);
    try {
      const response = await axios.put(
        `${apiUrl}/api/Prospect/UpdateProspectPhone`, phoneData,
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      return response.data;
    }catch (error) {
      console.error("error updating prospect phone:", error);
      throw error;
    }
  },
};

//delete phones 
export const Section4 = {

  deactivatePhones: async (phones) => {
    try {
      const deactivatePhone ={
        ...phones,
        status: 1, //status shud be 1 to deactivate phones
      };
      const response = await axios.put(`${apiUrl}/api/Prospect/UpdateProspectPhone`,
        [deactivatePhone],
        {
          headers: {"Content-Type": "application/json"}
        }
      );
      console.log("phone deactivated successfully:", response.data);
      return response.data;
      
    }catch(error){
      console.error("error deactivating phone:", error);
      throw error;
    }
  },
};