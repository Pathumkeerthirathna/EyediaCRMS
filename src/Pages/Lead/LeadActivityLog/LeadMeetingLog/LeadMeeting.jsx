import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Tooltip } from "react-tooltip";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
    EnumBusinessType,
    EnumClientType,
    EnumIndustryType,
    EnumClientEngagementLevel,
    EnumFileType
} from "../../../../Constants";
import { useSnackbar } from "../../../../Snackbars/SnackbarContext";
import "./LeadMeeting.css";

import { AddLeadMeetings } from "../../../../Components/Lead/LeadMeetings";
import { AddParticipants } from "../../../../Components/Lead/LeadMeetings";
import { AddDiscussions } from "../../../../Components/Lead/LeadMeetings";
import { AddAttachments } from "../../../../Components/Lead/LeadMeetings";
import { AddDecisions } from "../../../../Components/Lead/LeadMeetings";
import { AddOutcomes } from "../../../../Components/Lead/LeadMeetings";
import { AddNotes } from "../../../../Components/Lead/LeadMeetings";


const apiUrl = import.meta.env.VITE_API_URL;

const LeadMeetingLog = () => {
    const [leadList, setLeadList] = useState([]);
    const [leadID, setLeadID] = useState([]);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [meetingID, setMeetingID] = useState(null);
    const [meetingLogData, setMeetingLogData] = useState([]);
    const [meetingLogResponseData, setMeetingLogResponseData] = useState([]);

    const [durationData, setDurationData]= useState([]);
    const [leadMeetingLogData, setLeadMeetingLogData] = useState([]);
    const [likelihoodtoConvertData, setLikelihoodtoConvertData] = useState([]);
    const [engagementLevel, setEngagementLevelData] = useState([]);

    const [meetingLocationData, setMeetingLocationData] = useState([]);
    const [meetingLatitudeData, setMeetingLatitudeData] = useState([]);
    const [meetingLogitudeData, setMeetingLongitudeData] = useState([]);
    const [meetingEngagedPerson, setMeetingEngagedPerson] = useState([]);
    const [meetingCount, setMeetingCount] = useState(0);


    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4); // Default value
    const itemRef = useRef(null); // Reference to an item for height calculation
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const menuRef = useRef(null);
    const [step, setStep] = useState(1);

    const [editLeadMeeting, setEditLeadMeeting] = useState(null);
    const [editParticipant, setEditParticipant] = useState(null);
    const [editDiscussion, setEditDiscussion] = useState(null);
    const [editNote, setEditNote] = useState(null);
    const [editAttachment, setEditAttachment] = useState(null);
    const [editDecision, setEditDecision] = useState(null);
    const [editOutcome, setEditOutcome] = useState(null);

    const [meetingParticipantData, setMeetingParticipantData] = useState([]);




    //drawers
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [participantDrawerOpen, setParticipantDrawerOpen] = useState(false);
    const [discussionDrawerOpen, setDisscussionDrawerOpen] = useState(false);
    const [notesDrawerOpen, setNoteDrawerOpen] = useState(false);
    const [attachmentDrawerOpen, setAttachmentDrawerOpen] = useState(false);
    const [decisionDrawerOpen, setDecisionDrawerOpen] = useState(false);
    const [outcomeDrawerOpen, setOutcomeDrawerOpen] = useState(false);

    //scrolling
     const locationSectionRef = useRef(null);
    
     //map
     const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: 'AIzaSyANMAlOFTy3Kn6aw7cGhHWejtI83Xdxmrg',
    });

    
 //functions to toggle drawer
 const handleToggleDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setIsDrawerOpen(open);
};

 const handleParticipantDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setParticipantDrawerOpen(open);
};

 const handleDiscussionDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setDisscussionDrawerOpen(open);
};

 const handleNoteDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setNoteDrawerOpen(open);
};

 const handleAttachmentDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setAttachmentDrawerOpen(open);
};

 const handleDecisionDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setDecisionDrawerOpen(open);
};

 const handleOutcomeDrawer = (open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setOutcomeDrawerOpen(open);
};


    //snackbars
    const { showMessage } = useSnackbar();

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
    
            showMessage('Leads fetched successfully', 'success');
    
        } catch (error) {
            console.error("Error fetching lead data:", error);
            showMessage(error.message || 'Failed to fetch leads', 'error');
            
        }
        };
        getLead();
    
    
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

