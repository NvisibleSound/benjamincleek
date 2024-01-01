// VideoUploader.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './VideoUploader.module.css';
import { BsUpload } from "react-icons/bs";
import Dropzone from 'react-dropzone';
import axios from 'axios';
import VideoCard from './VideoCard';

const VideoUploader = (props) => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (files) => {
    let response;
  
    try {
      const allowedTypes = ['video/quicktime', 'video/mp4'];
  
      for (const file of files) {
        if (!file) continue;
  
        if (!allowedTypes.includes(file.type)) {
          setMessage('Invalid file type. Please select a .mov');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  

  
        response = await axios.post('http://localhost:5000/benjamincleek/videos', formData);
  
        const newVideo = {
          id: uuidv4(),
          name: file.name,
          filename: file.name,
          location: response.data.location,
          key: response.data.key,
        };
  
        props.onUploadSuccess(newVideo.name, newVideo.location, newVideo.key);
  
        setUploadedVideos((prevVideos) => [...prevVideos, newVideo]);
        setMessage('Video uploaded successfully');
        setUploadProgress(0); // Reset progress after successful upload
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading video');
      setUploadProgress(0); // Reset progress on error
    }
  };
  

  return (
    <div className={styles.VideoUploader}>
      <div className={styles.header}>
        {message}
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}></div>
      </div>
      <Dropzone onDrop={handleUpload} multiple>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className={styles.dropzone}>
              <BsUpload className={styles.uploadIcon} />
              <p>Drag and drop files here or click to select files</p>
            </div>
          </div>
        )}
      </Dropzone>
      {Array.isArray(uploadedVideos) &&
        uploadedVideos.map((video) => (
          <VideoCard
            key={video.id}
            filename={video.filename}
            id={video.id}
            metadata={{
              name: video.name,
              filename: video.filename,
              location: video.location,
              key: video.key,
            }}
          />
        ))}
    </div>
  );
};

export default VideoUploader;
