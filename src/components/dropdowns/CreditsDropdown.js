import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CreditsDropdown = ({ onChange: providedOnChange, selectedItems }) => {
  const [items, setItems] = useState([]);
  const value = Array.isArray(selectedItems) ? selectedItems.map(value => ({ value, label: value })) : [];
  const onChange = selectedValues => providedOnChange(selectedValues.map(v => v.value));

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const url = `http://localhost:5000/credits`;

    try {
      const { data } = await axios.get(url);
      const items = data.map(value => ({ value, label: value }));
      setItems(items);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Select
      isMulti
      value={value}
      onChange={onChange}
      options={items}
    />
  );
};

export default CreditsDropdown;
