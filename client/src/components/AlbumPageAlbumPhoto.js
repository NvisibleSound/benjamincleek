import React, { useEffect, useState } from 'react';
import styles from './AlbumPageAlbumPhoto.module.css';
import { BsImage } from 'react-icons/bs';

export default function AlbumPhoto({ fileurl, className, onFileUrlChange }) {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (fileurl) {
      setSelectedImage(fileurl);
    }
  }, [fileurl]);

  return (
    <div className={styles.container}>
      <div className={styles.dropzone}>
        <div className={styles.selectedImage}>
          {selectedImage ? (
            <img
              src={selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage}
              alt="Selected"
              className={styles.circleImage}
            />
          ) : (
            <div>
              <div>
                <BsImage style={{ fontSize: 40 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
