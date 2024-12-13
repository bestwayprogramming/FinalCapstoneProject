import React from "react";
import AddProduct from "../component/AddProduct";
import PageHeader from "../component/PageHeader";
import Navbar from "../component/Navbar";

const AddProductPage = () => {
  return (
    <>
      <Navbar></Navbar>
      <PageHeader
        title="Add Product"
        breadcrumbItems={[{ text: "Add Product", link: "/addproduct" }]}
      />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <AddProduct />
        </div>
      </main>
    </>
  );
};

export default AddProductPage;
