import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'

export default function LiveRateDropdown({ onChange: providedOnChange, selectedItems }) {
  const [items, setItems] = useState([])
  const value = selectedItems ? { value: selectedItems, label: selectedItems } : null;
  const onChange = selectedValue => providedOnChange(selectedValue ? selectedValue.value : null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems () {
    // add to backend
    const url = `http://localhost:5000/liverate`

    try {
      const { data } = await axios.get(url)
      const items = data.map(value => ({ value, label: value }))

      setItems(items)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <Select
        onChange={onChange}
        value={value}
        options={items}
      />
    </div>
  );
}