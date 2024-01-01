import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function AlbumVersionDropdown({ onChange }) {
  const [albumversion, setAlbumVersion ] = useState([]);

  useEffect(() => {
    async function fetchAlbumVersion() {
      const url = 'http://localhost:5000/albumversion';

      try {
        const { data } = await axios.get(url);
        const options = data.map(albumversion => ({ value: albumversion, label: albumversion }));
        setAlbumVersion(options);
      } catch (e) {
        console.log(e);
      }
    }

    fetchAlbumVersion();
  }, []);

  return (
    <div>
      <Select
        onChange={onChange}
        options={albumversion}
      />
    </div>
  );
}
