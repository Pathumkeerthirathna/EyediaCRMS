import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const GetProduct = () => {
  const [productList, setProductList] = useState([]);

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
        console.log("Raw data:", rawData);

        if (Array.isArray(rawData) && Array.isArray(rawData[0])) {
          setProductList(rawData[0]); // nested array
        } else if (Array.isArray(rawData)) {
          setProductList(rawData); // flat array
        } else {
          setProductList([]);
        }

        // const data = await response.json();
        // console.log("API response:", data);

        // console.log("Raw response:", data);


        // setProductList((data.resData && Array.isArray(data.resData[0])) ? data.resData[0] : []);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getProduct();
  }, []);

  return (
     <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      {productList.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul className="space-y-2">
          {productList.map((product) => (
            <li
              key={product.id}
              className="border p-3 rounded shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">ID: {product.id}</p>
              <p className="text-sm font-medium text-green-700">
                Sale Price: ${product.salePrice}
              </p>
              <p className="text-sm text-red-500">
                Cost Price: ${product.costPrice}
              </p>
              <p className="text-sm">
                Status: {product.status === 1 ? "Inactive" : "Active"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetProduct;
