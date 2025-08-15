import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import "./Lead.css";
import { Tooltip } from "react-tooltip";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import { set, useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import {
  EnumBusinessType,
  EnumClientType,
  EnumContactType,
  EnumIndustryType,
  EnumClientSource,
  EnumDealStage,
  EnumClientEngagementLevel,
} from "../../Constants";
import axios from "axios";
import { AddLeads } from "../../Components/Lead/Lead";
import { RefreshLeads } from "../../Components/Lead/Lead";
import { UpdateLead } from "../../Components/Lead/Lead";
import { DeleteLead } from "../../Components/Lead/Lead";

import { AddLeadContactPersons } from "../../Components/Lead/LeadContactPersons";
import { RefreshLeadContactPersons } from "../../Components/Lead/LeadContactPersons";
import { UpdateLeadContactPerson } from "../../Components/Lead/LeadContactPersons";
import { DeleteLeadContactPerson } from "../../Components/Lead/LeadContactPersons";
import { AddLeadPhone } from "../../Components/Lead/LeadPhones";
import { RefreshLeadPhone } from "../../Components/Lead/LeadPhones";
import { UpdateLeadPhone } from "../../Components/Lead/LeadPhones";
import { DeleteLeadPhone } from "../../Components/Lead/LeadPhones";
import { AddLeadEmail } from "../../Components/Lead/LeadEmails";
import { RefreshLeadEmail } from "../../Components/Lead/LeadEmails";
import { UpdateLeadEmail } from "../../Components/Lead/LeadEmails";
import { DeleteLeadEmail } from "../../Components/Lead/LeadEmails";
import { AddLeadAddress } from "../../Components/Lead/LeadAddress";
import { RefreshLeadAddress } from "../../Components/Lead/LeadAddress";
import { UpdateLeadAddress } from "../../Components/Lead/LeadAddress";
import { DeleteLeadAddress } from "../../Components/Lead/LeadAddress";

import { SelectProducts } from "../../Components/Lead/LeadInterestedProducts";
import { useSnackbar } from "../../Snackbars/SnackbarContext";


const apiUrl = import.meta.env.VITE_API_URL;

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
   height: '320px',
  marginLeft:'0rem',
  borderRadius:'7px'
};

