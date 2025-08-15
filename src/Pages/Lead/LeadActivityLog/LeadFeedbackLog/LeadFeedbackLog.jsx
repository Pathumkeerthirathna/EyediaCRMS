import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LeadFeedbackLog.css";
import { Tooltip } from "react-tooltip";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
    EnumClientEngagementLevel,
    EnumFeedbackType,
    EnumBusinessType,
    EnumClientType,
} from "../../../../Constants";

const apiUrl = import.meta.env.VITE_API_URL;

const LeadFeedbackLog = () => {
    const [leadList, setLeadList] = useState([]);
    const [leadID, setLeadID] = useState([]);
    const [selectedLeadId, setSelectedLeadId] = useState(null);

    const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
    const [feedbackID, setFeedbackID] = useState(null);
    const [feedbackLogResponseData, SetFeedbackLogResponseData] = useState([]);

    const [feedbackLogData, setFeedbackLogData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const itemRef = useRef(null);
    const menuRef = useRef(null);

    //drawers
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isResDrawerOpen, setIsResDrawerOpen] = useState(false);


    //functions to toggle drawer
    const handleToggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setIsDrawerOpen(open);
    };

    const handleResToggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setIsResDrawerOpen(open);
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

//get prospect info by double clicking
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

    //   showMessage('Lead Infomation fetched successfully', 'success');

    console.log(leadID);
    
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching prospect details:", error);
    //   showMessage(error.message || 'Failed to fetch lead infomation', 'error');
     
    }


  try{
    //fetch feedback data
    const feedbackLogResponse = await fetch(`${apiUrl}/api/Feedback/GetLeadFeedback`, {
        method: "POST",
        headers: {"Content-Type" : "application/json",},
        body: JSON.stringify({leadID:id}),
    });

    if(!feedbackLogResponse.ok){
        throw new Error (`HTTP error! Status: ${feedbackLogResponse.status}`);
    }
    const feedbackLogData = await feedbackLogResponse.json();
    console.log("feedback log data:", feedbackLogData);

    console.log("first feedback log entry:", feedbackLogData.resData[0]);

    const resData = Array.isArray(feedbackLogData.resData[0])?
    feedbackLogData.resData[0] : feedbackLogData.resData;

    setFeedbackLogData(resData || []);

    console.log("setFeedbackData:", feedbackLogData.resData);
    
  }catch(error){
     console.error("error fetching data:", error);
  }

};  

//get data from leadID + id
const handleFeedbackClick = async (getFeedback) => {
setSelectedFeedbackId(getFeedback.id);
setFeedbackID(getFeedback.id);


    const FeedbackLogResponse = {
        id: getFeedback.id,
        leadID: getFeedback.leadID
    }

    console.log(FeedbackLogResponse);

    try{
        const feedbackLogResponse = await fetch (`${apiUrl}/api/Feedback/GetLeadFeedback`, {
            method: "POST",
            headers: {"Content-Type" : "application/json",},
            body: JSON.stringify(FeedbackLogResponse)
        });

        const feedbackLogResponseData = await feedbackLogResponse.json();
        console.log("feedback log response:", feedbackLogResponseData);

        if(!feedbackLogResponse.ok){
            throw new Error (`HTTP error! Status:${feedbackLogResponse.status}`);
        }
        
        console.log("feedback data retrieved:", feedbackLogResponseData);
        SetFeedbackLogResponseData(feedbackLogResponseData || []);

        // const resData = feedbackLogResponseData.resData;
        
    }catch(error){
        console.error("error fetching feedback log data:", error);
    }
    
};



