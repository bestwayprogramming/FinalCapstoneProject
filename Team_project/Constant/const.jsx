export const COLORS = [
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#00FF00" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Purple", hex: "#800080" },
  { name: "Gray", hex: "#808080" },
  { name: "Pink", hex: "#FFC0CB" },
];

export const SIZES = [
  { name: '1', inStock: true },
  { name: '2', inStock: true },
  { name: '3', inStock: true },
  { name: '4', inStock: true },
  { name: '5', inStock: true },
  { name: '6', inStock: true },
  { name: '7', inStock: true },
  { name: '8', inStock: true },
  { name: '9', inStock: true },
  { name: '10', inStock: true },
]


export const types = ["Women", "Men", "Unisex"];
export const conditions = ["New", "Used"];
export const categories = ["Sport Shoes", "Casual Shoes", "Formal Shoes"];


export const mapColorsToHex = (colorsArray) => {
  return colorsArray.map((color) => {
    const matchedColor = COLORS.find(
      (c) => c.name.toLowerCase() === color.toLowerCase()
    );
    return matchedColor ? matchedColor.hex : "#000000"; // Default to white if no match
  });
};

export const mapColorsToHexAndName = (colorNamesArray) => {
  return colorNamesArray.map((colorName) => {
    const matchedColor = COLORS.find(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    );
    return matchedColor
      ? { name: matchedColor.name, hex: matchedColor.hex }
      : { name: colorName, hex: "#000000" }; 
  });
};

export const mapSizesToStock = (dbSizesArray) => {
  return dbSizesArray
    .map((sizeName) => {
      const matchedSize = SIZES.find((size) => size.name === sizeName);
      return matchedSize ? { ...matchedSize, inStock: true } : null; // Set inStock to true
    })
    .filter(Boolean);
};

export const mapHexToColorName = (hex) => {
  const matchedColor = COLORS.find((color) => color.hex === hex);
  return matchedColor ? matchedColor.name : "Unknown Color"; // Return "Unknown Color" if no match
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'gold';
    case 'Shipped':
      return 'geekblue';
    case 'Delivered':
      return 'green';
    case 'Cancelled':
      return 'red';
    default:
      return 'default';
  }
};


export const Orderstatus=[
  { value: 'Pending', label: 'Pending' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered'},
  { value: 'Cancelled', label: 'Cancelled'},
]
