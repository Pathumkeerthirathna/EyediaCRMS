import React from "react";
import {
    EnumNetworkComponentConnectorType,
    EnumNetworkComponentType,
    EnumNetworkComponentSpecification,
    EnumMaterial,
} from "../../Constants";


const NetworkComponentForm = ({ formData, onChange }) => {
  return (
    <div className="network-form text-gray-600 ml-5">
      <div className="form-group mt-4">
        <label>Type:</label>
       <select name="ncType" onChange={onChange} value={formData.ncType || ''}>
        <option value="">Select Component Type</option>
        {Object.entries(EnumNetworkComponentType).map(([key, value]) => (
          <option key={key} value={value}>{value}</option>
        ))}
      </select>
      </div>
      <div className="form-group mt-4">
        <label>Material:</label>
        <select name="ncMaterial" onChange={onChange}>
        <option value="">Select Material</option>
        {Object.entries(EnumMaterial).map(([key, value]) => (
          <option key={key} value={value}>{value}</option>
        ))}
      </select>
      </div>
      <div className="form-group mt-4">
        <label>Specification:</label>
      <select name="ncSpecification" onChange={onChange}>
      <option value="">Select Specification</option>
      {Object.entries(EnumNetworkComponentSpecification).map(([key, value]) => (
        <option key={key} value={value}>{value}</option>
      ))}
    </select>
      </div>
      <div className="form-group mt-4">
        <label>Length:</label>
        <input type="number" name="length" onChange={onChange} />
      </div>
      <div className="form-group mt-4">
        <label>Color:</label>
        <input type="text" name="color" onChange={onChange} />
      </div>
    </div>
  );
};

export default NetworkComponentForm;
