import React from "react";
import OrderTable from "../component/OrderTable";
import Navbar from "../component/Navbar";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PageHeader from "../component/PageHeader";

const OrderPage = () => {
  const { filteredItems } = useSelector((state) => state.navigation);
  const location = useLocation();

  const breadcrumbs = [
    ...filteredItems
      .filter((item) => location.pathname.startsWith(item.href))
      .map((item) => ({ text: item.name, link: item.href })),
  ];

  return (
    <>
      <Navbar></Navbar>
      <PageHeader title="Orders" breadcrumbItems={breadcrumbs} />

      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <OrderTable />
        </div>
      </main>
    </>
  );
};

export default OrderPage;
