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

//form values for registering prospects 
const initialFormValues = {
  id: "",
  name: "",
  prospectType: 0,
  referrelNo: "",
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
  width: '450px',
  height: '300px',
};

const defaultCenter = {
  lat: 7.4863,
  lng: 80.3620,
};

//add prospect
export const AddProspect = ({onClose, onProspectAdded, editProspect}) => {

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
    if (editProspect)
      Object.entries(editProspect).forEach(([key, value]) => {
    if (initialFormValues.hasOwnProperty(key)) {
        setValue(key, value);
      }
    });
  }, [editProspect, setValue]);

// useEffect(() => {
//   if (editProspect) {
//     Object.entries(editProspect).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         setValue(key, value); // from react-hook-form
//       }
//     });
//   }
// }, [editProspect, setValue]);

  //map
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




const onSubmit = async (data) =>{

      if (editProspect && !editProspect.id) {
      alert("Missing phone for update");
      // showMessage(error.message || 'Missing phone for update', 'error');
      return;
    }

    data.prospectType = parseInt(data.prospectType, 10) || 0; // Ensure it's a number
    data.industry = parseInt(data.industry, 10) || 0; // Ensure it's a number
    data.businessType = parseInt(data.businessType, 10) || 0; // Ensure it's a number
    data.source = parseInt(data.source, 10) || 0; // Ensure it's a number
    data.engagementLevel = parseInt(data.engagementLevel, 10) || 0; // Ensure it's a number
    data.likelihoodToClose = parseInt(data.likelihoodToClose, 10) || 0; // Ensure it's a number
    data.latitude = parseFloat(data.latitude) || 0; // Ensure it's a number
    data.longitude = parseFloat(data.longitude) || 0; // Ensure it's a number
    

    // const prospectData = [{
    //     id: editProspect?.id || "string",
    //     name: data.name,
    //     prospectType: parseInt(data.prospectType),
    //     referrelNo: data.referrelNo,
    //     referrer: data.referrer,
    //     industry: parseInt(data.industry),
    //     businessType: parseInt(data.businessType),
    //     source: parseInt(data.source),
    //     firstContactedDate: data.firstContactedDate,
    //     nextFollowUpDate: data.nextFollowUpDate,
    //     latitude: parseFloat(data.latitude),
    //     longitude: parseFloat(data.longitude),
    //     salesAgentID: data.salesAgentID,
    // }];

    console.log("submitting prospect:", data);
    
    try{
         if (editProspect){
        //edit 
        await UpdateProspect.updateProspect(data);
        alert("prospect updated successfully!");
        showMessage('prospect updated successfully!', 'success');
      }else{
        //add new phone
        await axios.post(
          `${apiUrl}/api/Prospect/RegisterProspect`, data,
          {
            headers: {
              "Content-Type": "application/json"},
          });
          alert("prospect added successfully!");
          showMessage('prospect added successfully!', 'success');
      }
        reset();
        onClose();
        onProspectAdded();

    }catch(error){
      console.error("Error submitting form:", error);
    //   showMessage(error.message || 'Error submitting form', 'error');
      alert(editProspect? "failed to update prospect" : "Failed to add prospect");
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
                  {/* <div className="form-group">
                    <label htmlFor="prospectID">ID</label>
                    <input
                      {...register("prospectID")}
                      id="prospectID"
                      className="border p-2 rounded"
                      placeholder="ID"
                    />
                  </div> */}
                  {/* <div className="form-group">
                    <label htmlFor="referralNo">Referral No.</label>
                    <input
                      {...register("referralNo")}
                      id="referralNo"
                      className="border p-2 rounded"
                      placeholder="Referral No."
                    />
                  </div> */}
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
                    <label htmlFor="prospectType">Prospect Type</label>
                    <select
                      {...register("prospectType")}
                      id="prospectType"
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
                  {errors.prospectType && <p className="text-red-500 text-sm">Prospect Type is required</p>}

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
                    <label htmlFor="salesAgentId">Sales Agent ID</label>
                    <input
                      {...register("salesAgentId")}
                      id="salesAgentId"
                      className="border p-2 rounded"
                      placeholder="Sales Agent ID"
                    />
                  </div>
                  {errors.salesAgentID && <p className="text-red-500 text-sm">Sales Agent ID is required</p>}

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

                  {/* <div className="form-group">
                    <label htmlFor="createdAt">Created At</label>
                    <input
                      type="date"
                      {...register("createdAt")}
                      id="createdAt"
                      className="border p-2 rounded"
                    />
                  </div>
                  {errors.createdAt && <p className="text-red-500 text-sm">Created Date is required</p>} */}
                  
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

                  <div className="map-container ml-0 mb-4 mt-4">
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
                        <div>Loading Map...</div>
                      )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                      {...register("longitude")}
                      id="longitude"
                      type="number"
                      step="0.000001" // Defines the decimal precision (you can adjust the step value as needed)
                      className="border p-2 rounded"
                      placeholder="Enter a decimal longitude"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                      {...register("latitude")}
                      id="latitude"
                      type="number"
                      step="0.000001" // Defines the decimal precision (you can adjust the step value as needed)
                      className="border p-2 rounded"
                      placeholder="Enter a decimal longitude"
                    />
                  </div>
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


//refresh list 
export const RefreshProspect = () => {
 const [prospects, setProspects] = useState([]);

  useEffect(() => {
    const getProspects = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/Prospect/GetProspect`, {
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
        setProspects(data.resData || []);
        
      } catch (error) {
        console.error("Error fetching prospects:", error);
      }
    };

    getProspects();
  }, []);

};

//update prospect 
export const UpdateProspect = {
    updateProspect: async(data) => {
    
    try {
      const response = await axios.post(
        `${apiUrl}/api/Prospect/UpdateProspect`, data,
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      return response.data;
    }catch (error) {
      console.error("error updating Prospect:", error);
      showMessage(error.message || 'Error updating Prospect', 'error');
      throw error;
    }

    },
};