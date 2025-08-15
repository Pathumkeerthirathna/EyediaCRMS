import React, { useEffect, useState, useCallback} from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { EnumContactType } from "../../Constants";

const apiUrl = import.meta.env.VITE_API_URL;

//values for the form 
const defaultValues = {
  prospectID: "",
  add1: "",
  add2: "",
  add3: "",
  addType: 0,
  postalCode: "",
  city: "",
  province: "",
  latitude: 0,
  longitude: 0,
  isDefault: false,
  status: 0
}

//map components 
const containerStyle = {
  width: '410px',
  height: '300px',
};

const defaultCenter = {
  lat: 7.4863,
  lng: 80.3620,
};

//add new address form
export const AddAddress = ({onClose, prospectID, onProspectAddressAdded, editProspectAddress}) => {

//map components
const { isLoaded } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: 'AIzaSyANMAlOFTy3Kn6aw7cGhHWejtI83Xdxmrg', // Replace with your actual API key
});


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({defaultValues:{
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng
  }});
  
   useEffect(() => {
      setValue("prospectID", prospectID);

      if (editProspectAddress)
        Object.entries(editProspectAddress).forEach(([key, value]) => {
      if (defaultValues.hasOwnProperty(key)) {
          setValue(key, value);
        }
      });
    }, [prospectID, editProspectAddress, setValue]); //set the ProspectID in the field inside the form and editing
    
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
    if (editProspectAddress && !editProspectAddress.id) {
      alert("Missing address for update");
      return;
    }

    const addressData = 
    [{
      id: editProspectAddress?.id || "string", 
      prospectID: data.prospectID,
      add1: data.add1,
      add2: data.add2,
      add3: data.add3,
      addType: parseInt(data.addType),
      postalCode: data.postalCode,
      city: data.city,
      province: data.province,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      isDefault: data.isDefault,
      status: 0,
    }]

    console.log("Submitting address data:", addressData);

    try{
      if (editProspectAddress){
        //edit 
        await UpdateAddress.updateprospectAddress(addressData);
        alert("Prospect address updated successfully!");
      }else{
        //add new address
        await axios.post(
          `${apiUrl}/api/Prospect/AddProspectAddress`, addressData,{
            prospectID: data.prospectID,
          },{
            headers:{
              "Content-Type": "application/json"},
            });
            alert("Prospect address added successfully!");
          }
          reset();
          onClose();
          onProspectAddressAdded();
        }catch (error){
          console.error("Error submitting address data:", error);
          alert(editProspectAddress? "failed to update address" : "failed to add address");
        }

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
        <div className="add-prospect-phone-form-container w-120 mr-2 ml-6 bg-blue-50 p-4 rounded">
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="form-group text-gray-600 ml-5 mt-6">
              <label htmlFor="add1">Address Line 1</label>
              <input 
              {...register("add1", { required: true })}
              id="add1"
              className="p-2 rounded mr-2 w-50"
              placeholder="Address Line 1"
              />
            </div>
            {errors.add1 && <p className="text-red-500 text-sm ml-40 mb-2">Address Line 1 is required</p>}

            <div className="form-group text-gray-600 ml-5 mt-6">
              <label htmlFor="add2">Address Line 2</label>
              <input 
              {...register("add2", { required: true })}
              id="add2"
              className="p-2 rounded mr-2 w-50"
              placeholder="Address Line 2"
              />
            </div>
            {errors.add2 && <p className="text-red-500 text-sm ml-40 mb-2">Address Line 2 is required</p>}

            <div className="form-group text-gray-600 ml-5 mt-6">
              <label htmlFor="add3">Address Line 3</label>
              <input 
              {...register("add3", { required: true })}
              id="add3"
              className="p-2 rounded mr-2 w-50"
              placeholder="Address Line 3"
              />
            </div>
            {errors.add3 && <p className="text-red-500 text-sm ml-40 mb-2">Address Line 3 is required</p>}

            <div className="form-group text-gray-600 ml-4 mt-6">
              <label htmlFor="addType" className="mr-5">Address Type</label>
              <select 
              {...register("addType", { required: true })}
              id="addType"
              className="p-2 rounded mr-1 ml-2 w-60"
              defaultValue=""
              >
                <option value="" disabled>Select the Address Type</option>
                {Object.entries(EnumContactType).map(([key, label]) => (
                    <option key={key} value={key}>
                    {label}
                    </option>
                  ))}
              </select>
            </div>
            {errors.addType && <p className="text-red-500 text-sm">Address type is required</p>}

            <div className="form-group text-gray-600 ml-5 mt-6">
              <label htmlFor="postalCode">Postal Code</label>
              <input 
              {...register("postalCode", { required: true })}
              id="postalCode"
              className="p-2 rounded mr-2 w-50"
              placeholder="PostalCode"
              />
            </div>
            {errors.postalCode && <p className="text-red-500 text-sm ml-40 mb-2">Postal Code is required</p>}

            <div className="form-group text-gray-600 ml-5 mt-6">
              <label htmlFor="city">City</label>
              <input 
              {...register("city", { required: true })}
              id="city"
              className="p-2 rounded mr-2 w-50"
              placeholder="city"
              />
            </div>
            {errors.city && <p className="text-red-500 text-sm ml-40 mb-2">City is required</p>}

            <div className="form-group text-gray-600 ml-5 mt-6">
              <label htmlFor="province">Province</label>
              <input 
              {...register("province", { required: true })}
              id="province"
              className="p-2 rounded mr-2 w-50"
              placeholder="province"
              />
            </div>
            {errors.province && <p className="text-red-500 text-sm ml-40 mb-2">Province is required</p>}

            <p className="text-blue-800 ml-5 mb-4 mt-9 font-bold">Select Location on the Map</p>

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

                  

            <div className="form-group text-gray-600 ml-6 mt-5">
             <label htmlFor="isDefault">Is Default?</label>
               <input
               type="checkbox"
               {...register("isDefault")}
               id="isDefault"
               className="mr-0"
               />
           </div>


            <div className="flex mt-4 mb-3">
               <button
                type="button"
                onClick={onClose}
                style={{
                width: '5rem',
                height: '2rem',
                minWidth: '5rem',
                borderRadius: '6px',
                backgroundColor: 'darkred',
                marginLeft: '14rem',
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

//update the list of address when new address is added
export const RefreshAddress = () => {
    const [prospectAddress, setProspectAddress] = useState([]);

    useEffect(() => {
        const getProspectAddress = async () =>{
          try {
            const response = await fetch(`${apiUrl}/api/Prospect/GetProspectAddress`, {
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
            setProspectAddress(data.resData || []);
    
          } catch (error) {
            console.error("Error fetching prospect address:", error);
          }
        }
      getProspectAddress();
    },[]);

    return(
        <>
        </>
    );
};

//edit addresses
export const UpdateAddress = {

  updateprospectAddress: async (addressData)=>{

    const arr = [
      addressData
    ]

    console.log(arr);

    try{
      const response = await axios.put(
        `${apiUrl}/api/Prospect/UpdateProspectAddress`, addressData,{
          headers:{
            "Content-Type": "application/json"},
          }
      );
      return response.data;
    }catch (error){
      console.error("error updating prospect address:", error);
      throw error;
    }
  },
};

//delete addresses 
export const DeleteAddress = {

  deactivateProspectAddress: async (addresses) => {
    try {
      const deactivateAddress = {
        ...addresses,
        status:1, //set status to 1 in order to deacrtivate
      };
      const response = await axios.put(
        `${apiUrl}/api/Prospect/UpdateProspectAddress`,
        [deactivateAddress],{
          headers:{"Content-Type": "application/json"},
        }
      );
      console.log("Address deactivated successfully:", response.data);
      return response.data;
    }catch (error) {
      console.error("error deactivating address:", error);
      throw error;
    }
  }

};