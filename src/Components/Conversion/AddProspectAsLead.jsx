import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  EnumDealStage,
} from "../../Constants";

const apiUrl = import.meta.env.VITE_API_URL;

//step 0 - imports from prospect
const defaultValues = {
  prospectID: "",
  leadID: "",
  isAddressesImported: true,
  isPhonesImported: true,
  isEmailsImported: true,
  isContactPersonsImported: true,
};

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
       
      }
    ]
  }
];


const steps = ['Select what to import', 'Select Lead Interested Products', 'Confirm and Convert'];

//stepper to convert prospect into lead
export const AddProspectAsLead = ({ prospectID }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const formRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [leadID, setLeadID] = useState("");

  useEffect(() => {
    setValue("prospectID", prospectID);
  }, [prospectID, setValue]);

  const handleSaveAndNext = async (data) => {
    const conversionData = {
      prospectID: data.prospectID,
      leadID: data.leadID,
      isAddressesImported: data.isAddressesImported,
      isPhonesImported: data.isPhonesImported,
      isEmailsImported: data.isEmailsImported,
      isContactPersonsImported: data.isContactPersonsImported,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/Lead/AddProspectAsLead`,
        conversionData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Conversion Response:", response.data);

      setLeadID(response.data.leadID);

      setCompleted((prev) => ({ ...prev, [activeStep]: true }));
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error converting:", error);
      alert("Failed to add and convert. Please try again.");
    }
  };

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    setCompleted((prev) => ({ ...prev, [activeStep]: true }));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleFinalConfirm = () => {
    alert('Lead conversion completed!');
    handleReset(); // Or close drawer/modal here
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form ref={formRef} onSubmit={handleSubmit(handleSaveAndNext)}>
            <div className="w-213 ml-2 border border-gray-300 p-4 rounded-lg">
              <div className='ml-127 text-xs text-green-800'>
                <div>*All imports are selected on default, change accordingly</div>
              </div>

              <div className="ml-5 mt-9 mb-6 text-gray-600 space-y-5">
                <div className="flex items-center">
                  <label className="w-56" htmlFor="isContactPersonsImported">Import Contact Persons?</label>
                  <input type="checkbox" {...register("isContactPersonsImported")} id="isContactPersonsImported" />
                </div>
                <div className="flex items-center">
                  <label className="w-56" htmlFor="isEmailsImported">Import Emails?</label>
                  <input type="checkbox" {...register("isEmailsImported")} id="isEmailsImported" />
                </div>
                <div className="flex items-center">
                  <label className="w-56" htmlFor="isAddressesImported">Import Addresses?</label>
                  <input type="checkbox" {...register("isAddressesImported")} id="isAddressesImported" />
                </div>
                <div className="flex items-center">
                  <label className="w-56" htmlFor="isPhonesImported">Import Phones?</label>
                  <input type="checkbox" {...register("isPhonesImported")} id="isPhonesImported" />
                </div>
              </div>
            </div>
          </form>
        );

      case 1:
        return (
          <div className="p-4 border border-gray-300 rounded-lg">
            <div className='flex'>
              <div className="text-md text-gray-800 font-semibold mb-4">Product List</div>
              <div className='ml-130 text-xs text-green-800'>*Select Lead interested products</div>
            </div>
            <SelectProducts 
            leadID={leadID} />
          </div>
        );

      case 2:
        return (
          <div className="p-4 border border-gray-300 rounded-lg">
            <div className="text-lg font-semibold mb-2">Confirm Conversion</div>
            <div className="mb-2 text-gray-600">Please review the selected details before proceeding.</div>
          </div>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              {getStepContent(activeStep)}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {activeStep !== 0 && (
                <Button
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              )}
              <Box sx={{ flex: '1 1 auto' }} />

              {activeStep === 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (formRef.current) {
                      formRef.current.requestSubmit();
                    }
                  }}
                >
                  Save & Next
                </Button>
              )}

              {activeStep === 1 && (
                <Button
                  // variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}

              {activeStep === 2 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleFinalConfirm}
                >
                  Confirm and Close
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
};


//lead product selection - step 1
export const SelectProducts = ({ leadID }) => {
  const [productList, setProductList] = useState([]);
  const [catalogList, setCatalogList] = useState([]);
  const [catalogID, setCatalogID] = useState([]);
  const [selectedProductIDs, setSelectedProductIDs] = useState([]);
  const [productCatalogs, setProductCatalogs] = useState({});
  const [selectedCatalogIDs, setSelectedCatalogIDs] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialFormValues });

  const formRef = useRef(null);

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
        console.log("Fetched Products:", rawData);

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

  // updated to fetch and toggle dropdown
  const handleProductCheck = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/Product/GetProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const catalogs = data[0]?.[0]?.catalogs || [];

      setProductCatalogs((prev) => ({
        ...prev,
        [id]: {
          isOpen: true,
          catalogs: catalogs,
        },
      }));

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

      const allSelected = Object.values(newState).flat();
      setValue("catalogID", allSelected.join(","));

      return newState;
    });
  };

  const onSubmit = async (data) => {
    // validation: at least one product + one catalog
    const atLeastOneProduct = selectedProductIDs.length > 0;
    const atLeastOneCatalog = Object.values(selectedCatalogIDs).some(
      (catalogs) => catalogs.length > 0
    );

    if (!atLeastOneProduct || !atLeastOneCatalog) {
      alert("Please select at least one product and one catalog.");
      return;
    }

    console.log("Form data:", data);

    const selectionData = [
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
            leadInterestedProductID: data.leadInterestedProductID || "string",
            productID: data.productID,
            catalogID: data.catalogID,
            status: 0,
          },
        ],
      },
    ];

    try {
      const response = await axios.put(
        `${apiUrl}/api/Lead/AddLeadInterestedProduct`,
        selectionData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error converting:", error);
      alert("Failed to add and convert. Please try again.");
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 rounded-lg">
          <div className="flex">
            <div className="text-gray-600 ml-1 mt-2 mb-3">
              <label htmlFor="leadID">Lead ID</label>
              <input
                {...register("leadID")}
                id="leadID"
                className="p-2 rounded w-65 border border-gray-200 ml-15"
                placeholder="Lead ID"
              />
            </div>

            <div className="text-gray-600 ml-6 mt-2 mb-3">
              <label htmlFor="dealStage" className="mr-5">
                Deal Stage
              </label>
              <select
                {...register("dealStage", { required: true })}
                id="dealStage"
                className="p-2 rounded w-63 border border-gray-200 ml-4"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Deal Stage
                </option>
                {Object.entries(EnumDealStage).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex">
            <div className="text-gray-600 ml-1 mt-2 mb-4">
              <label htmlFor="productID">product ID</label>
              <input
                {...register("productID")}
                id="productID"
                className="p-2 rounded w-65 border border-gray-200 ml-10"
                placeholder="product ID"
              />
            </div>

            <div className="text-gray-600 ml-6 mt-2 mb-4">
              <label htmlFor="catalogID">Catalog ID</label>
              <input
                {...register("catalogID")}
                id="catalogID"
                className="p-2 rounded w-64 border border-gray-200 ml-10"
                placeholder="catalog ID"
                readOnly
              />
            </div>
          </div>

          {productList.map((product) => {
            const isSelected = selectedProductIDs.includes(product.id);
            const isDropdownOpen = productCatalogs[product.id]?.isOpen;
            const catalogs = productCatalogs[product.id]?.catalogs || [];

            return (
              <ul key={product.id} className="border border-gray-200 p-4 rounded-lg bg-white p-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="text-md text-gray-700 font-regular">{product.name}</div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isSelected}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedIDs = isChecked
                          ? [...selectedProductIDs, product.id]
                          : selectedProductIDs.filter((id) => id !== product.id);
                        setSelectedProductIDs(updatedIDs);
                        setValue("productID", updatedIDs.join(","));

                        if (!isChecked) {
                          setProductCatalogs((prev) => {
                            const copy = { ...prev };
                            delete copy[product.id];
                            return copy;
                          });
                          setSelectedCatalogIDs((prev) => {
                            const copy = { ...prev };
                            delete copy[product.id];
                            return copy;
                          });
                        }
                      }}
                    />

                    {isSelected && (
                      <button
                        type="button"
                        className="text-sm text-blue-600 underline"
                        onClick={() => {
                          if (!productCatalogs[product.id]) {
                            handleProductCheck(product.id);
                          } else {
                            setProductCatalogs((prev) => ({
                              ...prev,
                              [product.id]: {
                                ...prev[product.id],
                                isOpen: !prev[product.id].isOpen,
                              },
                            }));
                          }
                        }}
                      >
                        {isDropdownOpen ? "Hide Catalogs" : "Show Catalogs"}
                      </button>
                    )}
                  </div>
                </div>

                {isSelected && isDropdownOpen && catalogs.length > 0 && (
                  <ul className="mt-2 ml-4 pl-4 space-y-1">
                    {catalogs.map((catalog) => (
                      <li key={catalog.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={(selectedCatalogIDs[product.id] || []).includes(catalog.id)}
                          onChange={(e) =>
                            toggleCatalogSelection(product.id, catalog.id, e.target.checked)
                          }
                        />
                        <span className="text-gray-600">{catalog.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </ul>
            );
          })}

          <button
            type="submit"
            style={{
              width: "4rem",
              height: "2rem",
              minWidth: "5rem",
              borderRadius: "5px",
              backgroundColor: "#1976d2",
              marginLeft: "43.5rem",
              marginTop: "1rem",
              textTransform: "none",
              padding: 0,
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

