import React, { useState } from "react";

interface SupportGuidelineInputProps {
  resolutionStep: string;
  isSupportGuideline: boolean;
  onChange: (resolutionStep: string, isSupportGuideline: boolean) => void;
}

const SupportGuidelineInput: React.FC<SupportGuidelineInputProps> = ({
  resolutionStep,
  isSupportGuideline,
  onChange,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
    <textarea
        value={resolutionStep}
        onChange={(e) => onChange(e.target.value, isSupportGuideline)}
        className="w-full p-2 border border-gray-300 rounded resize-none max-h-[50px] min-h-[50px]"
        placeholder="Enter resolution step here..."
    />

    <label className="inline-flex items-center gap-2 whitespace-nowrap">
        <input
        type="checkbox"
        checked={isSupportGuideline}
        onChange={(e) => onChange(resolutionStep, e.target.checked)}
        className="w-5 h-5"
        />
        <span>Support Guideline</span>
    </label>
    </div>
  );
};

export default SupportGuidelineInput;