const Lead = () => {
  const [leadList, setLeadList] = useState([]);
  const [leadID, setLeadID] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default value
  const itemRef = useRef(null); // Reference to an item for height calculation
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const menuRef = useRef(null);
  const [step, setStep] = useState(1);
  const [engagementLevel, setEngagementLevelData] = useState([]);
  const [likelihoodtoConvertData, setLikelihoodtoConvertData] = useState([]);
  const [leadSalesAgentData, setLeadSalesAgentData] = useState([]);
  
  const [leadData, setLeadData] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [phoneData, setPhoneData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [leadInterestedProducts, setLeadInterestedProducts] = useState([]);

  const [engagementData, setEngagementData] = useState([]);
  const [leadNameData, setLeadNameData] = useState([]);
  const [leadBusinessTypeData, setLeadBusinessTypeData] = useState([]);
  const [leadReferellData, setLeadReferellData] = useState([]);
  const [leadCreatedAtData, setLeadCreatedAtData] = useState([]);
  const [leadFirstContactData, setLeadFirstContactData] = useState([]);
  const [leadLastContactData, setLeadLastContactData] = useState([]);
  const [leadNextFollowupData, setLeadNextFollowupData] = useState([]);
  const [leadIndustryData, setLeadIndustryData] = useState([]);
  const [leadTypeData, setLeadTypeData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [leadreferrerData, setLeadreferrerData] = useState([]);
  const [leadLatitude, setLeadLatitude] = useState([]);
  const [leadLongitude, setLeadLongitude] = useState([]);
  const [referrerData, setReferrerData] = useState(null);

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
  
    // const lat = watch('latitude');
    // const lng = watch('longitude');
  
    // const onLoad = useCallback((map) => {
    //   const bounds = new window.google.maps.LatLngBounds(markerPosition);
    //   map.fitBounds(bounds);
    //   setMap(map);
    // }, [markerPosition]);

    // const onUnmount = useCallback(() => {
    //   setMap(null);
    // }, []);

    const onLoad2 = useCallback((mapInstance) => {
      setMap(mapInstance);
    }, []);
  
    const onUnmount2 = useCallback(() => {
      setMap(null);
    }, []);


  //map components
  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    setValue('latitude', clickedLat);
    setValue('longitude', clickedLng);
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
  };


//fetches lead data from an API 
  useEffect(() => {
    const getLead = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/Lead/GetLead`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
         body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        // console.log("leadList updated:", leadList);
        // setSnackbarMsg("");
        
        // setLeadList(data.resData || []);
        setLeadList((data.resData && Array.isArray(data.resData[0])) ? data.resData[0] : []);

        // showMessage('Leads fetched successfully', 'success');
        


      } catch (error) {
        console.error("Error fetching lead data:", error);
        // showMessage(error.message || 'Failed to fetch leads', 'error');
        
      }
    };
    getLead();


  }, []);


    // Function to calculate items per page based on window height
    const calculateItemsPerPage = () => {
      if (!itemRef.current) return 4; // Default if ref not attached yet
  
      const windowHeight = window.innerHeight;
      const itemHeight = itemRef.current.offsetHeight + 20; // Include margin
      return Math.max(Math.floor(windowHeight / itemHeight) + 7, 3); // Ensure at least 1 item
    };
  
    // Recalculate items per page after the first render
    useEffect(() => {
      const updateItemsPerPage = () => {
        setTimeout(() => {
          setItemsPerPage(calculateItemsPerPage());
        }, 100); // Small delay to ensure DOM update
      };
  
      updateItemsPerPage();
    }, [leadList]); // Recalculate when data changes
  
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
  
    const totalPages = Math.ceil(leadList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTeam = leadList.slice(
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

  //get lead info by double clicking
  const handleDoubleClick = async (id) => {
    setSelectedLeadId(id);
    setLeadID(id);

    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }), // Sending lead.id as payload
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log("Response Data:", data);

      // showMessage('Lead Infomation fetched successfully', 'success');

      

    //retrive data to the cards relavant to the lead
    var resdata = data.resData;


    //lead ID
    const leadID = resdata[0].id;
    setLeadID(leadID);
    console.log("ID");

     //leaddata to edit 
    const leadInfo = resdata[0];
    setLeadData(leadInfo);
    console.log("lead information:", leadInfo);


    //contact persons 
    const contactPersonsData = resdata[1].contacPersons;
    setContactPersons(contactPersonsData);
    console.log("Contact Persons Data");
    console.log(contactPersonsData);

    //lead interested products
    const leadInterestedProducts = resdata[1].interestedProducts;
    setLeadInterestedProducts(leadInterestedProducts);
    console.log("Interested Products");
    console.log(leadInterestedProducts);
    
    //addresses
    const leadAdress = resdata[1].addresses;
    setAddressData(leadAdress);
    console.log("ADdresses");
    console.log(leadAdress);

    //emails
    const leadEmail = resdata[1].emails;
    setEmailData(leadEmail);
    console.log("Emails");
    console.log(leadEmail);

    //phone
    // const leadPhone = resdata[1].phones;
    // setPhoneData(leadPhone);
    // console.log("Phones");
    // console.log(leadPhone);

    const leadPhone = resdata[1].phones;
    setPhoneData(leadPhone);
    console.log("Phones");
    console.log(leadPhone);

    //engagement 
    const leadEngagement = resdata[1].history;
    setEngagementData(leadEngagement);
    console.log("Engagement");
    console.log(leadEngagement);

    //engagement level 
    const leadEngagementLevel = resdata[0].engagementLevel;
    setEngagementLevelData(leadEngagementLevel);
    console.log("engagement level");
    console.log (leadEngagementLevel);

    //likelihood to convert
    const leadLikelihoodToConvert = resdata[0].likelihoodToClose;
    setLikelihoodtoConvertData(leadLikelihoodToConvert);
    console.log("likelihood to convert");
    console.log(leadLikelihoodToConvert);

    //sales agent 
    const leadSalesAgent = resdata[0].salesAgentID;
    setLeadSalesAgentData(leadSalesAgent);
    console.log("sales agent");
    console.log(leadSalesAgent);
    

    //lead info 
    const leadName = resdata[0].name;
    setLeadNameData(leadName);
    console.log("lead name");
    console.log(leadName);
    
    const leadBusinessType = resdata[0].businessType;
    setLeadBusinessTypeData(leadBusinessType);
    console.log("lead business type");
    console.log(leadBusinessType);

    const leadReferellNo = resdata[0].referrelNo;
    setLeadReferellData(leadReferellNo);
    console.log("referell no");
    console.log(leadReferellNo);

    // const leadCreatedAt = resdata[0].createdAt;
    // setLeadCreatedAtData(leadCreatedAt);
    // console.log("cretaed at");
    // console.log(leadCreatedAt);
    
    const leadFirstContact = resdata[0].firstContactedDate;
    setLeadFirstContactData(leadFirstContact);
    console.log("first contacted date");
    console.log(leadFirstContact);

    const leadLastContact = resdata[0].lastContactedDate;
    setLeadLastContactData(leadLastContact);
    console.log("first contacted date");
    console.log(leadLastContact);

    const leadNextFollowup = resdata[0].nextFollowUpDate;
    setLeadNextFollowupData(leadNextFollowup);
    console.log("next followup");
    console.log(leadNextFollowup);

    const leadIndustry = resdata[0].industry;
    setLeadIndustryData(leadIndustry);
    console.log("industry");
    console.log(leadIndustry);

    const leadType = resdata[0].leadType;
    setLeadTypeData(leadType);
    console.log("lead type");
    console.log(leadType);

    const leadSource = resdata[0].source;
    setLeadSourceData(leadSource);
    console.log("source");
    console.log(leadSource);

    const leadReferrer = resdata[0].referrer;
    setLeadreferrerData(leadReferrer);
    console.log("referrer");
    console.log(leadReferrer);

    const leadLatitude = resdata[0].latitude;
    setLeadLatitude(leadLatitude);
    console.log("latitude");
    console.log(leadLatitude);
    
    const leadLongitude = resdata[0].longitude;
    setLeadLongitude(leadLongitude);

    console.log(leadID);
    
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching prospect details:", error);
      // showMessage(error.message || 'Failed to fetch lead infomation', 'error');
     
    }
  };

  const navigate = useNavigate();

  // scrolling 
  const formRef = useRef(null);


  //refresh logic for the leads
  const fetchLeads = async () => {
    // console.log("Fetching prospects for lead ID:", id);
    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLead`, {
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

      console.log("leads:", data);

      const resdata = data.resData;
  
      const leadList = resdata[0];
      setLeadList(leadList);

    } catch (error) {
      console.error("Error fetching lead list:", error);
    }
  };

  //refresh logic for the contact person list
  const fetchLeadContactPersons = async (leadID) => {

    console.log("Fetching contact persons for prospect ID:", leadID);
    
    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLeadContactPerson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadID: leadID }),
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
  const fetchLeadPhones = async (leadID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLeadPhone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadID: leadID }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const resdata = data.resData;
  
      const leadPhone = resdata[0];
      setPhoneData(leadPhone);

    } catch (error) {
      console.error("Error fetching phone list:", error);
    }
  };

  //refresh logic for emails 
  const fetchLeadEmails = async (leadID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLeadEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadID: leadID }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const resdata = data.resData;
  
      const leadEmail = resdata[0];
      setEmailData(leadEmail);
    } catch (error) {
      console.error("Error fetching email list:", error);
    }
  };

  //refresh logic for address
  const fetchLeadAddress = async (leadID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLeadAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadID: leadID }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const resdata = data.resData;
  
      const leadAdress = resdata[0];
      setAddressData(leadAdress);

    } catch (error) {
      console.error("Error fetching address list:", error);
    }
  }

  //refresh logic for contact persons after deactivating
  const fetchNewContactPersons = async (leadID) =>{
    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLeadContactPerson`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ leadID: leadID }),
      });

      const data = await response.json();

      console.log("Contact person Data:", data);
      
      setContactPersons((data.resData || []).filter(person => person.status === 0)); // Filter out deactivated contact persons
    }catch (error){
      console.error("error fetching updated contact person list:", error);
    }
  };

  //refresh logic for address deactivation
  const fetchNewAddresses = async (leadID) => {
    try {
      const response = await fetch(`${apiUrl}/api/Prospect/GetProspectAddress`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadID: leadID }),
      });

      const data = await response.json();
      console.log("Address Data:", data);

      setAddressData((data.resData || []).filter(address => address.status === 0)); //filter deactivated addresses
    }catch (error){
      console.error("error fetching updated address list:", error);
    }
  };

  //refresh logic for email deactivation 
  const fetchNewEmails = async (leadID) =>{
    try {
      const response = await fetch(`${apiUrl}/api/Lead/GetLeadEmail`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ leadID: leadID }),
      });

      const data = await response.json();
      console.log("contact person data:", data);

      setEmailData((data.resData || []).filter(email => email.status === 0)); //filter out the inactive emails 
    }catch (error){
      console.error("error fetching updated email list", error);
    }
  };

  //refresh logic for phone deactivation
  const fetchNewPhones = async (leadID) =>{
    try{
      const response = await fetch(`${apiUrl}/api/Lead/GetLeadPhone`,{
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify({leadID:leadID}),
      });
      const data = await response.json();
      console.log("phone data:", data);

      setPhoneData((data.resData || []).filter(phone => phone.status === 0)); //filter out deactivated phones
      
    }catch (error){
      console.error("error fetching updated phone list:", error);
    }
  };

//map fetched from API
useEffect(() => {
  const fetchCoordinates = async () => {
    try {
      const response = await fetch('/api/Lead/GetLead'); 
      const data = await response.json();
      setLeadLatitude(data.latitude);
      setLeadLongitude(data.longitude);
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
  const url = `https://www.google.com/maps/dir/?api=1&destination=${leadLatitude},${leadLongitude}&zoom=${zoomLevel}`;
  // const zoomLevel = 18;
  // const url = `https://www.google.com/maps/search/?api=1&query=${prospectLatitude},${prospectLongitude}&zoom=${zoomLevel}`;
  window.open(url, '_blank');
}

