import React, { useState, useEffect, useRef } from "react";
import "./LeadCallLog.css";
import { motion, AnimatePresence } from "framer-motion";
import {
    EnumBusinessType,
    EnumClientType,
    EnumIndustryType,
    EnumCallType,
    EnumContactType,
    EnumClientEngagementLevel,
} from "../../../../Constants";
import { Tooltip } from "react-tooltip";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import axios from "axios";
import Chip from '@mui/material/Chip';

import { useSnackbar } from "../../../../Snackbars/SnackbarContext";

import { AddLeadCallLog } from "../../../../Components/Lead/LeadCallLogs";


const apiUrl = import.meta.env.VITE_API_URL;

const LeadCallLog = () => {
    const [leadList, setLeadList] = useState([]);
    const [leadID, setLeadID] = useState([]);
    const [leadCallLogID, setLeadCallLogID] = useState(null);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [selectedLeadCallLogID, setSelectedLeadCallLogID] = useState([]);

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

    const [leadCallLogData, setLeadCallLogData] = useState([]);
    const [leadCallLogResponseData, setLeadCallLogResponseData] = useState([]);

    const [editLeadCalllog, setEditLeadCalllog] = useState([]);
    const [editLeadOutcomes, setEditLeadOutcomes] = useState([]);
    const [editLeadNotes, setEditLeadNotes] = useState([]);


    //snackbars
    const { showMessage } = useSnackbar();

    //drawers
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null); 
    const [leadOutcomeDrawerOpen, setLeadOutcomeDrawerOpen] = useState(null);
    const [leadNoteDrawerOpen, setLeadNoteDrawerOpen] = useState(null);


  //functions to toggle drawer
  const handleToggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };
  
  const handleToggleOutcomeDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setLeadOutcomeDrawerOpen(open);
  };

  const handleToggleNoteDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setLeadNoteDrawerOpen(open);
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

// Get ;ead info by double clicking
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
      console.log("Prospect Data:", leadData);
      

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

        //sales agent
        const leadSalesAgent = resData[0].salesAgentID;
        setLeadSalesAgentData(leadSalesAgent);
        console.log("sales agent");
        console.log(leadSalesAgent);

      } else {
        console.warn("No lead data found.");
        setEngagementLevelData(null);
        setLikelihoodtoConvertData(null);
        setLeadSalesAgentData(null);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try{
      //fetch call log data
      const leadCallLogResponse = await fetch (`${apiUrl}/api/CallLog/GetLeadCallLog`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({leadID:id}),
      });

      if (!leadCallLogResponse.ok){
        throw new Error(`HTTP error! Status: ${leadCallLogResponse.status}`);
      }
      const leadCallLogData = await leadCallLogResponse.json();

      console.log("callLogData:", leadCallLogData);

      console.log("First call log entry:", leadCallLogData.resData[0]);

      const resData = Array.isArray(leadCallLogData.resData[0]) ? leadCallLogData.resData[0] : leadCallLogData.resData;
     
      setLeadCallLogData(resData || []);

      console.log("setCallLogData:", leadCallLogData.resData);
      

    }catch(error){
      console.error("error fetching data:", error);
    }
};

//fetch from leadID + id
const handleCallLogDoubleClick = async (getCallLog) => {
  setLeadCallLogID(getCallLog.id);
  setSelectedLeadCallLogID(getCallLog.id);

  const calllogRequest = {
    id: getCallLog.id,
    leadID: getCallLog.leadID
  }

  console.log(calllogRequest);
  

  try {
    const leadCallLogDataResponse = await fetch(`${apiUrl}/api/CallLog/GetLeadCallLog`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(calllogRequest)
    });

    const leadCallLogResponseData = await leadCallLogDataResponse.json();
    console.log('callLog',leadCallLogResponseData);
    

    if(!leadCallLogDataResponse.ok){
      throw new Error (`HTTP error! Status:${leadCallLogDataResponse.status}`);
    }
 

    console.log("calllog data retrieved:", leadCallLogResponseData);
    

    console.log("log data", leadCallLogResponseData);
    setLeadCallLogResponseData(leadCallLogResponseData || []);
    
  } catch (error){
    console.error("error fetching data:", error);
  }
};

