import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value, filter);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    onSearch(query, e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search tokens..."
        value={query}
        onChange={handleSearch}
      />
      <select value={filter} onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="popular">Popular</option>
        <option value="new">New</option>
      </select>
    </div>
  );
};

export default Search;
