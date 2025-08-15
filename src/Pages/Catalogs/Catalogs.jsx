import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import { Tooltip } from "react-tooltip";
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ChevronDown } from "lucide-react";
import Chip from '@mui/material/Chip';
import "./Catalogs.css"; 
import { AddCatalog } from "../../Components/Products/AddCatalogs";
// import { DeactivateCatalogs } from "../../Components/Products/AddCatalogs";
// import { AddCatalogs } from "../../Components/Products/AddCatalog";
import {
    EnumNetworkComponentConnectorType,
    EnumNetworkComponentType,
    EnumNetworkComponentSpecification,
    EnumMaterial,
} from "../../Constants";

import ElectricalDeviceForm from "../../Components/CatalogTypes/ElectricalDeviceForm";
import SoftwareProductForm from "../../Components/CatalogTypes/SoftwareProductForm";
import NetworkComponentForm from "../../Components/CatalogTypes/NetworkComponentForm";

const apiUrl = import.meta.env.VITE_API_URL;

const categoryMap = {
    "000000": "Default",
    "000001": "Software product",
    "000002": "Network component",
    "000003": "Electric device",
};

//form values to add new catalogs
const defaultValues = 
    [
        {
            id: "",
            name: "",
            sku: "",
            categoryId: "",
            salePrice: 0,
            costPrice: 0,
            status: 0
        }
    ];

const chipColorMap = {
  "000000": "primary",
  "000003": "primary",
  "000002": "warning",
  "000001": "success",
};

const Catalogs = () => {
const [catalogData, setCatalogData] = useState([]);
const [selectedCatalog, setSelectedCatalog] = useState(null);
const [currentCatalog, setCurrentCatalog] = useState(null);
const [isEditing, setIsEditing] = useState(false);

const [expandedSpecs, setExpandedSpecs] = useState({});
const [tabState, setTabState] = useState({});
const [catalogType, setcatalogType] = useState("");
const [dynamicFormData, setDynamicFormData] = useState({});
const { register, handleSubmit, reset } = useForm();


const handleDynamicChange = (e) => {
  const { name, value } = e.target;
  setDynamicFormData((prev) => ({ ...prev, [name]: value }));
};

const renderCategoryForm = () => {
  switch (catalogType) {
    case "000001":
      return <SoftwareProductForm formData={dynamicFormData} onChange={handleDynamicChange} />;
    case "000002":
      return <NetworkComponentForm formData={dynamicFormData} onChange={handleDynamicChange} />;
    case "000003":
      return <ElectricalDeviceForm formData={dynamicFormData} onChange={handleDynamicChange} />;
    default:
      return null;
  }
};

const handleTabChange = (key) => (event, newValue) => {
  setTabState((prev) => ({
    ...prev,
    [key]: newValue,
  }));
};

const handleTabChange2 = (key2) => (event, newValue) => {
  setTabState((prev) => ({
    ...prev,
    [key2]: newValue,
  }));
};

//fetches from an API 
  useEffect(() => {

    const getCatalog = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/Product/GetCatalog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setCatalogData(data);
      } catch (error) {
        console.error("Error fetching lead data:", error);
      }
    };

    getCatalog();
  }, []);

const catalogEntries = catalogData.length > 0 ? Object.entries(catalogData[0]) : [];


//drawers
const [catalogDrawerVisible, setCatalogDrawerVisible] = React.useState(false);

//functions to toggle drawer 
const toggleCatalogDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setCatalogDrawerVisible(visible);
};

