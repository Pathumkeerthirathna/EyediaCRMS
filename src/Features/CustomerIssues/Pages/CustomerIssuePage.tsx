import React, { useState } from "react";
import { useCustomerIssues } from "../Hooks/useCustomerIsses";
import { IssueList } from "../Components/IssueList";
import { IssueDetailCard } from "../Components/IssueDetailsCard";
import { CustomerIssue } from "../types";
import Carousel from "../Components/Carousel";
import { FaFacebookMessenger,FaUserCheck } from "react-icons/fa";
import SupportTicketList from "../Components/SupportTicketList";
import {
  TextField
} from '@mui/material';

import SupportNotes from "../Components/SupportNotes";

import { ChatBox } from "../Components/ChatBox";

import { SupportGuidelinePanel } from "../Components/SupportGuidelinePanel";

import { Plus } from "lucide-react"; 

import AddCustomerIssueComponent from "../../CustomerIssues/Components/AddCustomerIssueComponent";



const statusMap = {
  1: { label: "Assigned", color: "info" },
  2: { label: "In Progress", color: "primary" },
  3: { label: "Awaiting Customer", color: "warning" },
  4: { label: "Resolved", color: "success" },
  5: { label: "Escalated", color: "error" },
  6: { label: "Verified", color: "success" },
  7: { label: "Closed", color: "default" },
} as const;

type StatusKey = keyof typeof statusMap; 

export interface SupportTicketData {
  id: number;
  userName: string;
  assignedAt: string;
  status: StatusKey;
  note: string;
  resolutionSummary: string;
  avatarUrl:string;
}



const dummyTickets: SupportTicketData[] = [
  {
    id: 1,
    userName: "Tharusha",
    assignedAt: "2025-08-10",
    status: 2,
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    note: "Customer had issues logging into the portal.",
    resolutionSummary: "Reset the password and ensured the user could log in successfully.",
  },
  {
    id: 2,
    userName: "Pathum",
    assignedAt: "2025-08-08",
    status: 4,
    avatarUrl: "https://randomuser.me/api/portraits/men/33.jpg",
    note: "Reported slow system performance.",
    resolutionSummary: "Cleared caches and optimized queries, performance improved.",
  },
  {
    id: 3,
    userName: "Anjali",
    assignedAt: "2025-08-07",
    status: 1,
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    note: "Unable to print invoices.",
    resolutionSummary: "Issue escalated to printer support team.",
  },
];


const demoSlides = [

    <div
    key="slide-1"
    className="w-full h-full flex items-center justify-center bg-transparent text-black text-lg rounded-lg"
    >
    {/* Replace with <img> if it's an image */}
    <img
        src="https://plus.unsplash.com/premium_photo-1674499074558-0340263538e0?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Screenshot 1"
        className="w-full h-full object-contain" // or object-cover if you want to fill and crop
    />
    </div>,

    <div
        key="slide-1"
        className="w-full h-full flex items-center justify-center bg-white text-black text-lg rounded-lg"
    >
        {/* Replace with <img> if it's an image */}
        <img
        src="https://plus.unsplash.com/premium_photo-1674499074558-0340263538e0?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Screenshot 1"
        className="w-full h-full object-contain" // or object-cover if you want to fill and crop
        />
    </div>,
   
    <div
        key="slide-1"
        className="w-full h-full flex items-center justify-center bg-white text-black text-lg rounded-lg"
    >
        {/* Replace with <img> if it's an image */}
        <img
        src="https://plus.unsplash.com/premium_photo-1680740103993-21639956f3f0?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Screenshot 1"
        className="w-full h-full object-contain" // or object-cover if you want to fill and crop
        />
    </div>,

    <div
        key="slide-1"
        className="w-full h-full flex items-center justify-center bg-white text-black text-lg rounded-lg"
    >
        {/* Replace with <img> if it's an image */}
        <img
        src="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Screenshot 1"
        className="w-full h-full object-contain" // or object-cover if you want to fill and crop
        />
    </div>,
];

