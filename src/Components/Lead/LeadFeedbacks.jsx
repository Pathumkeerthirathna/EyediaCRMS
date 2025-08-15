import React, {use, useEffect, useState} from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import {set, useForm} from "react-hook-form";
import {
    EnumClientEngagementLevel,
    EnumFeedbackType,
} from "../../Constants";
import { a } from "framer-motion/client";


const apiUrl = import.meta.env.VITE_API_URL;

const defaultValues = {
  id: "string",
  prospectID: "",
  feedbackType: 0,
  content: "",
  rating: 0,
  engagementLevel: 0,
  likelihoodToConvert: 0,
  subMittedOn: "",
  resolvedOn: "",
  relatedProduct: "",
  relatedService: "",
  status: 0,
  resolutions: [
    {
      id: "string",
      feedbackID: "",
      resolution: "",
      status: 0
    }
  ],

};

const initialFormValues = {

    id: "string",
    feedbackID: "",
    resolution: "",
    status: 0

};


//feedbacks 
//add 
export const AddFeedbacks = ({onClose, prospectID, onFeedbackAdded, editFeedback}) => {

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors},
    } = useForm ({defaultValues,});

    useEffect(() => {
        setValue("prospectID", prospectID);

        if(editFeedback)Object.entries(editFeedback).forEach(([key, value]) =>
        {
            if(defaultValues.hasOwnProperty(key)){
                setValue(key, value);
            }
        });

    }, [prospectID, editFeedback, setValue]); //set the prospectID and set data when editing

    const onSubmit = async (data) => {
        if(editFeedback && !editFeedback.id){
            alert("missing feedback for update");
            return;
        }

        const feedbackData = 
        {
            id: editFeedback?.id || "string",
            prospectID: data.prospectID,
            feedbackType: parseInt(data.feedbackType),
            content: data.content,
            rating: Number(data.rating),
            engagementLevel: Number(data.engagementLevel),
            likelihoodToConvert: Number(data.likelihoodToConvert),
            subMittedOn: data.subMittedOn,
            resolvedOn: data.resolvedOn,
            relatedProduct: data.relatedProduct,
            relatedService: data.relatedService,
            status: 0,
            resolutions: [
                {
                id:data.id || "string",
                feedbackID: data.feedbackID,
                resolution: data.resolution,
                status: 0
                }
            ],};

            console.log("sumitting feedbacks:", feedbackData);

        try{
            if(editFeedback){
                //edit
                await UpdateFeedbacks.updateProspectFeedbacks(feedbackData);
                alert("feedback updated successfully!");
            }else{
                //add
                await axios.post(`${apiUrl}/api/Feedback/AddProspectFeedback`, feedbackData,{
                    prospectID:data.prospectID,
                },{
                    headers: {"Content-Type" : "application/json"},
                });
                alert("Feedback added successfully!");
            }
            reset();
            onClose();
            onFeedbackAdded();
        }catch(error){
            console.error("error submitting form:", error);
            alert(editFeedback? "failed to update feedback" : "failed to add feedback");
        }          
    };

    return(
        <>
        <div className="flex">
        <div className="font-bold text-lg text-blue-900 ml-14 mt-8 mb-4">Add New Feedbacks</div>
        {/* <button 
            type="button"
            onClick={onClose}
            style={{
            width: '2rem',
            height: '2rem',
            minWidth: '2rem',
            borderRadius: '6px',
            backgroundColor: 'darkred',
            marginLeft: '15rem',
            marginTop: '2rem',
            textTransform: 'none',
            padding: 0,
            color: 'white',
            cursor: 'pointer',
           }}>X
        </button> */}
        </div>
            <div className="ml-6 mr-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">

                    {/* fields */}
                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="feedbackType" className="mr-5">Feedback Type</label>
                            <select
                                {...register("feedbackType", { required: true })}
                                id="feedbackType"
                                className="p-2 rounded mr-2 w-55"
                                defaultValue=""
                            >
                                <option value="">Select Feedback Type</option>
                                {Object.entries(EnumFeedbackType).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                    </div>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="content">Feedback Content</label>
                        <textarea
                        {...register("content", { required: true })}
                        id="content"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="content"
                        />
                   </div>

                   <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="rating">Rating</label>
                        <input
                        {...register("rating", {
                            required: true,
                            valueAsNumber: true,
                            max: 5 // for validation
                        })}
                        id="rating"
                        type="number"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Rating (0-5)"
                        min={0}
                        max={5}
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
                        <label htmlFor="subMittedOn">Submitted On</label>
                        <input
                        {...register("subMittedOn", { required: true })}
                        id="subMittedOn"
                        type="datetime-local"
                        className="p-2 rounded mr-2 w-55"
                        />
                    </div>

                     <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="resolvedOn">Resolved On</label>
                        <input
                        {...register("resolvedOn", { required: true })}
                        id="resolvedOn"
                        type="datetime-local"
                        className="p-2 rounded mr-2 w-55"
                        />
                    </div>

                    <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="relatedProduct">Related Product</label>
                        <input
                        {...register("relatedProduct", { required: false })}
                        id="relatedProduct"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Related Product"
                        />
                   </div>

                   <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="relatedService">Related Service</label>
                        <input
                        {...register("relatedService", { required: false })}
                        id="relatedService"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Related Service"
                        />
                   </div>

                   <div className="ml-4 mt-10 text-md text-gray-700 font-bold">Resolutions</div>
                    <hr className="w-112 ml-4 border-b-0 border-gray-300 "/>

                     <div className="form-group text-gray-600 ml-5 mt-6">
                        <label htmlFor="resolution">Resolution</label>
                        <textarea
                        {...register("resolution", { required: false })}
                        id="resolution"
                        className="p-2 rounded mr-2 w-55"
                        placeholder="Resolution"
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
    )

};

