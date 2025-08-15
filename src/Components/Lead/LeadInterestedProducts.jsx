import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import {
  EnumDealStage,
} from "../../Constants";

const apiUrl = import.meta.env.VITE_API_URL;



//form values to add products for leads
const initialFormValues = 
    [
  {
    id: "",
    leadID: "",
    productID: "",
    likelihoodToConvert: 0,
    dealStage: 1,
    status: 0,
    catalogs: [
      {
        id: "",
        leadInterestedProductID: "",
        productID: "",
        catalogID: "",
        status: 0,
        leadInterestedModules: [
          {
            id: "",
            leadInterestedProductCatalogID: "",
            catalogID: "",
            moduleID: "",
            status: 0
          }
        ]
      }
    ]
  }
];




//lead product selection
export const SelectProducts = ({leadID}) => {

const [productList, setProductList] = useState([]);
const [catalogList, setCatalogList] = useState([]);
const [catalogID, setCatalogID] = useState([]);
const [selectedProductIDs, setSelectedProductIDs] = useState([]);
const [productCatalogs, setProductCatalogs] = useState({});
const [selectedCatalogIDs, setSelectedCatalogIDs] = useState({});


    //fetch products 
  useEffect(() => {
  const getProduct = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/Product/GetProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(null),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const rawData = await response.json();
      console.log("Fetched Products:", rawData); // Console log here

      if (Array.isArray(rawData) && Array.isArray(rawData[0])) {
        setProductList(rawData[0]);
      } else if (Array.isArray(rawData)) {
        setProductList(rawData);
      } else {
        setProductList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getProduct();
   }, []);

//fetch catalogs 
  // const handleProductCheck = async (id) => {

  //   try {
  //     const response = await fetch(`${apiUrl}/api/Product/GetProduct`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id: id }), 
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Response Data:", data);

  //     // setCatalogList(data[0]); // Assuming data is the catalog list
  //     // console.log("Catalog List:", catalogList); 

  //     setCatalogList(data[0].catalogs); // Get the catalogs array 
  //     console.log("Catalog List:", data[0].catalogs); 


  //     // Handle the response data as needed
  //   } catch (error) {
  //     console.error("Error fetching catalogs:", error);

  //   }
  // };

  const handleProductCheck = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/api/Product/GetProduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();
    const catalogs = data[0]?.catalogs || [];
    setProductCatalogs((prev) => ({ ...prev, [id]: catalogs }));

    console.log("fetched catalogs for product ID:", data);
    
  } catch (error) {
    console.error("Error fetching catalogs:", error);
  }
};

const toggleCatalogSelection = (productID, catalogID, checked) => {
  setSelectedCatalogIDs((prev) => {
    const current = prev[productID] || [];
    const updated = checked
      ? [...current, catalogID]
      : current.filter((id) => id !== catalogID);
    const newState = { ...prev, [productID]: updated };

    // Flatten all selected catalog IDs and update form
    const allSelected = Object.values(newState).flat();
    setValue("catalogID", allSelected.join(","));

    return newState;
  });
};

 const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialFormValues, });

    useEffect(() => {
      setValue("leadID", leadID);
    }, [leadID, setValue]);

   const formRef = useRef(null);

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    const selectionData =   [
  {
    id: data.id,
    leadID: data.leadID,
    productID: data.productID,
    likelihoodToConvert: 0,
    dealStage: parseInt(data.dealStage),
    status: 0,
    catalogs: [
      {
        id: data.id,
        leadInterestedProductID: data.leadInterestedProductID,
        productID: data.productID,
        catalogID: data.catalogID,
        status: 0,
        leadInterestedModules: [
          {
            id: data.id,
            leadInterestedProductCatalogID: data.leadInterestedProductCatalogID,
            catalogID: data.catalogID,
            moduleID: data.moduleID,
            status: 0,
          }
        ]
      }
    ]
  }
];

    //convert prospect into lead
    try {
      const response = await axios.put(
        `${apiUrl}/api/Lead/AddLeadInterestedProduct`,
        selectionData, {
            leadID: data.leadID,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data); // response 
      reset();

    } catch (error) {
      console.error("Error converting:", error);
      alert("Failed to add and convert. Please try again.");
    }
  };

  return(
    <>
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 rounded-lg w-100 mr-2 ml-6">

              {/* <div className="form-group text-gray-600 ml-5">
                  <label htmlFor="leadID">Lead ID</label>
                  <input
                    {...register("leadID")}
                    id="leadID"
                    className="p-2 rounded mr-2 w-full"
                    placeholder="Lead ID"
                  />
              </div> */}

               <div className="form-group text-gray-600 ml-5 mt-1">
                    <label htmlFor="dealStage" className="mr-5">Deal Stage</label>
                    <select
                      {...register("dealStage", { required: true })}
                      id="dealStage"
                      className="p-2 rounded mr-1 ml-2 w-90"
                      defaultValue=""
                    >
                      <option value="" disabled>Select Deal Stage</option>
                      {Object.entries(EnumDealStage).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>


              <div className="form-group text-gray-600 ml-5 mt-6">
                  <label htmlFor="productID">product ID</label>
                  <input
                    {...register("productID")}
                    id="productID"
                    className="p-2 rounded mr-1 ml-2 w-90"
                    placeholder="product ID"
                  />
              </div>

              <div className="form-group text-gray-600 ml-5 mt-6">
                  <label htmlFor="catalogID">Catalog ID</label>
                  <input
                    {...register("catalogID")}
                    id="catalogID"
                    className="p-2 rounded mr-1 ml-2 w-90"
                    placeholder="catalog ID"
                    readOnly
                  />
              </div>


            {productList.map((product) => (
              <ul key={product.id} className="border border-gray-200 p-4 rounded-lg bg-white p-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="text-md text-gray-700 font-regular">{product.name}</div>
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={selectedProductIDs.includes(product.id)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const updatedIDs = isChecked
                        ? [...selectedProductIDs, product.id]
                        : selectedProductIDs.filter((id) => id !== product.id);
                      setSelectedProductIDs(updatedIDs);
                      setValue("productID", updatedIDs.join(","));

                      if (isChecked) handleProductCheck(product.id);
                    }}
                  />
                </div>

              {selectedProductIDs.includes(product.id) && productCatalogs[product.id] && (
                <ul className="mt-2 ml-4 pl-4 space-y-1">
                    {productCatalogs[product.id].map((catalog) => (
                    <li key={catalog.id} className="flex items-center">
                        <input
                        type="checkbox"
                        className="mr-2"
                        checked={(selectedCatalogIDs[product.id] || []).includes(catalog.id)}
                        onChange={(e) => {
                            toggleCatalogSelection(product.id, catalog.id, e.target.checked);
                        }}
                        />
                        <span className="text-gray-600">{catalog.name}</span>
                    </li>
                    ))}
                </ul>
                )}
              </ul>
            ))}

            <button
                type="submit"
                style={{
                width: '4rem',
                height: '2rem',
                minWidth: '5rem',
                borderRadius: '5px',
                backgroundColor: '#1976d2',
                marginLeft: '17.5rem',
                marginTop: '1rem',
                textTransform: 'none',
                padding: 0,
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                }}>
                Save
            </button>


        </div>
   </form>         
    </>
  )
};
