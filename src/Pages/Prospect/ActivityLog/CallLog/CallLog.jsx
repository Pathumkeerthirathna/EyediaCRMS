import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CallLog.css";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import BorderColorIcon from '@mui/icons-material/BorderColor';
import Chip from '@mui/material/Chip';
import{
    EnumBusinessType,
    EnumClientType,
    EnumIndustryType,
    EnumCallType,
    EnumClientEngagementLevel,
} from "../../../../Constants";
import { AddCallLog } from "../../../../Components/Prospect/CallLogs";
import { AddOutcomes } from "../../../../Components/Prospect/CallLogs";
import { AddNotes } from "../../../../Components/Prospect/CallLogs";

import CallLogSnackbar from "../../../../Snackbars/CallLogSnackbar";

 const apiUrl = import.meta.env.VITE_API_URL;

 
  const CallLog = () => {
  const [prospectList, setProspectList] = useState([]);
  const [prospectID, setProspectID] = useState([]);
  const [callLogID, setCallLogID] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const itemRef = useRef(null);
  const menuRef = useRef(null);
  const [selectedProspectId, setSelectedProspectId] = useState(null);
  const [selectedCallLogID, setSelectedCallLogID] = useState([]);
  const [engagementLevel, setEngagementLevelData] = useState([]);
  const [likelihoodtoConvertData, setLikelihoodtoConvertData] = useState([]);
  const [prospectSalesAgentData, setProspectSalesAgentData] = useState([]);

  const [callLogData, setCallLogData] = useState([]);
  const [callLogResponseData, setCallLogResponseData] = useState([]);

  const [outcomeData, setOutcomeData] = useState([]);

  const [editProspectCalllog, setEditProspectCalllog] = useState([]);
  const [editProspectOutcomes, setEditProspectOutcomes] = useState([]);
  const [editProspectNotes, setEditProspectNotes] = useState([]);

  //drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null); 
  const [outcomeDrawerOpen, setOutcomeDrawerOpen] = useState(null);
  const [noteDrawerOpen, setNoteDrawerOpen] = useState(null);

  //snackbars
  const [snackbarMsg, setSnackbarMsg] = useState('');
  
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
    setOutcomeDrawerOpen(open);
  };

  const handleToggleNoteDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setNoteDrawerOpen(open);
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
          setProspectList(data.resData || []);
        } catch (error) {
          console.error("Error fetching prospect data:", error);
        }
      };
  
      getProspect();
    }, []);
  
      // Function to calculate items per page based on window height
      const calculateItemsPerPage = () => {
        if (!itemRef.current) return 4; // Default if ref not attached yet
    
        const windowHeight = window.innerHeight;
        const itemHeight = itemRef.current.offsetHeight + 20; // Include margin
        return Math.max(Math.floor(windowHeight / itemHeight) + 1, 3); // Ensure at least 1 item
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
    
// Get prospect info by double clicking
const handleDoubleClick = async (id) => {
  setSelectedProspectId(id);
  setSelectedCallLogID(id);
  setProspectID(id);
    try {
      // Fetch Prospect Info 
      const prospectResponse = await fetch(`${apiUrl}/api/Prospect/GetProspect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), 
      });

      if (!prospectResponse.ok) {
        throw new Error(`HTTP error! Status: ${prospectResponse.status}`);
      }

      const prospectData = await prospectResponse.json();
      console.log("Prospect Data:", prospectData);
      
      setSnackbarMsg("");

      

      const resData = prospectData.resData;

      if (resData && resData.length > 0) {
        // Engagement level
        const prospectEngagementLevel = resData[0].engagementLevel;
        setEngagementLevelData(prospectEngagementLevel);
        console.log("Engagement Level:", prospectEngagementLevel);

        // Likelihood to convert
        const prospectLikelihoodToConvert = resData[0].likelihoodToClose;
        setLikelihoodtoConvertData(prospectLikelihoodToConvert);
        console.log("Likelihood to Convert:", prospectLikelihoodToConvert);

        //sales agent
        const prospectSalesAgent = resData[0].salesAgentID;
        setProspectSalesAgentData(prospectSalesAgent);
        console.log("sales agent");
        console.log(prospectSalesAgent);

      } else {
        console.warn("No prospect data found.");
        setEngagementLevelData(null);
        setLikelihoodtoConvertData(null);
        setProspectSalesAgentData(null);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbarMsg("Failed to retrieve call log data.");
    }

    try{
      //fetch call log data
      const callLogResponse = await fetch (`${apiUrl}/api/CallLog/GetProspectCallLog`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({prospectID:id}),
      });

      if (!callLogResponse.ok){
        throw new Error(`HTTP error! Status: ${callLogResponse.status}`);
      }
      const callLogData = await callLogResponse.json();
      console.log("callLogData:", callLogData);
      


      console.log("First call log entry:", callLogData.resData[0]);

      setSnackbarMsg("Call log data retrieved");

      // callLogData = resData[0];
      // console.log("CALLLLOG");

      const resData = Array.isArray(callLogData.resData[0]) ? callLogData.resData[0] : callLogData.resData;

      setCallLogData(resData || []);
     
      console.log("setCallLogData:", callLogData.resData);
      

    }catch(error){
      console.error("error fetching data:", error);
      setSnackbarMsg("Failed to retrieve call log data.");
    }

    // try {
    //   //fetch outcomes 
    //   const outcomeResponse = await fetch (`${apiUrl}/api/CallLog/GetCallLogOutCome`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({callLogID:id}),
    //   });
    //   if(!outcomeResponse.ok){
    //     throw new Error(`HTTP error! Status:${outcomeResponse.status}`);
    //   }
    //   const outcomeData = await outcomeResponse.json();
    //   console.log("outcome data:", outcomeData);

      
    // }catch(error){
    //   console.error("error fetching data:", error);
    // }
};

//fetch from prospectID + id
const handleCallLogDoubleClick = async (getCallLog) => {
  setCallLogID(getCallLog.id);
  setSelectedCallLogID(getCallLog.id);

  const calllogRequest = {
    id: getCallLog.id,
    prospectID: getCallLog.prospectID
  }

  console.log(calllogRequest);
  

  try {
    const callLogDataResponse = await fetch(`${apiUrl}/api/CallLog/GetProspectCallLog`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(calllogRequest)
    });

    const callLogResponseData = await callLogDataResponse.json();
    console.log('callLog',callLogResponseData);
    

    if(!callLogDataResponse.ok){
      throw new Error (`HTTP error! Status:${callLogDataResponse.status}`);
    }
 

    console.log("calllog data retrieved:", callLogResponseData);
    

    console.log("log data", callLogResponseData);
    setCallLogResponseData(callLogResponseData || []);
    
  } catch (error){
    console.error("error fetching data:", error);
  }
};


//refresh logic for call logs
const fetchProspectCallLogs = async (prospectID) =>{
  try {
    const response = await fetch(`${apiUrl}/api/CallLog/GetProspectCallLog`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({prospectID: prospectID}),
    });
    if (!response.ok) {
      throw new Error (`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const resdata = data.resData;

    const ProspectCallLogs = resdata[0];
    setCallLogData(ProspectCallLogs);
    
  }catch (error) {
    console.error("error fetching call logs:", error);
  }
};

//refresh logic for outcomes 
const fetchProspectOutcomes = async () => {

};

//refresh logic for notes 
const fetchProspectNotes = async () => {

};
  
  
    return (
      <>
   <div className="call-log-container">
        <div className="call-log-card-container">
           <div className="call-log-search">
              <input className="call-log-search-input" />
               <button
                  className="call-log-open-btn"
                  onClick={() => setIsDrawerOpen(true)}
                  data-tooltip-id="open-tooltip"
                  data-tooltip-content="Add New Call log"
                  >+
                  </button>
                  <Tooltip id="open-tooltip" place="right-end" />
              
            </div>
              <div className="prospect-list">
                {displayedTeam.map((prospect, index) => (
                  <div
                    key={index}
                    className={`prospect-card ${selectedProspectId === prospect.id ? "selected" : ""}`}
                    ref={index === 0 ? itemRef : null}
                    onDoubleClick={() => handleDoubleClick(prospect.id)}
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
                  </div>
                ))}
              </div>
            
            {/* Pagination Controls */}
            <div className="pagination-container">
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


<div className="call-log-div2">

      <div className="header-container">
      <div>
        <div className="header-div2">Call Logs</div>
      </div>
      {/* <div className="relative">
        <button 
            data-tooltip-id="open-tooltip"
            data-tooltip-content="Add New CallLog" 
            onClick={() => setIsDrawerOpen(true)}
            className="relative ml-210">
             <img className="w-7 h-7 ml-4 mt-1 opacity-70" src="/src/assets/addCall2.png" alt="Add Call Log" />
        </button>
        </div> */}
      </div>
      
      {/* Right Drawer */}
        <Drawer anchor="right" open={isDrawerOpen} onClose={handleToggleDrawer(false)}>
        <Box sx={{ width: 550 }} role="presentation" onClick={handleToggleDrawer(false)} onKeyDown={handleToggleDrawer(false)}>
        </Box>
        <AddCallLog
        prospectID={selectedProspectId} 
        // onClose={() => setIsDrawerOpen(false)}
        onClose={() =>{
            setIsDrawerOpen(false);
            setEditProspectCalllog(null);
          }}
        onCallLogAdded={() => fetchProspectCallLogs (prospectID)} //refresh
        editProspectCallLog={editProspectCalllog} //edit call log
        />
        </Drawer>
            
  
       <div className="flex gap-9 p-3">
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

       {/* guide */}
       {/* <div className="mt-1 text-sm flex justify-end space-x-4 mr-4">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
            Incoming
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block mr-1"></span>
            Outgoing
          </span>
        </div> */}

      {/* data */}
       <div className="flex flex-row gap-5 p-3 h-[500px]">
          {/* table */}
          <div
            className={`transition-all duration-500 ${
              callLogResponseData?.resData?.length > 0 ? "w-2/3" : "w-full"
            } bg-white shadow-md rounded-lg border border-gray-300 overflow-visible`}
          >
            <div className="flex justify-between items-center p-4">
              <div className="text-gray-800 font-bold">Call List</div>
              {/* <div className="flex gap-3">
                <button
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
                </button>
              </div> */}
            </div>


            <div className="overflow-y-auto max-h-[500px] p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-2 text-left text-gray-600 font-normal">Date</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Caller/N</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Receiver/N</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Call Type</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Engaged/P</th>
                    <th className="p-2 text-left text-gray-600 font-normal">Duration</th>
                    {callLogResponseData?.resData?.length === 0 && (
                      <th className="p-2 text-left text-gray-600 font-normal">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {callLogData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-2 text-gray-500 text-center">
                        No call logs available
                      </td>
                    </tr>
                  ) : (
                    callLogData.map((log, index) => {
                      const isSelected = selectedCallLogID === log.id;
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
                        <td className="p-2">{log.duration}</td>
                        {callLogResponseData?.resData?.length === 0 && (
                          <td>
                            <button className="text-sm mr-2 text-yellow-500"
                            onClick={() => {
                              setIsDrawerOpen(true);
                              setEditProspectCalllog(log);
                            }}
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
              {callLogResponseData?.resData?.length > 0 && (
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
                      onClick={() => setCallLogResponseData({ resData: [] })}
                      className="bg-red-700 hover:bg-red-900 text-white text-sm px-3 py-1 rounded-full shadow mt-1 h-8 w-15 flex items-center justify-center"
                    >
                      close
                    </button>
                  </div>

                  {callLogResponseData.resData.map((item) => (

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
                          <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-27"
                          onClick={() => setNoteDrawerOpen(true)}
                          >+</button>
                       </div>

                        <div className="space-y-2">
                          {item.importantNotes.map(note => (
                            <div
                              key={note.id}
                              className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-72 mr-0"
                            >
                              <div className="text-gray-800 font-medium font-regular">
                              {note.note}
                              </div>
                                <button
                                onClick={() => {
                                  setNoteDrawerOpen(true);
                                  setEditProspectNotes(note);
                                }}
                                >
                                  <img className="w-4 h-4 opacity-70 ml-56" src="/src/assets/edit.png" />
                                </button>
                            </div>
                          ))}
                        {/* Note Drawer */}
                        <Drawer anchor="right" open={noteDrawerOpen} onClose={handleToggleNoteDrawer(false)}>
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
                        </Drawer>
                        </div>

                      </div>
                    )}

                    {/* Outcomes */}
                    {item.outComes?.length > 0 && (
                      <div className="mt-5">
                       <div className="flex gap-5 mb-3">
                          <h2 className="text-base text-gray-700 font-semibold ml-1">Outcomes:</h2>
                          <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-38"
                          onClick={() => setOutcomeDrawerOpen(true)}
                          >+</button>
                        </div>
                        
                          <div className="space-y-2">
                          {item.outComes.map(outcome => (
                           
                            <div
                              key={outcome.id}
                              className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-72 mr-0"
                            >
                              <div className="text-gray-800 font-medium font-regular">
                              {outcome.outCome}
                              </div>
                              <button
                               onClick={() => {
                                setOutcomeDrawerOpen(true);
                                setEditProspectOutcomes(outcome);
                              }}
                              >
                                  <img className="w-4 h-4 opacity-70 ml-56" src="/src/assets/edit.png" />
                                </button>
                            </div>
                          ))}
                          {/* <button
                               onClick={() => {
                                setOutcomeDrawerOpen(true);
                                setEditProspectOutcomes(outcome);
                              }}
                              >
                                  <img className="w-4 h-4 opacity-70" src="/src/assets/edit.png" />
                            </button> */}
                          </div>
                      
                      </div>
                    )}

                      {/* Outcome Drawer */}
                      <Drawer anchor="right" open={outcomeDrawerOpen} onClose={handleToggleOutcomeDrawer(false)}>
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
                      </Drawer>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
      </div>
      </div>
      <CallLogSnackbar messageTrigger={snackbarMsg} />
</div>

   </>
  );
};
  
  export default CallLog;