// const navigate = useNavigate();

// Get Lead info by double clicking
const handleDoubleClick = async (id) => {
    setSelectedLeadId(id);
//   setSelectedCallLogID(id);
    setLeadID(id);
    try {
        // Fetch Prospect Info 
        const leadResponse = await fetch(`${apiUrl}/api/Lead/GetLead`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), 
        });

        if (!leadResponse.ok) {
        throw new Error(`HTTP error! Status: ${leadResponse.status}`);
        }

        const leadData = await leadResponse.json();
        console.log("lead Data:", leadData);
        

        const resData = leadData.resData;

        if (resData && resData.length > 0) {
        // Engagement level
        const leadEngagementLevel = resData[0].engagementLevel;
        setEngagementLevelData(leadEngagementLevel);
        console.log("Engagement Level:", leadEngagementLevel);

        // Likelihood to convert
        const leadLikelihoodToConvert = resData[0].likelihoodToClose;
        setLikelihoodtoConvertData(leadLikelihoodToConvert);
        console.log("Likelihood to Convert:", leadLikelihoodToConvert);

        } else {
        console.warn("No lead data found.");
        setEngagementLevelData(null);
        setLikelihoodtoConvertData(null);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }

    try{
        //fetch meeting logs
        const leadMeetingResponse = await fetch (`${apiUrl}/api/Meeting/GetLeadMeeting`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({leadID:id}),
        });

        if (!leadMeetingResponse.ok){
        throw new Error(`HTTP error! Status: ${leadMeetingResponse.status}`);
        }
        const leadMeetingData = await leadMeetingResponse.json();

        console.log("meetingData:", leadMeetingData);

        console.log("First meeting entry:", leadMeetingData.resData[0]);

        const resData = Array.isArray(leadMeetingData.resData[0]) ? leadMeetingData.resData[0] : leadMeetingData.resData;
        
        setMeetingLogData(resData || []);
        const meetingCount = resData ? resData.length : 0;
        setMeetingCount(meetingCount);
        console.log("Total meetings found:", meetingCount);


        console.log("setLeadMeetingLogData:", leadMeetingData.resData);
        

    }catch(error){
        console.error("error fetching data:", error);
    }
};

//fetch using id + lead ID
const handleMeetingDoubleClick = async (getMeetingLog) => {
setSelectedMeetingId(getMeetingLog.id);
setMeetingID(getMeetingLog.id);

const meetingLogRequest = {
  id: getMeetingLog.id,
  leadID: getMeetingLog.leadID
}

console.log(meetingLogRequest);

try{
  const meetingLogResponse = await fetch(`${apiUrl}/api/Meeting/GetLeadMeeting`, {
    method: "POST",
    headers: {"Content-Type" : "application/json",

    },
    body: JSON.stringify(meetingLogRequest)
  });

  const meetingLogResponseData = await meetingLogResponse.json();
  console.log("meeting log response:", meetingLogResponseData);

  if(!meetingLogResponse.ok){
    throw new Error (`HTTP error! Status:${meetingLogResponse.status}`);
  }

  console.log("meeting data retrieved:", meetingLogResponseData);
  setMeetingLogResponseData(meetingLogResponseData || []);

const resData = meetingLogResponseData.resData;

  if (resData && resData.length > 0) {
        // Engagement level
        const leadMeetingDuration = resData[0].duration;
        setDurationData(leadMeetingDuration);
        console.log("duration:", leadMeetingDuration);

        //location
        const meetingLocation = resData[0].location;
        setMeetingLocationData(meetingLocation);
        console.log("location:", meetingLocation);

        //latitude and logitude
        const meetingLatitude = resData[0].latitude;
        setMeetingLatitudeData(meetingLatitude);
        console.log("latitude:", meetingLatitude);
        
        const meetingLogitude = resData[0].longitude;
        setMeetingLongitudeData(meetingLogitude);
        console.log("logitude:", meetingLogitude);

        //engaged person
        const engagedPerson = resData[0].engagedSalesAgentID;
        setMeetingEngagedPerson(engagedPerson);
        console.log("engaged person:", engagedPerson);
        
        

      } else {
        console.warn("No duration data found.");
        setDurationData(null);

      }

}catch(error){
  console.error("error fetching meeting log data:", error);
}

};

