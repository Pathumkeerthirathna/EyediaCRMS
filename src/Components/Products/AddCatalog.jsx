import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
    EnumNetworkComponentConnectorType,
    EnumNetworkComponentType,
    EnumNetworkComponentSpecification,
    EnumMaterial,
} from "../../Constants";

const apiUrl = import.meta.env.VITE_API_URL;


const category = {
    "000000": "Default",
    "000001": "Software product",
    "000002": "Network component",
    "000003": "Electric device",
};

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
]


//add new catalogs
export const AddCatalogs = ({}) => {

   return(
   <>
    <div className="w-100 ml-6 bg-blue-50 p-4 rounded">
        <form>
            <div className="form-group text-gray-600 ml-5 mt-8">
                <label>ID:</label>
                <input type="text" name="id" />
            </div>
            <div className="form-group text-gray-600 ml-5 mt-8">
                <label>Name:</label>
                <input type="text" name="name" />
            </div>
            <div className="form-group text-gray-600 ml-5 mt-8">
                <label>SKU:</label>
                <input type="text" name="sku" />
            </div>
            <div className="form-group text-gray-600 ml-5 mt-8">
                <label>Category:</label>
                <select name="categoryId">
                    {Object.entries(category).map(([id, name]) => (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group text-gray-600 ml-5 mt-8">
                <label>Sale Price:</label>
                <input type="number" name="salePrice" />
            </div>
            <div className="form-group text-gray-600 ml-5 mt-8">
                <label>Cost Price:</label>
                <input type="number" name="costPrice" />
            </div>
        </form>
    </div>
    </>
);

};


//delete existing catalogs
export const DeactivateCatalogs = () => {

};