import React from 'react';
import { Link } from 'react-router-dom';
import AdminTabs from './AdminTabs.js'
import styles from './Admin.module.css'

const Admin = () => {
  return (
    <div className={styles.dashboard}>
      <AdminTabs/>
      <div>
        {/* <Link to="/AlbumList">
          <button>Albums</button>
        </Link>
        <Link to="/TrackList">
          <button>Tracks</button>
        </Link>
        <Link to="/VideoList">
          <button>Video</button>
        </Link>
        <Link to="/PhotoList">
          <button>Photos</button>
        </Link> */}
      </div>
    </div>
  );
};

export default Admin;
