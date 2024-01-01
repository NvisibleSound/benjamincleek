import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './AlbumTrackUploader.module.css';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import AlbumTrackCard from './AlbumTrackCard';
import { AiFillPlusCircle } from 'react-icons/ai';

const AlbumTrackUploader = (props) => {
  const [uploadedTracks, setUploadedTracks] = useState([]);
  const [uploadedTrackIds, setUploadedTrackIds] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadedFileNames, setUploadedFileNames] = useState([]); // Maintain a list of uploaded file names

  const handleUpload = async (files) => {
    console.log('Number of files to process:', files.length);

    try {
      for (const file of files) {
        if (!file) continue;
  
        // Check for duplicate file names
        if (uploadedFileNames.includes(file.name)) {
          setMessage(`File '${file.name}' has already been uploaded.`);
          continue;
        }
  
        // File type validation
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a'];
        if (!allowedTypes.includes(file.type)) {
          setMessage('Invalid file type. Please select a .wav or .mp3 or .m4a file.');
          console.log(file.type)
          continue;
        }
  
        // File size validation
        const maxSize = 10 * 1024 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          setMessage('File size exceeds the maximum limit');
          continue;
        }

        const isDuplicate = uploadedTracks.some((track) => track.title === file.name);
        if (isDuplicate) {
          setMessage(`Track '${file.name}' is already in the list.`);
          continue;
        }
  
        // Create a new FormData object
        const formData = new FormData();
        formData.append('file', file);
  
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
  
        audio.onloadedmetadata = async () => {
          function formatDuration(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.round(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
          }
          const duration = audio.duration;
          const fileSize = (file.size / (1024 * 1024)).toFixed(2);
          const durationFormatted = formatDuration(duration);
  
          // Log for debugging
          console.log('Processing file:', file.name);
          console.log('Is this file a duplicate?', isDuplicate);
  
          try {
            // Make a POST request to upload the track to S3
            const response = await axios.post('http://localhost:5000/benjamincleek/audio', formData)
  
            const newTrack = {
              title: file.name,
              filename: file.name, 
              location: response.data.location,
              key: response.data.key,
              duration: durationFormatted,
              fileSize: fileSize + ' MB',
            };
            console.log(newTrack)
            setUploadedFileNames((prevFileNames) => [...prevFileNames, file.name]);
            setUploadedTracks((prevTracks) => [...prevTracks, newTrack]);
            setMessage(`Track uploaded successfully - File Size: ${(file.size / 1024).toFixed(2)} KB - Duration: ${duration.toFixed(2)} seconds`);
          } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading track');
          }
        };
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading track');
    }
  };
  const handleUploadTrackSuccess = (trackId) => {

    props.onTrackSaved(trackId);
  };

  
  return (
    <div>
      <div className={styles.uploader}>
      <Dropzone onDrop={(acceptedFiles) => handleUpload(acceptedFiles)} multiple>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className={styles.header}>
              <div className={styles.uploadIcon}>Upload tracks</div>
              <AiFillPlusCircle className={styles.uploadIcon} />
            </div>
          </div>
        )}
      </Dropzone>

      </div>
      {message && <div className={styles.message}>{message}</div>}
      {Array.isArray(uploadedTracks) &&
        uploadedTracks
          .filter((track, index, self) => self.findIndex((t) => t.title === track.title) === index) // Filter out duplicates
          .map((track) => (
            <AlbumTrackCard
              key={track.title}
              metadata={{
                title: track.filename,
                fileName: track.filename,
                location: track.location,
                key: track.key,
              }}
              id={track.id}
              onReplace={() => {}}
              onDeleteFile={() => {}}
              fileSize={track.fileSize}
              duration={track.duration}
              uploadedTracks={uploadedTracks}
              onUploadTrackSuccess={handleUploadTrackSuccess}

            />
          ))
      }

    </div>
  );
};

export default AlbumTrackUploader;
