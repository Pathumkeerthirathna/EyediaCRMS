import React from "react";
import "./LeadInvoices.css";
import { Tooltip } from "react-tooltip";


//dummy data for invoice table 
const invoices = [
  {
    date: "2025/01/12",
    prospectName: "Client A",
    number: "INV-00123",
    remark: "sent",
  },
  {
    date: "2025/01/12",
    prospectName: "Client B",
    number: "INV-00124",
    remark: "pending",
  },
  {
    date: "2025/01/12",
    prospectName: "Client C",
    number: "INV-00125",
    remark: "uncompleted",
  },
  {
    date: "2025/01/12",
    prospectName: "Client D",
    number: "INV-00126",
    remark: "rejected",
  },
];

const remarkColors = {
  sent: "bg-green-500",
  pending: "bg-yellow-500",
  uncompleted: "bg-blue-500",
  rejected: "bg-red-500",
};

const LeadInvoices = () => {
    return (
      <>
     <div className="invoice-container">
      <div className="invoice-card-container">
      <div className="invoice-search">
      <img src="/src/assets/searchh.png" alt="Logo" className="w-6 h-6 ml-1 mr-3 opacity-60" />
            <input className="invoice-search-input" />
            <Tooltip id="open-tooltip" place="right-end" />
            <div className="invoice-list">
            </div>
          </div>
      </div>

      <div className="invoice-div2">
      <button className="add-new-invoice-log-btn">Add New Invoice</button>

      <div className="flex gap-9 p-3">
      {/* invoice table Card */}
      <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300 w-full">
        <div className="text-gray-700 font-bold mb-2">Invoice List</div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left text-gray-600 font-normal p-2">Date</th>
            <th className="text-left text-gray-600 font-normal p-2">Client Name</th>
            <th className="text-left text-gray-600 font-normal p-2">Invoice Number</th>
            <th className="text-left text-gray-600 font-normal p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="p-2">{invoice.date}</td>
              <td className="p-2">{invoice.prospectName}</td>
              <td className="p-2">{invoice.number}</td>
              <td className="p-2 flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${remarkColors[invoice.remark]}`}
                ></span>
                {invoice.remark.charAt(0).toUpperCase() + invoice.remark.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-sm flex justify-end space-x-4">
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
          Sent
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block mr-1"></span>
          Pending
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full inline-block mr-1"></span>
          Uncompleted
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-1"></span>
          Rejected
        </span>
      </div>
    </div>

      </div>
      <div className="flex gap-9 p-3">
      {/* Invoice details Card */}
        <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300 w-108 h-50">
           <div className="text-gray-700 font-bold mb-2">Invoice Details</div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300 w-108 h-50">
           <div className="text-gray-700 font-bold mb-2">Invoice Responds</div>
        </div>
      </div>
      </div>
     </div>
     </>
    );
  };
  
  export default LeadInvoices;