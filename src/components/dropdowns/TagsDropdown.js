import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function TagsDropdown({ onChange: providedOnChange, selectedItems }) {
  const [items, setItems] = useState([]);

  const cleanLabel = value => {
    // Check for null value
    if (value === null) {
      return [];
    }

    // Split the value by commas and clean each part
    const parts = value.split(',').map(part => part.replace(/["{}]/g, '').trim());
    return parts.map(part => ({ value: part, label: part }));
  };

  const value = Array.isArray(selectedItems) ? selectedItems.map(value => cleanLabel(value)).flat() : cleanLabel(selectedItems);
  const onChange = selectedValues => providedOnChange(selectedValues.map(v => v.value));

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const url = `http://localhost:5000/tags`;

    try {
      const { data } = await axios.get(url);

      const cleanedItems = data.flatMap(value => cleanLabel(value));
      setItems(cleanedItems);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Select
        isMulti
        onChange={onChange}
        value={value}
        options={items}
      />
    </div>
  );
}
