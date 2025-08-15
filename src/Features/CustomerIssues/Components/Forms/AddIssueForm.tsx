import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

enum EnumCommunicationMethod {
  Phone = 1,
  Email,
  WhatsApp,
  SMS,
  InPerson,
  LiveChat,
  SocialMedia,
  Other,
}

import {Customer} from "../../../../types"

import { EnumClientType, EnumIndustryType, EnumBusinessType, EnumClientSource } from "../../../../Constants";

import CustomerListComponent from "../../../../Components/CustomerComponents/CustomerListComponent";

export const dummyCustomers: Customer[] = [
  {
    id: "CUST-1001",
    leadId: "LEAD-5001",
    name: "John Doe",
    cusomerType: EnumClientType.Individual,
    referrelNo: "REF12345",
    referrer: "Jane Smith",
    industry: EnumIndustryType.IT,
    businessType: EnumBusinessType.Services,
    source: EnumClientSource.Online,
    creditLimit: 15000,
    serviceStartedDate: "2023-01-15T00:00:00Z",
    conversionDate: "2023-02-10T00:00:00Z",
    contractDetails: "Standard yearly contract",
    createdAt: "2023-01-10T09:00:00Z",
    firstContactedDate: "2023-01-05T12:00:00Z",
    lastContactedDate: "2024-07-01T15:30:00Z",
    latitude: 6.9271,
    longitude: 79.8612,
    salesAgentId: "AGENT-001",
    status: 1,
    url: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "CUST-1002",
    leadId: "LEAD-5002",
    name: "Acme Corporation",
    cusomerType: EnumClientType.Corporate,
    referrelNo: "REF67890",
    referrer: "Corporate Partner",
    industry: EnumIndustryType.Manufacturing,
    businessType: EnumBusinessType.Production,
    source: EnumClientSource.Referral,
    creditLimit: 750000,
    serviceStartedDate: "2021-11-01T00:00:00Z",
    conversionDate: "2021-12-01T00:00:00Z",
    contractDetails: "3-year contract with quarterly payments",
    createdAt: "2021-10-20T08:00:00Z",
    firstContactedDate: "2021-10-15T10:30:00Z",
    lastContactedDate: "2024-07-01T16:00:00Z",
    latitude: 40.7128,
    longitude: -74.006,
    salesAgentId: "AGENT-002",
    status: 2,
    url: "https://randomuser.me/api/portraits/lego/1.jpg",
  },
  {
    id: "CUST-1003",
    leadId: "LEAD-5003",
    name: "Samantha Green",
    cusomerType: EnumClientType.Individual,
    referrelNo: "REF54321",
    referrer: undefined,
    industry: EnumIndustryType.Finance,
    businessType: EnumBusinessType.Consulting,
    source: EnumClientSource.SocialMedia,
    creditLimit: 20000,
    serviceStartedDate: "2024-01-10T00:00:00Z",
    conversionDate: "2024-02-05T00:00:00Z",
    contractDetails: "Monthly consulting contract",
    createdAt: "2024-01-01T07:00:00Z",
    firstContactedDate: "2023-12-20T09:15:00Z",
    lastContactedDate: "2024-07-01T17:00:00Z",
    latitude: 51.5074,
    longitude: -0.1278,
    salesAgentId: "AGENT-003",
    status: 1,
    url: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "CUST-1004",
    leadId: "LEAD-5004",
    name: "Global Tech Ltd",
    cusomerType: EnumClientType.Corporate,
    referrelNo: "REF11223",
    referrer: "Global Partner",
    industry: EnumIndustryType.Technology,
    businessType: EnumBusinessType.Development,
    source: EnumClientSource.Online,
    creditLimit: 500000,
    serviceStartedDate: "2022-06-10T00:00:00Z",
    conversionDate: "2022-07-01T00:00:00Z",
    contractDetails: "Annual support contract",
    createdAt: "2022-05-15T08:00:00Z",
    firstContactedDate: "2022-05-10T11:00:00Z",
    lastContactedDate: "2024-07-01T10:00:00Z",
    latitude: 34.0522,
    longitude: -118.2437,
    salesAgentId: "AGENT-004",
    status: 1,
    url: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "CUST-1005",
    leadId: "LEAD-5005",
    name: "Emma Watson",
    cusomerType: EnumClientType.Individual,
    referrelNo: "REF99887",
    referrer: "",
    industry: EnumIndustryType.Healthcare,
    businessType: EnumBusinessType.Services,
    source: EnumClientSource.Referral,
    creditLimit: 12000,
    serviceStartedDate: "2023-04-12T00:00:00Z",
    conversionDate: "2023-05-10T00:00:00Z",
    contractDetails: "Quarterly service contract",
    createdAt: "2023-04-01T09:00:00Z",
    firstContactedDate: "2023-03-30T10:00:00Z",
    lastContactedDate: "2024-07-01T14:00:00Z",
    latitude: 48.8566,
    longitude: 2.3522,
    salesAgentId: "AGENT-005",
    status: 2,
    url: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: "CUST-1006",
    leadId: "LEAD-5006",
    name: "Bright Future Inc",
    cusomerType: EnumClientType.Corporate,
    referrelNo: "REF77665",
    referrer: "Bright Partners",
    industry: EnumIndustryType.Education,
    businessType: EnumBusinessType.Services,
    source: EnumClientSource.Other,
    creditLimit: 300000,
    serviceStartedDate: "2020-09-01T00:00:00Z",
    conversionDate: "2020-10-01T00:00:00Z",
    contractDetails: "Multi-year educational program",
    createdAt: "2020-08-20T08:00:00Z",
    firstContactedDate: "2020-08-15T09:00:00Z",
    lastContactedDate: "2024-07-01T13:00:00Z",
    latitude: 37.7749,
    longitude: -122.4194,
    salesAgentId: "AGENT-006",
    status: 1,
    url: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "CUST-1007",
    leadId: "LEAD-5007",
    name: "Lucas Brown",
    cusomerType: EnumClientType.Individual,
    referrelNo: "REF33445",
    referrer: "Michael Scott",
    industry: EnumIndustryType.Retail,
    businessType: EnumBusinessType.Trading,
    source: EnumClientSource.SocialMedia,
    creditLimit: 18000,
    serviceStartedDate: "2023-02-15T00:00:00Z",
    conversionDate: "2023-03-10T00:00:00Z",
    contractDetails: "Yearly retail contract",
    createdAt: "2023-02-10T07:00:00Z",
    firstContactedDate: "2023-02-05T08:00:00Z",
    lastContactedDate: "2024-07-01T12:00:00Z",
    latitude: 52.5200,
    longitude: 13.405,
    salesAgentId: "AGENT-007",
    status: 1,
    url: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: "CUST-1008",
    leadId: "LEAD-5008",
    name: "Sophia Lee",
    cusomerType: EnumClientType.Individual,
    referrelNo: "REF22446",
    referrer: "Anna Kim",
    industry: EnumIndustryType.Education,
    businessType: EnumBusinessType.Consulting,
    source: EnumClientSource.Online,
    creditLimit: 14000,
    serviceStartedDate: "2024-03-01T00:00:00Z",
    conversionDate: "2024-03-20T00:00:00Z",
    contractDetails: "Consulting retainer",
    createdAt: "2024-02-25T06:00:00Z",
    firstContactedDate: "2024-02-20T07:00:00Z",
    lastContactedDate: "2024-07-01T11:00:00Z",
    latitude: 35.6895,
    longitude: 139.6917,
    salesAgentId: "AGENT-008",
    status: 1,
    url: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    id: "CUST-1009",
    leadId: "LEAD-5009",
    name: "Green Energy Solutions",
    cusomerType: EnumClientType.Corporate,
    referrelNo: "REF88990",
    referrer: "Eco Partner",
    industry: EnumIndustryType.Energy,
    businessType: EnumBusinessType.Production,
    source: EnumClientSource.Referral,
    creditLimit: 900000,
    serviceStartedDate: "2019-07-01T00:00:00Z",
    conversionDate: "2019-08-01T00:00:00Z",
    contractDetails: "5-year green energy contract",
    createdAt: "2019-06-15T05:00:00Z",
    firstContactedDate: "2019-06-10T06:00:00Z",
    lastContactedDate: "2024-07-01T10:00:00Z",
    latitude: 51.0447,
    longitude: -114.0719,
    salesAgentId: "AGENT-009",
    status: 2,
    url: "https://randomuser.me/api/portraits/lego/2.jpg",
  },
  {
    id: "CUST-1010",
    leadId: "LEAD-5010",
    name: "David Johnson",
    cusomerType: EnumClientType.Individual,
    referrelNo: "REF55667",
    referrer: "Nancy Drew",
    industry: EnumIndustryType.Media,
    businessType: EnumBusinessType.Services,
    source: EnumClientSource.Other,
    creditLimit: 16000,
    serviceStartedDate: "2023-05-01T00:00:00Z",
    conversionDate: "2023-06-01T00:00:00Z",
    contractDetails: "Monthly media service",
    createdAt: "2023-04-20T04:00:00Z",
    firstContactedDate: "2023-04-15T05:00:00Z",
    lastContactedDate: "2024-07-01T09:00:00Z",
    latitude: 41.8781,
    longitude: -87.6298,
    salesAgentId: "AGENT-010",
    status: 1,
    url: "https://randomuser.me/api/portraits/men/29.jpg",
  },
];

