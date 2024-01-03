import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function TagsFilter({ onChange: providedOnChange, selectedItems }) {
  const [items, setItems] = useState([]);
  
  // Check if selectedItems is defined before using map
  const value = selectedItems ? selectedItems.map(item => ({ value: item, label: item })) : [];
  
  const onChange = selectedValues => providedOnChange(selectedValues.map(v => v.value));

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const url = 'http://localhost:5000/tags';

    try {
      const { data } = await axios.get(url);

      const items = data.map(value => ({ value, label: value }));
      setItems(items);
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