return (
    <>
    <div className="feedback-log-container">
        <div className="feedback-log-card-container">
           <div className="feedback-log-search">
                <input className="feedback-log-search-input" />
                <button
                 className="feedback-open-btn"
                 onClick={() => setIsDrawerOpen(true)}
                 data-tooltip-id="open-tooltip"
                 data-tooltip-content="Add New Feedback"
                 >+
                </button>
               <Tooltip id="open-tooltip" place="right-end" />    

                {/* Right Drawer */}
                <Drawer anchor="right" open={isDrawerOpen} onClose={handleToggleDrawer(false)}>
                <Box sx={{ width: 550 }} role="presentation" onClick={handleToggleDrawer(false)} onKeyDown={handleToggleDrawer(false)}>
                </Box>
        
                {/* <AddFeedbacks
                onClose={() => {
                    setIsDrawerOpen(false);
                    setEditFeedback(null);
                }}
                prospectID={selectedProspectId}
                onFeedbackAdded={()=> fetchProspectFeedbacks(prospectID)}
                editFeedback={editFeedback}
                /> */}
                
                </Drawer>
          </div>

           <div className="lead-list">
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

        <div className="feedback-log-div2">
            <div className="header-container">
                <div>
                <div className="header-div2">Feedback Log</div>
                </div>

                <div className="relative">
                    {/* <button 
                        data-tooltip-id="open-tooltip"
                        data-tooltip-content="Add New Feedback" 
                        // onClick={() => setIsDrawerOpen(true)}
                        className="relative ml-198">
                            <img className="w-6 h-6 ml-4 mt-1 opacity-80" src="/src/assets/feedback.png" alt="Add feedback" />
                    </button>
                    <Tooltip id="open-tooltip" place="bottom" /> */}
                </div>
            </div>

            <div className="flex gap-8 p-3">

            {/*  Card2 */}
            <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300">
            <div className="text-gray-700 font-bold mb-2">Actions</div>
            <div className="flex">
                <p className="text-gray-500">Feedbacks</p>
            <button 
            // onClick={() => setIsDrawerOpen(true)}
            className="text-white bg-blue-900 w-10 h-6 text-sm rounded-lg ml-43">Add</button>
            </div>
            <div className="flex mt-2">
                <p className="text-gray-500">Resolutions</p>
            <button 
            // onClick={() => setIsResDrawerOpen(true)}
            className="text-white bg-blue-600 w-10 h-6 text-sm rounded-lg ml-42">Add</button>
            </div>
            </div>

            {/* Right Drawer */}
                {/* <Drawer anchor="right" open={isResDrawerOpen} onClose={handleResToggleDrawer(false)}>
                <Box sx={{ width: 400 }} role="presentation" onClick={handleResToggleDrawer(false)} onKeyDown={handleResToggleDrawer(false)}>
                </Box>

                <AddResolutions
                feedbackID={selectedFeedbackId}
                onResolutionAdded={() => fetchFeedbackResolution(feedbackID)} //refresh list
                onClose={handleResToggleDrawer(false)}
                // editResolution={editResolution} //edit
                
                />
                </Drawer> */}

            {/* feedback stats */}
            {/* Engagement & Likelihood Card */}
            <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300">
            <div className="text-gray-700 font-bold mb-2">Engagement Level</div>
            <div className="flex gap-6 mb-4 ml-6">
                {/* {engagementLevel === 1 && 
                (
                <span className="bg-red-500 text-white px-2 py-1 rounded-xl">Low</span>
                )}
                {engagementLevel === 2 && (
                <span className="bg-yellow-400 text-white px-2 py-1 rounded-xl">Medium</span>
                )}
            {engagementLevel === 3 && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-xl">High</span>
                )} */}
            </div>

            <div className="text-gray-700 font-bold mb-2">Likelihood to convert</div>
        <div className="w-full bg-gray-300 rounded-full h-4">
            {/* <div
            className="bg-indigo-600 h-4 rounded-full flex items-center justify-center text-white text-xs transition-all duration-500"
            style={{ width: `${likelihoodtoConvertData}%` }}
            >
            {likelihoodtoConvertData}%
            </div> */}
        </div>
            </div>

             {/* <div className="bg-white shadow-md rounded-lg p-4 w-1/3 w-30 border border-gray-300"></div> */}

            {/* img */}
            <div className="ml-10">
            <img className="w-37 h-32" src="/src/assets/review.png" />
            </div>

           </div>

           <div className="flex flex-row gap-3 p-3 h-[550px]">
                     
                {/* table */}
                <div 
                className={`transition-all duration-500 ${
                feedbackLogResponseData?.length > 0 ? "w-2/3" : "w-full"
                } bg-white shadow-md rounded-lg border border-gray-300 overflow-visible`}
                >
                <div className="flex justify-between items-center p-4">
                    <div className="text-gray-800 font-bold">Feedback List</div>
                </div>
            
                <div className="overflow-y-auto max-h-[500px] p-4">
                    <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-300">
                        <th className="p-2 text-left text-gray-600 font-normal">Submitted On</th>
                        <th className="p-2 text-left text-gray-600 font-normal">Resolved On</th>
                        {/* <th className="p-2 text-left text-gray-600 font-normal">Type</th> */}
                        <th className="p-2 text-left text-gray-600 font-normal">F/Type</th>
                        <th className="p-2 text-left text-gray-600 font-normal">Rating</th>
                        {!isDrawerOpen && (
                            <th className="p-2 text-left text-gray-600 font-normal">Action</th>
                        )}
                        </tr>
                    </thead>
                        <tbody>
                        {feedbackLogData.length === 0 ? (
                            <tr>
                            <td colSpan={isDrawerOpen ? 5 : 6} className="p-2 text-gray-500 text-center">
                                No feedback logs available
                            </td>
                            </tr>
                        ) : (
                            feedbackLogData.map((log, index) => {
                            const isSelected = selectedFeedbackId === log.id;
                            return (
                                <tr
                                key={index}
                                onClick={() => {
                                    handleFeedbackClick(log);
                                    setSelectedFeedbackId(log.id);
                                }}
                                className={`cursor-pointer hover:bg-gray-100 ${isSelected ? 'selected2' : ''}`}
                                ref={index === 0 ? itemRef : null}
                                >
                                <td className="p-2 text-sm text-gray-700">{new Date(log.subMittedOn).toLocaleDateString()}</td>
                                <td className="p-2 text-sm text-gray-700">{new Date(log.resolvedOn).toLocaleDateString()}</td>
                                <td className="p-2 text-md text-gray-700">{EnumFeedbackType[log.feedbackType]}</td>
                                <td className="p-2 text-md text-gray-700">
                                    <span className="text-orange-400">
                                        {'★'.repeat(log.rating)}
                                    </span>
                                    <span className="text-gray-300">
                                        {'☆'.repeat(5 - log.rating)}
                                    </span>
                               </td>
                                {/* <td className="p-2 text-md text-gray-700">{log.engagedSalesAgentID}</td>
                                <td className="p-2 text-md text-gray-700">{log.duration}</td> */}
                                {!isDrawerOpen && (
                                    <td className="p-2">
                                    <button
                                        className="text-sm text-yellow-500 hover:underline"
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDrawerOpen(true);
                                        // setEditFeedback(log);
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
                {feedbackLogResponseData?.resData?.length > 0 && (
                    <motion.div
                    key="feedback-details"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-1/2 bg-white shadow-md rounded-lg border border-gray-300 p-6 overflow-y-auto"
                    >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Feedback Details</h2>
                        <button
                        onClick={() => SetFeedbackLogResponseData({ resData: [] })}
                        className="bg-red-700 hover:bg-red-900 text-white text-sm px-3 py-1 text-sm rounded-lg shadow mt-1 h-6 w-6 flex items-center justify-center"
                        >
                        X
                        </button>
                    </div>

                    {feedbackLogResponseData.resData.map((item) => (
                    <div key={item.id} className="space-y-4 text-sm">

                         <div className="text-base text-gray-600 text-sm mt-3">
                            <strong>Content:</strong> 
                            <p className="ml-0 text-gray-600">{item.content}</p>
                       </div>

                        <div className="text-base text-gray-600 text-sm mt-3">
                        <div className="flex">
                            <strong>Likelihood To Convert:</strong> <p className="ml-3 text-blue-800">{item.likelihoodToConvert}%</p>
                        </div> 
                        </div>

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

                        {/* Resolutions */}
                        {item.resolutions?.length > 0 && (
                        <div className="mt-5">
                            <div className="flex gap-5 mb-3">
                            <h2 className="text-base text-gray-700 font-semibold">Resolutions:</h2>
                            <button className="bg-green-600 text-white font-bold w-7 rounded-lg ml-32"
                            onClick={handleResToggleDrawer(true)}
                            >+</button>
                            </div>
                            <div className="space-y-2">
                            {item.resolutions.map((resolution) => (
                                <div
                                key={resolution.id}
                                className="flex flex-col space-y-1 border border-gray-200 rounded p-3 bg-gray-50 w-67 mr-1"
                                >
                                <div className="text-gray-800 font-medium">{resolution.resolution}</div>
                                    <button
                                    onClick={() => {
                                        setIsResDrawerOpen(true);
                                        setEditResolution(resolution);
                                    }}
                                    >
                                        <img src="/src/assets/edit.png" alt="meeting" className="w-3 h-3 ml-57 mt-1 opacity-60" />
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
                            
                {/* refresh list */}
                {/* {showRefreshFeedbacks && (
                    <RefreshFeedbacks/>
                )} */}
                             
            </div>

        </div>
    </div>
    </>
)
};

export default LeadFeedbackLog;