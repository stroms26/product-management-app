import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    sku: "",
    NAME: "",
    price: "",
    TYPE: "DVD",
    size: "",
    weight: "",
    height: "",
    width: "",
    LENGTH: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.sku) errors.sku = "SKU is required.";
    if (!formData.NAME) errors.NAME = "Name is required.";
    if (!formData.price) errors.price = "Price is required.";
    if (formData.TYPE === "DVD" && !formData.size)
      errors.size = "Size is required.";
    if (formData.TYPE === "Book" && !formData.weight)
      errors.weight = "Weight is required.";
    if (formData.TYPE === "Furniture") {
      if (!formData.height) errors.height = "Height is required.";
      if (!formData.width) errors.width = "Width is required.";
      if (!formData.LENGTH) errors.LENGTH = "Length is required.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      sku: formData.sku,
      NAME: formData.NAME,
      price: formData.price,
      TYPE: formData.TYPE,
    };

    if (formData.TYPE === "DVD") {
      productData.size = formData.size;
    } else if (formData.TYPE === "Book") {
      productData.weight = formData.weight;
    } else if (formData.TYPE === "Furniture") {
      productData.height = formData.height;
      productData.width = formData.width;
      productData.LENGTH = formData.LENGTH;
    }

    try {
      const response = await axios.post(
        "https://conficus.com/add_product.php",
        productData
      );
      alert(response.data.message || JSON.stringify(response.data));
      onProductAdded();
      navigate("/");
    } catch (error) {
      console.error("Error adding product: ", error.message);
      alert(`Error adding product: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="product_form">
      <label>
        SKU:
        <input
          type="text"
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
        />
        {errors.sku && <p className="error">{errors.sku}</p>}
      </label>
      <label>
        Name:
        <input
          type="text"
          id="name"
          name="NAME"
          value={formData.NAME}
          onChange={handleChange}
          required
        />
        {errors.NAME && <p className="error">{errors.NAME}</p>}
      </label>
      <label>
        Price ($):
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        {errors.price && <p className="error">{errors.price}</p>}
      </label>
      <label>
        Type:
        <select
          id="productType"
          name="TYPE"
          value={formData.TYPE}
          onChange={handleChange}
          required
        >
          <option value="DVD">DVD</option>
          <option value="Book">Book</option>
          <option value="Furniture">Furniture</option>
        </select>
      </label>

      {formData.TYPE === "DVD" && (
        <label>
          Size (MB):
          <input
            type="number"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
          {errors.size && <p className="error">{errors.size}</p>}
          <p className="description">Please, provide size in MB.</p>
        </label>
      )}

      {formData.TYPE === "Book" && (
        <label>
          Weight (KG):
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
          {errors.weight && <p className="error">{errors.weight}</p>}
          <p className="description">Please, provide weight in KG.</p>
        </label>
      )}

      {formData.TYPE === "Furniture" && (
        <>
          <label>
            Height (CM):
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
            {errors.height && <p className="error">{errors.height}</p>}
            <p className="description">Please, provide height in CM.</p>
          </label>
          <label>
            Width (CM):
            <input
              type="number"
              id="width"
              name="width"
              value={formData.width}
              onChange={handleChange}
              required
            />
            {errors.width && <p className="error">{errors.width}</p>}
            <p className="description">Please, provide width in CM.</p>
          </label>
          <label>
            Length (CM):
            <input
              type="number"
              id="length"
              name="LENGTH"
              value={formData.LENGTH}
              onChange={handleChange}
              required
            />
            {errors.LENGTH && <p className="error">{errors.LENGTH}</p>}
            <p className="description">Please, provide length in CM.</p>
          </label>
        </>
      )}
      <button type="submit">Save</button>
      <button type="button" onClick={() => navigate("/")}>
        Cancel
      </button>
    </form>
  );
};

export default AddProduct;
