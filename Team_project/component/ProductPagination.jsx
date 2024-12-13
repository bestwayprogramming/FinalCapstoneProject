// ProductPagination.js
import React from 'react';
import { Pagination, ConfigProvider } from 'antd';

const ProductPagination = ({ current, total, pageSize, onPageChange, onShowSizeChange }) => (
  <ConfigProvider
    theme={{
      components: {
        Pagination: {
          itemBg: '#f0f0f0', // Gray background for all items
          itemBorderColor: '#333333', // Black border around items
        //   itemActiveBg: '#1677ff', // Blue background for active item
          itemActiveColor: '#ffffff', // White text for active item
          itemLinkBg: '#f0f0f0', // Gray background for previous/next links
          itemLinkColor: '#333333', // Black text color for previous/next links
          itemLinkBorderColor: '#333333', // Black border for previous/next links
        //   itemHoverBorderColor: '#1677ff', // Blue border on hover
          itemHoverColor: '#1677ff', // Text color on hover
        },
      },
    }}
  >
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onPageChange}
      onShowSizeChange={onShowSizeChange}
      showSizeChanger
      align='end'
    />
  </ConfigProvider>
);

export default ProductPagination;
