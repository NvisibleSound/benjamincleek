import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import styles from './ZphotoUploader.module.css';
import { BsImage, BsPlus, BsUpload } from 'react-icons/bs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Zphoto from './Zphoto'



export default function AlbumPhoto({ className, onChangeFileUrl, props }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedZphoto, setUploadedZphoto] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setSelectedImage(null);
  }, [location]);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file !== selectedImage) {
        setSelectedImage(file);
        handleSubmit(file);
      }
    }
  };  

  
  
  const handleUpload = async (files) => {
    let response;
  
    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
      for (const file of files) {
        if (!file) continue;
  
        if (!allowedTypes.includes(file.type)) {
          setMessage('Invalid file type. Please select a .mov');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          },
        };
  
        response = await axios.post('http://localhost:5000/benjamincleek/photos', formData, config);
  
        const newZphoto = {
          id: uuidv4(),
          artistid: '3',
          filename: file.name,
          location: response.data.location,
          key: response.data.key,
        };
  
        // Save zphoto metadata here synchronously
        try {
          const zphotoMetadata = {
            id: newZphoto.id,
            artistid: newZphoto.artistid,
            filename: newZphoto.filename,
            artistid: newZphoto.artistid,
            location: newZphoto.location,
            key: newZphoto.key,
          };
    
          const metadataResponse = await axios.post('http://localhost:5000/zphotos', zphotoMetadata);
  
  
          // You can handle the zphoto save success as needed, e.g., update UI or trigger other actions
        } catch (error) {
          console.error('Error saving zphoto metadata:', error);
          // Handle error saving zphoto metadata
        }
  
        props?.onUploadSuccess?.(newZphoto.id, newZphoto.filename, newZphoto.artistid, newZphoto.location, newZphoto.key);
        props?.onChangeFileUrl?.(response.data.location);
        console.log('AlbumPhoto newZhpoto:', newZphoto);
  
        setUploadedZphoto((prevZphoto) => [...prevZphoto, newZphoto]);
        setMessage('zphoto uploaded successfully');
        setUploadProgress(0); // Reset progress after successful upload
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading zphoto');
      setUploadProgress(0); // Reset progress on error
    }
  };
  
  
  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {message}
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}></div>
      </div>
      <Dropzone onDrop={handleUpload} className={className}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className={styles.dropzone}>
            <div className={styles.selectedImage} {...getRootProps()}>
            <input {...getInputProps({ multiple: true })} />
              {isDragActive ? (
                <div>Drop the image here</div>
              ) : (
                <>
                  {selectedImage && (
                    <img
                      src={selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage}
                      alt="Selected"
                      className={styles.circleImage}
                    />
                  )}
                  <div className={styles.add}>
                    <div>
                      <BsPlus style={{ fontSize: 80 }} />
                    </div>
                    <div>Click or drag an image file here</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Dropzone>

      {Array.isArray(uploadedZphoto) &&
        uploadedZphoto.map((zphoto, file, index) => (
          <Zphoto 
            key={uuidv4()}
            className={styles.zphotoThumb}
            filename={zphoto.filename}
            src={zphoto.location}
            metadata={{
              artistid: zphoto.artistid,
              filename: file.filename,
              location: zphoto.location,
              key: zphoto.key,
            }}
          />
        ))}      
    </div>
  );
};
