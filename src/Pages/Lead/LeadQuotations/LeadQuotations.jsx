import React from "react";
import "./LeadQuotations.css";
import { Tooltip } from "react-tooltip";


const quotations = [
  {
    id: 1,
    number: "QTN - 001",
    date: "2025/01/23",
    customerName: "",
    status: "approved",
    amount: "1 000 000 LKR",
  },
  {
    id: 2,
    number: "QTN - 002",
    date: "2025/01/23",
    customerName: "",
    status: "approved",
    amount: "1 000 000 LKR",
  },
  {
    id: 3,
    number: "QTN - 003",
    date: "2025/01/23",
    customerName: "",
    status: "rejected",
    amount: "1 000 000 LKR",
  },
  {
    id: 4,
    number: "QTN - 004",
    date: "2025/01/23",
    customerName: "",
    status: "pending",
    amount: "1 000 000 LKR",
  },
  {
    id: 5,
    number: "QTN - 005",
    date: "2025/01/23",
    customerName: "",
    status: "rejected",
    amount: "1 000 000 LKR",
  },
  {
    id: 6,
    number: "QTN - 006",
    date: "2025/01/23",
    customerName: "",
    status: "approved",
    amount: "1 000 000 LKR",
  },
  {
    id: 7,
    number: "QTN - 007",
    date: "2025/01/23",
    customerName: "",
    status: "approved",
    amount: "1 000 000 LKR",
  },
];

const statusColors = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  rejected: "bg-red-500",
};


const LeadQuotations = () => {
  return (
    <>
   <div className="quotations-container">
   <div className="quotations-div2"> 
<div className="flex gap-9 p-3">
   <div className="quotation-search">
     <input className="quotations-search-input" />
   </div>
   <button className="add-new-quotation-btn">Add New Quotation</button>
</div>

<div className="flex gap-9 p-3">
{/* quotation table Card */}
<div className="bg-white shadow-md rounded-lg p-4 w-1/3 border border-gray-300 w-full">
        <div className="text-gray-700 font-bold mb-2" >Quotation List</div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Quotation Number</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Customer Name</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation) => (
              <tr key={quotation.id} className="border-b border-gray-300">
                <td className="p-2" >{quotation.id}</td>
                <td className="p-2">{quotation.number}</td>
                <td className="p-2">{quotation.date}</td>
                <td className="p-2">{quotation.customerName}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-white rounded ${statusColors[quotation.status]}`}
                  >
                    {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                  </span>
                </td>
                <td className="p-2">{quotation.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

</div>
   </div>
   </>
  );
};

export default LeadQuotations;