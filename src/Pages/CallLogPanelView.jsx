import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const dummyCallLogs = [
  { id: 1, caller: "John Doe", time: "2025-05-01 10:00 AM", status: "Missed" },
  { id: 2, caller: "Jane Smith", time: "2025-05-01 11:30 AM", status: "Received" },
  { id: 3, caller: "Mike Johnson", time: "2025-05-02 09:15 AM", status: "Voicemail" },
];

const dummyOutcomes = [
  "Call Back Later",
  "Issue Resolved",
  "Follow-up Scheduled",
];

const dummyNotes = [
  "Customer was unavailable.",
  "Resolved billing issue.",
  "Follow-up needed in 2 days.",
];

const CallLogPanelView = () => {
  const [selectedCall, setSelectedCall] = useState(null);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">
      {/* Description */}
      {/* <div className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Call Log Dashboard</h1>
        <p className="text-gray-600 max-w-3xl">
          Below is a list of recent call logs. Click on a row to view more details, outcomes, and notes related to the call.
        </p>
      </div> */}

      {/* Layout container */}
      <div className="flex flex-row h-[600px] px-6 gap-4">
        {/* Table Section */}
        <div className={`transition-all duration-500 ${selectedCall ? "w-1/3" : "w-full"} bg-white shadow-md rounded-lg overflow-auto`}>          
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4">Caller</th>
                {!selectedCall && (
                  <>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {dummyCallLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedCall(log)}
                  className="cursor-pointer hover:bg-gray-100 border-b"
                >
                  <td className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">{log.caller}</td>
                  {!selectedCall && (
                    <>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{log.time}</td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{log.status}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Slide-in Panel */}
        <AnimatePresence>
          {selectedCall && (
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-2/3 bg-white shadow-lg p-6 overflow-y-auto border-l border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Call Log Details</h2>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-2">
                <p><span className="font-semibold text-gray-700">Caller:</span> {selectedCall.caller}</p>
                <p><span className="font-semibold text-gray-700">Time:</span> {selectedCall.time}</p>
                <p><span className="font-semibold text-gray-700">Status:</span> {selectedCall.status}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Outcomes</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {dummyOutcomes.map((outcome, idx) => (
                    <li key={idx}>{outcome}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {dummyNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CallLogPanelView;
