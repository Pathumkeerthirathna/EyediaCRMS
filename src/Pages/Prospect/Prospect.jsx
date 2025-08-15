import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Image, FileBox, X } from "lucide-react";
import CardContent from '@mui/material/CardContent';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import { Tooltip } from "react-tooltip";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  EnumBusinessType,
  EnumClientType,
  EnumIndustryType,
  EnumClientSource,
  EnumContactType,
  EnumClientEngagementLevel,
} from "../../Constants";
import axios from "axios";
import "./Prospect.css";

// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';

import { Section1 } from "../../Components/Phones";
import { Section2 } from "../../Components/Phones";
import { Section3 } from "../../Components/Phones";
import { Section4 } from "../../Components/Phones";

import { SectionA } from "../../Components/Prospect/ContactPersons";
import { SectionB } from "../../Components/Prospect/ContactPersons";
import { SectionC } from "../../Components/Prospect/ContactPersons";
import { SectionD } from "../../Components/Prospect/ContactPersons";

import { AddEmail } from "../../Components/Prospect/Emails";
import { RefreshEmail } from "../../Components/Prospect/Emails";
import { UpdateEmail } from "../../Components/Prospect/Emails";
import { DeleteEmail } from "../../Components/Prospect/Emails";

import { AddAddress } from "../../Components/Prospect/Address";
import { RefreshAddress } from "../../Components/Prospect/Address";
import { UpdateAddress } from "../../Components/Prospect/Address";
import { DeleteAddress } from "../../Components/Prospect/Address";

import { useSnackbar } from "../../Snackbars/SnackbarContext";

import { AddProspect } from "../../Components/Prospect/RegProspect";
import { UpdateProspect } from "../../Components/Prospect/RegProspect";
import { RefreshProspect } from "../../Components/Prospect/RegProspect";

// import ConvertProspect from "../../Components/ConvertProspect";

import { AddProspectAsLead } from "../../Components/Conversion/AddProspectAsLead";
// import AddProspectAsLead from "../../Components/Conversion/AddProspectAsLead";

const apiUrl = import.meta.env.VITE_API_URL;

//form values for registering prospects 
const initialFormValues = {
  id: "string",
  name: "",
  prospectType: 0,
  referrelNo: "",
  referrer: "",
  industry: 0,
  businessType: 0,
  source: 0,
  likelihoodToClose: 0,
  engagementLevel: 0,
  firstContactedDate: "2025-03-07T02:10:36.206Z",
  nextFollowUpDate: "2025-03-07T02:10:36.206Z",
  createdAt: "2025-03-07T02:10:36.206Z",
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

const containerStyle2 = {
  // width: '800px',
  height: '300px',
  marginLeft:'0rem',
  borderRadius:'7px'
};

//section3: To update the phone data
// export const UpdateLeadPhone = {
//   updateLeadPhone: async (leadPhoneData) => {

//     const arr = [
//       leadPhoneData
//     ]

//     console.log(arr);
//     try {
//       const response = await axios.put(
//         `${apiUrl}/api/Lead/UpdateLeadPhone`, leadPhoneData,
//         {
//           headers: {"Content-Type": "application/json"},
//         }
//       );
//       return response.data;
//     }catch (error) {
//       console.error("error updating lead phone:", error);
//       showMessage(error.message || 'Error updating lead phone', 'error');
//       throw error;
//     }
//   },
// };



const Prospect = () => {

  const [prospectList, setProspectList] = useState([]);
  const [prospectID, setProspectID] = useState([]);
  const [prospectData, setProspectData] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [phoneData, setPhoneData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [engagementLevel, setEngagementLevelData] = useState([]);
  const [likelihoodtoConvertData, setLikelihoodtoConvertData] = useState([]);
  const [prospectNameData, setProspectNameData] = useState([]);
  const [prospectBusinessTypeData, setProspectBusinessTypeData] = useState([]);
  const [prospectReferellData, setProspectReferellData] = useState([]);
  const [prospectCreatedAtData, setProspectCreatedAtData] = useState([]);
  const [prospectFirstContactData, setProspectFirstContactData] = useState([]);
  const [prospectLastContactData, setProspectLastContactData] = useState([]);
  const [prospectNextFollowupData, setProspectNextFollowupData] = useState([]);
  const [prospectIndustryData, setProspectIndustryData] = useState([]);
  const [prospectTypeData, setProspectTypeData] = useState([]);
  const [prospectSourceData, setProspectSourceData] = useState([]);
  const [prospectreferrerData, setProspectreferrerData] = useState([]);
  const [prospectSalesAgentData, setProspectSalesAgentData] = useState([]);
  const [prospectLatitude, setProspectLatitude] = useState([]);
  const [prospectLongitude, setProspectLongitude] = useState([]);
  const [selectedProspectId, setSelectedProspectId] = useState(null);
  const [referrerData, setReferrerData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default value
  const itemRef = useRef(null); // Reference to an item for height calculation
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const menuRef = useRef(null);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    defaultValues: initialFormValues, // Use predefined structure
  });

//set values to the form when editing
// useEffect(() => {
//   if (editProspect) {
//     Object.entries(editProspect).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         setValue(key, value); // from react-hook-form
//       }
//     });
//   }
// }, [editProspect, setValue]);


  //snackbars
  const { showMessage } = useSnackbar();

  //map
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyANMAlOFTy3Kn6aw7cGhHWejtI83Xdxmrg', // Replace with your actual API key
  });
  
