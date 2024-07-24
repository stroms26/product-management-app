// app.js
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch

  useEffect(() => {
    fetchProducts(); // Fetch initially on component mount
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchProducts(); // Re-fetch when refresh is triggered
      setRefresh(false); // Reset refresh after fetching
    }
  }, [refresh]);

  const fetchProducts = () => {
    setIsLoading(true);
    axios
      .get("https://conficus.com/fetch_products.php")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Invalid response from server:", response.data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          "https://conficus.com/delete_products.php",
          { data: { id: productId } }
        );

        if (response.status === 204) {
          setRefresh(true);
        } else {
          alert("Failed to delete product. Check console for details.");
          console.error(response.data);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  const handleProductAdded = () => {
    setRefresh(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProductList
              products={products}
              onDelete={handleDelete}
              refreshProductList={refresh}
              isLoading={isLoading}
            />
          }
        />
        <Route
          path="/add-product"
          element={<AddProduct onProductAdded={handleProductAdded} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
