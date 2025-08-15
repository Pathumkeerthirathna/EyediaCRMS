import React, {useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import {useForm, useFieldArray, set} from "react-hook-form";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import {
    EnumClientEngagementLevel,
    EnumFileType,
} from "../../Constants";

const apiUrl = import.meta.env.VITE_API_URL;


const defaultValues = {
    id: "",
    leadID: "",
    meetingTitle: "",
    description: "",
    startedAt: "",
    endedAt: "",
    location: "",
    latitude: 0,
    longitude: 0,
    engagedSalesAgentID: "",
    engagementLevel: 0,
    likelihoodToConvert: 0,
    status: 0,
    participants: [
        {
        id: "",
        meetingID: "",
        participantName: "",
        designation: "",
        status: 0
        }
    ],
    discussions: [
        {
        id: "",
        meetingID: "",
        discussion: "",
        status: 0
        }
    ],
    notes: [
        {
        id: "",
        meetingID: "",
        note: "",
        status: 0
        }
    ],
    attachments: [
        {
        id: "",
        meetingID: "",
        fileName: "",
        fileType: 0,
        status: 0
        }
    ],
    decisions: [
        {
        id: "",
        meetingID: "",
        decision: "",
        status: 0
        }
    ],
    outcomes: [
        {
        id: "",
        meetingID: "",
        outCome: "",
        status: 0
        }
    ],
};

const initialFormValues = {
    id: "string",
    meetingID: "",
    participantName: "",
    designation: "",
    status: 0
};

const baseFormValues = {
    id: "string",
    meetingID: "",
    discussion: "",
    status: 0

};

const initialValues = {
    id: "string",
    meetingID: "",
    note: "",
    status: 0
};

const formDefaults = {
    id: "string",
    meetingID: "",
    decision: "",
    status: 0
};

const defaultFormValues = {
    id: "string",
    meetingID: "",
    outCome: "",
    status: 0
};


//map components 
const containerStyle = {
    width: '445px',
    height: '300px',
  };
  
  const defaultCenter = {
    lat: 7.4863,
    lng: 80.3620,
  };


//meetings 
//add 
export const AddLeadMeetings = ({leadID, onClose, onLeadMeetingAdded, editLeadMeeting}) =>{

    //map components
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyANMAlOFTy3Kn6aw7cGhHWejtI83Xdxmrg', 
    });
  

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
      } = useForm({defaultValues});

        useEffect(() => {  
            setValue("leadID", leadID);

            if (editLeadMeeting)Object.entries(editLeadMeeting).forEach(([key, value])=>
            {
              if(defaultValues.hasOwnProperty(key)){
                setValue(key, value);
              }
            });
        }, [leadID, editLeadMeeting, setValue]); //set leadID and set data to the form when editing


    //adding new fields / multiple entries
    const { fields: participantFields, append: appendParticipant, remove: removeParticipant } = useFieldArray({
      control,
      name: "participants"
    });

    // map components
    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  
    const lat = watch('latitude');
    const lng = watch('longitude');
  
    const onLoad = useCallback((map) => {
      const bounds = new window.google.maps.LatLngBounds(markerPosition);
      map.fitBounds(bounds);
      setMap(map);
    }, [markerPosition]);
  
    const onUnmount = useCallback(() => {
      setMap(null);
    }, []);
    

    const onSubmit = async (data) => {

      if(editLeadMeeting && !editLeadMeeting.id){
        alert("missing meeting for update");
        return;
      }

        const leadMeetingData = {

                id: editLeadMeeting?.id || "string",
                leadID: data.leadID,
                meetingTitle: data.meetingTitle,
                description: data.description,
                startedAt: data.startedAt,
                endedAt: data.endedAt,
                location: data.location,
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                engagedSalesAgentID: data.engagedSalesAgentID,
                engagementLevel: Number(data.engagementLevel),
                likelihoodToConvert: Number(data.likelihoodToConvert),
                status: 0,
                participants: [
                {
                    id: data.id || "string",
                    meetingID: data.meetingID || "string",
                    participantName: data.participantName,
                    designation: data.designation,
                    status: 0
                }
                ],
                discussions: [
                {
                    id: data.id || "string",
                    meetingID: data.meetingID || "string",
                    discussion: data.discussion,
                    status: 0
                }
                ],
                notes: [
                {
                    id: data.id || "string",
                    meetingID: data.meetingID || "string",
                    note: data.note,
                    status: 0
                }
                ],
                attachments: [
                {
                    id: data.id || "string",
                    meetingID: data.meetingID || "string",
                    fileName: data.fileName,
                    fileType: Number(data.fileType),
                    status: 0
                }
                ],
                decisions: [
                {
                    id: data.id || "string",
                    meetingID: data.meetingID || "string",
                    decision: data.decision,
                    status: 0
                }
                ],
                outcomes: [
                {
                    id: data.id || "string",
                    meetingID: data.meetingID || "string",
                    outCome: data.outCome,
                    status: 0
                }
                ]
        };

        console.log("submitting meeting data:", leadMeetingData);

        try{
          if(editLeadMeeting){
            //edit meetings
            await UpdateLeadMeetings.updateLeadMeeting(leadMeetingData);
            alert("meeting updated successfully!");
          }else{
            //add new
            await axios.post(
              `${apiUrl}/api/Meeting/AddLeadMeeting`, leadMeetingData, {
                prospectID: data.prospectID,
              },{
                headers: { "Content-Type" : "application/json"},
              }
            );
            alert("meeting added successfully!");
          }
          reset();
          onClose();
          onLeadMeetingAdded();
        }catch (error){
          console.error("error submitting form:", error);
          alert (editMeeting? "failed to update meeting" : "failed to add meeting");
        }

        // try {
        //     await axios.post(`${apiUrl}/api/Meeting/AddProspectMeeting`,
        //          meetingData,
        //         {
        //             headers: {"Content-Type" : "application/json"},
        //         });

        //         console.log("submitted data:", meetingData);
        //         alert ("Meeting added succesfully!");
        //         reset();
        //         onMeetingAdded();
        //         onClose();
        // }catch(error){
        //     console.error("Error adding Meeting:", error);
        //     alert("Failed to add Meeting. Please try again.");
        // } 

        //map components
        const newLat = parseFloat(data.latitude);
        const newLng = parseFloat(data.longitude);
        if (!isNaN(newLat) && !isNaN(newLng)) {
          setMarkerPosition({ lat: newLat, lng: newLng });
          if (map) {
            const bounds = new window.google.maps.LatLngBounds({ lat: newLat, lng: newLng });
            map.fitBounds(bounds);
          }
        }
    };