//map components
    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [markerPosition2, setMarkerPosition2] = useState(defaultCenter);
  
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

    const onLoad2 = useCallback((mapInstance) => {
      setMap(mapInstance);
    }, []);
  
    const onUnmount2 = useCallback(() => {
      setMap(null);
    }, []);



  //prospect reg
  const onSubmit = async (data) => {

    //  if (editProspect && !editProspect.id) {
    //   alert("Missing prospect for update");
    //   return;
    // }

    data.prospectType = parseInt(data.prospectType, 10) || 0; // Ensure it's a number
    data.industry = parseInt(data.industry, 10) || 0; // Ensure it's a number
    data.businessType = parseInt(data.businessType, 10) || 0; // Ensure it's a number
    data.source = parseInt(data.source, 10) || 0; // Ensure it's a number
    data.engagementLevel = parseInt(data.engagementLevel, 10) || 0; // Ensure it's a number
    data.likelihoodToClose = parseInt(data.likelihoodToClose, 10) || 0; // Ensure it's a number
    data.latitude = parseFloat(data.latitude) || 0; // Ensure it's a number
    data.longitude = parseFloat(data.longitude) || 0; // Ensure it's a number
    console.log("Form Data:", data);


  //previous function
    // try {
    //   const response = await axios.post(
    //     `${apiUrl}/api/Prospect/RegisterProspect`,
    //     data,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   console.log("Server Response:", response.data);
    //   alert("Prospect registered successfully!");
    //   reset();
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   alert("Failed to register prospect.");
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

//fetches prospect data from an API 
  useEffect(() => {
    const getProspect = async () => {
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
        setProspectList(data.resData || []);
        // showMessage('Prospects fetched successfully', 'success');

      } catch (error) {
        console.error("Error fetching prospect data:", error);
        // showMessage(error.message || 'Failed to fetch Prospects', 'error');
      }
    };

    getProspect();
  }, []);


  // Function to calculate items per page based on window height
  const calculateItemsPerPage = () => {
    if (!itemRef.current) return 4; // Default if ref not attached yet

    const windowHeight = window.innerHeight;
    const itemHeight = itemRef.current.offsetHeight + 20; // Include margin
    return Math.max(Math.floor(windowHeight / itemHeight) + 6, 3); // Ensure at least 1 item
  };

  // Recalculate items per page after the first render
  useEffect(() => {
    const updateItemsPerPage = () => {
      setTimeout(() => {
        setItemsPerPage(calculateItemsPerPage());
      }, 100); // Small delay to ensure DOM update
    };

    updateItemsPerPage();
  }, [prospectList]); // Recalculate when data changes

  // Update itemsPerPage dynamically on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(calculateItemsPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(prospectList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // console.log(Array.isArray(prospectList), typeof prospectList, prospectList);
  const displayedTeam = prospectList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (e) => {
    const value = e.target.value;
    const pageNumber = parseInt(value, 10);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  //get prospect info by double clicking
  const handleDoubleClick = async (id) => {
    setSelectedProspectId(id);
    setProspectID(id);
    // setEditProspect(id);
    // await fetchContactPersons(id);
    //await fetchProspectPhones(id);
    // await fetchProspectEmails(id);
    // await fetchProspectAddress(id);
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }), // Sending prospect.id as payload
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data);

      // showMessage('Prospect Information fetched successfully', 'success');

    //retrive data to the cards relavant to the prospect
    var resdata = data.resData;
    
    //prospect ID
    const prospectID = resdata[0].id;
    setProspectID(prospectID);
    console.log("ID");

    console.log(prospectID);

    //prospectdata to edit 
    const prospectInfo = resdata[0];
    // console.log("prospect info:", prospectInfo);
    setProspectData(prospectInfo);
    console.log("prospect information:", prospectInfo);
    

    //contact persons 
    const contactPersonsData = resdata[1].contactpersons;
    console.log("Contact Persons Data:", contactPersonsData);
    console.log(contactPersonsData);
    setContactPersons(contactPersonsData);
    console.log("Contact Persons", contactPersonsData);
    
    //address
    const prospectAdress = resdata[1].addresses;
    setAddressData(prospectAdress);
    console.log("ADdresses");
    console.log(prospectAdress);

      
    //emails
    const prospectEmail = resdata[1].emails;
    setEmailData(prospectEmail);
    console.log("Emails");
    console.log(prospectEmail);

    //phone
    const prospectPhone = resdata[1].phones;
    setPhoneData(prospectPhone);
    console.log("Phones");
    console.log(prospectPhone);

    //engagement 
    const prospectEngagement = resdata[1].engagementHistory;
    setEngagementData(prospectEngagement);
    console.log("Engagement");
    console.log(prospectEngagement);

    //engagement level 
    const prospectEngagementLevel = resdata[0].engagementLevel;
    setEngagementLevelData(prospectEngagementLevel);
    console.log("engagement level");
    console.log (prospectEngagementLevel);

    //likelihood to convert
    const prospectLikelihoodToConvert = resdata[0].likelihoodToClose;
    setLikelihoodtoConvertData(prospectLikelihoodToConvert);
    console.log("likelihood to convert");
    console.log(prospectLikelihoodToConvert);
    
    //prospect info 
    const prospectName = resdata[0].name;
    setProspectNameData(prospectName);
    console.log("prospect name");
    console.log(prospectName);
    
    const prospectBusinessType = resdata[0].businessType;
    setProspectBusinessTypeData(prospectBusinessType);
    console.log("prospect business type");
    console.log(prospectBusinessType);

    const prospectReferellNo = resdata[0].referrelNo;
    setProspectReferellData(prospectReferellNo);
    console.log("referell no");
    console.log(prospectReferellNo);

    const prospectCreatedAt = resdata[0].createdAt;
    setProspectCreatedAtData(prospectCreatedAt);
    console.log("cretaed at");
    console.log(prospectCreatedAt);
    
    const prospectFirstContact = resdata[0].firstContactedDate;
    setProspectFirstContactData(prospectFirstContact);
    console.log("first contacted date");
    console.log(prospectFirstContact);

    const prospectLastContact = resdata[0].lastContactedDate;
    setProspectLastContactData(prospectLastContact);
    console.log("first contacted date");
    console.log(prospectLastContact);

    const prospectNextFollowup = resdata[0].nextFollowUpDate;
    setProspectNextFollowupData(prospectNextFollowup);
    console.log("next followup");
    console.log(prospectNextFollowup);

    const prospectIndustry = resdata[0].industry;
    setProspectIndustryData(prospectIndustry);
    console.log("industry");
    console.log(prospectIndustry);

    const prospectType = resdata[0].prospectType;
    setProspectTypeData(prospectType);
    console.log("prospect type");
    console.log(prospectType);

    const prospectSource = resdata[0].source;
    setProspectSourceData(prospectSource);
    console.log("source");
    console.log(prospectSource);

    const prospectReferrer = resdata[0].referrer;
    setProspectreferrerData(prospectReferrer);
    console.log("referrer");
    console.log(prospectReferrer);

    const prospectSalesAgent = resdata[0].salesAgentID;
    setProspectSalesAgentData(prospectSalesAgent);
    console.log("sales agent");
    console.log(prospectSalesAgent);

    const prospectLatitude = resdata[0].latitude;
    setProspectLatitude(prospectLatitude);
    console.log("latitude");
    console.log(prospectLatitude);
    
    const prospectLongitude = resdata[0].longitude;
    setProspectLongitude(prospectLongitude);
    
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching prospect details:", error);
      showMessage(error.message || 'Failed to fetch Prospect Information', 'error');
    }
  };

    //refresh logic for the prospects
  const fetchProspects = async () => {
    // console.log("Fetching prospects for prospect ID:", id);
    
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        console.log("Error fetching contact persons:", response.statusText);  
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("prospects:", data);

      const resdata = data.resData;
      setProspectList(resdata);
  
      // const prospectList = resdata[0];
      // setProspectList(prospectList);

    } catch (error) {
      console.error("Error fetching prospect list:", error);
    }
  };

  //refresh logic for the contact person list
  const fetchContactPersons = async (prospectID) => {

    console.log("Fetching contact persons for prospect ID:", prospectID);
    
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectContactPerson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prospectID: prospectID }),
      });
      if (!response.ok) {
        console.log("Error fetching contact persons:", response.statusText);  
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Contact person Data:", data);

      const resdata = data.resData;
  
      const contactPersonsData = resdata[0];
      setContactPersons(contactPersonsData);

    } catch (error) {
      console.error("Error fetching contact person list:", error);
    }
  };
  
  //refresh logic for the phone list
  const fetchProspectPhones = async (prospectID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectPhone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prospectID: prospectID }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const resdata = data.resData;
  
      const prospectPhone = resdata[0];
      setPhoneData(prospectPhone);

    } catch (error) {
      console.error("Error fetching phone list:", error);
    }
  };

  //refresh logic for emails 
  const fetchProspectEmails = async (prospectID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prospectID: prospectID }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const resdata = data.resData;
  
      const prospectEmail = resdata[0];
      setEmailData(prospectEmail);
    } catch (error) {
      console.error("Error fetching email list:", error);
    }
  };

  //refresh logic for address
  const fetchProspectAddress = async (prospectID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prospectID: prospectID }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const resdata = data.resData;
  
      const prospectAdress = resdata[0];
      setAddressData(prospectAdress);
    } catch (error) {
      console.error("Error fetching address list:", error);
    }
  }

  //refresh logic for contact persons after deactivating
  const fetchNewContactPersons = async (prospectID) =>{
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectContactPerson`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ prospectID: prospectID }),
      });

      const data = await response.json();

      console.log("Contact person Data:", data);
      
      setContactPersons((data.resData || []).filter(person => person.status === 0)); // Filter out deactivated contact persons
    }catch (error){
      console.error("error fetching updated contact person list:", error);
    }
  };

  //refresh logic for address deactivation
  const fetchNewAddresses = async (prospectID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectAddress`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prospectID: prospectID }),
      });

      const data = await response.json();
      console.log("Address Data:", data);

      setAddressData((data.resData || []).filter(address => address.status === 0)); //filter deactivated addresses
    }catch (error){
      console.error("error fetching updated address list:", error);
    }
  };

  //refresh logic for email deactivation 
  const fetchNewEmails = async (ProspectID) =>{
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectEmail`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ prospectID: ProspectID }),
      });

      const data = await response.json();
      console.log("contact person data:", data);

      setEmailData((data.resData || []).filter(email => email.status === 0)); //filter out the inactive emails 
    }catch (error){
      console.error("error fetching updated email list", error);
    }
  };

  //refresh logic for phone deactivation
  const fetchNewPhones = async (prospectID) =>{
    try{
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectPhone`,{
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify({prospectID:prospectID}),
      });
      const data = await response.json();
      console.log("phone data:", data);

      setPhoneData((data.resData || []).filter(phone => phone.status === 0)); //filter out deactivated phones
      
    }catch (error){
      console.error("error fetching updated phone list:", error);
    }
  };


