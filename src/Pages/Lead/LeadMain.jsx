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
  EnumClientEngagementLevel,
} from "../../Constants";
import axios from "axios";
import "./Lead.css";


const apiUrl = import.meta.env.VITE_API_URL;





const LeadMain = () => {
    const [LeadList, setLeadList] = useState([]);
    const [leadId, setLeadId] = useState([]);
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



//fetches prospect data from an API 
  useEffect(() => {
    const getLead = async () => {
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
        
        setLeadList(data.resData || []);

      } catch (error) {
        console.error("Error fetching lead data:", error);
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
  }, [LeadList]); // Recalculate when data changes

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

  const totalPages = Math.ceil(LeadList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTeam = LeadList.slice(
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
    setLeadId(id);

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

      

    //retrive data to the cards relavant to the lead
    var resdata = data.resData;
    
    //prospect ID
    const leadID = resdata[0].id;
    setLeadId(leadID);
    console.log("ID");

    console.log(leadID);
    
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching prospect details:", error);
      setSnackbarMsg("Failed to retrieve prospect data");
    }
  };



    return (
      <>
        <div className="lead-container">
          <div className="lead-card-container">{/* section 1 */}
  
            <div className="lead-search">{/* lead search */}
              <input className="lead-search-input" />
              <button
                className="open-btn"
                // onClick={() => setIsOpen(true)}
                data-tooltip-id="open-tooltip"
                data-tooltip-content="Add New lead"
              >+
              </button>
              <Tooltip id="open-tooltip" place="right-end" />
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
                      {EnumClientType[lead.prospectType] || "Unknown"}
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

            <div className="lead-div2">{/* section 2 */}

  
  <div className="menudots" ref={menuRef}>
    {/* Three-dot button */}
      <button
      onClick={() => setOpen(!open)}
      className="tripledots p-2 rounded-full hover:bg-gray-200 ml-190">
      &#x22EE; {/* Vertical ellipsis (⋮) */}</button>
  
    {/* Dropdown menu for edit and delete*/}
      {open && (
        <div className="menudots-menu absolute mt-2 w-30 bg-white rounded-lg shadow-lg ml-160">
           <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
              <span className="mr-2 ml-5"></span> Edit
            </button><hr class="border-t-1 border-gray-300"/>
           <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
              <span className="mr-2 ml-3"></span> Delete
           </button>
        </div>
               )}
  </div>
   
           </div>
 
 </div>
      </>
    );


};

export default LeadMain;