const hasCoordinates = leadLatitude !== null && leadLongitude !== null;
const center = { lat: leadLatitude, lng: leadLongitude };

//fetching ref 
const fetchReferrerDetails = async (referrelNo) => {
  try{
    const response = await fetch (`${apiUrl}/api/Lead/GetLead`, {
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
    const referrerLead = resData[0];
    setReferrerData(referrerLead);


     console.log("referrer data:", data);

  }  catch (error){
    console.error("error fetchinf referrer details:", error);
  }
};

//drawers
const [LeadDrawerVisible, setLeadDrawerVisible] = React.useState(false);
const [isActivityDrawerOpen, setIsActivityDrawerOpen] = React.useState(false);
const [isCpersonsDrawerOpen, setIsCpersonsDrawerOpen] = React.useState(false);
const [phoneDrawerVisible, setPhoneDrawerVisible] = React.useState(false);
const [EmailDrawerVisible, setEmailDrawerVisible] = React.useState(false);
const [AddressDrawerVisible, setAddressDrawerVisible] = React.useState(false);
const [ProductDrawerVisible, setProductDrawerVisible] = React.useState(false);
const [ReferreDrawerVisible, setReferrerDrawerVisible] = React.useState(false);

//functions to toggle drawer 

const toggleLeadDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setLeadDrawerVisible(visible);
};

const handleActivityToggleDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setIsActivityDrawerOpen(open);
};

const handleCpersonToggleDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setIsCpersonsDrawerOpen(open);
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

const [editLeadContactPerson, setEditLeadContactPerson] = useState(null);
const [editLeadPhone, setEditLeadPhone] = useState(null);
const [editLeadEmail, setEditLeadEmail] = useState(null);
const [editLeadAddress, setEditLeadAddress] = useState(null);

const [editLead, setEditLead] = useState(null);

  
  return (
    <>
   <div className="lead-container">
      <div className="lead-card-container">{/* section 1 */}
                <div className="lead-search">{/* lead search */}
                  <input className="lead-search-input" />
                  <button
                    className="open-btn"
                    onClick={toggleLeadDrawerVisibility(true)}
                    data-tooltip-id="open-tooltip"
                    data-tooltip-content="Add New lead"
                  >+
                  </button>
                  <Tooltip id="open-tooltip" place="right-end" />

                {/* Right Drawer for registering leads */}
                <Drawer anchor="right" open={LeadDrawerVisible} onClose={toggleLeadDrawerVisibility(false)}>
                    <Box sx={{ width: 500 }} role="presentation" onClick={toggleLeadDrawerVisibility(false)} onKeyDown={toggleLeadDrawerVisibility(false)}>
                    </Box>

              <div className="flex flex-col gap-4 p-4">
                <h2 className="font-bold text-xl text-blue-900 ml-10 mt-3">Lead Registration</h2>
                  <CardContent className="p-4">{/* drawer card content to show the form to add new leads */}
                    <AddLeads
                      onClose={() => {
                    toggleLeadDrawerVisibility(false);
                    setEditLead(null);
                  }}
                  leadID={leadID} //leadID
                  onLeadAdded={() => fetchLeads()} //refresh function
                  editLead={editLead} //pass edit prospect phone
                    />

                </CardContent>
              </div>

                </Drawer>
                </div>
      
                <div className="lead-list">{/* lead name list */}
                  {displayedTeam.map((lead, index) => (
                    <div
                      key={index}
                      className={`lead-card ${selectedLeadId === lead.id ? "selected" : ""}`}
                      ref={index === 0 ? itemRef : null}
                      onDoubleClick={() => {
                        setSelectedLeadId(lead.id);
                        handleDoubleClick(lead.id);
                      }}
                    >
                       <div className="flex">
                      {/* <button>
                        <img src="/src/assets/edit2.png" alt="meeting" className="w-3 h-3 ml-38 mt-1 opacity-30" />
                      </button> */}
                      {/* <button>
                        <img src="/src/assets/del.png" alt="meeting" className="w-3 h-3 ml-45 mt-0 opacity-50" />
                      </button> */}
                      </div>
                      <h3 className="lead-name">{lead.name}</h3>
                      <div className="lead-sub-info">
                        <p className="lead-business">
                          {EnumBusinessType[lead.businessType] || "Unknown"}
                          &nbsp;&nbsp;/&nbsp;&nbsp;
                        </p>
                        <p className="lead-type">
                          {EnumClientType[lead.leadType] || "Unknown"}
                        </p>
                      </div>
                      {/* <div className="flex">
                      <button>
                        <img src="/src/assets/edit2.png" alt="meeting" className="w-3 h-3 ml-38 mt-1 opacity-30" />
                      </button>
                      <button>
                        <img src="/src/assets/del.png" alt="meeting" className="w-3 h-3 ml-43 mt-1 opacity-40" />
                      </button>
                      </div> */}
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

    {/* main content */}
    <div className="lead-div2">
        <button className="convert-into-customer-btn">Convert into Customer</button>

        {/* lead stats */}
        <div className="flex gap-9 p-3">
                {/* Sales Agent Card */}
                <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span className="font-bold">Sales Agent</span>
                    <span className="text-gray-500">{leadSalesAgentData}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-700">Ongoing Meeting</span>
                    <span className="text-red-700 text-lg">
                      01:15:23<span className="text-sm"></span>
                    </span>
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
                <div className="ml-3">
                <img className="w-35 h-35 mt-4" src="/src/assets/lead.png" />
                </div>
        </div>


        {/* lead information table */}
        <div className="flex gap-9 p-3 ml-0">
          <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-5xl border border-gray-300">{/* lead details card */}
             
             <div className="flex justify-between items-center mb-4 px-4 flex-wrap">
                <div className="font-bold text-md text-gray-900 mb-2 md:mb-0">
                  Lead Information
                </div>
                <button
                  onClick={() => {
                    setLeadDrawerVisible(true);
                    setEditLead(leadData); // edit
                  }}
                  className="opacity-80"
                >
                  <img src="/src/assets/edit.png" alt="Edit" className="w-4 h-4" />
                </button>
             </div>


            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Table */}
            <div className="w-full md:w-1/2 overflow-x-auto rounded-sm overflow-hidden border border-white">
              <table className="min-w-full table-auto border border-white">
                  <tbody>
                    <tr className="border-b border-white">
                      <td className="font-semibold px-4 py-2 text-blue-900">Name</td>
                      <td className="px-4 py-2">{leadNameData}</td>
                    </tr>
                    <tr className="border-b border-white">
                      <td className="font-semibold px-4 py-2 text-blue-900">Lead Type</td>
                      <td className="px-4 py-2">{EnumClientType[leadTypeData] || "Lead Type Unavailable"}</td>
                    </tr>
                    <tr className="border-b border-white">
                      <td className="font-semibold px-4 py-2 text-blue-900">Industry</td>
                      <td className="px-4 py-2">{EnumIndustryType[leadIndustryData] || "Industry Unavailable"}</td>
                    </tr>
                    <tr className="border-b border-white">
                      <td className="font-semibold px-4 py-2 text-blue-900">Business Type</td>
                      <td className="px-4 py-2">{EnumBusinessType[leadBusinessTypeData] || "Business Type Unavailable"}</td>
                    </tr>
                    <tr className="border-b border-white">
                      <td className="font-semibold px-4 py-2 text-blue-900">Source</td>
                      <td className="px-4 py-2">{EnumClientSource[leadSourceData] || "Source Unavailable"}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold px-4 py-2 text-blue-900">Referrel No</td>
                      <td className="px-4 py-2">{leadReferellData}</td>
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
                    <td className="px-4 py-2">{leadreferrerData}</td>
                    <button 
                    className="text-sm text-blue-500 font-semibold mr-4 px-4 py-2"
                    onClick={(event) => {
                      fetchReferrerDetails(leadreferrerData);
                      toggleReferrerDrawerVisibility(true)(event);
                    }}
                    >View</button>
                    {/* Right Drawer for referrer details */}
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
                  {/* <tr className="border-b border-white">
                    <td className="font-semibold px-4 py-2 text-blue-900">Created At</td>
                    <td className="px-4 py-2"></td>
                  </tr> */}
                  <tr className="border-b border-white">
                    <td className="font-semibold px-4 py-2 text-blue-900">First Contacted on</td>
                    <td className="px-4 py-2">
                      {/* {new Date(leadFirstContactData).toLocaleDateString('en-GB')} */}
                      {new Date(leadFirstContactData).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="font-semibold px-4 py-2 text-blue-900">Last Contacted on</td>
                    <td className="px-4 py-2">
                      {new Date(leadLastContactData).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="font-semibold px-4 py-2 text-blue-900">Next Follow-up</td>
                    <td className="px-4 py-2">
                      {new Date(leadNextFollowupData).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</td>
                  </tr>
                </tbody>
            </table>
          </div>

            </div>

            {/* <div className="flex mb-4">
              <div className="font-bold ml-4 text-md">
                Lead Information
              </div>
                <button 
                onClick={() => 
                  {
                    setLeadDrawerVisible(true);
                    setEditLead(leadData); // edit 
                  }}
                >
                  <img src="/src/assets/edit.png" alt="pros" className="w-4 h-4 ml-180 mt-1 opacity-80" />
                </button>
             </div> */}

            {/* <div className="flex">
              <button
               onClick={() => 
                {
                  setLeadDrawerVisible(true);
                  //setEditProspect(lead);  //edit 
                }}
              >
                <img src="/src/assets/edit.png" alt="meeting" className="w-4 h-4 ml-200 mt-1 opacity-50" />
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
                          <p className="mb-2 text-gray-700 ml-3">{leadLatitude}</p>
                          <p className="mb-2 text-gray-700 ml-3">,</p>
                          <p className="mb-2 text-gray-700 ml-3">{leadLongitude}</p>
                      </div>
                      {/* <div className="flex items-center gap-1 mt-2">
                          <button className="mb-4 text-green-700 font-bold text-sm ml-118" onClick={openMap}>View Map</button>
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
                                  <div>Loading Map...</div>
                                )}
                            </div> 
                </div>
            </div>
        </div>

            {/* cards */}
           <div className="flex gap-9 p-3">
            <div className="bg-white shadow-lg rounded-lg p-3 w-1/3 w-74 border border-gray-300">{/* activity log */}
                  <div className="flex justify-between pb-2"
                      onClick={handleActivityToggleDrawer(true)}
                      >
                          <span className="font-bold mt-4 ml-3 mb-3">Activity Log</span>
                          {/* <button className="btn-log">⋮</button> */}
                           <img src="/src/assets/activity.png" alt="Edit" className="w-8 h-8 mt-3 mr-4 opacity-50" />
                  </div>

            {/* Right Drawer for activity log */}
                <Drawer anchor="right" open={isActivityDrawerOpen} onClose={handleActivityToggleDrawer(false)}>
                    <Box sx={{ width: 500 }} role="presentation" onClick={handleActivityToggleDrawer(false)} onKeyDown={handleActivityToggleDrawer(false)}>
                    </Box>

              <div className="flex flex-col gap-4 p-4">
                <h2 className="font-bold text-xl text-gray-500 ml-5 mt-4">Activity Log</h2>
                  <CardContent className="p-4">{/* drawer card content to show the activity lgo details */}
                    <div className="p-4 w-80">
                        {engagementData.length > 0 ? (
                            <div className="space-y-4">
                                  {engagementData.map((engagement, index) => {
                                  // Determine the navigation path dynamically
                                  let navigationPath = "/CallLog"; // Default path
                                  if (engagement.summary.includes("feedback")) {
                                  navigationPath = "/Feedbacks";
                                  } else if (engagement.summary.includes("Meeting ended")) {
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
                      onClick={handleCpersonToggleDrawer(true)}>
                        <span className="font-bold mt-5 ml-3 mb-3">Contact Persons</span>
                        {/* <button className="btn-log">⋮</button> */}
                         <img src="/src/assets/contactP.png" alt="Edit" className="w-8 h-8 mt-4 mr-4 opacity-50" />
                </div>
                  {/* Right Drawer */}
                  <Drawer anchor="right" open={isCpersonsDrawerOpen} onClose={handleCpersonToggleDrawer(false)}>
                    <Box sx={{ width: 470 }} role="presentation" onClick={handleCpersonToggleDrawer(false)} onKeyDown={handleCpersonToggleDrawer(false)}>
                    </Box>
                  <div className="flex flex-col gap-4 p-4">
                    <div className="header-container">
                    <h2 className="font-bold text-xl text-gray-500 ml-5 mt-4">Contact Persons</h2>

                    {/* Button to open the form inside the drawer */}
                    {!showForm && (
                        <Button variant="contained"  onClick={() => setShowForm(true)}
                         sx={{width: '2rem',
                                height: '2rem',       
                                minWidth: '2rem',
                                borderRadius:'6px',
                                backgroundColor: 'darkblue',
                                marginLeft:'10rem',
                                marginRight:'1rem',
                                marginTop:'1rem',
                                fontSize: '1rem',
                                textTransform: 'none',
                                padding: 0 }}>+</Button>
                      )}
                    </div>
                    {/* add new contact person form - section 1 */}
                    {showForm && (
                        <AddLeadContactPersons
                        onClose={() => {
                          setShowForm(false);
                          setEditLeadContactPerson(null);
                        }}
                          leadID={leadID} //LeadID
                          onLeadContactPersonAdded={() => fetchLeadContactPersons(leadID)} //refresh function
                          editLeadContactPerson={editLeadContactPerson} // pass the edit contact person data
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
                                    setEditLeadContactPerson(person); // edit contact persons
                                  }}
                                  >Edit</button>
                                  <button className="text-red-500 font-regular"
                                  onClick={async () => {
                                    try {

                                      console.log("Attempting to deactivate contact person:", person);

                                      await DeleteLeadContactPerson.deactivateLeadContactPerson(person);
                                      console.log("Deactivation response:", response);

                                      await fetchNewContactPersons(leadID); //refresh the list
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
                        <RefreshLeadContactPersons/>
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
                <h2 className="font-bold text-xl text-gray-500 ml-5 mt-4">Phones</h2>
                {/* Button to open the form inside the drawer */}
                {!showPhoneForm && (
                    <Button variant="contained"  onClick={() => setShowPhoneForm(true)}
                      sx={{width: '2rem',
                                height: '2rem',       
                                minWidth: '2rem',
                                borderRadius:'6px',
                                backgroundColor: 'darkblue',
                                marginLeft:'10rem',
                                marginRight:'1rem',
                                marginTop:'1rem',
                                fontSize: '1rem',
                                textTransform: 'none',
                                padding: 0 }}>+</Button>
                    )}
                  </div>
                  {/* form to add new phones */}
                  {showPhoneForm && (
                      <AddLeadPhone
                        onClose={() => {
                          setShowPhoneForm(false);
                          setEditLeadPhone(null);
                        }}
                        leadID={leadID} //leadID
                        onLeadPhoneAdded={() => fetchLeadPhones(leadID)} //refresh function
                        editLeadPhone={editLeadPhone} //pass edit prospect phone 
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
                                setEditLeadPhone(phone); // edit lead phone
                              }}
                              >Edit</button>
        
                                <button className="text-red-500 font-regular"
                                onClick={async () => {
                                  try {

                                    console.log("Attempting to deactivate phone:", phone);

                                    await DeleteLeadPhone.deactivateLeadPhones(phone);
                                    console.log("Deactivation response:", response);

                                    await fetchNewPhones(leadID); //refresh the list
                                    console.log("refresh response:", response);
                                    
                                  alert("phone deactivated");
                                  }catch (error){
                                    alert("failed to deactivate phone");
                                  }
                                }}>
                                  Delete</button>
                                  </div>

                            <p><strong>Phone:</strong> {phone.phoneNo}</p>
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
                      <RefreshLeadPhone/>
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
                  <h2 className="font-bold text-xl text-gray-500 ml-5 mt-4">Email Addresses</h2>
                  {/* Button to open the form inside the drawer */}
                  {!showEmailForm && (
                      <Button variant="contained"  onClick={() => setShowEmailForm(true)}
                       sx={{width: '2rem',
                                height: '2rem',       
                                minWidth: '2rem',
                                borderRadius:'6px',
                                backgroundColor: 'darkblue',
                                marginLeft:'10rem',
                                marginRight:'1rem',
                                marginTop:'1rem',
                                fontSize: '1rem',
                                textTransform: 'none',
                                padding: 0 }}>+</Button>
                      )}
                  </div>

                    {/* form to add new emails */}
                    {showEmailForm && (
                        <AddLeadEmail
                        onClose={() => {
                          setShowEmailForm(false);
                          setEditLeadEmail(null);
                        }}
                        leadID={leadID}
                        onLeadEmailAdded={() => fetchLeadEmails(leadID)} //refresh function
                        editLeadEmail={editLeadEmail} //pass edit lead email
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
                              setEditLeadEmail(email); // edit lead email
                            }}
                            >Edit</button>
                            <button className="text-red-500 font-regular"
                                  onClick={async () => {
                                    try {

                                      console.log("Attempting to deactivate address:", email);

                                      await DeleteLeadEmail.deactivateLeadEmail(email);
                                      console.log("Deactivation response:", response);

                                      await fetchNewEmails(leadID); //refresh the list
                                      console.log("refresh response:", response);
                                      
                                    alert("address deactivated");
                                    }catch (error){
                                      alert("failed to deactivate address");
                                    }
                                  }}>
                                    Delete</button>
                                    </div>
                            <p><strong>Email:</strong> {email.emailAddress}</p>
                            <p><strong>Type:</strong> {EnumContactType[email.emailType]}</p>
                            </div>
                          ))}
                            </div>
                        ) : (
                          <p className="ml-2">No email addresses found.</p>
                        )}
                        </div>

                    {/* section 2 - refreshed list of prospect emails after adding */}
                    {showRefreshEmail && (
                        <RefreshLeadEmail/>
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
                    <h2 className="font-bold text-xl text-gray-500 ml-6 mt-4">Addresses</h2>
                        {/* Button to open the form inside the drawer */}
                        {!showEmailForm && (
                            <Button variant="contained"  onClick={() => setShowAddressForm(true)}
                             sx={{width: '2rem',
                                height: '2rem',       
                                minWidth: '2rem',
                                borderRadius:'6px',
                                backgroundColor: 'darkblue',
                                marginLeft:'10rem',
                                marginRight:'1.5rem',
                                marginTop:'1rem',
                                fontSize: '1rem',
                                textTransform: 'none',
                                padding: 0 }}>+</Button>
                            )}
                      </div>

                      {/* form to add new addresses */}
                      {showAddressForm && (
                        <AddLeadAddress
                        onClose={() => {
                          setShowAddressForm(false);
                          setEditLeadAddress(null);
                        }}
                        leadID={leadID} //leadID
                        onLeadAddressAdded={() => fetchLeadAddress(leadID)} //refresh function
                        editLeadAddress={editLeadAddress} //pass edit email
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
                                        setEditLeadAddress(address); // edit prospect address
                                      }}
                                      >Edit</button>
                                      <button className="text-red-500 font-regular"
                                  onClick={async () => {
                                    try {

                                      console.log("Attempting to deactivate address:", address);

                                      await DeleteLeadAddress.deactivateLeadAddress(address);
                                      console.log("Deactivation response:", response);

                                      await fetchNewAddresses(leadID); //refresh the list
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
                        {/* section 2 - refreshed list of lead addresses after adding */}
                        {showRefreshAddress && (
                              <RefreshLeadAddress/>
                            )}
                </div>
                </Drawer>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-3 w-1/3 w-74 border border-gray-300">{/* interested products */}
                <div className="flex justify-between pb-2"
                    onClick={toggleProductDrawerVisibility(true)}
                    >
                    <span className="font-bold mt-4 ml-3">Interested Products</span>
                    {/* <button className="btn-log">⋮</button> */}
                    <img src="/src/assets/iProduct.png" alt="Edit" className="w-8 h-8 mt-2 mr-4 opacity-50" />
                </div>

                {/* Right Drawer */}
                  <Drawer anchor="right" open={ProductDrawerVisible} onClose={toggleProductDrawerVisibility(false)}>
                  <Box sx={{ width: 500 }} role="presentation" onClick={toggleProductDrawerVisibility(false)} onKeyDown={toggleProductDrawerVisibility(false)}>
                  </Box>
                  <div className="flex flex-col gap-4 p-4">
                    <div className="header-container">
                    <h2 className="font-bold text-xl text-gray-500 ml-5 mt-4">Interested Products</h2>
                    {/* <hr className="border-b border-gray-200"/> */}
                        {/* Button to open the form inside the drawer */}
                        {!showEmailForm && (
                            <Button variant="contained"  
                            onClick={() => setShowEmailForm(true)}
                              sx={{width: '2rem',
                                height: '2rem',       
                                minWidth: '2rem',
                                borderRadius:'6px',
                                backgroundColor: 'darkblue',
                                marginLeft:'10rem',
                                marginRight:'1rem',
                                marginTop:'1rem',
                                fontSize: '1rem',
                                textTransform: 'none',
                                padding: 0 }}>+</Button>
                            )}
                      </div>
                      {/* details and forms */}

                      <SelectProducts
                      leadID={leadID} //leadID
                      />

                  <div className="p-4 w-100 ml-5">{/* list of emails fetched from API */}
                      {leadInterestedProducts.length > 0 ? (
                          <div className="space-y-4">
                          {leadInterestedProducts.map((product, index) => (
                          <div key={index} className="bg-gray-50 p-4 w-100 rounded shadow">
                          {/* <div className="flex mb-6">
                          <button className="text-blue-500 font-regular ml-70 mr-4"
                          onClick={() => {
                            setShowEmailForm(true);
                            setEditLeadEmail(email); // edit lead email
                          }}
                          >Edit</button>
                          <button className="text-red-500 font-regular"
                                onClick={async () => {
                                  try {

                                    console.log("Attempting to deactivate address:", email);

                                    await DeleteLeadEmail.deactivateLeadEmail(email);
                                    console.log("Deactivation response:", response);

                                    await fetchNewEmails(leadID); //refresh the list
                                    console.log("refresh response:", response);
                                    
                                  alert("address deactivated");
                                  }catch (error){
                                    alert("failed to deactivate address");
                                  }
                                }}>
                                  Delete</button>
                                  </div> */}
                          <p><strong>Product Name:</strong> {product.productName}</p>
                          <p><strong>Deal Stage:</strong> {EnumDealStage[product.dealStage]}</p>
                          {/* <p><strong>Catalogs:</strong> {product.catalogs}</p> */}
                          <div className="mt-4">
                             <strong className="text-white bg-green-700 px-3 py-1 rounded-full text-sm text-center inline-block">
                              Catalogs:
                            </strong>
                              {product.catalogs && product.catalogs.length > 0 ? (
                                <ul>
                                  {product.catalogs.map((catalog, index) => (
                                    <li key={index}>
                                      <p className="text-gray-600 ml-4"><strong className="text-gray-400">-</strong> {catalog.catalogName}</p>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-red-800 ml-4">No catalogs available.</p>
                              )}
                            </div>
                          </div>
                        ))}
                          </div>
                      ) : (
                        <p className="ml-2">No interested products found.</p>
                      )}
                    </div>

                </div>
                </Drawer>

            </div>

           </div>

    </div>
   </div>
   </>
  );
};

export default Lead;