const renderDetails = (category, item) => {
  switch (category) {
    case "electricalDeviceList":
        const key2 = `${category}-${item.id}`;
        const currentEDevTab = tabState[key2] || 0;
      return (
        <div className="mt-3">
          {/* <p><strong>Specifications:</strong> {item.specifications ?? "N/A"}</p>
          <p><strong>Power Source:</strong> {item.powerSource ?? "N/A"}</p>
          <p><strong>Battery Capacity:</strong> {item.batteryCapacity ?? "N/A"} mAh</p>
          <p><strong>Voltage:</strong> {item.voltage ?? "N/A"}</p>
          <p><strong>Height:</strong> {item.height ?? "N/A"} cm</p>
          <p><strong>Depth:</strong> {item.depth ?? "N/A"} cm</p>
          <p><strong>Weight:</strong> {item.weight ?? "N/A"} kg</p>
          <p><strong>Width:</strong> {item.width ?? "N/A"} cm</p>
          <p><strong>SKU:</strong> {item.sku ?? "N/A"}</p> */}

          <Tabs value={currentEDevTab} onChange={handleTabChange2(key2)}>
            <Tab label="General Info" sx={{ textTransform: 'none', fontSize: '0.75rem' }}/>
            <Tab label="Measurments" sx={{ textTransform: 'none', fontSize: '0.75rem' }} />
         </Tabs>

        <Box sx={{ mt: 2 }}>
            {currentEDevTab === 0 && (
            <div>
                <p><strong>Specifications:</strong> {item.specifications ?? "N/A"}</p>
                <p><strong>Power Source:</strong> {item.powerSource ?? "N/A"}</p>
                <p><strong>Battery Capacity:</strong> {item.batteryCapacity ?? "N/A"} mAh</p>
                <p><strong>Voltage:</strong> {item.voltage ?? "N/A"}</p>
                <p><strong>SKU:</strong> {item.sku ?? "N/A"}</p>

            </div>
            )}
            {currentEDevTab === 1 && (
            <div>
                <p><strong>Height:</strong> {item.height ?? "N/A"} cm</p>
                <p><strong>Depth:</strong> {item.depth ?? "N/A"} cm</p>
                <p><strong>Weight:</strong> {item.weight ?? "N/A"} kg</p>
                <p><strong>Width:</strong> {item.width ?? "N/A"} cm</p>
            </div>
            )}
        </Box>

        </div>
      );
    case "networkComponent":
      return (
        <>
          <p><strong>Network Component Type:</strong> {EnumNetworkComponentType[item.ncType] ?? "N/A"}</p>
          <p><strong>Network Component Connector Type:</strong> {EnumNetworkComponentConnectorType[item.ncConnectorType] ?? "Default"}</p>
          <p><strong>Network Component Specification:</strong> {EnumNetworkComponentSpecification[item.ncSpecification] ?? "N/A"}</p>
          <p><strong>Material:</strong> {EnumMaterial[item.ncMaterial] ?? "N/A"}</p>
          <p><strong>Color:</strong> {item.color ?? "N/A"}</p>
          <p><strong>Length:</strong> {item.length ?? "N/A"}</p>
          <p><strong>SKU:</strong> {item.sku ?? "N/A"}</p>
        </>
      );
    case "softwareProduct":
    const key = `${category}-${item.id}`;
    const currentTab = tabState[key] || 0;

  return (
    <div className="mt-3">
      <Tabs value={currentTab} onChange={handleTabChange(key)}>
        <Tab label="General Info" sx={{ textTransform: 'none', fontSize: '0.75rem' }}/>
        <Tab label="URLs" sx={{ textTransform: 'none', fontSize: '0.75rem' }} />
        <Tab label="Other" sx={{ textTransform: 'none', fontSize: '0.75rem' }} />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && (
          <div>
            <p><strong>Hardware Requirements:</strong> {item.hardwareRequirements ?? "N/A"}</p>
            <p><strong>Database:</strong> {item.databaseName ?? "N/A"}</p>
            <p><strong>Compliance:</strong> {item.compliance ?? "N/A"}</p>
            <p><strong>Operating System Compatibility:</strong> {item.operatingSystemCompatibility ?? "N/A"}</p>
            <p><strong>Software Requirements:</strong> {item.softwareRequirements ?? "N/A"}</p>
            <p><strong>Software Modules:</strong> {item.softwaremodules ?? "N/A"}</p>
            <p><strong>Software Key Features:</strong> {item.softwareKeyFeatures ?? "N/A"}</p>
          </div>
        )}
        {currentTab === 1 && (
          <div>
            <p><strong>API Reference URL:</strong> {item.apiReferenceUrl ?? "N/A"}</p>
            <p><strong>Developer Guide URL:</strong> {item.developerGuideUrl ?? "N/A"}</p>
            <p><strong>Installation Guide URL:</strong> {item.installationGuideUrl ?? "N/A"}</p>
            <p><strong>Quick Start Guide URL:</strong> {item.quickStartGuideUrl ?? "N/A"}</p>
            <p><strong>Troubleshooting Guide URL:</strong> {item.troubleShootingGuideUrl ?? "N/A"}</p>
            <p><strong>User Manual URL:</strong> {item.userManualUrl ?? "N/A"}</p>
          </div>
        )}
        {currentTab === 2 && (
          <div>
            <p><strong>Hourly Rate:</strong> {item.hourlyRate ?? "N/A"}</p>
            <p><strong>Hourly Rate per Head:</strong> {item.houryRatePerHead ?? "N/A"}</p>
            <p><strong>Monthly Rate:</strong> {item.monthlyRate ?? "N/A"}</p>
            <p><strong>Monthly Rate per Head:</strong> {item.monthlyRatePerHead ?? "N/A"}</p>
            <p><strong>SKU:</strong> {item.sku ?? "N/A"}</p>
          </div>
        )}
      </Box>
    </div>
  );
    case "catalogList":
    default:
      return (
        <>
          <p><strong>Type:</strong> {item.$type ?? "N/A"}</p>
          <p><strong>SKU:</strong> {item.sku ?? "N/A"}</p>
        </>
      );
  }
};