export const CustomerIssuesPage: React.FC = () => {

  const [resolutionStep, setResolutionStep] = useState("");
  const [isSupportGuideline, setIsSupportGuideline] = useState(false);



  const handleChange = (step: string, isSupport: boolean) => {
    setResolutionStep(step);
    setIsSupportGuideline(isSupport);
  };

  const { issues, loading } = useCustomerIssues();
  const [selected, setSelected] = useState<CustomerIssue | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [UserDrawerOpen, setUserDrawerOpen] = useState(false);
  const [isAddIssueOpen, setIsAddIssueOpen] = useState(false);

  if (loading) return <div className="p-6">Loading...</div>;

  return (

    <div className="w-full p-4 relative">

      
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="md:col-span-1">

          <div className="max-h-full overflow-y-auto pr-1">
            <IssueList issues={issues} onSelect={(i) => setSelected(i)} />
          </div>

          {/* <IssueList issues={issues} onSelect={(i) => setSelected(i)} /> */}
        </div>

        <div className="md:col-span-3">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-50">

          

            {/* Left: Issue detail */}
            <div className="lg:col-span-9 h-[calc(90h-150px)]">
              {selected ? (
                <IssueDetailCard
                  issue={selected}
                  onClearSelection={() => setSelected(null)}
                />
              ) : (
                <div className="p-6 border rounded-md bg-gray-50 h-full flex items-center justify-center">
                  <p className="text-center text-gray-500">
                    No issue selected. Select one to see details.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Carousel */}
            <div className="lg:col-span-3 h-full">
              <div className="rounded-lg shadow-sm overflow-hidden h-65">
                <Carousel
                  autoPlayInterval={4000}
                  loop
                  showArrows
                  showDots
                  className="w-full"
                >
                  {demoSlides}
                </Carousel>
              </div>
            </div>

              {/* Second row: Support Guidelines - full width */}
            <div className="lg:col-span-9 w-full bg-white p-0 ">
             
                <div className="w-full">
                    <SupportGuidelinePanel currentUserName="Alice Smith" />
                </div>

            </div>

            <div className="lg:col-span-3 w-full bg-white p-0 ">

              <SupportNotes />
              
            </div>

          </div>
          
        </div>

      </div>

      <div className="fixed bottom-12 right-12 flex flex-col gap-2 z-50">
        
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
          aria-label="User check"
        >
          <FaUserCheck className="w-6 h-6" aria-hidden="true" />
          <span className="sr-only">User Check</span>
        </button>

        <SupportTicketList
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tickets={dummyTickets}
        />

        <button
          onClick={() => setChatOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
          aria-label="Messages"
        >
          <FaFacebookMessenger className="w-6 h-6" aria-hidden="true" />
          <span className="sr-only">Messages</span>
        </button>

         <button
          onClick={() => setIsAddIssueOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
          aria-label="Messages"
        >
          <Plus className="w-5 h-5" />
          <span className="sr-only">Messages</span>
        </button>

        {/* Tooltip on hover */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Add New Issue
          </div>

       
          <AddCustomerIssueComponent
              open={isAddIssueOpen}
              onClose={() => setIsAddIssueOpen(false)}
          />
          
      </div>

      {/* Chat Box Slide-in */}
      <div
        className={`fixed bottom-1 right-12 z-50 transform transition-transform duration-800 ease-in-out shadow-lg`}
        style={{
          width: 300,
          // Slide up when open, slide down when closed:
          transform: chatOpen
            ? "translateY(0)"
            : "translateY(120%)",
          opacity: chatOpen ? 1 : 0,
          pointerEvents: chatOpen ? "auto" : "none",
        }}
      >
        {selected && (
          <ChatBox
            customerName={selected.customerName}
            onClose={() => setChatOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
 