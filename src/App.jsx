import React, { useState } from "react";
import { indexProducts, searchProducts } from "./search";

export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const res = await searchProducts(query);
    setResults(res);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Smart Product Search 🔍</h2>
      <button onClick={indexProducts}>📦 Index Products</button>
      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Type what you're looking for..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, width: 300 }}
        />
        <button onClick={handleSearch} style={{ marginLeft: 10 }}>Search</button>
      </div>
      <ul style={{ marginTop: 20 }}>
        {results.map((item, idx) => (
          <li key={idx}><strong>{item.name}</strong>: {item.desc}</li>
        ))}
      </ul>
    </div>
  );
}
