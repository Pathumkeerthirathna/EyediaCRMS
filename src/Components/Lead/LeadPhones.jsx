import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { EnumContactType } from "../../Constants";
import { useSnackbar } from '../../Snackbars/SnackbarContext';

const apiUrl = import.meta.env.VITE_API_URL;

//values for the form
const defaultValues =
  {
    leadID: "",
    phoneNo: "",
    isDefault: false,
    phoneType: 0,
    status: 0,
  };


// Section1: Form to add a new phone
export const AddLeadPhone = ({ onClose, leadID, onLeadPhoneAdded, editLeadPhone, scrollRef}) => {

 //snackbars
 const { showMessage } = useSnackbar();
 
 
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({defaultValues,});

  useEffect(() => {
    setValue("leadID", leadID);

    if (editLeadPhone)
      Object.entries(editLeadPhone).forEach(([key, value]) => {
    if (defaultValues.hasOwnProperty(key)) {
        setValue(key, value);
      }
    });
  }, [leadID, editLeadPhone, setValue]); //set the ProspectID in the field inside the form and editing 

  const onSubmit = async (data) => {
    if (editLeadPhone && !editLeadPhone.id) {
      alert("Missing phone for update");
      // showMessage(error.message || 'Missing phone for update', 'error');
      return;
    }

    const leadPhoneData = 
      [{
        id: editLeadPhone?.id || "string", 
        leadID: data.leadID,
        phoneNo: data.phoneNo,
        isDefault: data.isDefault,
        phoneType: parseInt(data.phoneType),
        status: 0,
      }];

    // const arr = [
    //   phoneData
    // ]

    console.log("Submitting phone data:", leadPhoneData);

    try {
      if (editLeadPhone){
        //edit 
        await UpdateLeadPhone.updateLeadPhone(leadPhoneData);
        alert("Lead phone updated successfully!");
        showMessage('Phone updated successfully!', 'success');
      }else{
        //add new phone
        await axios.post(
          `${apiUrl}/api/Lead/AddLeadPhone`, leadPhoneData,{
            leadID: data.leadID,
          },{
            headers: {
              "Content-Type": "application/json"},
          });
          alert("Lead phone added successfully!");
          showMessage('Phone added successfully!', 'success');
      }
        reset();
        onClose();
        onLeadPhoneAdded();

    } catch (error) {
      console.error("Error submitting form:", error);
      showMessage(error.message || 'Error submitting form', 'error');
      alert(editLeadPhone? "failed to update lead phone" : "Failed to add lead phone");
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
             <label htmlFor="phoneNo">Phone</label>
               <input
                {...register("phoneNo", { required: true })}
                id="phoneNo"
                className="p-2 rounded mr-2 w-full"
                placeholder="Phone"
               />
           </div>
           {errors.phoneNo && <p className="text-red-500 text-sm ml-30 mb-2">Phone is required</p>}

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
export const RefreshLeadPhone = () => {
  const [leadPhones, setLeadPhones] = useState([]);

  useEffect(() => {
    const getLeadPhones = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/Lead/GetLeadPhone`, {
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
        

        setLeadPhones(data.resData || []);

        
      } catch (error) {
        console.error("Error fetching lead phone data:", error);
      }
    };

    getLeadPhones();
  }, []);
};

//section3: To update the phone data
export const UpdateLeadPhone = {
  updateLeadPhone: async (leadPhoneData) => {

    const arr = [
      leadPhoneData
    ]

    console.log(arr);
    try {
      const response = await axios.put(
        `${apiUrl}/api/Lead/UpdateLeadPhone`, leadPhoneData,
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      return response.data;
    }catch (error) {
      console.error("error updating lead phone:", error);
      showMessage(error.message || 'Error updating lead phone', 'error');
      throw error;
    }
  },
};

//delete phones 
export const DeleteLeadPhone = {

  deactivateLeadPhones: async (leadPhones) => {
    try {
      const deactivatePhone ={
        ...leadPhones,
        status: 1, //status shud be 1 to deactivate phones
      };
      const response = await axios.put(`${apiUrl}/api/Lead/UpdateLeadPhone`,
        [deactivatePhone],
        {
          headers: {"Content-Type": "application/json"}
        }
      );
      console.log("phone deactivated successfully:", response.data);
      showMessage('lead phone deactivated successfully!', 'success');
      return response.data;
      
    }catch(error){
      console.error("error deactivating phone:", error);
      showMessage(error.message || 'Error deactivating lead phone', 'error');
      throw error;
      
    }
  },
};