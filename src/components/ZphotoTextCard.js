import { useState, useEffect } from "react";
import styles from './ZphotoTextCard.module.css';
import axios from "axios";

const ZphotoTextCard = ({ src, alt, metadata }) => {
  const [filename, setFilename] = useState('');  
  const [artistid, setArtistId] = useState('');
  const [location, setLocation] = useState('');
  const [key, setKey] = useState('');


  console.log('Received src:', src);
  console.log("artistid", artistid)
  console.log("location", location)
  console.log("key", key)
  console.log("filename", filename)
  
  useEffect(() => {
    if (metadata) {
      setFilename(metadata.filename || '');
      setArtistId(metadata.artistid || '');
      setLocation(metadata.location || '');
      setKey(metadata.key || '');
    }
  }, [metadata]);


  return (
    <div >
      
        <div className={styles.ZphotoTextCard}>
          <div>Artist ID: {artistid}</div>
          <div>Filename: {filename}</div>
          {/* <div>Location: {location}</div> */}
          {/* <div>Key: {key}</div> */}
        </div>
      
     
    </div>
  );
};

export default ZphotoTextCard;
