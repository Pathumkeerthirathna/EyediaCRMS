
import React from "react";

const ElectricalDeviceForm = ({ formData, onChange }) => {
  return (
    <div className="electrical-form text-gray-600 ml-5">
      <div className="form-group mt-4">
        <label>Specifications:</label>
        <input type="text" name="specifications" onChange={onChange} value={formData.specifications || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Power Source:</label>
        <input type="text" name="powerSource" onChange={onChange} value={formData.powerSource || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Voltage:</label>
        <input type="text" name="voltage" onChange={onChange} value={formData.voltage || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Battery Capacity:</label>
        <input type="number" name="batteryCapacity" onChange={onChange} value={formData.batteryCapacity || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Height:</label>
        <input type="number" name="height" onChange={onChange} value={formData.height || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Width:</label>
        <input type="number" name="width" onChange={onChange} value={formData.width || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Depth:</label>
        <input type="number" name="depth" onChange={onChange} value={formData.depth || ''} />
      </div>
      <div className="form-group mt-4">
        <label>Weight:</label>
        <input type="number" name="weight" onChange={onChange} value={formData.weight || ''} />
      </div>
    </div>
  );
};

export default ElectricalDeviceForm;