//add catalog
const onSubmit = async (formData) => {
  const catalogFormData = [{
    id: "", 
    name: formData.name,
    sku: formData.sku,
    catalogType: formData.catalogType,
    salePrice: parseFloat(formData.salePrice),
    costPrice: parseFloat(formData.costPrice),
    status: 0,
    ...dynamicFormData, // Include category-specific dynamic fields
  }];

  try {
    const response = await fetch(`${apiUrl}/api/Product/AddCatalog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(catalogFormData),
    });

    console.log("Submitting catalog data:", catalogFormData);
    

    if (!response.ok) {
      throw new Error(`Failed to add catalog: ${response.status}`);
    }

    const result = await response.json();
    console.log("Catalog added successfully:", result);
    alert("Catalog added!");
    reset(); // Clear form
    setCatalogDrawerVisible(false); // Close drawer
    refreshCatalogList(); // Refresh catalog list
  } catch (error) {
    console.error("Error adding catalog:", error);
    alert("Failed to add catalog. Check console for details.");
  }
};

//update catalog
const updateCatalog = {
  updateProductCatalog: async (catalogFormData) => {
    try{
      const response = await axios.put(
        `${apiUrl}/api/Product/UpdateCatalog`, catalogFormData,
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      return response.data;
    }catch (error){
      console.error("error updating product catalog:", error);
      throw error;
    }
  },
};

const handleEditCatalog = (category, item) => {
  setCurrentCatalog({ ...item, category });
  setcatalogType(item.catalogType);
  setDynamicFormData(item); 
  setIsEditing(true);
  setCatalogDrawerVisible(true);
};

const handleUpdate = async (formData) => {
  if (!currentCatalog) return;

  const catalogFormData = {
    id: currentCatalog.id,
    name: formData.name,
    sku: formData.sku,
    catalogType: formData.catalogType,
    SalePrice: parseFloat(formData.salePrice),
    costPrice: parseFloat(formData.costPrice),
    status: currentCatalog.status || 0,
    ...dynamicFormData,
  };

  try {
    const response = await fetch(`${apiUrl}/api/Product/UpdateCatalog`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([catalogFormData]), 
    });

    console.log("Sending update data:", catalogFormData);

    if (!response.ok) {
      const error = await response.json(); 
    //   console.error("Backend error details:", error);
      throw new Error(`Failed to update catalog: ${response.status}`);
    }

    const result = await response.json();
    console.log("Catalog updated successfully:", result);
    alert("Catalog updated!");
    reset();
    setCatalogDrawerVisible(false);
    setIsEditing(false);
    setCurrentCatalog(null);
    refreshCatalogList();

  } catch (error) {
    console.error("Error updating catalog:", error);
    alert(`Failed to update catalog: ${error.message}`);
  }
};
useEffect(() => {
  if (currentCatalog) {
    reset({
      name: currentCatalog.name,
      sku: currentCatalog.sku,
      categoryId: currentCatalog.categoryId,
      salePrice: currentCatalog.salePrice,
      costPrice: currentCatalog.costPrice,
    });
    setDynamicFormData(currentCatalog);
  }
}, [currentCatalog, reset]);


//refresh catalog list
const refreshCatalogList = useCallback(async () => {
    try {
        const response = await fetch(`${apiUrl}/api/Product/GetCatalog`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        });
    
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched data:", data);
        setCatalogData(data);
    } catch (error) {
        console.error("Error fetching catalog data:", error);
    }   
}, []);

useEffect(() => {
    refreshCatalogList();
}, []);





  return (
    <div className="product-container p-6 bg-white min-h-screen border border-gray-300 rounded-lg">
      {/* Header */}
      <div className="flex gap-238 mb-4">
       <h1 className="text-2xl font-semibold text-gray-900 mb-2">Catalogs</h1>
       <div className="search">
        <p className="text-sm mt-1 text-blue-600">Filter</p>
        <input className="search-input" />
       </div>
     </div>

     {/* Catalogs */}
    <div className="product-div2">
    <div className="flex flex-wrap gap-6 mb-4 ml-1"> {/* Added flex-wrap */}

        {/* {catalogEntries.map(([category, items]) =>
        items.map((item, index) => (
            <div
            key={`${category}-${index}`}
            className="bg-gray-20 p-4 rounded-lg border w-[32%] border-gray-300"
            >
            <div className="flex justify-between mb-5 ml-2">
                <h1 className="font-semibold text-gray-700 text-md">
                {item.name || "Catalog Name"}
                </h1>
                <Chip label={category} color="primary" variant="outlined" />
            </div>
            <div className="flex justify-between mb-5 text-gray-600 ml-2">
                <div className="flex flex-col gap-2">
                <p>Cost Price - LKR {item.costPrice ?? "N/A"}</p>
                <p>Sales Price - LKR {item.salePrice ?? "N/A"}</p>
                <p>Specifications - {item.specifications ?? "N/A"}</p>
                </div>
            </div>
            </div>
        ))
        )} */}

       {catalogEntries.map(([category, items]) =>
        items.map((item, index) => {
            const key = `${category}-${index}`;
            const isExpanded = expandedSpecs[key];

            return (
            <div
                key={key}
                className="bg-gray-20 p-4 rounded-lg border w-[32%] border-gray-300"
                onDoubleClick={() => handleEditCatalog(category, item)}
            >
                <div className="flex justify-between mb-5 ml-2">
                <h1 className="font-semibold text-gray-700 text-md">
                    {item.name || "Catalog Name"}
                </h1>
                {/* <Chip
                label={categoryMap[item.categoryId] ?? item.categoryId}
                color={chipColorMap[item.categoryId] ?? "default"}
                variant="outlined"
                /> */}
                {item.categoryId !== "000000" && (
                <Chip
                    label={categoryMap[item.categoryId] ?? item.categoryId}
                    color={chipColorMap[item.categoryId] ?? "default"}
                    variant="outlined"
                />
                )}
                </div>

                <div className="flex justify-between mb-5 text-gray-600 ml-2">
                <div className="flex flex-col gap-2">
                    <p>Cost Price - LKR {item.costPrice ?? "N/A"}</p>
                    <p>Sales Price - LKR {item.salePrice ?? "N/A"}</p>
                </div>
                </div>

                {/* Toggle button and expanded details */}
                <div className="text-right mt-2">
                <button
                    onClick={() =>
                    setExpandedSpecs((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                    }))
                    }
                    className="text-blue-700 font-semibold text-sm hover:underline"
                >
                    {isExpanded ? "Hide Details" : "Show More Details"}
                </button>

               {isExpanded && (
                <div className="mt-3 text-gray-700 text-sm border-t border-gray-200 pt-3 text-left ml-1">
                    {/* <p><strong>Specifications:</strong> {item.specifications ?? "N/A"}</p> */}
                    {/* <p><strong>Category:</strong> {categoryMap[item.categoryId] ?? item.categoryId}</p> */}
                    {renderDetails(category, item)}
                </div>
                )}
                </div>
            </div>
            );
        })
       )}

    </div>
    </div>


    {/* add new catalogs */}
    <div className="fixed bottom-6 right-10 z-50">
        <button 
        onClick={toggleCatalogDrawerVisibility(true)}
        data-tooltip-id="open-tooltip"
        data-tooltip-content="Add Catalog"
        className="px-4 py-2 bg-blue-950 rounded-3xl text-white text-lg font-bold shadow-lg hover:bg-blue-900">
            +
        </button>
        <Tooltip id="open-tooltip" place="left" />
    </div>

        <Drawer anchor="right" open={catalogDrawerVisible} onClose={() => {
        setCatalogDrawerVisible(false);
        setIsEditing(false);
        setCurrentCatalog(null);
        reset();
        }}>
            <Box sx={{ width: 500 }} role="presentation">
            </Box>
            <div className="font-bold text-xl text-blue-800 ml-7 mt-8">
            {isEditing ? "Edit Catalog" : "Add Catalog"}
            </div>
            <div className="mt-5">
                <div className="w-115 p-4 rounded">
                <form onSubmit={handleSubmit(isEditing ? handleUpdate : onSubmit)}>
                    <div className="w-115 ml-2 p-4 rounded">

                    <div className="form-group text-gray-600 ml-5 mt-8">
                        <label>Name:</label>
                        <input type="text" {...register("name")}  defaultValue={currentCatalog?.name || ""}/>
                    </div>
                    <div className="form-group text-gray-600 ml-5 mt-8">
                        <label>SKU:</label>
                        <input type="text" {...register("sku")}  defaultValue={currentCatalog?.sku || ""}/>
                    </div>
                    <div className="form-group text-gray-600 ml-5 mt-8">
                        <label>Category:</label>
                    <select
                    {...register("categoryId")}
                    value={catalogType} 
                    onChange={(e) => {
                        setcatalogType(e.target.value);
                        handleDynamicChange(e);
                    }}
                    >
                    {Object.entries(categoryMap).map(([id, name]) => (
                        <option key={id} value={id}>
                        {name}
                        </option>
                    ))}
                    </select>

                    </div>
                    <div className="form-group text-gray-600 ml-5 mt-8">
                        <label>Sale Price:</label>
                        <input type="text" {...register("salePrice")} defaultValue={currentCatalog?.salePrice || ""}/>
                    </div>
                    <div className="form-group text-gray-600 ml-5 mt-8">
                        <label>Cost Price:</label>
                        <input type="text" {...register("costPrice")} defaultValue={currentCatalog?.costPrice || ""}/>
                    </div>
                    {renderCategoryForm()}

                    <div className="ml-92">
                        <button className="px-4 py-2 bg-blue-800 rounded-xl text-white text-sm font-regular hover:bg-blue-900">Save</button>
                    </div>

                    </div>
                </form>
                </div>
            </div>
        </Drawer>

    </div>
  );
};

export default Catalogs;
