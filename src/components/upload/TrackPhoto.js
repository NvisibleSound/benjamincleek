import React from 'react';
import styles from './TrackPhoto.module.css';

const trackPhoto = ({src, alt}) => {
  const handleOnError = (err) => {
<i className="bi bi-person-circle"></i>
  }
  return (
    <div >
      {src ? (
        <img 
          className={styles.trackPhoto} 
          src={src} 
          alt={alt} 
          
          onError={handleOnError}/> 
      ) : (
        <div>
          <img className={styles.trackPhoto}
          src={"https://generative-placeholders.glitch.me/image?"} 
          alt={alt} 
          /> 
        </div>
     
      )}
    </div>
  )
}

export default trackPhoto;