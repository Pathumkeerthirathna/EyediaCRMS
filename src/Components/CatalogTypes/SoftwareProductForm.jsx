import React from "react";
import { EnumSoftwareprojectStatus } from "../../Constants";

const SoftwareProductForm = ({ formData, onChange }) => {
  return (
    <div className="software-form text-gray-600 ml-5">
      <div className="form-group mt-4">
        <label>Operating System Compatibility:</label>
        <input type="text" name="operatingSystemCompatibility" onChange={onChange} value={formData.operatingSystemCompatibility || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Compliance:</label>
        <input type="text" name="compliance" onChange={onChange} value={formData.compliance || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Hourly Rate:</label>
        <input type="number" name="hourlyRate" onChange={onChange} value={formData.hourlyRate || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Hourly Rate Per Head:</label>
        <input type="number" name="hourlyRatePerHead" onChange={onChange} value={formData.hourlyRatePerHead || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Monthly Rate:</label>
        <input type="number" name="monthlyRate" onChange={onChange} value={formData.monthlyRate || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Monthly Rate Per Head:</label>
        <input type="number" name="monthlyRatePerHead" onChange={onChange} value={formData.monthlyRatePerHead || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Certification Expiry Date:</label>
        <input type="date" name="certificationExpryDate" onChange={onChange} value={formData.certificationExpryDate || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Hardware Requirements:</label>
        <input type="text" name="hardwareRequirements" onChange={onChange} value={formData.hardwareRequirements || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Software Requirements:</label>
        <input type="text" name="softwareRequirements" onChange={onChange} value={formData.softwareRequirements || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Installation Guide URL:</label>
        <input type="text" name="installationGuideUrl" onChange={onChange} value={formData.installationGuideUrl || ''} />
      </div>
      <div className="form-group mt-4">
        <label>User Manual URL:</label>
        <input type="text" name="userManualUrl" onChange={onChange} value={formData.userManualUrl || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Developer Guide URL:</label>
        <input type="text" name="developerGuideUrl" onChange={onChange} value={formData.developerGuideUrl || ''} />
      </div>
      <div className="form-group mt-4">
        <label>API Reference URL:</label>
        <input type="text" name="apiReferenceUrl" onChange={onChange} value={formData.apiReferenceUrl || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Quick Start Guide URL:</label>
        <input type="text" name="quickStartGuideUrl" onChange={onChange} value={formData.quickStartGuideUrl || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Troubleshooting Guide URL:</label>
        <input type="text" name="troubleShootingGuideUrl" onChange={onChange} value={formData.troubleShootingGuideUrl || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Database Name:</label>
        <input type="text" name="databaseName" onChange={onChange} value={formData.databaseName || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Project Status:</label>
        <select name="softwareprojectStatus" onChange={onChange} value={formData.softwareprojectStatus || ''}>
        <option value="">Select Status</option>
        {Object.entries(EnumSoftwareprojectStatus).map(([key, value]) => (
          <option key={key} value={value}>
            {value}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default SoftwareProductForm;