import React from 'react';
import styles from './BioPic.module.css'

const BioPic = ({ }) => {
  return (
    <div className={styles.BioPic}>
      <img
        src={"https://benjamincleek.s3.us-west-2.amazonaws.com/photos/136a6db4-11ee-4ebe-b56c-6c58c9b2c0dd-B0008117.jpg"}
        alt="Bio Pic"
        width="400" 
        height="auto"
      />
    </div>
  );
};

export default BioPic;
