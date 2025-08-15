import React, { useState, useEffect, useRef, useCallback } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import Box from '@mui/material/Box';
import { Tooltip } from "react-tooltip";
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { ChevronDown } from "lucide-react";
import Chip from '@mui/material/Chip';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Button from '@mui/material/Button';
// import "./Products.css";

import { AddProducts } from "../../Components/Products/AddProducts";

const apiUrl = import.meta.env.VITE_API_URL;

const Products = () => {
  const [productData, setProductData] = useState([]);


  //fetches from an API 
    useEffect(() => {
  
      const getProduct = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/Product/GetProduct`, {
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
          setProductData(data);
        } catch (error) {
          console.error("Error fetching lead data:", error);
        }
      };
  
      getProduct();
    }, []);


//drawers
const [productDrawerVisible, setProductDrawerVisible] = React.useState(false);

//functions to toggle drawer 
const toggleProductDrawerVisibility = (visible) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setProductDrawerVisible(visible);
};

  return (
    <div className="product-container p-6 bg-white min-h-screen border border-gray-300 rounded-lg">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Products</h1>

      {/* Summary Cards */}
      <div className="card-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
       <div className="bg-gray-20 p-4 rounded-lg border border-gray-300 ml-2">
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
            <p className="text-2xl font-semibold text-blue-800">4</p>
            </div>
            {/* <button 
             onClick={toggleProductDrawerVisibility(true)}
            className="px-3 py-1 rounded-lg bg-blue-800 text-white font-bold">+</button> */}

            <Drawer anchor="right" open={productDrawerVisible} onClose={toggleProductDrawerVisibility(false)}>
                <Box sx={{ width: 500 }} role="presentation" onClick={toggleProductDrawerVisibility(false)} onKeyDown={toggleProductDrawerVisibility(false)}>
                </Box>
                <div className="font-bold text-xl text-blue-800 ml-7 mt-8">Add Products</div>
                <div className="mt-5">
                    <AddProducts/>
                </div>
                
           </Drawer>
        </div>
        </div>

        <div className="bg-gray-20 p-4 rounded-lg border border-gray-300">
          <h2 className="text-sm font-medium text-gray-500">Catalogs</h2>
          <p className="text-2xl font-semibold text-orange-400">10</p>
        </div>
        <div className="bg-gray-20 p-4 mr-4 rounded-lg border border-gray-300 flex items-center justify-center text-blue-600">
          <PlusCircle className="mr-2" 
          onClick={toggleProductDrawerVisibility(true)}
          />
          Add New Product
        </div>
        {/* img */}
    {/* <div className="flex flex-wrap justify-center gap-7 sm:justify-start sm:ml-12">
        <img className="w-16 h-16 sm:w-20 sm:h-20" src="/src/assets/system.png" alt="System" />
        <img className="w-16 h-16 sm:w-20 sm:h-20" src="/src/assets/cubes.png" alt="Cubes" />
        <img className="w-16 h-16 sm:w-20 sm:h-20" src="/src/assets/tech.png" alt="Tech" />
    </div> */}

      </div>
      </div>

      {/* Products */}
      <div className="product-div2">
      {/* <div className="bg-gray-20 p-4 rounded-lg border border-gray-300 h-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Product List</h3>
          <button className="px-4 py-1 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition">
            See Product Details
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b border-gray-200 font-medium text-gray-600">
              <tr>
                <th className="py-2 px-4">Product/N</th>
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Sales Price</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {catalogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-gray-400">
                    No product logs available
                  </td>
                </tr>
              ) : (
                catalogs.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="py-2 px-4 font-medium text-gray-700">Product</td>
                    <td className="py-2 px-4">{item}</td>
                    <td className="py-2 px-4">200$</td>
                    <td className="py-2 px-4">
                      <span className="text-green-600 font-semibold">Active</span>
                    </td>
                    <td className="py-2 px-4">
                      <button onClick={() => removeCatalog(index)} className="text-red-500 hover:underline">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> */}

      <div className="flex gap-5 mb-4">

      <div className="flex flex-wrap gap-8 ml-2">
        {productData?.[0]?.map((product, index) => (
          <div
            key={product.id}
            className="bg-gray-20 p-4 rounded-lg border border-gray-300 w-[48%]"
          >
            {/* Product Header */}
            <div className="flex justify-between mb-5 ml-2 items-center">
              <h1 className="font-bold text-gray-700 text-md">{product.name}</h1>
              <Chip
                label={product.status === 1 ? "Active" : "Inactive"}
                color={product.status === 1 ? "success" : "default"}
                variant="filled"
              />
            </div>

            {/* Price Info & Add Catalog */}
            <div className="flex justify-between mb-5 text-gray-600 ml-2 items-center">
              <div className="flex gap-6">
                <p>Cost Price - ${product.costPrice}</p>
                <p>Sales Price - ${product.salePrice}</p>
              </div>
              <button
                data-tooltip-id={`open-tooltip-${index}`}
                data-tooltip-content="Add Catalog"
                className="bg-blue-800 font-bold px-3 py-1 text-white text-md rounded-2xl"
              >
                +
              </button>
              <Tooltip id={`open-tooltip-${index}`} place="right-end" />
            </div>

            {/* Catalog Accordion */}
            {product.catalogs?.length > 0 && (
              <div className="max-h-[300px] overflow-auto pr-2">
                {product.catalogs.map((catalog, cIndex) => (
                  <Accordion key={cIndex} className="rounded-lg mb-2">
                      <AccordionSummary
                        expandIcon={<ChevronDown />}
                        aria-controls={`panel${index}-${cIndex}-content`}
                        id={`panel${index}-${cIndex}-header`}
                      >
                         <Typography component="span" className="flex justify-between w-full">
                        <span className="text-gray-700 text-md">{catalog.name}</span>
                        <span className="text-xs text-blue-400 mr-3 mt-1">{catalog.$type}</span>
                      </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {catalog.$type === "Electric Devices" && (
                          <>
                            <p><strong>Specifications:</strong> {catalog.specifications}</p>
                            <p><strong>Height:</strong> {catalog.height}</p>
                            <p><strong>Width:</strong> {catalog.width}</p>
                            <p><strong>Depth:</strong> {catalog.depth}</p>
                          </>
                        )}

                        {catalog.$type === "SoftwareProduct" && (
                          <>
                            <p><strong>Version:</strong> {catalog.compliance}</p>
                            <p><strong>License:</strong> {catalog.databaseName}</p>
                            <p><strong>Supported OS:</strong> {catalog.softwareRequirements}</p>
                          </>
                        )}

                        {catalog.$type === "Network Component" && (
                          <>
                            <p><strong>Bandwidth:</strong> {catalog.bandwidth}</p>
                            <p><strong>Protocol:</strong> {catalog.protocol}</p>
                            <p><strong>Ports:</strong> {catalog.ports}</p>
                          </>
                        )}

                        {/* Default fallback if type unknown */}
                        {!["Electric Devices", "SoftwareProduct", "Network Component"].includes(catalog.$type) && (
                          <p>No detailed information available for this catalog type.</p>
                        )}

                        <p className="text-red-600 text-sm mt-4 text-right cursor-pointer">
                          Delete
                        </p>
                      </AccordionDetails>
                  </Accordion>
                ))}

              </div>
            )}
          </div>
        ))}
      </div>

      </div>


      </div>

      {/* New Product Form */}
      {/* <div className="mt-6 bg-white p-6 rounded-lg shadow max-w-md">
        <h3 className="text-lg font-semibold mb-3">New Product</h3>
        <label className="block text-sm mb-1">Name</label>
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          className="border px-3 py-2 w-full rounded mb-3"
        />
        <button
          onClick={addProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </div> */}
    </div>
  );
};

export default Products;
