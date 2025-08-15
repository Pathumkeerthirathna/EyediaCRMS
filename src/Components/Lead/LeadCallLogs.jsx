import React, {useEffect, useState } from "react";
import axios from "axios";
import { set, useForm } from "react-hook-form";
import { EnumCallType, EnumClientEngagementLevel } from "../../Constants";
import { object } from "framer-motion/client";

const apiUrl = import.meta.env.VITE_API_URL;

// Default values for AddCallLog form, outcome form and note form
const defaultValues = {
  id: "",
  leadID: "",
  callerNumber: "",
  receiverNumber: "",
  callType: "",
  description: "",
  callMadeAt: "",
  callEndedAt: "",
  engagedPerson: "",
  engagementLevel: "",
  likelihoodToConvert: "",
  notes: [
    {
      id: "",
      callLogID: "",
      note: "",
      status: 0
    }
  ],
  outcomes: [
    {
      id: "",
      callLogID: "",
      outCome: "",
      status: 0

      }
  ],
};

const initialFormValues = {
    id: "",
    callLogID: "",
    outCome: "",
    status: 0,
};

const baseFormValues = {       
    id: "",
    callLogID: "",
    note: "",
    status: 0,
};



//calllogs
//add 
export const AddLeadCallLog = ({ leadID, onClose, onLeadCallLogAdded, editLeadCallLog}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues,});

  useEffect(() => {
      setValue("leadID", leadID);

      if(editLeadCallLog)
        Object.entries(editLeadCallLog).forEach(([key, value]) => {
          if(defaultValues.hasOwnProperty(key)){
            setValue(key, value);
          }
        });    
  }, [leadID, editLeadCallLog, setValue]); //set the leadID and edit call log


  const onSubmit = async (data) => {

      if(editLeadCallLog && !editLeadCallLog.id){
        alert("missing call log for update");
        return;
      }

    const leadCallLogData = {
    
      id: editLeadCallLog?.id || "string",
      leadID: data.leadID,
      callerNumber: data.callerNumber,
      receiverNumber: data.receiverNumber,
      callType: parseInt(data.callType),
      description: data.description,
      callMadeAt: data.callMadeAt,
      callEndedAt: data.callEndedAt,
      engagedPerson: data.engagedPerson,
      engagementLevel: Number(data.engagementLevel),
      likelihoodToConvert: Number(data.likelihoodToConvert),
      notes: [
        {
          id: data.id || "string",
          callLogID: data.callLogID || "string", 
          note: data.note, 
          status: 0,
        },
      ],
      outcomes: [
        {
          id: data.id || "string",
          callLogID: data.callLogID || "string",
          outCome: data.outCome,
          status: 0,
        },
      ],
    };

    console.log("Submitting call log data:", leadCallLogData);

    try{
      if(editLeadCallLog){
        //edit
        await UpdateLeadCallLog.updateLeadCallLog(leadCallLogData);
        alert("lead call log updated successfully!");
      }else{
        //add new
        await axios.post(`${apiUrl}/api/CallLog/AddLeadCallLog`, leadCallLogData, {
          leadID: data.leadID,
        },{
          headers: {"Content-Type" : "application/json"},
        } 
      );
      alert ("call log added successfully!");
      }
      reset();
      onClose();
      onLeadCallLogAdded();

    }catch(error){
      console.error("Error submitting form:", error);
      alert(editLeadCallLog ? "Failed to update call log" : "Failed to add call log. Please try again.");
    }

    // try {
    //   await axios.post(
    //     `${apiUrl}/api/CallLog/AddProspectCallLog`,
    //     callLogData,
    //     {
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );

    //   console.log("submitted data:", callLogData);
      
    //   alert("Call log added successfully!");
    //   reset();
    //   onCallLogAdded();
    //   onClose(); 

    // } catch (error) {
    //   console.error("Error adding call log:", error);
    //   alert("Failed to add call log. Please try again.");
    // }
  };

  return (
    <>
      <div className="font-bold text-lg text-blue-900 ml-14 mt-8 mb-4">Add New Call Log</div>
      <div className="ml-6 mr-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          {/* Fields */}
          

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="callerNumber">Caller Number</label>
            <input
              {...register("callerNumber", { required: true })}
              id="callerNumber"
              className="p-2 rounded mr-2 w-55"
              placeholder="Caller Number"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="receiverNumber">Receiver Number</label>
            <input
              {...register("receiverNumber", { required: true })}
              id="receiverNumber"
              className="p-2 rounded mr-2 w-55"
              placeholder="Receiver Number"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="callType" className="mr-5">Call Type</label>
            <select
              {...register("callType", { required: true })}
              id="callType"
              className="p-2 rounded mr-2 w-55"
              defaultValue=""
            >
              <option value="" disabled>Select Call Type</option>
              {Object.entries(EnumCallType).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="description">Description</label>
            <textarea
              {...register("description", { required: true })}
              id="description"
              className="p-2 rounded mr-2 w-55"
              placeholder="Description"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="callMadeAt">Call Made At</label>
            <input
              {...register("callMadeAt", { required: true })}
              id="callMadeAt"
              type="datetime-local"
              className="p-2 rounded mr-2 w-55"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="callEndedAt">Call Ended At</label>
            <input
              {...register("callEndedAt", { required: true })}
              id="callEndedAt"
              type="datetime-local"
              className="p-2 rounded mr-2 w-55"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="engagedPerson">Engaged Person</label>
            <input
              {...register("engagedPerson", { required: true })}
              id="engagedPerson"
              className="p-2 rounded mr-2 w-55"
              placeholder="Engaged Person"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="engagementLevel" className="mr-5">Engagement Level</label>
            <select
              {...register("engagementLevel", { required: true })}
              id="engagementLevel"
              className="p-2 rounded mr-2 w-55"
              defaultValue=""
            >
              <option value="">Select Engagement Level</option>
              {Object.entries(EnumClientEngagementLevel).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="likelihoodToConvert">Likelihood To Convert</label>
            <input
              {...register("likelihoodToConvert", { required: true,  valueAsNumber: true })}
              id="likelihoodToConvert"
              type="number"
              className="p-2 rounded mr-2 w-55"
              placeholder="Likelihood to Convert (0-100)"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="note">Notes</label>
            <textarea
              {...register("note", { required: true })}
              id="note"
              className="p-2 rounded mr-2 w-55"
              placeholder="note"
            />
          </div>

          <div className="form-group text-gray-600 ml-5 mt-6">
            <label htmlFor="outCome">Outcomes</label>
            <textarea
              {...register("outCome", { required: true })}
              id="outCome"
              className="p-2 rounded mr-2 w-55"
              placeholder="outcome"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '5rem',
              height: '2rem',
              minWidth: '5rem',
              borderRadius: '10px',
              backgroundColor: 'darkblue',
              marginLeft: '24rem',
              marginTop: '1rem',
              marginBottom: '2rem',
              textTransform: 'none',
              padding: 0,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          
        </form>
      </div>
    </>
  );
};

//refresh 
export const RefreshCallList = () => {
  const [callLogData, setCallLogData] = useState([]);

  useEffect (() => {
    const getProspectCallLogs = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/CallLog/GetProspectCallLog`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(null),
            });

            if (!response.ok) {
                throw new Error (`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            console.log(data);

            setCallLogData(data.resData || []);
            
        }catch (error){
            console.error("error fetching call log data:", error);
        }
    };
    getProspectCallLogs();
  }, []);


};

