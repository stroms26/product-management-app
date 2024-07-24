// productlist.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = ({ onDelete, refreshProductList }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [refreshProductList]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://conficus.com/fetch_products.php"
      );
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Invalid response from server:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productIds) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${productIds.length} product(s)?`
      )
    ) {
      try {
        const response = await axios.delete(
          "https://conficus.com/delete_products.php",
          {
            data: { ids: productIds },
          }
        );

        if (response.status === 204) {
          fetchProducts();
          setSelectedProductIds([]);
        } else {
          console.error("Cannot delete products:", response.data);
          alert("Failed to delete products. See console for details.");
        }
      } catch (error) {
        console.error("Cannot delete products:", error);
        alert("There was a problem deleting the products.");
      }
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProductIds((prevIds) => {
      if (prevIds.includes(productId)) {
        return prevIds.filter((id) => id !== productId);
      } else {
        return [...prevIds, productId];
      }
    });
  };

  const handleMassDelete = () => {
    if (selectedProductIds.length > 0) {
      handleDelete(selectedProductIds);
    } else {
      alert("Atzime vismaz vienu produktu.");
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      <div>
        <Link to="/add-product" id="add-product-btn">
          Add Product
        </Link>
        <button id="mass-delete-btn" onClick={handleMassDelete}>
          Mass Delete
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              className="product-item"
              key={product.id}
              data-product-id={product.id}
            >
              <input
                type="checkbox"
                className="delete-checkbox"
                onChange={() => handleCheckboxChange(product.id)}
                checked={selectedProductIds.includes(product.id)}
              />
              <h2>{product.TYPE}</h2>
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Name:</strong> {product.NAME}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              {product.TYPE === "DVD" && (
                <p>
                  <strong>Size (MB):</strong> {product.size}
                </p>
              )}
              {product.TYPE === "Book" && (
                <p>
                  <strong>Weight (KG):</strong> {product.weight}
                </p>
              )}
              {product.TYPE === "Furniture" && (
                <p>
                  <strong>Dimensions (H x W x L):</strong> {product.height} x{" "}
                  {product.width} x {product.LENGTH}
                </p>
              )}
              <button onClick={() => handleDelete([product.id])}>Delete</button>{" "}
              {/* Pass ID as array */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
