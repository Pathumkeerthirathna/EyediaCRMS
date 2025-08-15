import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import { Tooltip } from "react-tooltip";
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

const apiUrl = import.meta.env.VITE_API_URL;

const categoryMap = {
    "000000": "Default",
    "000001": "Software product",
    "000002": "Network component",
    "000003": "Electric device",
};


export const AddProducts = () => {
const [catalogData, setCatalogData] = useState([]);
const [selectedCatalogs, setSelectedCatalogs] = useState([]);

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

//add catalog
const onSubmit = async (formData) => {
  const productFormData = [{
    id: "", 
    name: formData.name,
    salePrice: parseFloat(formData.salePrice),
    costPrice: parseFloat(formData.costPrice),
    status: 0,
    catalogItems: [
    formData.catalogItems
  ],
  }];

  try {
    const response = await fetch(`${apiUrl}/api/Product/AddProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productFormData),
    });

    console.log("Submitting catalog data:", productFormData);
    

    if (!response.ok) {
      throw new Error(`Failed to add catalog: ${response.status}`);
    }

    const result = await response.json();
    console.log("Catalog added successfully:", result);
    alert("Catalog added!");
    reset(); // Clear form

  } catch (error) {
    console.error("Error adding catalog:", error);
    alert("Failed to add catalog. Check console for details.");
  }
};    
    return(
        <>
        <div className="add-prospect-phone-form-container w-110 mr-2 ml-6  p-4 rounded">
            <form>
                <div className="form-group text-gray-600 ml-3 mt-6">
                    <label htmlFor="name">P/Name</label>
                    <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="p-2 rounded mr-2 w-full"
                    />
                </div>

                <div className="form-group text-gray-600 ml-3 mt-6">
                    <label htmlFor="salePrice">Sale Price</label>
                    <input 
                    type="number" 
                    id="salePrice" 
                    name="salePrice" 
                    className="p-2 rounded mr-2 w-full"
                    />
                </div>

                <div className="form-group text-gray-600 ml-3 mt-6">
                    <label htmlFor="costPrice">Cost Price</label>
                    <input 
                    type="number" 
                    id="costPrice" 
                    name="costPrice" 
                    className="p-2 rounded mr-2 w-full"
                    />
                </div>

                <div className="form-group text-gray-600 font-semibold ml-3 mt-6">
                 <p>Select Catalogs below</p>
                </div>
                <div className="max-h-[300px] overflow-auto pr-2 ml-3 mt-6 mb-7">
                {catalogEntries.map(([category, items]) =>
                    items.map((item, index) => {
                        const key = `${category}-${index}`;
                        return (
                        <div
                            key={key}
                            className="flex items-start gap-3 bg-gray-50 p-3 rounded-md border border-gray-200 mb-2"
                        >
                            {/* Checkbox */}
                            <input
                            type="checkbox"
                            className="form-checkbox mt-1 h-4 w-4 text-blue-600"
                            checked={selectedCatalogs?.includes(item.id)}
                            onChange={() => handleCatalogSelect(item)}
                            />

                            {/* Name and Category (if not default) */}
                            <div className="flex flex-col text-sm text-gray-800">
                            <span className="font-medium">{item.name || "Catalog Name"}</span>
                            {item.categoryId !== "000000" && (
                                <span className="text-xs text-gray-500">
                                {categoryMap[item.categoryId] ?? item.categoryId}
                                </span>
                            )}
                            </div>
                        </div>
                        );
                    })
                    )}
                </div>


                <div className="ml-85 mt-5">
                    <button className="px-3 py-1 bg-blue-800 rounded-lg text-white">
                        Save 
                    </button>
                </div>
            </form>
        </div>
        </>
    )
};