//update 
export const UpdateLeadCallLog =  {

  updateLeadCallLog: async(callLogData) => {
    
  console.log("Updating call log data:", callLogData);

  try{
    const response = await axios.put(
      `${apiUrl}/api/CallLog/UpdateCallLog`, callLogData, {
        
        headers: {"Content-Type" : "application/json"},
      }
    );
    return response.data;

  }catch (error){
    console.error("Error Updating call log:", error);
    throw error;
  }
  },
};



// outcomes
//add 
export const AddOutcomes = ({callLogID, onclose, editLeadOutcome}) => {

    const {
        register,
        handleSubmit, 
        reset,
        setValue, 
        formState:{errors},
    }= useForm ({initialFormValues,});

    useEffect(() => {
        
            setValue("callLogID", callLogID);

            if(editLeadOutcome)
              Object.entries(editLeadOutcome).forEach(([key, value]) => {
            if(initialFormValues.hasOwnProperty(key)){
              setValue(key, value);
            }
          });
        
    }, [callLogID, editLeadOutcome, setValue]); //set calllogID and edit prospect call log outcomes

    const onSubmit = async (data) => {

      if(editLeadOutcome && !editLeadOutcome.id){
        alert("missing outcome for update");
        return;
      }

        const outcomeData = 
        [{
            id: editLeadOutcome?.id || "string",
            callLogID: data.callLogID,
            outCome: data.outCome,
            status: 0,
        }];

        console.log("submitting outcome:", outcomeData);

        try{
          if(editLeadOutcome){
            //edit
            await UpdateCallLogOutcomes.updateProspectOutcomes(outcomeData);
            alert("lead call log outcome updated successfully!");
          }else{
            //add new
            await axios.post (
              `${apiUrl}/api/CallLog/AddCallLogOutCome`, outcomeData, {
                headers: {"Content-Type" : "application/json"},
              });

              alert("lead outcome added successfully!");
          }
          reset();
          onclose();

        }catch(error){
          console.error("error submitting form:", error);
          alert(editLeadOutcome? "failed to update outcome": "failed to add outcome");
        }

        // try {
        //     await axios.post(`${apiUrl}/api/CallLog/AddCallLogOutCome`, 
        //         outcomeData,
        //         {
        //             header: {"Content-Type" : "application/json"},
        //         }
        //     );
        //     alert("outcome added successfully!");
        //     reset();
        //     // onOutcomeAdded();
        //     // if (onClose) onclose();
        // }catch (error) {
        //     console.error("error adding outcome:", error);
        //     alert("failed to add outcome.please try again.");
        // }
    };

return(
    <>
    <div className="text-blue-700 text-md font-bold mt-8 ml-12 mb-5">Add Outcomes</div>
    <div className="p-4 rounded">
        <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group text-gray-600 ml-5 mt-6">
             <label htmlFor="outCome">Outcome</label>
               <input
                {...register("outCome", { required: true })}
                id="outCome"
                className="p-2 rounded mr-2 w-full"
                placeholder="outcome"
               />
           </div>
           <button
                type="submit"
                style={{
                  width: '4rem',
                  height: '2rem',
                  minWidth: '5rem',
                  borderRadius: '10px',
                  backgroundColor: 'darkblue',
                  marginLeft: '17rem',
                  marginTop: '1rem',
                  textTransform: 'none',
                  padding: 0,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                Save
               </button>

        </form>

    </div>
    </>
)
};

//refresh 
export const RefreshOutcomeList = () => {
const [outcomeData, setOutcomeData] = useState([]);

useEffect(() => {
    const getProspectOutcome = async () => {
        try {
            const response = await fetch (`${apiUrl}/api/CallLog/GetCallLogOutCome`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json", 
                },
                body: JSON.stringify(null),
            });

            if(!response.ok){
                throw new Error (`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            console.log(data);

            setOutcomeData(data.resData || []);
            
        }catch (error){
            console.error("error fetching outcome data:", error);
        }
    };
    getProspectOutcome();
}, []);
};

//update  
export const UpdateCallLogOutcomes = {
  updateProspectOutcomes : async (outcomeData) => {

    const arr =[
      outcomeData
    ]

    console.log(arr);

    try {
      const response = await axios.post (
        `${apiUrl}/api/CallLog/UpdateCallLogOutcome`, outcomeData, {
          headers: {"Content-Type" : "application/json"},
        }
      );
      return response.data;
    }catch (error){
      console.error("error updating prospect call log outcome");
      throw error;
    }
    
  }

};




//notes
//add  
export const AddNotes = ({callLogID, onClose, editProspectNote}) => {

    const{
        register,
        handleSubmit,
        reset, 
        setValue,
        formState:{errors},
    } = useForm({baseFormValues,});

    useEffect(() => {

            setValue("callLogID", callLogID);

            if(editProspectNote)
              Object.entries(editProspectNote).forEach(([key, value]) => {
            if(baseFormValues.hasOwnProperty(key)){
              setValue(key, value);
            }
          });

    }, [callLogID, editProspectNote, setValue]); //set the calllogID and edit

    const onSubmit = async (data) => {

      if (editProspectNote && !editProspectNote.id){
        alert("missing note for update");
        return;
      }
        const noteData = 
        [{
            id: editProspectNote?.id || "string",
            callLogID: data.callLogID,
            note:data.note,
            status: 0,
        }];

        console.log("submitting note:", noteData);

        try{
          if(editProspectNote){
            //edit
            await UpdateCallLogNotes.updateProspectNotes(noteData);
            alert("prospect note updated successfully!");
          }else{
            //add 
            await axios.post(
              `${apiUrl}/api/CallLog/AddCallLogImportantNote`, noteData, {
                headers: {"Content-Type" : "application/json"},
              });
              alert("prospect note added successfully!");
          }
          reset();
          onClose();

        }catch(error){
          console.error("error submitting form:", error);
          alert(editProspectNote? "failed to update prospect note" : "failed to add prospect note");
        }

        // try {
        //     await axios.post(`${apiUrl}/api/CallLog/AddCallLogImportantNote`, noteData,
        //         {
        //             header: {"Content-Type" : "application/json"},
        //         }
        //     );
        //     alert("Note Added Successfully!");
        //     reset();
           
        //     // if (onclose) onclose();
        // }catch (error){
        //     console.error("error adding outcome: ", error);
        //     alert("Failed to add note. Please try again.")
        // }
    };

    return(
        <>
         <div className="text-blue-700 text-md font-bold mt-8 ml-12 mb-5">Add Notes</div>
            <div className="p-4 rounded">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="note">Note</label>
                        <input
                            {...register("note", { required: true })}
                            id="note"
                            className="p-2 rounded mr-2 w-full"
                            placeholder="Note"
                        />
                   </div>

                   <button
                        type="submit"
                        style={{
                        width: '4rem',
                        height: '2rem',
                        minWidth: '5rem',
                        borderRadius: '10px',
                        backgroundColor: 'darkblue',
                        marginLeft: '17rem',
                        marginTop: '1rem',
                        textTransform: 'none',
                        padding: 0,
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        }}>
                        Save
                  </button>


                </form>
            </div>

        </>
    )
};

//refresh 
export const RefreshNoteList = () =>{
    const [noteData, setNoteData] = useState([]);

    useEffect(() => {
        const getProspectNote = async () => {
            try {
                const response = await fetch (`${apiUrl}/api/CallLog/GetCallLogImportantNote`, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json", 
                    },
                    body: JSON.stringify(null),
                });
    
                if(!response.ok){
                    throw new Error (`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
    
                console.log(data);
    
                setNoteData(data.resData || []);
                
            }catch (error){
                console.error("error fetching Note data:", error);
            }
        };
        getProspectNote();
    }, []);
};

//update  
export const UpdateCallLogNotes = {

  updateProspectNotes: async (noteData) => {
    
    const arr = [
      noteData
    ]

    console.log(arr);

    try{
      const response = await axios.post(
        `${apiUrl}/api/CallLog/UpdateCallLogImportantNote`, noteData, 
        {
          headers: {"Content-Type" : "application/json"},
        }
      );
      return response.data;
    }catch(error){
      console.error("error updating prospect note", error);
      throw error;
    }
  },
};