//refresh logic for call logs
const fetchLeadCallLogs = async (leadID) =>{
  try {
    const response = await fetch(`${apiUrl}/api/CallLog/GetLeadCallLog`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({leadID: leadID}),
    });
    if (!response.ok) {
      throw new Error (`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const resdata = data.resData;

    const LeadCallLogs = resdata[0];
    setLeadCallLogData(LeadCallLogs);
    
  }catch (error) {
    console.error("error fetching call logs:", error);
  }
};


return (
 <>
    <div className="Lead-Call-log-container">
      <div className="lead-card-container">{/* section 1 */}
                <div className="call-log-search">{/* lead search */}
                  <input className="call-log-search-input" />
                   <button
                    className="call-log-open-btn"
                    onClick={() => setIsDrawerOpen(true)}
                    data-tooltip-id="open-tooltip"
                    data-tooltip-content="Add New Call log"
                    >+
                    </button>
                    <Tooltip id="open-tooltip" place="right-end" />

                      {/* right drawer to add and edit prospects */}
                    <Drawer anchor="right" open={isDrawerOpen} onClose={handleToggleDrawer(false)}>
                        <Box sx={{ width: 500 }} role="presentation" onClick={handleToggleDrawer(false)} onKeyDown={handleToggleDrawer(false)}>
                        </Box>

                        <AddLeadCallLog
                        leadID={selectedLeadId}
                        onClose={() => setIsDrawerOpen(false)}
                        onLeadCallLogAdded={() => fetchLeadCallLogs (leadID)} //refresh
                        />

    
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


    <div className="Lead-call-log-div2">
        <div className="header-container">
            <div className="header-div2">Lead Call Log</div>
        </div>

        <div className="flex gap-9 p-3">
            {/* Sales Agent Card */}
            <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300">
            <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold">Sales Agent</span>
                <span className="text-blue-800">{leadSalesAgentData}</span>
            </div>
            <div className="flex justify-between mt-4 pb-2">
            <p className="font-regular">Ongoing Meeting</p>
            <p className="font-regular text-red-700 text-lg">02:10:34</p>
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
            <img className="w-30 h-30" src="/src/assets/call2.png" />
            </div>

        </div>

        {/* data */}
        <div className="flex flex-row gap-5 p-3 h-[500px]">
            {/* table */}
            <div
            className={`transition-all duration-500 ${
                leadCallLogResponseData?.resData?.length > 0 ? "w-2/3" : "w-full"
            } bg-white shadow-md rounded-lg border border-gray-300 overflow-visible`}
            >
            <div className="flex justify-between items-center p-4">
                <div className="text-gray-800 font-bold">Call List</div>
                <div className="flex gap-3">
                {/* <button
                    data-tooltip-id="open-tooltip"
                    data-tooltip-content="Add Outcome"
                    onClick={() => setOutcomeDrawerOpen(true)}
                >
                    <img className="w-4 h-4 opacity-70" src="/src/assets/outcome.png" />
                </button>
                <button
                    data-tooltip-id="open-tooltip"
                    data-tooltip-content="Add Note"
                    onClick={() => setNoteDrawerOpen(true)}
                >
                    <img className="w-4 h-4 opacity-70" src="/src/assets/note.png" />
                </button> */}
                </div>
            </div>

            {/* Outcome Drawer */}
            {/* <Drawer anchor="right" open={outcomeDrawerOpen} onClose={handleToggleOutcomeDrawer(false)}>
                <Box
                sx={{ width: 300 }}
                role="presentation"
                onClick={handleToggleOutcomeDrawer(false)}
                onKeyDown={handleToggleOutcomeDrawer(false)}
                />
                <AddOutcomes 
                callLogID={callLogID} 
                onClose={() => setOutcomeDrawerOpen(false)}
                editProspectOutcome={editProspectOutcomes} // edit outcomes
                />
            </Drawer> */}

            {/* Note Drawer */}
            {/* <Drawer anchor="right" open={noteDrawerOpen} onClose={handleToggleNoteDrawer(false)}>
                <Box
                sx={{ width: 300 }}
                role="presentation"
                onClick={handleToggleNoteDrawer(false)}
                onKeyDown={handleToggleNoteDrawer(false)}
                />
                <AddNotes 
                callLogID={callLogID} 
                onClose={() => setNoteDrawerOpen(false)} 
                editProspectNote={editProspectNotes} // edit notes
                />
            </Drawer> */}

            <div className="overflow-y-auto max-h-[700px] p-4 mt-5">
                <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-gray-300">
                    <th className="p-2 text-left text-gray-600 font-normal">Date</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Caller/N</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Receiver/N</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Call Type</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Engaged/P</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Duration</th>
                    {leadCallLogResponseData?.resData?.length === 0 && (
                        <th className="p-2 text-left text-gray-600 font-normal">Actions</th>
                    )}
                    </tr>
                </thead>
                <tbody>
                    {leadCallLogData.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="p-2 text-gray-500 text-center">
                        No call logs available
                        </td>
                    </tr>
                    ) : (
                    leadCallLogData.map((log, index) => {
                        const isSelected = selectedLeadCallLogID === log.id;
                        return(
                         <tr
                            key={index}
                            onClick={() => handleCallLogDoubleClick(log)}
                             className={`cursor-pointer hover:bg-gray-100 ${isSelected ? 'selected2' : ''}`}
                             ref={index === 0 ? itemRef : null}
                            >
                                <td className="p-2">{new Date(log.callMadeAt).toLocaleDateString()}</td>
                                <td className="p-2">{log.callerNumber}</td>
                                <td className="p-2">{log.receiverNumber}</td>
                                <td className="p-2">
                                <Chip
                                    label={EnumCallType[log.callType] || "Unknown"}
                                    color={
                                    log.callType === 0
                                        ? "success"
                                        : log.callType === 1
                                        ? "primary"
                                        : "default"
                                    }
                                />
                                </td>
                                <td className="p-2">{log.engagedPerson}</td>
                            <td className="p-2">{log.duration?.split('.')[0]}</td>
                                {leadCallLogResponseData?.resData?.length === 0 && (
                                    <td>
                                    <button className="text-sm mr-2 text-yellow-500"
                                    // onClick={() => {
                                    //     setIsDrawerOpen(true);
                                    //     setEditProspectCalllog(log);
                                    // }}
                                    >Update</button>
                                    <button className="text-sm ml-1 text-red-500">Delete</button>
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

         {/* panel */}
         <AnimatePresence>
            {leadCallLogResponseData?.resData?.length > 0 && (
            <motion.div
            key="call-details"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-1/2 bg-white shadow-md rounded-lg border border-gray-300 p-6 overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Call Log Details</h2>
                <button
                    onClick={() => setLeadCallLogResponseData({ resData: [] })}
                    className="bg-red-700 hover:bg-red-900 text-white text-sm px-3 py-1 rounded-full shadow mt-1 h-8 w-15 flex items-center justify-center"
                >
                    close
                </button>
                </div>

                {leadCallLogResponseData.resData.map((item) => (

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
                    
                {/* Important Notes */}
                {item.importantNotes?.length > 0 && (
                    <div className="mt-5">
                      <div className="flex gap-5 mb-3">
                       <h2 className="text-base text-gray-700 font-semibold">Important Notes:</h2>
                       <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-25"
                    // onClick={handleParticipantDrawer(true)}
                    >+</button>
                    </div>

                    <div className="space-y-2">
                        {item.importantNotes.map(note => (
                        <div
                            key={note.id}
                             className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-69 mr-1"
                        >
                            <div className="text-gray-800 font-medium font-regular">
                            {note.note}
                            </div>
                            <button
                            // onClick={() => {
                            //     setNoteDrawerOpen(true);
                            //     setEditProspectNotes(note);
                            // }}
                            >
                                <img className="w-4 h-4 opacity-70 ml-58" src="/src/assets/edit.png" />
                            </button>
                        </div>
                        ))}
                    </div>

                    </div>
                )}

                {/* Outcomes */}
                {item.outComes?.length > 0 && (
                    <div className="mt-5">
                      <div className="flex gap-5 mb-3">
                        <h2 className="text-base text-gray-700 font-semibold">Outcomes:</h2>
                        <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-36"
                        // onClick={handleParticipantDrawer(true)}
                        >+</button>
                        </div>
                        <div className="space-y-2">
                        {item.outComes.map(outcome => (
                        
                        <div
                            key={outcome.id}
                             className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-69 mr-1"
                        >
                            <div className="text-gray-800 font-medium font-regular">
                            {outcome.outCome}
                            </div>
                            <button
                            // onClick={() => {
                            // setOutcomeDrawerOpen(true);
                            // setEditProspectOutcomes(outcome);
                            // }}
                            >
                                <img className="w-4 h-4 opacity-70 ml-58" src="/src/assets/edit.png" />
                            </button>
                        </div>
                        ))}
                        </div>
                    
                    </div>
                )}
                </div>
                ))}
            </motion.div>
            )}
         </AnimatePresence>
        </div>

        </div>

    </div>
 </>
)
};

export default LeadCallLog;