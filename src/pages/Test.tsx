// Certainly! Here’s what you should do to optimize and improve your code for best practices, especially for an interview:

// 1. Remove Duplicate Code
// You have duplicate code for the entire component. Keep only one copy.

// 2. Use useCallback and useMemo for Performance
// Wrap handlers and computed values with useCallback and useMemo to avoid unnecessary re-renders and function re-creations.

// 3. Input Validation and UX
// Prevent adding items with empty names.
// Reset the price field to empty after adding.
// Disable the "Add Item" button if the name is empty.
// 4. API Data Handling
// Limit the number of fetched items for demo purposes.
// Ensure price is always a number and rounded.
// 5. General Code Cleanliness
// Add comments for clarity.
// Use functional updates for state setters.
// Use consistent naming and formatting.
// 6. React Patterns
// Render dynamic buttons using React, not direct DOM manipulation.
// Use semantic HTML and accessibility best practices.
// Here’s the improved code with comments:
// In summary:

// Remove duplicate code
// Use React hooks for performance
// Validate input
// Use functional state updates
// Add comments
// Use React for all UI rendering
// Make code readable and maintainable
// These changes will impress in an interview and show you know React best practices!

import React, { useState, useEffect, useMemo, useCallback } from "react";

// Item type definition
interface Item {
  id: number;
  name: string;
  price?: number;
}

// Simulate a network request for items
const fetchItems = async (): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ]);
    }, 1000);
  });
};

const apiUrl = "https://jsonplaceholder.typicode.com/posts";

const ItemManager: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<number | "">("");

  // Fetch initial items (simulated)
  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  // Fetch items from API (real)
  const fetchApiItems = useCallback(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Limit to 10 items for demo, map to Item type
        setItems(
          data.slice(0, 10).map((d: any, i: number) => ({
            id: d.id ?? i + 1,
            name: d.title ?? `Item ${i + 1}`,
            price: Math.round(Math.random() * 10000) / 100, // Example price, rounded
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  // Filtered items (computed, not stored in state)
  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [items, searchTerm]
  );

  // Add a new item (with validation)
  const addItem = useCallback(() => {
    if (!newItemName.trim()) return;
    const newItem: Item = {
      id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      name: newItemName.trim(),
      price: typeof newItemPrice === "number" && !isNaN(newItemPrice) ? newItemPrice : undefined,
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemName("");
    setNewItemPrice("");
  }, [items, newItemName, newItemPrice]);

  // Handle item click
  const handleItemClick = useCallback((itemId: number) => {
    alert(`Item clicked: ${itemId}`);
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  // Render dynamic buttons using React
  const renderButtons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => (
        <button
          key={i}
          className="dynamicButton"
          onClick={() => alert(`Button ${i + 1} clicked!`)}
        >
          Button {i + 1}
        </button>
      )),
    []
  );

  return (
    <div>
        <h1>Item Manager</h1>
      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search items..."
        />
      </div>

      {/* Add Item Section */}
      <div className="add-item-section">
        <button onClick={fetchApiItems}>Fetch Items</button>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Item name"
        />
        <input
          type="number"
          value={newItemPrice}
          min={0}
          onChange={(e) =>
            setNewItemPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
          }
          placeholder="Item price"
        />
        <button onClick={addItem} disabled={!newItemName.trim()}>
          Add Item
        </button>
      </div>

      {/* Item List */}
      <ul id="itemList">
        {filteredItems.map((item) => (
          <li
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            style={{ cursor: "pointer" }}
          >
            {item.name}
            {item.price !== undefined && ` - $${item.price.toFixed(2)}`}
          </li>
        ))}
      </ul>

      {/* Dynamic Buttons */}
      <div id="buttonContainer">{renderButtons}</div>
    </div>
  );
};


export default ItemManager;

// ---
// WHAT WAS IMPROVED:
// - Removed duplicate code.
// - Used useCallback/useMemo for handlers and computed values.
// - Added input validation and UX improvements.
// - Limited API fetch for demo.
// - Used functional state updates.
// - Added comments and improved code readability.
// - Used React for all rendering (no direct DOM manipulation).