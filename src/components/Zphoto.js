import { useState, useEffect } from "react";
import styles from './Zphoto.module.css';
import axios from "axios";

const Zphoto = ({ filename, src, alt, metadata }) => {
  const [location, setLocation] = useState('');

  const handleOnError = (err) => {
    // Handle error
  };

    const [artistid, setArtistId] = useState('');
    const [key, setKey] = useState('');
  
    useEffect(() => {
      if (metadata) {
        setArtistId(metadata.artistid);
        setLocation(metadata.location);
        setKey(metadata.key);
      }
    }, [metadata]);
  
    const handleVideoNameChange = (e) => {
      const newName = e.target.value;
      setName(newName);
      handleMetadataChange(newName);
    };

  return (
    <div >
      {src ? (
        <img
          src={src}
          className={styles.zphotoThumb}
          onError={handleOnError}
        />
      ) : (
        <div>
          <img
            className={styles.photo}
            src={"https://generative-placeholders.glitch.me/image?"}
            alt={alt}
          />
        </div>
      )}
    </div>
  );
};

export default Zphoto;