//Refresh List
export const RefreshFeedbacks = () => {
    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        const getProspectFeedback = async () => {
            try{
                const response = await fetch(`${apiUrl}/api/Feedback/GetProspectFeedback`, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify(null),
                });

                if(!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                console.log(data);
                setFeedbackData(data.resData || []);
                
            }catch(error){
                console.error("error fetching feedbacks:",error);
            }
        };
        getProspectFeedback();
    },[]);
};

//update 
export const UpdateFeedbacks = {
    updateProspectFeedbacks: async (feedbackData) => {
        console.log("updating feedback data:", feedbackData);

        try{
            const response = await axios.post(`${apiUrl}/api/Feedback/UpdateFeedback`, feedbackData, {
                headers: {
                    "Content-Type" : "application/json"
                },
            });
            return response.data;
        }catch(error){
            console.error("error updating feedback:", error);
            throw error;
        }
    },
};




//resolutions
//add resolutions
export const AddResolutions = ({onClose, feedbackID, onResolutionAdded, editResolution}) => {

    const{
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }, 
    } = useForm({defaultValues: initialFormValues});

    useEffect(() => {
        setValue("feedbackID", feedbackID);

        if(editResolution)Object.entries(editResolution).forEach(([key, value]) => {
            if(initialFormValues.hasOwnProperty(key)){
                setValue(key, value);
            }
        });
    }, [feedbackID, editResolution, setValue]); //setID and set data when editing


    const onSubmit = async(data) => {
        if(editResolution && !editResolution.id){
            alert("missing phone for update");
            return;
        }

        const resolutionData = 
        [{
            id: editResolution?.id || "string",
            feedbackID:data.feedbackID,
            resolution: data.resolution,
            status:0,
        }];

        console.log("submitting feedback resolution:", resolutionData);

        try{
            if(editResolution){
                //edit
                await UpdateResolutions.updateFeedbackResolutions(resolutionData);
                alert("feedback resolution updated successfully!");
            }else{
                //add
                await axios.post(`${apiUrl}/api/Feedback/AddFeedbackResolution`, resolutionData, {
                    feedbackID: data.feedbackID,
                },{
                    headers: {
                        "Content-Type" : "application/json"
                    },
                });
                alert("feedback resolution added successfully!");
            }
            reset();
            onClose();
            onResolutionAdded();
        }catch(error){
            console.error("Error Submitting Form:", error);
            alert(editResolution? "failed to update resolution" : "failed to add resolution");
        }
    };

    return(
        <>
          <div className="font-bold text-lg text-blue-900 ml-14 mt-8 mb-4">Add Resolutions</div>
            <div className="ml-6 mr-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">

                     <div className="form-group text-gray-600 ml-2 mt-6">
                        <label htmlFor="resolution">Resolution</label>
                        <textarea
                        {...register("resolution", { required: false })}
                        id="resolution"
                        className="p-2 rounded mr-1 w-66"
                        placeholder="Resolution"
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
                        marginLeft: '21rem',
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
    )
};

//refresh 
export const RefreshResolutions = ({}) => {
const [resolutionData, setResolutionData] = useState([]);

useEffect(() => {
    const getFeedbackResolution = async () => {
        try{
            const response = await fetch(`${apiUrl}/api/Feedback/GetFeedbackResolution`, {
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

            setResolutionData(data.resData || []);
            
        }catch(error){
            console.error("error fetching feedback resolutions:", error);
        }
    };
    getFeedbackResolution();
},[]);
};

//update 
export const UpdateResolutions = {
    updateFeedbackResolutions: async (resolutionData) =>{
        console.log("updating resolutions:", resolutionData);
        
        try{
            const response = await axios.post(`${apiUrl}/api/Feedback/UpdateFeedbackResolution`, resolutionData, {
                headers: {
                    "Content-Type" : "application/json"
                },
            });
            return response.data;
        }catch(error){
            console.error("error updating resolution:", error);
            throw error;
        }
    }, 
};