//refresh logic for meeting list
const fetchLeadMeetingLogs = async (leadID) => {
try {
  const response = await fetch (`${apiUrl}/api/Meeting/GetLeadMeeting`, {
    method: "POST",
    headers: {"Content-Type" : "application/json",
    },

    body: JSON.stringify({leadID:leadID}),
  });

  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  const resdata = data.resData;

  console.log("leadID:", leadID);

  const LeadMeetingLogs = resdata[0];
  setMeetingLogData(LeadMeetingLogs);
  
}catch (error){
  console.error("error fetching meeting logs:", error);
}
};

//refresh logic for meeting list
const fetchMeetingParticipants = async (meetingID) => {
try {
  const response = await fetch (`${apiUrl}/api/Meeting/GetMeetingParticipants`, {
    method: "POST",
    headers: {"Content-Type" : "application/json",
    },

    body: JSON.stringify({meetingID:meetingID}),
  });

  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  const resdata = data.resData;

  console.log("meetingID:", meetingID);

  const LeadMeetingParticipants = resdata[0];
  setMeetingParticipantData(LeadMeetingParticipants);
  
}catch (error){
  console.error("error fetching meeting participantss:", error);
}
};



return (
    <>
    <div className="lead-meeting-container">
        <div className="lead-meeting-card-container">
            <div className="meeting-search">{/* lead search */}
                  <input className="meeting-search-input" />
                   <button
                    className="meeting-open-btn"
                    onClick={() => setIsDrawerOpen(true)}
                    data-tooltip-id="open-tooltip"
                    data-tooltip-content="Add New Meeting"
                    >+  
                    </button>
                    <Tooltip id="open-tooltip" place="right-end" />
                </div>
                {/* Right Drawer */}
                <Drawer anchor="right" open={isDrawerOpen} onClose={handleToggleDrawer(false)}>
                <Box sx={{ width: 550 }} role="presentation" onClick={handleToggleDrawer(false)} onKeyDown={handleToggleDrawer(false)}>
                </Box>
                <AddLeadMeetings
                 onClose={() =>{
                    setIsDrawerOpen(false);
                    setEditLeadMeeting(null);
                  }}
                leadID={selectedLeadId}
                onLeadMeetingAdded={()=> fetchLeadMeetingLogs(leadID)}
                editLeadMeeting={editLeadMeeting} //edit
                // onClose={() => setIsDrawerOpen(false)}
                
                />
                </Drawer>

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

        <div className="meeting-div2">
            <div className="header-container">
              <div className="header-div2">Lead Meetings</div>
            </div>

          {/*cards  */}
        <div className="flex gap-8 p-3">
            {/* meeting stats */}
            <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300 ml-1">
                    <div className="flex justify-between border-gray-300 pb-2">
                    <span className="font-bold text-gray-700">Meeting Duration</span>
                    <span className="text-red-600 text-lg font-semibold">{durationData}</span>
                </div>
                <div className="flex justify-between border-gray-300 pb-2">
                    <span className="font-bold text-gray-700">Engaged Sales Person</span>
                    <span className="text-gray-400 text-lg">{meetingEngagedPerson}</span>
                </div>
                <div className="card stat-row mt-7">
                <h4 className="font-semibold text-md">Total Meetings</h4>
                <p className="text-red text-lg text-blue-600 font-semibold">{meetingCount}</p>
                </div>
                
            </div>

            {/* Engagement & Likelihood Card */}
        <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300">
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
                <img className="w-37 h-40" src="/src/assets/meetingg.png" />
            </div>
        </div>

        <div className="flex flex-row gap-3 p-3 h-[500px]">
          
          {/* table */}
          <div
            className={`transition-all duration-500 ${
              meetingLogResponseData?.length > 0 ? "w-2/3" : "w-full"
            } bg-white shadow-md rounded-lg border border-gray-300 overflow-visible`}
          >
            <div className="flex justify-between items-center p-4">
              <div className="text-gray-800 font-bold">Meeting List</div>
              <button 
              onClick={() =>
                    locationSectionRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
              className="bg-blue-950 text-sm text-white w-38 h-7 rounded-lg font-semibold">See Location Details</button>
            </div>
        
            <div className="overflow-y-auto max-h-[500px] p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-2 text-left text-gray-600 font-normal">Date</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Meeting Title</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Location</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Engaged/P</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Duration</th>
                    {!isDrawerOpen && (
                      <th className="p-2 text-left text-gray-600 font-normal">Action</th>
                    )}
                  </tr>
                </thead>
                 <tbody>
                  {meetingLogData.length === 0 ? (
                    <tr>
                        {/* colSpan={isDrawerOpen ? 5 : 6} */}
                      <td className="p-2 text-gray-500 text-center">
                        No meeting logs available
                      </td>
                    </tr>
                  ) : (
                    meetingLogData.map((log, index) => {
                      const isSelected = selectedMeetingId === log.id;
                      return (
                        <tr
                          key={index}
                          onClick={() => {
                            handleMeetingDoubleClick(log);
                            setSelectedMeetingId(log.id);
                          }}
                          className={`cursor-pointer hover:bg-gray-100 ${isSelected ? 'selected2' : ''}`}
                          ref={index === 0 ? itemRef : null}
                        >
                          <td className="p-2 text-sm text-gray-700">{new Date(log.startedAt).toLocaleDateString()}</td>
                          <td className="p-2 text-md text-gray-700">{log.meetingTitle}</td>
                          <td className="p-2 text-md text-gray-700">{log.location}</td>
                          <td className="p-2 text-md text-gray-700">{log.engagedSalesAgentID}</td>
                          <td className="p-2 text-md text-gray-700">{log.duration}</td>
                          {!isDrawerOpen && (
                            <td className="p-2">
                              <button
                                className="text-sm text-yellow-500 hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDrawerOpen(true);
                                  setEditLeadMeeting(log);
                                }}
                              >
                                Update
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
        
              </table>
            </div>
          </div>
        
            {/* Optional detail panel - placeholder if you need to display side info */}
            <AnimatePresence>
            {meetingLogResponseData?.resData?.length > 0 && (
            <motion.div
                key="meeting-details"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-1/2 bg-white shadow-md rounded-lg border border-gray-300 p-6 overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Meeting Details</h2>
                <button
                    onClick={() => setMeetingLogResponseData({ resData: [] })}
                    className="bg-red-700 hover:bg-red-900 text-white text-sm px-3 py-1 text-sm rounded-lg shadow mt-1 h-6 w-6 flex items-center justify-center"
                >
                    X
                </button>
                </div>
                {/* <button 
                onClick={() =>
                    locationSectionRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                className="text-blue-800 text-sm font-semibold">See Location Details</button> */}

            {meetingLogResponseData.resData.map((item) => (
                <div key={item.id} className="space-y-4 text-sm">

                <p className="text-base text-gray-600 text-sm mt-3">
                    <strong>Description:</strong> {item.description}
                </p>

                <p className="text-base text-gray-600 text-sm mt-3">
                    <div className="flex">
                        <strong>Likelihood To Convert:</strong> <p className="ml-3 text-blue-800">{item.likelihoodToConvert}%</p>
                    </div> 
                </p>

                <p className="text-base text-gray-600 text-sm mt-3">
                    <strong>Engagement Level:</strong>{" "}
                    <span
                    className={`inline-block px-3 py-1 rounded-lg ml-4 text-sm font-medium ${
                        item.engagementLevel === 1
                        ? "bg-red-500 text-white"
                        : item.engagementLevel === 2
                        ? "bg-yellow-400 text-white"
                        : item.engagementLevel === 3
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                    >
                    {EnumClientEngagementLevel[item.engagementLevel]}
                    </span>
                </p>

                {/* participants */}
                {item.participants?.length > 0 && (
                    <div className="mt-5">
                    <div className="flex gap-5 mb-3">
                    <h2 className="text-base text-gray-700 font-semibold">Participants:</h2>
                    <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-32"
                    onClick={handleParticipantDrawer(true)}
                    >+</button>
                    </div>
                    <div className="space-y-2">
                        {item.participants.map((participant) => (
                        <div
                            key={participant.id}
                            className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-67 mr-1"
                        >
                            <div className="text-gray-800 font-medium">{participant.participantName}</div>
                            <div className="text-gray-500 text-sm">{participant.designation}</div>
                                <button
                              onClick={() => {
                                setParticipantDrawerOpen(true);
                                setEditParticipant(participant);
                              }}
                                >
                                <img src="/src/assets/edit.png" alt="meeting" className="w-3 h-3 ml-57 mt-1 opacity-60" />
                                </button>
                        </div>
                        ))}
                        {/* <img src="/src/assets/edit2.png" alt="meeting" className="w-7 h-7 ml-4 mt-1 opacity-80" /> */}
                    </div>
                    </div>
                )}

                
                <Drawer anchor="right" open={participantDrawerOpen} onClose={handleParticipantDrawer(false)}>
                    <Box sx={{ width: 430 }} role="presentation" onClick={handleParticipantDrawer(false)} onKeyDown={handleParticipantDrawer(false)}>
                    </Box>

                    <AddParticipants
                    meetingID={selectedMeetingId}
                    onParticipantAdded={()=> fetchMeetingParticipants(meetingID)}
                    onClose={() => setParticipantDrawerOpen(false)}
                    editParticipant={editParticipant} //edit

                    />
                    </Drawer>

                {/* discussions */}
                {item.discussions?.length > 0 && (
                    <div className="mt-5">
                    <div className="flex gap-5 mb-3">
                    <h2 className="text-base text-gray-700 font-semibold">Discussions:</h2>
                    <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-33"
                    onClick={handleDiscussionDrawer(true)}
                    >+</button>
                    </div>
                    <div className="space-y-2">
                        {item.discussions.map((discussion) => (
                        <div
                            key={discussion.id}
                            className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-67 mr-1"
                        >
                            <div className="text-gray-800 font-medium">{discussion.discussion}</div>
                            <button
                           onClick={() => {
                                setDisscussionDrawerOpen(true);
                                setEditDiscussion(discussion);
                              }}
                            >
                                <img src="/src/assets/edit.png" alt="meeting" className="w-3 h-3 ml-57 mt-1 opacity-60" />
                                </button>
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                <Drawer anchor="right" open={discussionDrawerOpen} onClose={handleDiscussionDrawer(false)}>
                    <Box sx={{ width: 430 }} role="presentation" onClick={handleDiscussionDrawer(false)} onKeyDown={handleDiscussionDrawer(false)}>
                    </Box>

                    <AddDiscussions
                    meetingID={selectedMeetingId}
                    onDiscussionAdded={()=> fetchMeetingParticipants(meetingID)}
                    onClose={() => setDisscussionDrawerOpen(false)}
                    editDiscussion={editDiscussion} //edit
                    />
                    </Drawer>

                {/* notes */}
                {item.notes?.length > 0 && (
                    <div className="mt-5">
                    <div className="flex gap-5 mb-3">
                    <h2 className="text-base text-gray-700 font-semibold">Notes:</h2>
                    <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-42"
                    onClick={handleNoteDrawer(true)}
                    >+</button>
                    </div>
                    <div className="space-y-2">
                        {item.notes.map((note) => (
                        <div
                            key={note.id}
                            className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-67 mr-1"
                        >
                            <div className="text-gray-800 font-medium">{note.note}</div>
                            <button
                            onClick={() => {
                                setNoteDrawerOpen(true);
                                setEditNote(note);
                              }}
                            >
                                <img src="/src/assets/edit.png" alt="meeting" className="w-3 h-3 ml-57 mt-1 opacity-60" />
                                </button>
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                <Drawer anchor="right" open={notesDrawerOpen} onClose={handleNoteDrawer(false)}>
                    <Box sx={{ width: 430 }} role="presentation" onClick={handleNoteDrawer(false)} onKeyDown={handleNoteDrawer(false)}>
                    </Box>

                    <AddNotes
                    meetingID={selectedMeetingId}
                    onNoteAdded={()=> fetchMeetingNotes(meetingID)}
                    onClose={() => setNoteDrawerOpen(false)}
                    editNotes={editNote} //edit
                    />
                </Drawer>

                {/* attachments */}
                {item.attachments?.length > 0 && (
                    <div className="mt-5">
                    <div className="flex gap-5 mb-3">
                    <h2 className="text-base text-gray-700 font-semibold">Attachments:</h2>
                    <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-30"
                    onClick={handleAttachmentDrawer(true)}
                    >+</button>
                    </div>
                    <div className="space-y-2">
                        {item.attachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-full max-w-sm mr-1 overflow-hidden"
                        >
                            <div
                            className="text-gray-800 font-medium truncate max-w-full"
                            title={attachment.fileName}
                            >
                            {attachment.fileName}
                            </div>
                            <div className="text-gray-800 font-medium">
                            {EnumFileType[attachment.fileType] || 'Unknown'}
                        </div>
                            <button
                          onClick={() => {
                                setAttachmentDrawerOpen(true);
                                setEditAttachment(attachment);
                              }}
                            >
                                <img src="/src/assets/edit.png" alt="meeting" className="w-3 h-3 ml-57 mt-1 opacity-60" />
                                </button>
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                <Drawer anchor="right" open={attachmentDrawerOpen} onClose={handleAttachmentDrawer(false)}>
                    <Box sx={{ width: 400 }} role="presentation" onClick={handleAttachmentDrawer(false)} onKeyDown={handleAttachmentDrawer(false)}>
                    </Box>

                    <AddAttachments
                    meetingID={selectedMeetingId}
                    onAttachmentAdded={()=> fetchMeetingAttachments(meetingID)}
                    onClose={() => setAttachmentDrawerOpen(false)}
                    editAttachment={editAttachment} //edit
                    />
                    
                </Drawer>

                {/* decisions */}
                {item.decisions?.length > 0 && (
                    <div className="mt-5">
                    <div className="flex gap-5 mb-3">
                    <h2 className="text-base text-gray-700 font-semibold">Decisions:</h2>
                    <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-35"
                    onClick={handleDecisionDrawer(true)}
                    >+</button>
                    </div>
                    <div className="space-y-2">
                        {item.decisions.map((decision) => (
                        <div
                            key={decision.id}
                            className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-67 mr-1"
                        >
                            <div className="text-gray-800 font-medium">{decision.decision}</div>

                            <button
                           onClick={() => {
                                setDecisionDrawerOpen(true);
                                setEditDecision(decision);
                              }}
                            >
                                <img src="/src/assets/edit.png" alt="meeting" className="w-3 h-3 ml-57 mt-1 opacity-60" />
                            </button>
                            
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                <Drawer anchor="right" open={decisionDrawerOpen} onClose={handleDecisionDrawer(false)}>
                    <Box sx={{ width: 400 }} role="presentation" onClick={handleDecisionDrawer(false)} onKeyDown={handleDecisionDrawer(false)}>
                    </Box>

                    <AddDecisions
                    meetingID={selectedMeetingId}
                    onDecisionAdded={()=> fetchMeetingDecisions(meetingID)}
                    onClose={() => setDecisionDrawerOpen(false)}
                    editDecision={editDecision} //edit
                    />
                </Drawer>

                {/* outcomes */}
                {item.outcomes?.length > 0 && (
                    <div className="mt-5">
                    <div className="flex gap-5 mb-3">
                    <h2 className="text-base text-gray-700 font-semibold">Outcomes:</h2>
                    <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-35"
                    onClick={handleOutcomeDrawer(true)}
                    >+</button>
                    </div>
                    <div className="space-y-2">
                        {item.outcomes.map((outcome) => (
                        <div
                            key={outcome.id}
                            className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-67 mr-1"
                        >
                            <div className="text-gray-800 font-medium">{outcome.outCome}</div>
                            <button
                           onClick={() => {
                                setOutcomeDrawerOpen(true);
                                setEditOutcome(outcome);
                              }}
                            >
                                <img src="/src/assets/edit.png" alt="meeting" className="w-3 h-3 ml-57 mt-1 opacity-60" />
                            </button>
                        
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                <Drawer anchor="right" open={outcomeDrawerOpen} onClose={handleOutcomeDrawer(false)}>
                    <Box sx={{ width: 400 }} role="presentation" onClick={handleOutcomeDrawer(false)} onKeyDown={handleOutcomeDrawer(false)}>
                    </Box>

                    <AddOutcomes
                    meetingID={selectedMeetingId}
                    onOutcomeAdded={()=> fetchMeetingOutcomes(meetingID)}
                    onClose={() => setOutcomeDrawerOpen(false)}
                    editOutcome={editOutcome} //edit
                    />
                </Drawer>

                </div>
            ))}

            </motion.div>
            )}
            </AnimatePresence>

            {/* refresh meeting list */}
            {/* {showRefreshMeeting && (
                <RefreshMeetings/>
            )} */}
        </div>


        {/* location */}
        <div className="flex" ref={locationSectionRef}>
            
            <div className="bg-white shadow-md rounded-lg p-4 w-65 h-60 border border-gray-300 ml-3">
              <div className="flex">
                <h2 className="text-gray-900 font-semibold">Location Details</h2>
                 <img className="w-5 h-5 opacity-60 ml-20 mt-1" src="/src/assets/navigator.png" />
              </div>
              <div className="mt-8 text-gray-900 text-sm ml-4">
        
                <div className="flex gap-3">
                  <p className="mt-1 mb-3 font-semibold">Location:</p>
                  <span className="mt-1 text-gray-500">{meetingLocationData}</span>
                </div>
                
                <div className="flex gap-3">
                  <p className="mt-1 mb-3 font-semibold">Latitude:</p>
                  <span className="mt-1 text-gray-500">{meetingLatitudeData}</span>
                </div>
        
                <div className="flex gap-3">
                 <p className="mt-1 mb-3 font-semibold">Longitude:</p> 
                 <span className="mt-1 text-gray-500">{meetingLogitudeData}</span>
                </div>
        
              </div>
              <div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${meetingLatitudeData},${meetingLogitudeData}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-800 text-white rounded-lg px-3 py-1 text-xs font-semibold mt-4 ml-11 inline-block hover:bg-green-900 transition"
                >
                  View on Google Maps
                </a>
              </div>
        
            </div>
        
            <div className="bg-white shadow-md rounded-lg p-1 w-170 h-60 border border-gray-300 ml-3">
        
              
                {isLoaded && meetingLatitudeData && meetingLogitudeData ? (
                    <GoogleMap
                      center={{
                        lat: parseFloat(meetingLatitudeData),
                        lng: parseFloat(meetingLogitudeData)
                      }}
                      zoom={15}
                      mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
                    >
                      <Marker
                        position={{
                          lat: parseFloat(meetingLatitudeData),
                          lng: parseFloat(meetingLogitudeData)
                        }}
                      />
                    </GoogleMap>
                  ) : (
                    <div className="text-gray-500">Map loading or coordinates not available...</div>
                  )}
                
            </div>
        </div>


        </div>
    </div>
    </>
)
};

export default LeadMeetingLog;