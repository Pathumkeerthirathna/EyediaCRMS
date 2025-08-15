// SupportGuidelinePanel.tsx
import React, { useState } from "react";
import SupportGuidelineInput from "../Components/SupportGuideLineInput"; // adjust path
import { format } from "date-fns";

export interface SupportGuideline {
  resolutionStep: string;
  addedAt: Date;
  addedUserName: string;
  isAddedAsSupportGuideline: boolean;
}

const formatDate = (d: Date) =>
  format(d, "dd MMM yyyy, HH:mm"); // e.g., "04 Aug 2025, 13:45"

export const SupportGuidelinePanel: React.FC<{
  currentUserName?: string;
}> = ({ currentUserName = "Current User" }) => {
  const [guidelines, setGuidelines] = useState<SupportGuideline[]>([
    {
      resolutionStep: "Restart the service and clear cache.",
      addedAt: new Date("2025-07-20T10:15:00"),
      addedUserName: "Jane Doe",
      isAddedAsSupportGuideline: true,
    },
    {
  resolutionStep: "Verify user credentials and reset the password if necessary.",
  addedAt: new Date("2025-07-22T09:45:00"),
  addedUserName: "Emily Clark",
  isAddedAsSupportGuideline: true,
},
{
  resolutionStep: "Reinstall the application to ensure all files are intact.",
  addedAt: new Date("2025-07-22T11:20:00"),
  addedUserName: "Michael Lee",
  isAddedAsSupportGuideline: true,
},
{
  resolutionStep: "Clear browser cookies and local storage before reattempting.",
  addedAt: new Date("2025-07-23T08:10:00"),
  addedUserName: "Sarah Tan",
  isAddedAsSupportGuideline: true,
},
{
  resolutionStep: "Update to the latest version of the software.",
  addedAt: new Date("2025-07-23T15:05:00"),
  addedUserName: "David Kumar",
  isAddedAsSupportGuideline: true,
},
{
  resolutionStep: "Restart the system and check system logs for related errors.",
  addedAt: new Date("2025-07-24T10:00:00"),
  addedUserName: "Ayesha Fernando",
  isAddedAsSupportGuideline: true,
}
    
  ]);

  const [currentStep, setCurrentStep] = useState("");
  const [isSupport, setIsSupport] = useState(false);

  const handleChange = (step: string, support: boolean) => {
    setCurrentStep(step);
    setIsSupport(support);
  };

  const addGuideline = () => {
    if (!currentStep.trim()) return;
    setGuidelines((prev) => [
      {
        resolutionStep: currentStep.trim(),
        addedAt: new Date(),
        addedUserName: currentUserName,
        isAddedAsSupportGuideline: isSupport,
      },
      ...prev,
    ]);
    setCurrentStep("");
    setIsSupport(false);
  };

  return (
    <div className="space-y-1">
      {/* Input area */}
      <div className="bg-white shadow p-0">
        <div className="flex flex-col md:flex-row md:items-start gap-2 p-4">
          <div className="flex-1">
            <SupportGuidelineInput
              resolutionStep={currentStep}
              isSupportGuideline={isSupport}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="flex-1 overflow-y-auto max-h-34 px-4 pb-4 thin-scrollbar">
        {guidelines.map((g, idx) => (
          <div
              key={idx}
              className="border rounded-md p-2 bg-gray-50 mt-2"
          >
            
              <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
                <span>{g.addedUserName}</span>
                <span className="text-gray-800 font-normal">{formatDate(g.addedAt)}</span>
              </div>

              <div className="text-base text-gray-900 whitespace-pre-wrap mb-1">
                {g.resolutionStep}
              </div>

              
            </div>
        ))}
        </div>

      </div>

    </div>
  );


};