const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    setValue('latitude', clickedLat);
    setValue('longitude', clickedLng);
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
};

    return(
        <>
        <div className="font-bold text-lg text-blue-900 ml-14 mt-8 mb-4">Add New Meeting</div>
          <div className="ml-6 mr-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">

                    {/* fields */}
                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="meetingTitle">Meeting Title</label>
                        <input
                        {...register("meetingTitle", { required: true })}
                        id="meetingTitle"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Meeting Title"
                        />
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
                        <label htmlFor="startedAt">Meeting Started at</label>
                        <input
                        {...register("startedAt", { required: true })}
                        id="startedAt"
                        type="datetime-local"
                        className="p-2 rounded mr-2 w-55"
                        />
                    </div>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="endedAt">Meeting Ended at</label>
                        <input
                        {...register("endedAt", { required: true })}
                        id="endedAt"
                        type="datetime-local"
                        className="p-2 rounded mr-2 w-55"
                        />
                    </div>

                   <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="location">Location</label>
                        <input
                        {...register("location", { required: true })}
                        id="location"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Location"
                        />
                   </div>

                   {/* latitude n longitude */}
                   <p className="text-gray-900 ml-5 mb-4 mt-9 font-semibold">Select Location on the Map</p>

                    <div className="map-container ml-5 mb-4 mt-2">
                    {isLoaded ? (
                                <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={markerPosition}
                                zoom={11}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                                onClick={handleMapClick}
                                >
                                <Marker position={markerPosition} />
                                </GoogleMap>
                            ) : (
                                <div>Loading Map</div>
                            )}

                    </div>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                            <label htmlFor="latitude">Latitude</label>
                            <input
                            {...register("latitude")}
                            id="latitude"
                            type="number"
                            step="any" 
                            className="border p-2 rounded"
                            placeholder="latitude"
                            />
                    </div>

                    <div className="form-group text-gray-600 ml-5 mt-6 mb-5">
                        <label htmlFor="longitude">longitude</label>
                        <input
                        {...register("longitude")}
                        id="longitude"
                        type="number"
                        step="any"
                        className="border p-2 rounded"
                        placeholder="longitude"
                        />
                    </div>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="engagedSalesAgentID">Sales Agent ID</label>
                        <input
                        {...register("engagedSalesAgentID", { required: true })}
                        id="engagedSalesAgentID"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Engaged Sales Agent ID"
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

                    <div className="ml-4 mt-10 text-md text-gray-700 font-bold">Participants
                    {/* <button
                      type="button"
                      onClick={() => appendParticipant({ participantName: "", designation: "", status: 0 })}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm ml-80"
                    >
                      +
                    </button> */}
                    </div>
                    <hr className="w-112 ml-4 border-b-0 border-gray-300 "/>

                    {/* {participantFields.map((item, index) => (
                    <div key={item.id} className="ml-5 mt-6 mb-6 p-4 bg-gray-40 rounded border border-gray-200">
                        <div className="form-group text-gray-600 mb-4">
                        <label htmlFor={`participants.${index}.participantName`}>Participant Name</label>
                        <input
                          {...register(`participants.${index}.participantName`, { required: "Participant Name is required" })}
                          id={`participants.${index}.participantName`}
                          className="p-2 rounded w-full"
                          placeholder="Participant Name"
                        />
                        </div>

                        <div className="form-group text-gray-600 mb-4">
                        <label htmlFor={`participants.${index}.designation`}>Designation</label>
                        <input
                        {...register(`participants.${index}.designation`, { required: "Designation is required" })}
                        id={`participants.${index}.designation`}
                        className="p-2 rounded w-full"
                        placeholder="Designation"
                      />
                        </div>

                        <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="text-sm bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700 ml-86"
                        >
                        Remove
                        </button>
                    </div>
                    ))} */}

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="participantName">Participant Name</label>
                        <input
                        {...register("participantName", { required: false })}
                        id="participantName"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Participant Name"
                        />
                   </div>

                   <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="designation">Designation</label>
                        <input
                        {...register("designation", { required: false })}
                        id="designation"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Designation"
                        />
                   </div>

                   <div className="ml-4 mt-10 text-md text-gray-700 font-bold">Disscussions</div>
                    <hr className="w-112 ml-4 border-b-0 border-gray-300 "/>
                   
                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="discussion">Discussion</label>
                        <input
                        {...register("discussion", { required: false })}
                        id="discussion"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Discussion"
                        />
                   </div>

                   <div className="ml-4 mt-10 text-md text-gray-700 font-bold">Notes</div>
                    <hr className="w-112 ml-4 border-b-0 border-gray-300 "/>
                   
                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="note">Note</label>
                        <input
                        {...register("note", { required: false })}
                        id="note"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Note"
                        />
                   </div>

                   <div className="ml-4 mt-10 text-md text-gray-700 font-bold">Attachments</div>
                    <hr className="w-112 ml-4 border-b-0 border-gray-300 "/>
                 
                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="fileName">File Name</label>
                        <input
                        {...register("fileName", { required: false })}
                        id="fileName"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="File Name"
                        />
                   </div>

                   <div className="form-group text-gray-600 ml-5 mt-6">
                         <label htmlFor="fileType" className="mr-5">File Type</label>
                               <select
                                 {...register("fileType", { required: false })}
                                 id="fileType"
                                 className="p-2 rounded mr-2 w-55"
                                 defaultValue=""
                               >
                                 <option value="">Select File Type</option>
                                 {Object.entries(EnumFileType).map(([key, label]) => (
                                   <option key={key} value={key}>{label}</option>
                                 ))}
                               </select>
                     </div>

                     <div className="ml-4 mt-10 text-md text-gray-700 font-bold">Decisions</div>
                     <hr className="w-112 ml-4 border-b-0 border-gray-300 "/>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="decision">Decision</label>
                        <input
                        {...register("decision", { required: false })}
                        id="decision"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Decision"
                        />
                   </div>

                   <div className="ml-4 mt-10 text-md text-gray-700 font-bold">Outcomes</div>
                     <hr className="w-112 ml-4 border-b-0 border-gray-300 "/>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="outCome">Outcome</label>
                        <input
                        {...register("outCome", { required: false })}
                        id="outCome"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Outcome"
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

//refresh list 
export const RefreshMeetings = () =>{
const [meetingLogData, setMeetingLogData] = useState([]);

useEffect (() => {
  const getLeadMeetingLogs = async () => {
    try{
      const response = await fetch (`${apiUrl}/api/Meeting/GetLeadMeeting`, {
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

      setMeetingLogData(data.resData || []);
      
    }catch (error){
      console.error("error fetching meeting log data:", error);
    }
  };
  getLeadMeetingLogs();
})
};

//update 
export const UpdateLeadMeetings = {
 updateLeadMeeting: async (leadMeetingData) => {
  
  console.log("Updating meeting data:", leadMeetingData);

  try {
    const response = await axios.put(`${apiUrl}/api/Meeting/UpdateMeeting`, leadMeetingData,{
      headers: {"Content-Type" : "application/json"},
    });
    return response.data;

  }catch (error){
    console.error("error updating lead meeting:", error);
    throw error;
  }
 },
};



//participants 
//add
export const AddParticipants = ({onClose, meetingID, onParticipantAdded, editParticipant}) => {

  const {
    register, 
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({defaultValues: initialFormValues});

  useEffect (() => {
    setValue("meetingID", meetingID);
    
    if (editParticipant) Object.entries(editParticipant).forEach(([key, value]) =>{
      if(initialFormValues.hasOwnProperty(key)){
        setValue(key, value);
      }
    });
  }, [meetingID, editParticipant, setValue]); //set meetingID and set data to the form when editing

  const onSubmit = async (data) => {
    if(editParticipant && !editParticipant.id){
      alert("missing participant for update");
      return;
    }

    const participantData = 
    [{
      id: editParticipant?.id || "string",
      meetingID: data.meetingID,
      participantName: data.participantName,
      designation: data.designation,
      status: 0,
    }];

    console.log("submitting participant data:", participantData);

    try{
      if(editParticipant){
        //edit
        await UpdateParticipants.updateMeetingParticipants(participantData);
        alert("participant updated successfully!");
      }else{
        //add new participant
        await axios.post (
          `${apiUrl}/api/Meeting/AddMeetingParticipant`, participantData, {
            meetingID: data.meetingID,
          },{
            headers: {"Content-Type" : "application/json"},
          }
        );
        alert("participant added successfully!");
      }
      reset();
      onClose();
      onParticipantAdded();
    }catch (error) {
      console.error("error submitting participants:", error);
      alert(editParticipant? "failed to update participant" : "failed to add participant");
    }
  };

  return(
    <>
    <div className="flex mb-9">
    <h1 className="mt-5 text-gray-700 font-bold text-lg ml-6">Add Participants</h1>
    <button
        type="button"
        onClick={onClose}
        style={{
        width: '2rem',
        height: '2rem',
        minWidth: '2rem',
        borderRadius: '6px',
        backgroundColor: 'darkred',
        marginLeft: '14rem',
        marginTop: '1rem',
        textTransform: 'none',
        padding: 0,
        color: 'white',
        cursor: 'pointer',
    }}>
        X
        </button>
 </div>
    <div className="add-meeting-participant-form-container w-100 mr-5 ml-6 bg-gray-50 p-4 rounded">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group text-gray-600 ml-5 mt-6">
             <label htmlFor="participantName">Participant Name</label>
               <input
                {...register("participantName", { required: true })}
                id="participantName"
                className="p-2 rounded mr-2 w-full"
                placeholder="Participant Name"
               />
           </div>

           <div className="form-group text-gray-600 ml-5 mt-6">
             <label htmlFor="designation">Designation</label>
               <input
                {...register("designation", { required: true })}
                id="designation"
                className="p-2 rounded mr-2 w-full"
                placeholder="Designation"
               />
           </div>

           <div className="flex mt-4">
               {/* <button
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
               </button> */}

               <button
                type="submit"
                style={{
                  width: '4rem',
                  height: '2rem',
                  minWidth: '5rem',
                  borderRadius: '10px',
                  backgroundColor: 'darkblue',
                  marginLeft: '17.5rem',
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
  )
};

//refresh list 
export const RefreshParticipants = () =>{
const [participantData, setParticipantData] = useState([]);

useEffect(() => {
  const getMeetingParticipants = async () => {
    try{
      const response = await fetch (`${apiUrl}/api/Meeting/GetMeetingParticipants`, {
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

      setParticipantData(data.resData || []);
      
    }catch (error){
      console.error("error fetching participant data:", error);
    }
  };
  getMeetingParticipants();
})
};

//update
export const UpdateParticipants = {
updateMeetingParticipants: async (participantData) => {

  console.log("updating meeting participants:", participantData);

  try{
    const response = await axios.put(`${apiUrl}/api/Meeting/UpdateMeetingParticipant`, participantData, {
      headers: {"Content-Type" : "application/json"},
    });
    return response.data;
  }catch (error){
    console.error("error updating meeting participant:", error);
    throw error;
  }
},
};


//discussions
//add 
export const AddDiscussions = ({onClose, meetingID, onDiscussionAdded, editDiscussion}) => {
const {
  register, 
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
} = useForm({defaultValues: baseFormValues});

useEffect(() => {
  setValue("meetingID", meetingID);

  if(editDiscussion) Object.entries(editDiscussion).forEach(([key, value]) =>{
    if(baseFormValues.hasOwnProperty(key)){
      setValue(key, value);
    }
  });
}, [meetingID, editDiscussion, setValue]); //set meetingID and set data for editing


const onSubmit = async (data) => {
  if(editDiscussion && !editDiscussion.id){
    alert("missing discussion for update");
    return;
  }

  const discussionData = 
  [{
    id:editDiscussion?.id || "string",
    meetingID: data.meetingID,
    discussion: data.discussion,
    status: 0,
  }];

  console.log("submitting discussion data:", discussionData);

  try{
    if(editDiscussion){
      //edit
      await UpdateDiscussions.updateMeetingDiscussion(discussionData);
      alert("meeting disscussion updated successfully!")
    }else{
      //add
      await axios.post(`${apiUrl}/api/Meeting/AddMeetingDiscussion`, discussionData, {
        meetingID: data.meetingID,
      },{
        headers: {"Content-Type" : "application/json"},
      });
      alert("meeting discussion added successfully!");
    }
    reset();
    onClose();
    onDiscussionAdded();
  }catch (error){
    console.error("error submitting form:", error);
    alert(editDiscussion? "failed to update discussion" : "failed to add discussion");
  }
};

return(
 <>
 <div className="flex mb-9">
    <h1 className="mt-5 text-gray-700 font-bold text-lg ml-6">Add Discussions</h1>
    <button
        type="button"
        onClick={onClose}
        style={{
        width: '2rem',
        height: '2rem',
        minWidth: '2rem',
        borderRadius: '6px',
        backgroundColor: 'darkred',
        marginLeft: '14rem',
        marginTop: '1rem',
        textTransform: 'none',
        padding: 0,
        color: 'white',
        cursor: 'pointer',
    }}>
        X
        </button>
 </div>
 
    <div className="add-meeting-participant-form-container w-100 mr-5 ml-6 bg-gray-50 p-4 rounded">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group text-gray-600 ml-5 mt-6">
             <label htmlFor="discussion">Discussion</label>
               <input
                {...register("discussion", { required: true })}
                id="discussion"
                className="p-2 rounded mr-2 w-full"
                placeholder="Discussion"
               />
           </div>



           <div className="flex mt-4">
               {/* <button
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
               </button> */}

               <button
                type="submit"
                style={{
                  width: '4rem',
                  height: '2rem',
                  minWidth: '5rem',
                  borderRadius: '10px',
                  backgroundColor: 'darkblue',
                  marginLeft: '17.5rem',
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
)
};

//refresh list 
const RefreshDiscussions = () =>{

};

//update 
export const UpdateDiscussions = {
  updateMeetingDiscussion: async (discussionData) => {

    console.log("updating meeting disscussion:", discussionData);

    try{
      const response = await axios.put(`${apiUrl}/api/Meeting/UpdateMeetingDiscussion`,discussionData, {
        headers: {"Content-Type" : "application/json"},
      });
      return response.data;
    }catch(error){
      console.error("error updating meeting discussion:", error);
      throw error;
    }
  },
};


//notes
//add 
export const AddNotes = ({onClose, meetingID, onNoteAdded, editNotes}) => {
const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
} = useForm({defaultValues: initialValues});

useEffect(() => {
  setValue("meetingID", meetingID);

  if(editNotes)Object.entries(editNotes).forEach(([key,value]) => {
    if(initialValues.hasOwnProperty(key)){
      setValue(key, value);
    }
  });
}, [meetingID, editNotes, setValue]); //set meetingID and set data for editing

const onSubmit = async (data) => {
  if(editNotes && !editNotes.id){
    alert("missing note for update");
    return;
  }

  const noteData = 
  [{
    id: editNotes?.id || "string",
    meetingID:data.meetingID,
    note:data.note,
    status:0,
  }];

  console.log("submitting note:", noteData);

  try{
    if(editNotes){
      //edit
      await UpdateNotes.updateMeetingNotes(noteData);
      alert("Note Updated Successfully!");
    }else{
      //add
      await axios.post(`${apiUrl}/api/Meeting/AddMeetingNote`, noteData,{
        meetingID:data.meetingID,
      }, {
        headers: {"Content-Type" : "application/json"},
      });
      alert("Note added successfully!");
    }
    reset();
    onClose();
    onNoteAdded();
  }catch(error){
    console.error("error submitting form:", error);
    alert(editNotes? "failed to update note" : "failed to add note");
  }
}

return(
  <>
   <div className="flex mb-9">
    <h1 className="mt-5 text-gray-700 font-bold text-lg ml-7">Add Notes</h1>
    <button
        type="button"
        onClick={onClose}
        style={{
        width: '2rem',
        height: '2rem',
        minWidth: '2rem',
        borderRadius: '6px',
        backgroundColor: 'darkred',
        marginLeft: '17rem',
        marginTop: '1rem',
        textTransform: 'none',
        padding: 0,
        color: 'white',
        cursor: 'pointer',
    }}>
        X
        </button>
 </div>
 
    <div className="add-meeting-participant-form-container w-100 mr-5 ml-6 bg-gray-50 p-4 rounded">
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



           <div className="flex mt-4">
               {/* <button
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
               </button> */}

               <button
                type="submit"
                style={{
                  width: '4rem',
                  height: '2rem',
                  minWidth: '5rem',
                  borderRadius: '10px',
                  backgroundColor: 'darkblue',
                  marginLeft: '17.5rem',
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
)
};

//refresh list 
export const RefreshNotes = () => {

};

//update
export const UpdateNotes = {
  updateMeetingNotes: async (noteData) =>{
     console.log("updating meeting notes:", noteData);

     try{
      const response = await axios.put(`${apiUrl}/api/Meeting/UpdateMeetingNote`, noteData, {
        headers: {"Content-Type" : "application/json"},
      });
      return response.data;
     }catch(error){
      console.error("error updating meeting notes:", error);
      throw error;
     }
     

  },
};



//attachments 
//add 
export const AddAttachments = ({}) => {

};

//refresh list 
export const RefreshAttachments = () => {

};

//update 
export const UpdateAttachments = {

  updateMeetingAttachments: async () => {

    console.log("updating meeting attachments:", attachmentData);

    try{
      const response = await axios.put(`${apiUrl}/api/Meeting/UpdateMeetingAttachment`, attachmentData, {
        headers: {"Content-Type" : "application/json"},
      });
      return response.data; 
    }catch(error){
      console.error("error updating meeting attachments:", error);
      throw error;
    }
  },
};



//decisions 
//add
export const AddDecisions = ({onClose, meetingID, onDecisionAdded, editDecision}) => {
 const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({defaultValues: formDefaults});

  useEffect(() => {
    setValue("meetingID", meetingID);

    if(editDecision) Object.entries(editDecision).forEach(([key, value]) => {
      if(formDefaults.hasOwnProperty(key)){
        setValue(key, value);
      }
    });
  }, [meetingID, editDecision, setValue]); //set meetingID and set data for editing

  const onSubmit = async (data) => {
    if(editDecision && !editDecision.id){
      alert("missing decision for update");
      return;
    }

    const decisionData = 
    [{
      id: editDecision?.id || "string",
      meetingID: data.meetingID,
      decision: data.decision,
      status: 0,
    }];

    console.log("submitting decision:", decisionData);

    try {
      if (editDecision) {
        // edit
        await UpdateDecisions.updateMeetingDecisions(decisionData);
        alert("Decision Updated Successfully!");
      } else {
        // add
        await axios.post(`${apiUrl}/api/Meeting/AddMeetingDecision`, decisionData, {
          headers: {"Content-Type" : "application/json"},
        });
        alert("Decision added successfully!");
      }
      reset();
      onClose();
      onDecisionAdded();
    } catch (error) {
      console.error("error submitting form:", error);
      alert(editDecision ? "failed to update decision" : "failed to add decision");
    }
  }

  return(
  <>
   <div className="flex mb-9">
    <h1 className="mt-5 text-gray-700 font-bold text-lg ml-6">Add Decisions</h1>
    <button
        type="button"
        onClick={onClose}
        style={{
        width: '2rem',
        height: '2rem',
        minWidth: '2rem',
        borderRadius: '6px',
        backgroundColor: 'darkred',
        marginLeft: '15rem',
        marginTop: '1rem',
        textTransform: 'none',
        padding: 0,
        color: 'white',
        cursor: 'pointer',
    }}>
        X
        </button>
 </div>
 
    <div className="add-meeting-participant-form-container w-100 mr-5 ml-6 bg-gray-50 p-4 rounded">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group text-gray-600 ml-5 mt-6">
             <label htmlFor="decision">Decision</label>
               <input
                {...register("decision", { required: true })}
                id="decision"
                className="p-2 rounded mr-2 w-full"
                placeholder="Decision"
               />
           </div>



           <div className="flex mt-4">
               {/* <button
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
               </button> */}

               <button
                type="submit"
                style={{
                  width: '4rem',
                  height: '2rem',
                  minWidth: '5rem',
                  borderRadius: '10px',
                  backgroundColor: 'darkblue',
                  marginLeft: '17.5rem',
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
)


};

//refresh list 
export const RefreshDecisions = () => {

};

//update
export const UpdateDecisions = {
  updateMeetingDecisions: async () => {

    console.log("updating meeting decisions:", decisionData);

    try{
      const response = await axios.put(`${apiUrl}/api/Meeting/UpdateMeetingDecision`, decisionData, {
        headers: {"Content-Type" : "application/json"},
      });
      return response.data;
    }catch(error){
      console.error("error updating meeting decisions:", error);
      throw error;
    }
  },
};


//outcomes 
//add
export const AddOutcomes = ({onClose, meetingID, onOutcomeAdded, editOutcome}) => {
 const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({defaultValues: defaultFormValues});

  useEffect(()=> {
    setValue("meetingID", meetingID);

    if(editOutcome) Object.entries(editOutcome).forEach(([key, value]) => {
      if(defaultFormValues.hasOwnProperty(key)){
        setValue(key, value);
      }
    });
  }, [meetingID, editOutcome, setValue]); //set ID and data for editing

  const onSubmit = async (data) => {
    if (editOutcome && !editOutcome.id){
      alert("missing outcome to update");
      return;
    }

    const outcomeData = 
    [{
      id: editOutcome?.id || "string",
      meetingID: data.meetingID,
      outCome: data.outCome,
      status: 0,
    }];

    console.log("submitting form: ", outcomeData);

    try{
      if(editOutcome){
        //edit
        await UpdateOutcomes.updateMeetingOutcomes(outcomeData);
        alert("outcome updated successfully!");
      }else{
        //add
        await axios.post(`${apiUrl}/api/Meeting/AddMeetingOutcome`, outcomeData, {
          meetingID:data.meetingID,
        },{
          headers: {"Content-Type" : "application/json"},
        });
        alert("outcome added successfully!");
      }
      reset();
      onClose();
      onOutcomeAdded();
    }catch(error){
      console.error('error submitting form:', error);
      alert(editOutcome? "failed to update outcome" : "failed to add outcome");
    }
  };

  return(
    <>
    <div className="flex mb-9">
    <h1 className="mt-5 text-gray-700 font-bold text-lg ml-6">Add Outcomes</h1>
    <button
        type="button"
        onClick={onClose}
        style={{
        width: '2rem',
        height: '2rem',
        minWidth: '2rem',
        borderRadius: '6px',
        backgroundColor: 'darkred',
        marginLeft: '15rem',
        marginTop: '1rem',
        textTransform: 'none',
        padding: 0,
        color: 'white',
        cursor: 'pointer',
    }}>
        X
        </button>
 </div>
 
    <div className="add-meeting-participant-form-container w-100 mr-5 ml-6 bg-gray-50 p-4 rounded">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group text-gray-600 ml-5 mt-6">
             <label htmlFor="outCome">Outcome</label>
               <input
                {...register("outCome", { required: true })}
                id="outCome"
                className="p-2 rounded mr-2 w-full"
                placeholder="Outcome"
               />
           </div>



           <div className="flex mt-4">
               {/* <button
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
               </button> */}

               <button
                type="submit"
                style={{
                  width: '4rem',
                  height: '2rem',
                  minWidth: '5rem',
                  borderRadius: '10px',
                  backgroundColor: 'darkblue',
                  marginLeft: '17.5rem',
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
  )
};

//refresh list
export const RefreshOutcomes = () => {

};

//update
export const UpdateOutcomes = {
  updateMeetingOutcomes: async (outcomeData) => {

    console.log("updating meeting outcomes:", outcomeData);

    try{
      const response = await axios.put(`${apiUrl}/api/Meeting/UpdateMeetingOutCome`, outcomeData, {
        headers: {"Content-Type" : "application/json"},
      });
      return response.data;
    }catch(error){
      console.error("error updating meeting outcomes:", error);
      throw error;
    }
  },
};