type AddIssueFormProps = {
  onSubmit: (data: {
    productID: string;
    moduleID: string;
    categoryID: string;
    issueDesc: string;
    communicationMethod: EnumCommunicationMethod;
  }) => void;
};

export default function AddIssueForm({ onSubmit }: AddIssueFormProps) {
    const [CustomerID, setCustomerID] = useState("000000");
    const [productID, setProductID] = useState("000000");
    const [moduleID, setModuleID] = useState("000000");
    const [categoryID, setCategoryID] = useState("");
    const [issueDesc, setIssueDesc] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [communicationMethod, setCommunicationMethod] = useState<EnumCommunicationMethod>(
    EnumCommunicationMethod.Phone
    
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ productID, moduleID, categoryID, issueDesc, communicationMethod });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
    >
      <TextField
        label="Customer"
        value={productID}
        onChange={(e) => setCustomerID(e.target.value)}
        size="small"
        fullWidth
        onClick={() => setDrawerOpen(true)} // Open drawer on click
          InputProps={{
            readOnly: true,
          }}
      />

      <TextField
        label="Product ID"
        value={productID}
        onChange={(e) => setProductID(e.target.value)}
        size="small"
        fullWidth
      />

      <TextField
        label="Module ID"
        value={moduleID}
        onChange={(e) => setModuleID(e.target.value)}
        size="small"
        fullWidth
      />

      <TextField
        label="Category ID"
        value={categoryID}
        onChange={(e) => setCategoryID(e.target.value)}
        required
        size="small"
        fullWidth
      />

      <TextField
        label="Issue Description"
        value={issueDesc}
        onChange={(e) => setIssueDesc(e.target.value)}
        required
        multiline
        minRows={3}
        size="small"
        fullWidth
      />

      <FormControl fullWidth size="small">
        <InputLabel id="comm-method-label">Communication Method</InputLabel>
        <Select
          labelId="comm-method-label"
          value={communicationMethod}
          label="Communication Method"
          onChange={(e) =>
            setCommunicationMethod(Number(e.target.value) as EnumCommunicationMethod)
          }
          required
        >
          {Object.entries(EnumCommunicationMethod)
            .filter(([key]) => isNaN(Number(key))) // filter enum names only
            .map(([key, val]) => (
              <MenuItem key={key} value={val as number}>
                {key}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      


 {/* Drawer with Customer List */}
      <CustomerListComponent
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        customers={dummyCustomers}
        // Add a handler inside UserListComponent for selection if needed
      />

    </Box>

   
  );
}
