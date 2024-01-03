import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function TrackPriceDropdown({ onChange: providedOnChange, selectedItems }) {
  const [items, setItems] = useState([]);
  const value = { value: selectedItems, label: selectedItems };
  const onChange = selectedValues => providedOnChange(selectedValues.value);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const url = 'http://localhost:5000/trackprice';

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
      <Select onChange={onChange} value={value} options={items} />
    </div>
  );
}
