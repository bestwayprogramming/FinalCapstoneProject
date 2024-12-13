// src/redux/navigationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { name: "Home", href: "/products", current: false, roles: ["buyer"] },
    { name: "Dashboard", href: "/home", current: false, roles: ["seller"] },
    { name: "Add Product", href: "/addProduct", current: false, roles: ["seller"] },
    { name: "Orders", href: "/orders", current: false, roles: ["seller"] },
    { name: "Orders", href: "/orderHistory", current: false, roles: ["buyer"] },
  ],
  filteredItems: [],
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrent: (state, action) => {
      const path = action.payload;

      // Reset current flags
      state.filteredItems.forEach((item) => (item.current = false));

      // Mark items in the path as current
      const activeItems = state.filteredItems.filter((item) =>
        path.startsWith(item.href)
      );

      activeItems.forEach((item) => {
        item.current = true;
      });
    },
    filterNavigationByUserType: (state, action) => {
      const userType = action.payload;
      state.filteredItems = state.items.filter((item) =>
        item.roles.includes(userType)
      );
    },

    addNavigationItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeNavigationItem: (state, action) => {
      state.items = state.items.filter((item) => item.href !== action.payload);
    },
  },
});

export const { setCurrent, addNavigationItem, removeNavigationItem, filterNavigationByUserType } =
  navigationSlice.actions;

export default navigationSlice.reducer;


