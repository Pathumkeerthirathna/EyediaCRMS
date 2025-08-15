import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
     EnumBusinessType, 
     EnumClientSource,
     EnumClientType,
     EnumIndustryType,
} from "../../Constants";

import { useSnackbar } from '../../Snackbars/SnackbarContext';

const apiUrl = import.meta.env.VITE_API_URL;

//form values for registering lead
const initialFormValues = {
  prospectID: "",
  name: "",
  leadType: 0,
  referrer: "",
  industry: 0,
  businessType: 0,
  source: 0,
  firstContactedDate: "",
  nextFollowUpDate: "",
  latitude: 0,
  longitude: 0,
  salesAgentID: "",
};

//map components 
const containerStyle = {
  width: '410px',
  height: '300px',
};

const defaultCenter = {
  lat: 7.4863,
  lng: 80.3620,
};



//add new
export const AddLeads = ({onClose, onLeadAdded, editLead}) => {

//snackbars
const { showMessage } = useSnackbar();

   const {
     register,
     handleSubmit,
     reset,
     watch,
     setValue,
     formState: { errors },
   } = useForm({defaultValues:initialFormValues,});

  //set values to the form when editing
    useEffect(() => {
      if (editLead)
        Object.entries(editLead).forEach(([key, value]) => {
      if (initialFormValues.hasOwnProperty(key)) {
          setValue(key, value);
        }
      });
    }, [editLead, setValue]);


    //map components
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: 'AIzaSyANMAlOFTy3Kn6aw7cGhHWejtI83Xdxmrg', // Replace with your actual API key
    });
    
      //map components
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

      if (editLead && !editLead.id) {
      alert("Missing phone for update");
      // showMessage(error.message || 'Missing lead for update', 'error');
      return;
    }


    data.leadType = parseInt(data.leadType, 10) || 0; // Ensure it's a number
    data.industry = parseInt(data.industry, 10) || 0; // Ensure it's a number
    data.businessType = parseInt(data.businessType, 10) || 0; // Ensure it's a number
    data.source = parseInt(data.source, 10) || 0; // Ensure it's a number
    data.engagementLevel = parseInt(data.engagementLevel, 10) || 0; // Ensure it's a number
    data.likelihoodToClose = parseInt(data.likelihoodToClose, 10) || 0; // Ensure it's a number
    data.latitude = parseFloat(data.latitude) || 0; // Ensure it's a number
    data.longitude = parseFloat(data.longitude) || 0; // Ensure it's a number
        
    
    // const LeadData = 
        // {  
        //   lead: {

        //         id: editLead?.id || "string",
        //         prospectID: data.prospectID,
        //         name: data.name,
        //         leadType: parseInt(data.leadType),
        //         referrer: data.referrer,
        //         industry: parseInt(data.industry),
        //         businessType: parseInt(data.businessType),
        //         source: parseInt(data.source),
        //         firstContactedDate: data.firstContactedDate,
        //         nextFollowUpDate: data.nextFollowUpDate,
        //         latitude: parseFloat(data.latitude),
        //         longitude: parseFloat(data.longitude),
        //         salesAgentID: data.salesAgentID,
        //     }
        // };


       console.log("Submitting lead data:", data);

        try {
             if (editLead){
            //edit 
            await UpdateLead.updateLead(data);
            alert("Lead updated successfully!");
            showMessage('Lead updated successfully!', 'success');
        }else{
            //add 
            await axios.post(
            `${apiUrl}/api/Lead/RegisterLead`, data,
            {
                headers: {
                "Content-Type": "application/json"},
            });
            alert("Lead added successfully!");
            showMessage('Lead added successfully!', 'success');
        }
            reset();
            onClose();
            onLeadAdded();

        } catch (error) {
        console.error("Error submitting form:", error);
        alert(editLead? "failed to update Lead" : "Failed to add lead");
        }

        
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

    return (
        <>
        <div className="lead-form-container bg-white w-110 mr-2 ml-6 bg-blue-50 p-4 rounded">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      {...register("name")}
                      id="name"
                      className="border p-2 rounded"
                      placeholder="Name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

                  <div className="form-group">
                    <label htmlFor="leadType">Lead Type</label>
                    <select
                      {...register("leadType")}
                      id="leadType"
                      className="border p-2 rounded"
                    >
                      <option>Select Type</option>
                      {Object.entries(EnumClientType).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.leadType && <p className="text-red-500 text-sm">Lead Type is required</p>}

                <div className="form-group">
                    <label htmlFor="referrer">Referrer</label>
                    <input
                      {...register("referrer")}
                      id="referrer"
                      className="border p-2 rounded"
                      placeholder="Referrer"
                    />
                  </div>
                  {errors.referrer && <p className="text-red-500 text-sm">Referrer is required</p>}

                   <div className="form-group">
                      <label htmlFor="industry">Industry</label>
                      <select
                        {...register("industry")}
                        id="industry"
                        className="border p-2 rounded"
                      >
                        <option>Select Industry</option>
                        {Object.entries(EnumIndustryType).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.industry && <p className="text-red-500 text-sm">Industry is required</p>}

                    
                    <div className="form-group">
                      <label htmlFor="businessType">Business Type</label>
                      <select
                        {...register("businessType")}
                        id="businessType"
                        className="border p-2 rounded"
                      >
                        <option>Select Business Type</option>
                        {Object.entries(EnumBusinessType).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.businessType && <p className="text-red-500 text-sm">Business Type is required</p>}

                    <div className="form-group">
                      <label htmlFor="source">Source</label>
                      <select
                        {...register("source")}
                        id="source"
                        className="border p-2 rounded"
                      >
                        <option>Select Source</option>
                        {Object.entries(EnumClientSource).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.source && <p className="text-red-500 text-sm">Source is required</p>}

                     <div className="form-group">
                    <label htmlFor="firstContactedDate">First Contact Date</label>
                    <input
                      type="date"
                      {...register("firstContactedDate")}
                      id="firstContactedDate"
                      className="border p-2 rounded"
                    />
                  </div>
                  {errors.firstContactedDate && <p className="text-red-500 text-sm">First Contact Date is required</p>}

                    <div className="form-group">
                    <label htmlFor="nextFollowUpDate">Next Follow Up</label>
                    <input
                      type="date"
                      {...register("nextFollowUpDate")}
                      id="nextFollowUpDate"
                      className="border p-2 rounded"
                    />
                  </div>
                  {errors.nextFollowUpDate && <p className="text-red-500 text-sm">Next Follow Up date is required</p>}

                   <p className="text-blue-800 ml-1 mb-4 mt-9 font-semibold">Select Location on the Map</p>
                    <div className="map-container ml-1 mb-4 mt-2">
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
                    <div className="form-group text-gray-600">
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

                  <div className="form-group text-gray-600">
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

                   <div className="form-group">
                    <label htmlFor="salesAgentID">Sales Agent ID</label>
                    <input
                      {...register("salesAgentID")}
                      id="salesAgentID"
                      className="border p-2 rounded"
                      placeholder="Sales Agent ID"
                    />
                  </div>
                  {errors.salesAgentID && <p className="text-red-500 text-sm">Sales Agent ID is required</p>}
                
                  <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-800 text-white rounded-2xl mb-4"
                    >
                        Save
                    </button>
                  </div>

            </form>
        </div>
        </>
    )


};

//refresh 
export const RefreshLeads = () => {
const [leads, setLeads] = useState([]);

  useEffect(() => {
    const getLeads = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/Lead/GetLead`, {
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
        setLeads(data.resData || []);
        
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    getLeads();
  }, []);
};

//update
export const UpdateLead =  {

    updateLead : async (data) => {
       try {
      const response = await axios.put(
        `${apiUrl}/api/Lead/UpdateLead`, data,
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      return response.data;
    }catch (error) {
      console.error("error updating lead:", error);
      showMessage(error.message || 'Error updating lead', 'error');
      throw error;
    }

    },

};


//deactivate
export const DeleteLead = () =>{

};