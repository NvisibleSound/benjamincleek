import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { IoSearchOutline } from 'react-icons/io5';

const SongSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  
  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Call onSearch with the new query
  };

  const searchIconStyles = {
    fontSize: '24px',
    color: 'black',
    marginRight: '5px',
    cursor: 'pointer',
  };

  return (
    <div>
      <TextField
        variant="outlined"
        style={{ flex: 1, width:500 }}
        value={query}
        onChange={handleInputChange} // Update query and trigger search as user types
        InputProps={{
          style: { color: 'black' },
          startAdornment: (
            <div style={searchIconStyles}>
              <IoSearchOutline />
            </div>
          ),
        }}
      />
    </div>
  );
};

export default SongSearch;