//drawers
const [state, setState] = React.useState({right: false,});
const [prospectDrawerOpen, setProspectDrawerOpen] = React.useState(false);
const [isDrawerOpen, setDrawerOpen] = React.useState(false);
const [phoneDrawerVisible, setPhoneDrawerVisible] = React.useState(false);
const [EmailDrawerVisible, setEmailDrawerVisible] = React.useState(false);
const [AddressDrawerVisible, setAddressDrawerVisible] = React.useState(false);
const [ProductDrawerVisible, setProductDrawerVisible] = React.useState(false);
const [ReferreDrawerVisible, setReferrerDrawerVisible] = React.useState(false);


const navigate = useNavigate();


//content for contact person drawer
const drawerContent = (
  <Box sx={{ width: 300, padding: 2 }} role="presentation"></Box>
  );

// Functions to toggle drawer
const toggleDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setState({ right: open });
};

const handleProspectDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setProspectDrawerOpen(open);
};


const handleToggleDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setDrawerOpen(open);
};

const togglePhoneDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setPhoneDrawerVisible(visible);
};

const toggleEmailDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setEmailDrawerVisible(visible);
};

const toggleAddressDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setAddressDrawerVisible(visible);
};

const toggleProductDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setProductDrawerVisible(visible);
};

const toggleReferrerDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')){
    return;
  }
  setReferrerDrawerVisible(visible);
}

const handleClickOpen1 = () => {
  setOpen1(true);
};

const handleClose1 = () => {
  setOpen1(false);
};

const toggleSelection = (product) => {
  setSelected((prev) =>
    prev.includes(product)
      ? prev.filter((p) => p !== product)
      : [...prev, product]
  );
};

//funtions to open forms relavant to adding new prospect activities
const [showForm, setShowForm] = useState(false);
const [showSectionB, setShowSectionB] = useState(false);
const [showSectionC, setShowSectionC] = useState(false);
const [showPhoneForm, setShowPhoneForm] = useState(false);
const [showSection2, setShowSection2] = useState(false);
const [showEmailForm, setShowEmailForm] = useState(false);
const [showRefreshEmail, setShowRefreshEmail] = useState(false);
const [showAddressForm, setShowAddressForm] = useState(false);
const [showRefreshAddress, setShowRefreshAddress] = useState(false);

const [editProspect, setEditProspect] = useState(null);
const [editContactPerson, setEditContactPerson] = useState(null);
const [editProspectPhone, setEditProspectPhone] = useState(null);
const [editProspectEmail, setEditProspectEmail] = useState(null);
const [editProspectAddress, setEditProspectAddress] = useState(null);

// scrolling 
const formRef = useRef(null);

