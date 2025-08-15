// Components/Sidebar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
     LayoutDashboard ,
     Users,
     AlertCircle,
     ChevronDown, 
     ChevronRight
     } from "lucide-react"


export default function Sidebar({ isOpen, toggleSidebar }) {

    const [isClientBaseOpen, setIsClientBaseOpen] = useState(false)
    const [isProspectOpen, setIsProspectOpen] = useState(false)
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false)
    const [isLeadOpen, setIsLeadOpen] = useState(false)
    const [isAssetsOpen, setIsAssetsOpen] = useState(false)
    const [isProductOpen, setIsProductOpen] = useState(false)
    const [isDealOpen, setIsDealOpen] = useState(false)
    const [isSalesOpen, setIsSalesOpen] = useState(false)
    const [isAccessOpen, setIsAccessOpen] = useState(false)
    const [isIssueOpen, setIsIssuesOpen] = useState(false)
    const [isUserOpen, setIsUsersOpen] = useState(false)
    const [isCustomerOpen, setIsCustomerOpen] = useState(false)

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 transition-transform duration-300 z-20 ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        
        <h2 className="text-xl font-bold">Eyedia CRMS</h2>
     
      </div>

      <ul>

      <li className="mb-2 rounded hover:bg-gray-700">
            <Link
                to="/Dashboard"
                className="flex items-center p-2 text-white"
            >
                <LayoutDashboard size={20} className="mr-2" />
                <span>Dashboard</span>
            </Link>
            </li>
        

        {/* lead */}
        <li className="mb-3">
            <div className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white">
            <img src="/src/assets/magnet.png" alt="Lead Icon" className="w-5 h-5 mr-2 mt-0" />
            
        <button
            onClick={() => setIsClientBaseOpen(!isClientBaseOpen)}
            className="flex items-center justify-between w-full"
            >
            {/* <PeopleAltIcon/> */}
            <span>Lead</span>
            {isClientBaseOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            </div>

            {isClientBaseOpen && ( 
            <ul className="ml-4 mt-1 space-y-1">

            {/* Prospect Section */}
                <li className="mb-2">
                
                <Link to="/prospect" className="block p-2 hover:bg-gray-700 rounded">
                
                <button
                onClick={() => setIsProspectOpen(!isProspectOpen)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
                >
                
                <span>Prospect</span> 

                {isProspectOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button></Link>
                {isProspectOpen && (
                <ul className="ml-4 mt-1 space-y-1">

                    {/*activity*/}
                    <li>
                    <button
                    onClick={() => setIsActivityLogOpen(!isActivityLogOpen)}
                    className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
                >
                    <span>Activity Log</span>
                    {isActivityLogOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isActivityLogOpen && (
                    <ul className="ml-4 mt-1 space-y-1">
                    <li>
                        <Link to="/CallLog" className="block p-2 hover:bg-gray-700 rounded">
                        Call Log
                        </Link>
                    </li>
                    <li>
                        <Link to="/MeetingLog" className="block p-2 hover:bg-gray-700 rounded">
                        Meeting Log
                        </Link>
                    </li>
                    <li>
                        <Link to="/FeedbackLog" className="block p-2 hover:bg-gray-700 rounded">
                        Feedbacks
                        </Link>
                    </li>
                    </ul>
                )}
                    
                    </li>
                    {/* <li>
                    <Link to="/Invoices" className="block p-2 hover:bg-gray-700 rounded">
                        Invoices
                    </Link>
                    </li>
                    <li>
                    <Link to="/Quotations" className="block p-2 hover:bg-gray-700 rounded">
                        Quotations
                    </Link>
                    </li> */}
                </ul>
                )}
                </li>

            {/* Lead Section */}
                <li className="mb-2"><Link to="/Lead" className="block p-2 hover:bg-gray-700 rounded">
                <button
                    onClick={() => setIsLeadOpen(!isLeadOpen)}
                    className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white"
                    >
                    <span>Lead</span>
                    {isLeadOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button></Link>

                    {isLeadOpen && (
                    <ul className="ml-4 mt-1 space-y-1">
                        {/*activity*/}
                        <li>
                        <button
                        onClick={() => setIsActivityLogOpen(!isActivityLogOpen)}
                        className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
                    >
                        <span>Activity Log</span>
                        {isActivityLogOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {isActivityLogOpen && (
                        <ul className="ml-4 mt-1 space-y-1">
                        <li>
                            <Link to="/LeadCallLog" className="block p-2 hover:bg-gray-700 rounded">
                            Call Log
                            </Link>
                        </li>
                        <li>
                            <Link to="/LeadMeetingLog" className="block p-2 hover:bg-gray-700 rounded">
                            Meeting Log
                            </Link>
                        </li>
                        <li>
                            <Link to="/LeadFeedbackLog" className="block p-2 hover:bg-gray-700 rounded">
                            Feedbacks
                            </Link>
                        </li>
                        </ul>
                    )}
                        
                        </li>
                        {/* <li>
                        <Link to="/LeadInvoices" className="block p-2 hover:bg-gray-700 rounded text-white">
                            Invoices
                        </Link>
                        </li>
                        <li>
                        <Link to="/LeadQuotations" className="block p-2 hover:bg-gray-700 rounded text-white">
                            Quotations
                        </Link>
                        </li> */}
                    </ul>
                    )}
                </li>
            </ul>
        )}
        </li>
        {/* Customer Section */}
    <li className="mb-4"><Link to="/Customer" className="block p-2 hover:bg-gray-700 rounded">
    <div className="flex">
      <img src="/src/assets/rating.png" alt="Customer Icon" className="w-4 h-4 mr-4 mt-1" />
    
    <button
          onClick={() => setIsCustomerOpen(!isCustomerOpen)}
          className="flex items-center justify-between w-full  hover:bg-gray-700 rounded text-white"
        >
        <span>Customer</span>
        {isCustomerOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button></div></Link>
        {isCustomerOpen && (
          <ul className="ml-4 mt-1 space-y-1">
            {/*activity*/}
            <li>
            <button
            onClick={() => setIsActivityLogOpen(!isActivityLogOpen)}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <span>Activity Log</span>
            {isActivityLogOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isActivityLogOpen && (
            <ul className="ml-4 mt-1 space-y-1">
              <li>
                <Link to="/CallLog" className="block p-2 hover:bg-gray-700 rounded">
                  Call Log
                </Link>
              </li>
              <li>
                <Link to="/MeetingLog" className="block p-2 hover:bg-gray-700 rounded">
                  Meeting Log
                </Link>
              </li>
              <li>
                <Link to="/FeedbackLog" className="block p-2 hover:bg-gray-700 rounded">
                  Feedbacks
                </Link>
              </li>
            </ul>
          )}
              
            </li>
            {/* <li>
              <Link to="/customer/profile" className="block p-2 hover:bg-gray-700 rounded text-white">
                Activity Log
              </Link>
            </li> */}
            <li>
              <Link to="/customer/orders" className="block p-2 hover:bg-gray-700 rounded text-white">
                Invoices
              </Link>
            </li>
            <li>
              <Link to="/customer/support" className="block p-2 hover:bg-gray-700 rounded text-white">
                Quotations
              </Link>
            </li>
          </ul>
        )}
    </li>

    {/* Product Mangement*/}
    <li className="mb-4">
      <div className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white">
      <img src="/src/assets/pmng.png" alt="Customer Icon" className="w-5 h-5 mr-2 mt-0" />
    <button
          onClick={() => setIsProductOpen(!isProductOpen)}
        className="flex items-center justify-between w-full"
        >
        <span>Product</span>
        {isProductOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        </div>

        {isProductOpen && (
          <ul className="ml-4 mt-1 space-y-1">
            <li>
              <Link to="/Products" className="block p-2 hover:bg-gray-700 rounded text-white">
                Products
              </Link>
            </li>
            <li>
              <Link to="/Catalogs" className="block p-2 hover:bg-gray-700 rounded text-white">
                Catalogs
              </Link>
            </li>
          </ul>
        )}
    </li>

    {/* Deal Mangement*/}
    <li className="mb-5">
    <div className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white">
      <img src="/src/assets/deal.png" alt="Customer Icon" className="w-5 h-5 mr-2 mt-0" />
    <button
          onClick={() => setIsDealOpen(!isDealOpen)}
          className="flex items-center justify-between w-full"
        >
        <span>Deal</span>
        {isDealOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button></div>
        {isDealOpen && (
          <ul className="ml-4 mt-1 space-y-1">
            <li>
              <Link to="/customer/profile" className="block p-2 hover:bg-gray-700 rounded text-white">
                Quotation Request
              </Link>
            </li>
            <li>
              <Link to="/customer/profile" className="block p-2 hover:bg-gray-700 rounded text-white">
              Purchase order
              </Link>
            </li>
            <li>
              <Link to="/customer/orders" className="block p-2 hover:bg-gray-700 rounded text-white">
                Billing & Payments
              </Link>
            </li>
          </ul>
        )}
    </li>

    {/*sales execution*/}
    <li className="mb-5">
    <div className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white">
      <img src="/src/assets/increase.png" alt="Customer Icon" className="w-5 h-5 mr-2 mt-0" />
    <button
          onClick={() => setIsSalesOpen(!isSalesOpen)}
          className="flex items-center justify-between w-full"
        >
        <span>Sales Execution</span>
        {isSalesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button></div>
        {isSalesOpen && (
          <ul className="ml-4 mt-1 space-y-1">
            <li>
              <Link to="/customer/profile" className="block p-2 hover:bg-gray-700 rounded text-white">
              Inventory issuance
              </Link>
            </li>
            <li>
              <Link to="/customer/profile" className="block p-2 hover:bg-gray-700 rounded text-white">
              Dispatch & confirmation
              </Link>
            </li>
            <li>
              <Link to="/customer/orders" className="block p-2 hover:bg-gray-700 rounded text-white">
                Finalized sales
              </Link>
            </li>
          </ul>
        )}
    </li>

    {/*Access control*/}
    <li className="mb-2">
    <div className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white">
      <img src="/src/assets/password.png" alt="Customer Icon" className="w-5 h-5 mr-2 mt-0" />
    <button
          onClick={() => setIsAccessOpen(!isAccessOpen)}
          className="flex items-center justify-between w-full"
        >
        <span>Access Control</span>
        {isAccessOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button></div>
        {isAccessOpen && (
          <ul className="ml-4 mt-1 space-y-1">
            <li>
              <Link to="/customer/profile" className="block p-2 hover:bg-gray-700 rounded text-white">
              Users
              </Link>
            </li>
            <li>
              <Link to="/customer/profile" className="block p-2 hover:bg-gray-700 rounded text-white">
              Permission
              </Link>
            </li>
            <li>
              <Link to="/customer/orders" className="block p-2 hover:bg-gray-700 rounded text-white">
                System settings
              </Link>
            </li>
          </ul>
        )}
    </li>

      {/*Customer issues*/}
    <li className="mb-2">
    <div className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white">
      <AlertCircle size={20} className="mr-2" />
    <button
          onClick={() => setIsIssuesOpen(!isIssueOpen)}
          className="flex items-center justify-between w-full"
        >
        <span>Customer Isues</span>
        {isIssueOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button></div>
        {isIssueOpen && (
          <ul className="ml-4 mt-1 space-y-1">
            <li>
              <Link to="/customer/issues" className="block p-2 hover:bg-gray-700 rounded text-white">
              Issues
              </Link>
            </li>
            
          </ul>
        )}
    </li>

        {/*Users*/}
    <li className="mb-2">
    <div className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded text-white">
      <Users size={20} className="mr-2" />
    <button
          onClick={() => setIsUsersOpen(!isUserOpen)}
          className="flex items-center justify-between w-full"
        >
        <span>Accounts</span>
        {isUserOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button></div>
        {isUserOpen && (
          <ul className="ml-4 mt-1 space-y-1">
            <li>
              <Link to="/Account/Users" className="block p-2 hover:bg-gray-700 rounded text-white">
              Users
              </Link>
            </li>
            
          </ul>
        )}
    </li>
        </ul>


    </div>
  );
}
