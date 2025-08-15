import React, {useEffect, useState } from 'react';
import { EnumContactType } from '../../Constants';
import axios from 'axios';
import { useForm } from 'react-hook-form';


const apiUrl = import.meta.env.VITE_API_URL;

//values for the form
const defaultValues = 
{ 
    prospectID: "",
    email: "",
    emailType: 0,
    isDefault: false,
    status: 0

};

//form to add new emails 
export const AddEmail = ({onClose, prospectID, onProspectEmailAdded, editProspectEmail, scrollRef}) => {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({defaultValues,});

  useEffect(() => {
    setValue("prospectID", prospectID);

    if (editProspectEmail)
      Object.entries(editProspectEmail).forEach(([key, values]) => {
    if (defaultValues.hasOwnProperty(key)) {
        setValue(key, values);
      }
    });
  }, [prospectID, editProspectEmail, setValue]); //set the ProspectID in the field inside the form and editing

  const onSubmit = async (data) => {
    if (editProspectEmail && !editProspectEmail.id){
      alert("Missing email for update");
      return;
    }

    const emailData =
    [{
      id: editProspectEmail?.id || "string",
      prospectID: data.prospectID,
      email: data.email,
      emailType: parseInt(data.emailType),
      isDefault: data.isDefault,
      status: 0,
      }];

      console.log("submitting email data:", emailData);

      try {
        if (editProspectEmail){
          //edit
          await UpdateEmail.updateProspectEmail(emailData);
          alert("Email updated successfully!");
        }else{
          //add new email
          await axios.post(
            `${apiUrl}/api/Prospect/AddProspectEmail`, emailData, {
              prospectID: data.prospectID,
            },{
              headers: {
                "Content-Type": "application/json"},
              });
              alert ("prospect email added successfully!");
            }
            reset();
            onClose();
            onProspectEmailAdded();
        } catch (error){
          console.error("error submitting form:", error);
          alert(editProspectEmail? "failed to update propsect email" : "failed to add prospect email");
        }
      };

    return(
        <>
        <div 
        ref={scrollRef}
        className="add-prospect-email-form-container w-100 ml-6 bg-blue-50 p-4 rounded">
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="form-group text-gray-600 ml-5 mt-8">
              <label htmlFor="email">Email</label>
              <input
              {...register("email", { required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",},
              })}
              id="email"
              className="p-2 rounded mr-1 w-full"
              placeholder="Email"
              />
            </div>
            {errors.email && (
                 <p className="text-red-500 text-sm mt-1 ml-30 mb-2">{errors.email.message}</p>
                 )}

            <div className="form-group text-gray-600 ml-5">
                <label htmlFor="emailType" className="mr-5">Email Type</label>
                    <select
                     {...register("emailType", { required: true})}
                     id="emailType"
                     className="p-4 rounded mr-3 ml-3 w-100"
                     defaultValue=""
                      >
                       <option value="" disabled>Select an Email type</option>
                       {Object.entries(EnumContactType).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
              </div>
               {errors.emailType && <p className="text-red-500 text-sm">Email type is required</p>}

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
                  }}
                >
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
                  }}
                >
                  Save
                </button>
             </div>
          </form>
        </div>
      </>
    );
};

//refresh the list of emails when new email is added
export const RefreshEmail = () => {
    const [prospectEmails, setProspectEmail] = useState([]);

    useEffect(() => {
        const getProspectEmail = async () =>{
          try {
            const response = await fetch(`${apiUrl}/api/Prospect/GetProspectEmail`, {
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
            setProspectEmail(data.resData || []);
    
          } catch (error) {
            console.error("Error fetching prospect emails:", error);
          }
        }
      getProspectEmail();
      },[]);
    

    return(
        <>
        </>
    );

};


//update emails
export const UpdateEmail = {

  updateProspectEmail: async (emailData) =>{

    const arr = [
      emailData
    ]
    console.log(arr);

    try{
      const response = await axios.put(
        `${apiUrl}/api/Prospect/UpdateProspectEmail`, emailData,
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      return response.data;
    }catch (error){
      console.error("error updating prospect email:", error);
      throw error;
    }
  },
};

//delete emails 
export const DeleteEmail = {
deactivateProspectEmail: async (emails) => {
  try{
    const deactivateEmail ={
      ...emails,
      status: 1, //status shud be 1 to deactivate an email
    };

    const response = await axios.put(`${apiUrl}/api/Prospect/UpdateProspectEmail`,
      [deactivateEmail],
      {
        headers: {
          "Content-Type": "application/json",
           }  
       }
    );
        console.log("prospect phone deactivated successfully:", response.data);
        return response.data;
        }catch(error){
          console.error("error deactivating prospect email:", error);
          throw error;
        }
      },
};