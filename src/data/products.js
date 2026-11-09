export const PRODUCTS = [
  { _id: "1", id: 1, name: "Milk 1L", category: "Dairy", price: 55, mrp: 60, unit: "litre", img: "🥛", emoji: "🥛", stock: 120 },
  { _id: "2", id: 2, name: "Brown Bread", category: "Bakery", price: 40, mrp: 45, unit: "pack", img: "🍞", emoji: "🍞", stock: 80 },
  { _id: "3", id: 3, name: "Chocolate 100g", category: "Snacks", price: 50, mrp: 60, unit: "pack", img: "🍫", emoji: "🍫", stock: 80 },
  { _id: "4", id: 4, name: "Tomato 1kg", category: "Vegetables", price: 28, mrp: 35, unit: "kg", img: "🍅", emoji: "🍅", stock: 100 },
  { _id: "5", id: 5, name: "Eggs 12pcs", category: "Dairy", price: 84, mrp: 90, unit: "tray", img: "🥚", emoji: "🥚", stock: 60 },
  { _id: "6", id: 6, name: "Atta 5kg", category: "Household", price: 240, mrp: 280, unit: "bag", img: "🌾", emoji: "🌾", stock: 30 },
];

export const SLOTS = ["06:00 - 08:00", "08:00 - 10:00", "17:00 - 19:00"];
export const FREQUENCIES = [
  { id: "daily", label: "Daily" },
  { id: "alternate", label: "Alternate Day" },
  { id: "weekly", label: "Weekly" },
  { id: "custom", label: "Custom" },
];