import React, { useState } from "react";
import { Card, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditProduct from "./EditProduct"; // Import the modal component
import { Link } from "react-router-dom";

const ProductList = ({ products, loading, error, onDelete, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the selected product for editing
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setSelectedProduct(null); // Clear the selected product
  };

  const handleUpdate = (updatedProduct) => {
    onUpdate(updatedProduct); // Call the update function passed as prop
    handleModalClose(); // Close the modal after updating
  };


  return (
    <></>
  );
};


export default ProductList;