// Scroll to form when editing
useEffect(() => {
  if (
    (editContactPerson || editProspectPhone || editProspectEmail || editProspectAddress) &&
    formRef.current
  ) {
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [editContactPerson, editProspectPhone, editProspectEmail, editProspectAddress]);

//map fetched from API
useEffect(() => {
  const fetchCoordinates = async () => {
    try {
      const response = await fetch('/api/Prospect/GetProspect'); 
      const data = await response.json();
      setProspectLatitude(data.latitude);
      setProspectLongitude(data.longitude);
    } catch (error) {
      console.error('Failed to fetch coordinates:', error);
    }
  };

  fetchCoordinates();
}, []);


//map
const openMap = () => {
  // const url = `https://www.google.lk/maps/@${prospectLatitude},${prospectLongitude}`;
  // const url = `https://www.google.com/maps/search/?api=1&query=${prospectLatitude},${prospectLongitude}`;
  // const url = `https://www.google.com/maps/search/?api=1&query=${prospectLatitude},${prospectLongitude}`;
  const zoomLevel = 18;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${prospectLatitude},${prospectLongitude}&zoom=${zoomLevel}`;
  // const zoomLevel = 18;
  // const url = `https://www.google.com/maps/search/?api=1&query=${prospectLatitude},${prospectLongitude}&zoom=${zoomLevel}`;
  window.open(url, '_blank');
}

const hasCoordinates = prospectLatitude !== null && prospectLongitude !== null;
const center = { lat: prospectLatitude, lng: prospectLongitude };


//fetching ref 
const fetchReferrerDetails = async (referrelNo) => {
  try{
    const response = await fetch (`${apiUrl}/api/Prospect/GetProspect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({referrelNo: referrelNo}),
    });

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("referrer data:", data);

    var resData = data.resData;
    const referrerProspect = resData[0];
    setReferrerData(referrerProspect);

  }  catch (error){
    console.error("error fetchinf referrer details:", error);
  }
};

  return (
    <>
      <div className="prospect-container">
        <div className="prospect-card-container">{/* section 1 */}

          <div className="prospect-search">{/* prospect search */}
            <input className="prospect-search-input" />
            <button
              className="open-btn"
              onClick={() => setProspectDrawerOpen(true)}
              data-tooltip-id="open-tooltip"
              data-tooltip-content="Add New Prospect"
            >+
            </button>
            <Tooltip id="open-tooltip" place="right-end" />

            {/* right drawer to add and edit prospects */}
              <Drawer anchor="right" open={prospectDrawerOpen} onClose={handleProspectDrawer(false)}>
                  <Box sx={{ width: 500 }} role="presentation" onClick={handleProspectDrawer(false)} onKeyDown={handleProspectDrawer(false)}>
                  </Box>

            <div className="flex flex-col gap-4 p-4">
              <h2 className="font-bold text-xl text-blue-900 ml-10 mt-3">Prospect Registration</h2>
                <CardContent className="p-4">{/* drawer card content to show the form to add new leads */}
                  <AddProspect
                  onClose={() => {
                      setProspectDrawerOpen(false);
                      setEditProspect(null);
                    }}
                    prospectID={prospectID} //prospectID
                    onProspectAdded={() => fetchProspects()} //refresh function
                    editProspect={editProspect} //pass edit prospect 
                  />

              </CardContent>
            </div>

              </Drawer>
          </div>

          <div className="prospect-list">{/* prospect name list */}
            {displayedTeam.map((prospect, index) => (
              <div
                key={index}
                className={`prospect-card ${selectedProspectId === prospect.id ? "selected" : ""}`}
                ref={index === 0 ? itemRef : null}
                onDoubleClick={() => {
                  setSelectedProspectId(prospect.id);
                  handleDoubleClick(prospect.id);
                }}
              >
                <h3 className="prospect-name">{prospect.name}</h3>
                <div className="prospect-sub-info">
                  <p className="prospect-business">
                    {EnumBusinessType[prospect.businessType] || "Unknown"}
                    &nbsp;&nbsp;/&nbsp;&nbsp;
                  </p>
                  <p className="prospect-type">
                    {EnumClientType[prospect.prospectType] || "Unknown"}
                  </p>
                </div>
                {/* <button 
              onClick={() => 
                {
                  setProspectDrawerOpen(true);
                  setEditProspect(prospect); // edit 
                }}
              >
                <img src="/src/assets/edit.png" alt="pros" className="w-4 h-4 ml-45 mt-1 mt-1" />
              </button> */}
              </div>
            ))}
          </div>

          <div className="pagination-container"> {/* Pagination Controls */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="pagination-button"
              disabled={currentPage === 1}
            >
              «
            </button>
            <input
              type="text"
              value={currentPage}
              className="pagination-input"
              onChange={handlePageChange} // Call handler on input change
            />
            <span className="pagination-text">/ {totalPages}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="pagination-button"
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
          <div className="prospect-div2">{/* section 2 */}
           <React.Fragment>
              <button className="convert-into-lead-btn" onClick={handleClickOpen1}>Convert into Lead</button>
                <Dialog
                  open={open1}
                  onClose={handleClose1}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  maxWidth={false} // disables the default maxWidth behavior
                  fullWidth={false} // prevents MUI from forcing fullWidth
                  PaperProps={{
                    sx: {
                      backgroundColor: 'white',
                      width: '70vw', // use vw for better responsiveness
                      height: '520px',
                      // opacity: 0.9,
                      // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                      marginTop: '4rem',
                      borderRadius: '10px',
                    },
                  }}>

                    <DialogTitle id="alert-dialog-title"
                      sx={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      mt: 2, // 2px margin-top
                      ml:2,
                      color: "darkblue"
                    }}> 
                      {"Complete the following steps to convert prospect into lead"}
                       <button
                        onClick={handleClose1}
                        style={{
                          background: 'darkred',
                          border: 'none',
                          borderRadius:'10px',
                          width:'2rem',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '2px',
                          marginLeft:'16rem',
                        }}
                      >
                        X
                      </button>
                    </DialogTitle>

                   <DialogContent>
                        <div className="ml-6 mr-6"> 

                            <AddProspectAsLead
                          prospectID={selectedProspectId}
                          />
                          
                          {/* <AddProspectAsLead
                          prospectID={selectedProspectId}
                          /> */}

                          {/* <ConvertProspect
                          prospectID={selectedProspectId}
                          /> */}

                        </div>
                    </DialogContent>
               </Dialog>
           </React.Fragment>

<div className="menudots" ref={menuRef}>
  {/* Three-dot button */}
    {/* <button
    onClick={() => setOpen(!open)}
    className="tripledots p-2 rounded-full hover:bg-gray-200 ml-190">
    &#x22EE; Vertical ellipsis (⋮)</button> */}

  {/* Dropdown menu for edit and delete*/}
    {/* {open && (
      <div className="menudots-menu absolute mt-2 w-30 bg-white rounded-lg shadow-lg ml-160">
         <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
            <span className="mr-2 ml-5"></span> Edit
          </button><hr class="border-t-1 border-gray-300"/>
         <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
            <span className="mr-2 ml-3"></span> Delete
         </button>
      </div>
             )} */}
</div>
 
{/* sales agent card and engagement */}
<div className="flex gap-6 p-3">
  {/* Sales Agent Card */}
    <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300">
      <div className="flex justify-between border-b border-gray-300 pb-2">
         <span className="font-bold">Sales Agent</span>
         <span className="text-blue-800">{prospectSalesAgentData}</span>
     </div>
     <div className="flex justify-between mt-4 pb-2">
      <p className="font-regular">Ongoing Meeting</p>
      <p className="font-regular text-red-700 text-lg">02:10:34</p>
     </div>
   
    </div>

  {/* Engagement & Likelihood Card - the engagement level relavant to the respective prospect will be shown*/}
    <div className="bg-white shadow-md rounded-lg p-4 w-1/3 w-90 border border-gray-300">
       <div className="text-gray-700 font-bold mb-2">Engagement Level</div>
          <div className="flex gap-6 mb-4 ml-6">
            {engagementLevel === 1 && 
            (
              <span className="bg-red-500 text-white px-2 py-1 rounded-xl">Low</span>
            )}
           {engagementLevel === 2 && (
              <span className="bg-yellow-400 text-white px-2 py-1 rounded-xl">Medium</span>
            )}
          {engagementLevel === 3 && (
             <span className="bg-green-500 text-white px-2 py-1 rounded-xl">High</span>
            )}
         </div>

         <div className="text-gray-700 font-bold mb-2">Likelihood to convert</div>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-indigo-600 h-4 rounded-full flex items-center justify-center text-white text-xs transition-all duration-500"
          style={{ width: `${likelihoodtoConvertData}%` }}
        >
          {likelihoodtoConvertData}%
        </div>
      </div>
    </div>

    {/* img */}
    <div className="ml-10">
      <img className="w-40 h-40" src="/src/assets/prospect.png" />
    </div>

</div>

{/* prospect information table */}
<div className="flex gap-9 p-3 ml-0">
  <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-5xl border border-gray-300">{/* prospect details card */}
   
      <div className="flex justify-between items-center mb-4 px-4 flex-wrap">
          <div className="font-bold text-md text-gray-900 mb-2 md:mb-0">
            Prospect Information
          </div>
          <button
            onClick={() => {
              setProspectDrawerOpen(true);
              setEditProspect(prospectData);
            }}
            className="opacity-80"
          >
            <img src="/src/assets/edit.png" alt="Edit" className="w-4 h-4" />
          </button>
    </div>


        {/* <hr className="border-b border-gray-300 w-220 ml-3"/> */}

    <div className="flex flex-col md:flex-row gap-4">
       {/* Left Table */}
    <div className="w-full md:w-1/2 overflow-x-auto rounded-sm overflow-hidden border border-white">
      <table className="min-w-full table-auto border border-white">
          <tbody>
             <tr className="border-b border-white">
               <td className="font-semibold px-4 py-2 text-blue-900">Name</td>
               <td className="px-4 py-2">{prospectNameData}</td>
            </tr>
             <tr className="border-b border-white">
               <td className="font-semibold px-4 py-2 text-blue-900">Prospect Type</td>
               <td className="px-4 py-2">{EnumClientType[prospectTypeData] || "Prospect Type Unavailable"}</td>
             </tr>
             <tr className="border-b border-white">
               <td className="font-semibold px-4 py-2 text-blue-900">Industry</td>
               <td className="px-4 py-2">{EnumIndustryType[prospectIndustryData] || "Industry Unavailable"}</td>
             </tr>
            <tr className="border-b border-white">
               <td className="font-semibold px-4 py-2 text-blue-900">Business Type</td>
               <td className="px-4 py-2">{EnumBusinessType[prospectBusinessTypeData] || "Business Type Unavailable"}</td>
            </tr>
            <tr className="border-b border-white">
               <td className="font-semibold px-4 py-2 text-blue-900">Source</td>
               <td className="px-4 py-2">{EnumClientSource[prospectSourceData] || "Source Unavailable"}</td>
            </tr>
            <tr>
              <td className="font-semibold px-4 py-2 text-blue-900">Referrel No</td>
              <td className="px-4 py-2">{prospectReferellData}</td>
            </tr>
        </tbody>
      </table>
    </div>

    {/* Right Table */}
  <div className="w-full md:w-1/2 overflow-x-auto rounded-sm overflow-hidden border border-white">
    <table className="min-w-full table-auto border border-white">
        <tbody>
        <tr className="border-b border-white">
            <td className="font-semibold px-4 py-2 text-blue-900">Referrer</td>
            <td className="px-4 py-2">{prospectreferrerData}</td>
            <button 
            className="text-sm text-blue-500 font-semibold mr-4 px-4 py-2"
            onClick={(event) => {
              fetchReferrerDetails(prospectreferrerData);
              toggleReferrerDrawerVisibility(true)(event);
            }}
            >View</button>

            <Drawer anchor="right" open={ReferreDrawerVisible} onClose={toggleReferrerDrawerVisibility(false)}>
               <Box sx={{ width: 400 }} role="presentation" onClick={toggleReferrerDrawerVisibility(false)} onKeyDown={toggleReferrerDrawerVisibility(false)}>
               </Box>

               <CardContent>
                    {referrerData ? (
                      <div className="mr-2 ml-8 mt-2">
                        <h2 className="text-xl font-semibold text-center mb-7 text-red-700">
                          Referrer Details
                        </h2>
                        <table className="w-full text-base text-left border border-gray-300">
                          <tbody>
                            <tr className="border-b border-gray-300">
                              <td className="font-semibold text-blue-900 p-3">Name</td>
                              <td className="p-3">{referrerData.name}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="font-semibold text-blue-800 p-3">Industry</td>
                              <td className="p-3">
                                {EnumIndustryType[referrerData.industry] || referrerData.industry}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="font-semibold text-blue-900 p-3">Business Type</td>
                              <td className="p-3">
                                {EnumBusinessType[referrerData.businessType] || referrerData.businessType}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="font-semibold text-blue-900 p-3">Source</td>
                              <td className="p-3">
                                {EnumClientSource[referrerData.source] || referrerData.source}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="font-semibold text-blue-900 p-3">Prospect Type</td>
                              <td className="p-3">
                                {EnumClientType[referrerData.prospectType] || referrerData.prospectType}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="font-semibold text-blue-900 p-3">Latitude</td>
                              <td className="p-3">{referrerData.latitude}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold text-blue-900 p-3">Longitude</td>
                              <td className="p-3">{referrerData.longitude}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-red-700">Referrer Details are not available</p>
                    )}
               </CardContent>

            </Drawer>

          </tr>
          <tr className="border-b border-white">
            <td className="font-semibold px-4 py-2 text-blue-900">Created At</td>
            <td className="px-4 py-2">
              {new Date(prospectCreatedAtData).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
              </td>
          </tr>
          <tr className="border-b border-white">
            <td className="font-semibold px-4 py-2 text-blue-900">First Contacted on</td>
            <td className="px-4 py-2"> 
              {new Date(prospectFirstContactData).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</td>
          </tr>
          <tr className="border-b border-white">
            <td className="font-semibold px-4 py-2 text-blue-900">Last Contacted on</td>
            <td className="px-4 py-2">
              {new Date(prospectLastContactData).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</td>
          </tr>
          <tr className="border-b border-white">
            <td className="font-semibold px-4 py-2 text-blue-900">Next Follow-up</td>
            <td className="px-4 py-2">
              {new Date(prospectNextFollowupData).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</td>
          </tr>
        </tbody>
    </table>
  </div>

   {/* <div className="">
        {prospectData && (
          <div className="bg-gray-100 p-4 rounded shadow space-y-2">
            <p><strong>Name:</strong> {prospectData.name}</p>
            <p><strong>Email:</strong> {prospectData.email}</p>
            <p><strong>Phone:</strong> {prospectData.phone}</p>

          </div>
    )}
  </div> */}

    </div>
     {/* <div className="flex">
              <button 
              onClick={() => 
                {
                  setProspectDrawerOpen(true);
                  setEditProspect(prospectData); // edit 
                }}
              >
                <img src="/src/assets/edit.png" alt="pros" className="w-5 h-5 ml-200 mt-1 opacity-50" />
              </button>
        </div> */}
  </div>
</div>

  {/* map */}
  <div className="flex gap-9 p-3 ml-0">
  <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-5xl border border-gray-300">
       <div className="display-flex mt-2">
        <button className="mb-1 text-white bg-blue-700 w-25 h-6 rounded-lg font-bold text-sm ml-6" onClick={openMap}>View Map</button>
       <div className="flex items-center gap-1">
          <p className="mb-2 text-gray-700 font-semibold ml-6">Coordinates:</p>
          <div className="flex items-center gap-1 mt-1">
                <p className="mb-2 text-gray-700 ml-3">{prospectLatitude}</p>
                <p className="mb-2 text-gray-700 ml-3">,</p>
                <p className="mb-2 text-gray-700 ml-3">{prospectLongitude}</p>
             </div>
             {/* <div className="flex items-center gap-1 mt-2">
                <button className="mb-4 text-green-700 font-bold text-sm ml-80" onClick={openMap}>View Map</button>
             </div> */}
      </div>

                <div className="map-container ml-0 mb-0 mt-4">
                    {isLoaded && hasCoordinates ? (
                      <GoogleMap
                        mapContainerStyle={containerStyle2}
                        center={center}
                        zoom={13}
                        onLoad={onLoad2}
                        onUnmount={onUnmount2}
                      >
                        <Marker position={center} />
                      </GoogleMap>
                    ) : (
                      <div>Loading Map</div>
                    )}
                  </div> 
       </div>
  </div>
  </div>

<div className="flex gap-9 p-3">
   <div className="bg-white shadow-lg rounded-lg p-3 w-1/3 w-74 border border-gray-300">{/* activity log */}
      <div className="flex justify-between pb-2"
           onClick={toggleProductDrawerVisibility(true)}>
               <span className="font-bold mt-4 ml-3 mb-3">Activity Log</span>
               {/* <button className="btn-log">⋮</button> */}
               <img src="/src/assets/activity.png" alt="Edit" className="w-8 h-8 mt-3 mr-4 opacity-50" />
      </div>

{/* Right Drawer for activity log */}
     <Drawer anchor="right" open={ProductDrawerVisible} onClose={toggleProductDrawerVisibility(false)}>
        <Box sx={{ width: 500 }} role="presentation" onClick={toggleProductDrawerVisibility(false)} onKeyDown={toggleProductDrawerVisibility(false)}>
        </Box>

  <div className="flex flex-col gap-4 p-4">
    <h2 className="font-bold text-xl text-blue-900 ml-10 mt-3">Activity Log</h2>
      <CardContent className="p-4">{/* drawer card content to show the activity lgo details */}
        <div className="p-4 w-80">
             {engagementData.length > 0 ? (
                 <div className="space-y-4">
                      {engagementData.map((engagement, index) => {
                       // Determine the navigation path dynamically
                       let navigationPath = "/CallLog"; // Default path
                       if (engagement.summary.includes("feedback")) {
                       navigationPath = "/FeedbackLog";
                       } else if (engagement.summary.includes("Meeting")) {
                       navigationPath = "/MeetingLog";
                       }

                      return (
                        <div key={index} className="bg-gray-30 p-4 w-100 rounded shadow">
                            <p>{engagement.summary}</p>
                               <Button
                               variant="outlined"
                               color="primary"
                               className="more-btn"
                               sx={{ marginLeft: "16rem", marginTop: "1.5rem", textTransform: "none" }}
                               onClick={() => navigate(navigationPath)} // Navigate dynamically
                              >View More
                              </Button>
                        </div>
                      );
                  })}
                 </div>
        ) : (
          <p>No Activity log history found.</p>
        )}
      </div>
    </CardContent>
  </div>

     </Drawer>
  </div>


<div className="bg-white shadow-lg rounded-lg p-2 w-1/3 w-74 border border-gray-300">{/* contact persons */}
   <div className="flex justify-between pb-2"
        onClick={handleToggleDrawer(true)}>
           <span className="font-bold mt-5 ml-3 mb-2">Contact Persons</span>
           {/* <button className="btn-log">⋮</button> */}
           <img src="/src/assets/contactP.png" alt="Edit" className="w-8 h-8 mt-4 mr-4 opacity-50" />
   </div>
        {/* Right Drawer */}
        <Drawer anchor="right" open={isDrawerOpen} onClose={handleToggleDrawer(false)}>
          <Box sx={{ width: 470 }} role="presentation" onClick={handleToggleDrawer(false)} onKeyDown={handleToggleDrawer(false)}>
          </Box>
        <div className="flex flex-col gap-4 p-4">
          <div className="header-container">
           <h2 className="font-bold text-xl text-blue-900 ml-10 mt-4">Contact Persons</h2>

           {/* Button to open the form inside the drawer */}
           {!showForm && (
              <Button variant="contained"  onClick={() => setShowForm(true)}
              sx={{width: '5rem',
                height: '2rem', 
                minWidth: '5rem', 
                borderRadius:'6px',
                backgroundColor: 'darkblue', 
                marginLeft:'10rem',
                marginTop:'1rem',
                textTransform: 'none',
                padding: 0 }}>Add New</Button>
            )}
          </div>
          {/* add new contact person form - section A */}
          {showForm && (
              <SectionA
              onClose={() => {
                setShowForm(false);
                setEditContactPerson(null);
              }}
                prospectID={prospectID} //prospectID
                onContactPersonAdded={() => fetchContactPersons(prospectID)} //refresh function
                editContactPerson={editContactPerson} // pass the edit contact person data
                scrollRef={formRef}//scroll to top
              />
            )}
            <div className="p-4 w-80"> {/* contact person list fetched from API */}
                {contactPersons.length > 0 ? (
                  <div className="space-y-4">
                    {contactPersons.map((person, index) => (
                      <div key={index} className="bg-gray-50 p-4 w-100 rounded shadow ml-2">
                        <div className="flex mb-6">
                        <button className="text-blue-500 font-regular ml-70 mr-4"
                         onClick={() => {
                          setShowForm(true);
                          setEditContactPerson(person); // edit contact persons
                        }}
                        >Edit</button>
                         <button className="text-red-500 font-regular"
                         onClick={async () => {
                          try {

                            console.log("Attempting to deactivate contact person:", person);

                            await SectionD.deactivateContactPerson(person);
                            console.log("Deactivation response:", response);

                            await fetchNewContactPersons(prospectID); //refresh the list
                            console.log("refresh response:", response);
                            
                          alert("contact person deactivated");
                          }catch (error){
                            alert("failed to deactivate contact person");
                          }
                         }}>
                          Delete</button>
                         </div>
                        <p><strong>Name:</strong> {person.title} {person.name}</p>
                        <p><strong>Designation:</strong> {person.designation}</p>
                        <p><strong>Gender:</strong> {person.gender}</p>
                        <p><strong>NIC:</strong> {person.nic}</p>
                        <p><strong>Birth Date:</strong> {new Date(person.birthDate).toLocaleDateString()}</p>
                        <p><strong>Contacts:</strong> {person.contact01}, {person.contact02}</p>
                        <p><strong>Emails:</strong> {person.email01}, {person.email02}</p>
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="ml-2">No contact persons found.</p>
                )}
            </div>
            {/* section B - refreshed list of contact persons after adding */}
            {showSectionB && (
              <SectionB/>
            )}
            
        </div>
      </Drawer>
</div>

<div className="bg-white shadow-lg rounded-lg p-3 w-1/3 w-74 border border-gray-300">{/* phones */}
   <div className="flex justify-between pb-2"
        onClick={togglePhoneDrawerVisibility(true)}>
          <span className="font-bold mt-4 ml-3">Phones</span>
          {/* <button className="btn-log">⋮</button> */}
          <img src="/src/assets/phoness.png" alt="Edit" className="w-8 h-8 mt-3 mr-4 opacity-50" />
   </div>
        {/* Right Drawer */}
        <Drawer anchor="right" open={phoneDrawerVisible} onClose={togglePhoneDrawerVisibility(false)}>
        <Box sx={{ width: 480 }} role="presentation" onClick={togglePhoneDrawerVisibility(false)} onKeyDown={togglePhoneDrawerVisibility(false)}>
        </Box>
        <div className="flex flex-col gap-4 p-4">
        <div className="header-container">
        <h2 className="font-bold text-xl text-blue-900 ml-10 mt-3">Phones</h2>
        {/* Button to open the form inside the drawer */}
        {!showPhoneForm && (
            <Button variant="contained"  onClick={() => setShowPhoneForm(true)}
              sx={{width: '5rem',
                height: '2rem', 
                minWidth: '5rem', 
                borderRadius:'6px',
                backgroundColor: 'darkblue', 
                marginLeft:'15rem',
                marginTop:'1rem',
                textTransform: 'none',
                padding: 0 }}>Add New</Button>
            )}
          </div>
          {/* form to add new phones */}
          {showPhoneForm && (
              <Section1
                onClose={() => {
                  setShowPhoneForm(false);
                  setEditProspectPhone(null);
                }}
                prospectID={prospectID} //prospectID
                onProspectPhoneAdded={() => fetchProspectPhones(prospectID)} //refresh function
                editProspectPhone={editProspectPhone} //pass edit prospect phone 
                scrollRef={formRef}//scroll to top
              />
            )}
            <div className="p-4 w-100 ml-2">{/* list of phones fetched from API */}
               {phoneData.length > 0 ? (
                 <div className="space-y-4">
                  {phoneData.map((phone, index) => (
                    <div key={index} className="bg-gray-50 p-4 w-100 rounded shadow">
                      <div className="flex mb-6">
                      <button className="text-blue-500 font-regular ml-70 mr-4"
                      onClick={() => {
                        setShowPhoneForm(true);
                        setEditProspectPhone(phone); // edit prospect phone
                      }}
                      >Edit</button>

                        <button className="text-red-500 font-regular"
                         onClick={async () => {
                          try {

                            console.log("Attempting to deactivate phone:", phone);

                            await Section4.deactivatePhones(phone);
                            console.log("Deactivation response:", response);

                            await fetchNewPhones(prospectID); //refresh the list
                            console.log("refresh response:", response);
                            
                          alert("phone deactivated");
                          }catch (error){
                            alert("failed to deactivate phone");
                          }
                         }}>
                          Delete</button>
                          </div>

                    <p><strong>Phone:</strong> {phone.phone}</p>
                   <p><strong>Type:</strong> {EnumContactType[phone.phoneType]}</p>
                   </div>
                 ))}
                 </div>
          ) : (
              <p className="ml-2">No phone numbers found.</p>
             )}
            </div>

        {/* section 2 - refreshed list of prospect Phones after adding */}
        {showSection2 && (
              <Section2/>
            )}

        </div>
        </Drawer>
</div>
</div>


<div className="flex gap-9 p-3 mb-2">
    <div className="bg-white shadow-lg rounded-lg p-3 w-1/3 w-74 border border-gray-300">{/* emails */}
        <div className="flex justify-between pb-2"
             onClick={toggleEmailDrawerVisibility(true)}>
                <span className="font-bold mt-4 ml-3 mb-3">Email Addresses</span>
               {/* <button className="btn-log">⋮</button> */}
               <img src="/src/assets/email.png" alt="Edit" className="w-8 h-8 mt-3 mr-4 opacity-50" />
        </div>
        {/* Right Drawer */}
        <Drawer anchor="right" open={EmailDrawerVisible} onClose={toggleEmailDrawerVisibility(false)}>
        <Box sx={{ width: 480 }} role="presentation" onClick={toggleEmailDrawerVisibility(false)} onKeyDown={toggleEmailDrawerVisibility(false)}>
        </Box>
        <div className="flex flex-col gap-4 p-4">
        <div className="header-container">
        <h2 className="font-bold text-xl text-blue-900 ml-10 mt-3">Email Addresses</h2>
        {/* Button to open the form inside the drawer */}
         {!showEmailForm && (
            <Button variant="contained"  onClick={() => setShowEmailForm(true)}
              sx={{width: '5rem',
                height: '2rem',       
                minWidth: '5rem',
                borderRadius:'6px',
                backgroundColor: 'darkblue',
                marginLeft:'10rem',
                marginTop:'1rem',
                textTransform: 'none',
                padding: 0 }}>Add New</Button>
            )}
        </div>

          {/* form to add new emails */}
          {showEmailForm && (
              <AddEmail
              onClose={() => {
                setShowEmailForm(false);
                setEditProspectEmail(null);
              }}
              prospectID={prospectID} //prospectID
              onProspectEmailAdded={() => fetchProspectEmails(prospectID)} //refresh function
              editProspectEmail={editProspectEmail} //pass edit prospect email
              scrollRef={formRef}//scroll to top
              />
            )}
              <div className="p-4 w-100 ml-2">{/* list of emails fetched from API */}
              {emailData.length > 0 ? (
                  <div className="space-y-4">
                  {emailData.map((email, index) => (
                  <div key={index} className="bg-gray-50 p-4 w-100 rounded shadow">
                  <div className="flex mb-6">
                  <button className="text-blue-500 font-regular ml-70 mr-4"
                  onClick={() => {
                    setShowEmailForm(true);
                    setEditProspectEmail(email); // edit prospect email
                  }}
                  >Edit</button>
                  <button className="text-red-500 font-regular"
                         onClick={async () => {
                          try {

                            console.log("Attempting to deactivate address:", email);

                            await DeleteEmail.deactivateProspectEmail(email);
                            console.log("Deactivation response:", response);

                            await fetchNewEmails(prospectID); //refresh the list
                            console.log("refresh response:", response);
                            
                          alert("address deactivated");
                          }catch (error){
                            alert("failed to deactivate address");
                          }
                         }}>
                          Delete</button>
                          </div>
                  <p><strong>Email:</strong> {email.email}</p>
                  <p><strong>Type:</strong> {email.emailType === 1 ? "Work" : "Personal"}</p>
                  </div>
                 ))}
                   </div>
              ) : (
                 <p className="ml-2">No email addresses found.</p>
               )}
              </div>

          {/* section 2 - refreshed list of prospect emails after adding */}
           {showRefreshEmail && (
              <RefreshEmail/>
            )}
        </div>

      </Drawer>
    </div>

   <div className="bg-white shadow-lg rounded-lg p-3 w-1/3 w-74 border border-gray-300">{/* addresses */}
      <div className="flex justify-between pb-2"
           onClick={toggleAddressDrawerVisibility(true)}>
          <span className="font-bold mt-4 ml-3">Addresses</span>
          {/* <button className="btn-log">⋮</button> */}
          <img src="/src/assets/address.png" alt="Edit" className="w-8 h-8 mt-3 mr-4 opacity-50" />
      </div>
         {/* Right Drawer */}
         <Drawer anchor="right" open={AddressDrawerVisible} onClose={toggleAddressDrawerVisibility(false)}>
        <Box sx={{ width: 500 }} role="presentation" onClick={toggleAddressDrawerVisibility(false)} onKeyDown={toggleAddressDrawerVisibility(false)}>
        </Box>
        <div className="flex flex-col gap-4 p-4">
          <div className="header-container">
          <h2 className="font-bold text-xl text-blue-900 ml-10 mt-3">Addresses</h2>
              {/* Button to open the form inside the drawer */}
              {!showEmailForm && (
                  <Button variant="contained"  onClick={() => setShowAddressForm(true)}
                    sx={{width: '5rem',
                      height: '2rem',       
                      minWidth: '5rem',
                      borderRadius:'6px',
                      backgroundColor: 'darkblue',
                      marginLeft:'15rem',
                      marginTop:'1rem',
                      textTransform: 'none',
                      padding: 0 }}>Add New</Button>
                  )}
            </div>

            {/* form to add new addresses */}
            {showAddressForm && (
              <AddAddress
              onClose={() => {
                setShowAddressForm(false);
                setEditProspectAddress(null);
              }}
              prospectID={prospectID} //prospectID
              onProspectAddressAdded={() => fetchProspectAddress(prospectID)} //refresh function
              editProspectAddress={editProspectAddress} //pass edit prospect email
              scrollRef={formRef}//scroll to top
              />
            )}
            <div className="p-4 w-100 ml-5">{/* list of addresses fetched from API */}
                  {addressData.length > 0 ? (
                    <div className="space-y-4">
                      {addressData.map((address, index) => (
                        <div key={index} className="bg-gray-50 p-4 w-100 rounded shadow">
                          <div className="flex mb-6">
                            <button className="text-blue-500 font-regular ml-70 mr-4"
                            onClick={() => {
                              setShowAddressForm(true);
                              setEditProspectAddress(address); // edit prospect address
                            }}
                            >Edit</button>
                            <button className="text-red-500 font-regular"
                         onClick={async () => {
                          try {

                            console.log("Attempting to deactivate address:", address);

                            await DeleteAddress.deactivateProspectAddress(address);
                            console.log("Deactivation response:", response);

                            await fetchNewAddresses(prospectID); //refresh the list
                            console.log("refresh response:", response);
                            
                          alert("address deactivated");
                          }catch (error){
                            alert("failed to deactivate address");
                          }
                         }}>
                          Delete</button>
                          </div>
                          <p><strong>Address:</strong> {address.add1}, {address.add2}, {address.add3}</p>
                          <p><strong>City:</strong> {address.city}, {address.province} {address.postalCode}</p>
                          <p><strong>Coordinates:</strong> {address.latitude}, {address.longitude}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="ml-2">No addresses found.</p>
                  )}
              </div>
              {/* section 2 - refreshed list of prospect addresses after adding */}
              {showRefreshAddress && (
                    <RefreshAddress/>
                  )}
       </div>
      </Drawer>
   </div>

   {/* <div>
        <button onClick={openMap}>View Map</button>
    </div> */}

{/* <div className="bg-white shadow-lg rounded-lg p-3 w-1/3 w-70 border border-gray-300">
<div className="flex justify-between pb-2"
onClick={toggleProductDrawerVisibility(true)}>
          <span className="font-bold mt-4 ml-3">Engagement History</span>
          <button className="btn-log">⋮</button>
        </div>

        <Drawer anchor="right" open={ProductDrawerVisible} onClose={toggleProductDrawerVisibility(false)}>
        <Box sx={{ width: 500 }} role="presentation" onClick={toggleProductDrawerVisibility(false)} onKeyDown={toggleProductDrawerVisibility(false)}>
        </Box>

        <div className="flex flex-col gap-4 p-4">
        <h2 className="font-bold text-xl text-blue-900 ml-10 mt-3">Engagement History</h2>

    <CardContent className="p-4">
      <div className="p-4 w-80">
        {engagementData.length > 0 ? (
          <div className="space-y-4">
            {engagementData.map((engagement, index) => (
              <div key={index} className="bg-gray-30 p-4 w-100 rounded shadow">
                <p><strong>Summary: </strong>{engagement.summary}</p>
                <p><strong>Engagement Date:</strong> {new Date(engagement.engagementDoneAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No engagement history found.</p>
        )}
      </div>
    </CardContent>

</div>

      </Drawer>
</div> */}

</div>
</div>
</div>

{/* Drawer Background Overlay to register new prospects*/}
  {/* <div className={`overlay ${isOpen ? "show" : ""}`}
       onClick={() => setIsOpen(false)}
  ></div> */}

      {/* Sliding Drawer - register new prospect */}
      {/* <div className={`drawer ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>
        <div className="prospect-form-container bg-white w-120 mr-2 ml-6 bg-blue-50 p-4 rounded">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <>
                <h1 className="font-bold text-xl text-blue-900 ml-0 mt-1 mb-7">
                  Prospect Registration
                </h1>
                <div>
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
                    <label htmlFor="prospectID">ID</label>
                    <input
                      {...register("prospectID")}
                      id="prospectID"
                      className="border p-2 rounded"
                      placeholder="ID"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="referralNo">Referral No.</label>
                    <input
                      {...register("referralNo")}
                      id="referralNo"
                      className="border p-2 rounded"
                      placeholder="Referral No."
                    />
                  </div>
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
                    <label htmlFor="firstContactDate">First Contact Date</label>
                    <input
                      type="date"
                      {...register("firstContactDate")}
                      id="firstContactDate"
                      className="border p-2 rounded"
                    />
                  </div>
                  {errors.firstContactedDate && <p className="text-red-500 text-sm">First Contact Date is required</p>}

                  <div className="form-group">
                    <label htmlFor="createdAt">Created At</label>
                    <input
                      type="date"
                      {...register("createdAt")}
                      id="createdAt"
                      className="border p-2 rounded"
                    />
                  </div>
                  {errors.createdAt && <p className="text-red-500 text-sm">Created Date is required</p>}
                  
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
                </div>
              </>
            )}
          </form>
        </div>
      </div> */}

      
    </>
  );
};

export default Prospect;
