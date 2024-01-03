import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios'



export default function BonusItemDropdown({ onChange: providedOnChange, selectedItems }) {
  const [items, setItems] = useState([]);
  const value = Array.isArray(selectedItems) ? selectedItems.map(value => ({ value, label: value })) : [{ value: selectedItems, label: selectedItems }];
  const onChange = selectedValues => {
    if (Array.isArray(selectedValues)) {
      providedOnChange(selectedValues.map(v => v.value));
    } else {
      providedOnChange([selectedValues.value]);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    const [bonusitem] = await Promise.all([fetchBonusItem()]);
    console.log(bonusitem); // Add this line to check if bonusitem is fetched correctly
    const bonusitemStrings = bonusitem.map(item => ({ value: item, label: item }));
    setItems(bonusitemStrings);
  }
  

  async function fetchBonusItem() {
    const url = `http://localhost:5000/bonusitem`;
    try {
      const { data } = await axios.get(url);
      return data;
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
