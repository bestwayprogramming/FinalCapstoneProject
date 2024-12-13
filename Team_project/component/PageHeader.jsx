import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const PageHeader = ({ title, breadcrumbItems }) => {
  return (
    <>
      <header className="bg-white shadow-sm rounded-lg mt-10 border border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
              <Breadcrumb separator="/">
                {breadcrumbItems.map((item, index) => (
                  <Breadcrumb.Item key={index}>
                    {item.link ? (
                      <Link
                        to={item.link}
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                      >
                        {item.text}
                      </Link>
                    ) : (
                      <span className="text-gray-600">{item.text}</span>
                    )}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </h1>
          </div>
        </div>
      </header>
    </>
  );
};

export default PageHeader;
