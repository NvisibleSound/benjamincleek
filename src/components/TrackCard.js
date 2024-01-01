import React, { useState, useRef, useEffect } from 'react';
import Message from './upload/Message';
import axios from 'axios';
import styles from './TrackCard.module.css';
import TrackPhoto from './upload/TrackPhoto';
import { MdCancel, MdDelete, MdCloudUpload } from 'react-icons/md';
import { PiArrowsClockwiseBold } from "react-icons/pi";
import { v4 as uuidv4 } from 'uuid';

const TrackCard = ({ filename, id, onReplace, onDeleteFile, metadata, onMetadataChange }) => {
  const [trackName, setTrackName] = useState('');
  const [fileName, setFileName] = useState(filename || '');
  const [track, setTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (metadata) {
      setTrackName(metadata.trackName);
      setFileName(metadata.fileName);
    }
  }, [metadata]);

  const handleMetadataChange = (newTrackName) => {
    if (onMetadataChange) {
      onMetadataChange({
        trackName: newTrackName,
        fileName,
        // ... other metadata fields ...
      });
    }
  };

  const onChange = (e) => {
    const selectedTrack = e.target.files[0];
    if (selectedTrack) {
      setTrack(selectedTrack);
      setFileName(selectedTrack.name);
      setTrackName(selectedTrack.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (track) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', track);

      try {
        const response = await axios.post('http://localhost:5000/busktracks', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const uploadPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(uploadPercentage);
          },
        });

        setMessage('Track Uploaded');
        setTrackName(response.data.Location);

        if (onReplace) {
          onReplace(track);
        }
      } catch (error) {
        setMessage('An error occurred while uploading the track');
      } finally {
        setUploading(false);
      }
    }
  };


  const handleTrackNameChange = (e) => {
    const newName = e.target.value;
    setTrackName(newName);
    handleMetadataChange(newName);
  };

  const handleReplaceTrack = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const updateFileUrl = (fileurl) => {
    setTrack((prevState) => ({
      ...prevState,
      fileurl: fileurl,
    }));
  };
  
  const handleDeleteFile = async () => {
    try {
      if (id) {
        // Make a DELETE request to the backend endpoint
        await axios.delete(`http://localhost:5000/buskaudio/tracks/${id}/delete`, {
          data: {
            bucketName: 'buskaudio', // Replace with your actual bucket name
          },
        });

        // Handle deletion in the parent component
        // Update the fileurl in the state
        updateFileUrl('');

        setMessage('File deleted successfully');
      } else {
        setMessage('Unable to delete file: Missing track information');
      }
    } catch (error) {
      setMessage('Error deleting the file');
    }
  };
  
  const handleReplaceFile = async (newFileUrl) => {
    try {
      // Make a PUT request to update the fileurl in the backend
      await axios.put(`http://localhost:5000/tracks/${track.id}/update-fileurl`, {
        fileurl: newFileUrl,
      });
  
      // Update the fileurl in the state
      updateFileUrl(newFileUrl);
  
      setMessage('File replaced successfully');
    } catch (error) {
      setMessage('Error replacing the file');
    }
  };
  
  
  return (
    <div key={uuidv4()}>
      {message && <Message msg={message} />}
      <div className="card">
        <div className={styles.uploadTrack}>
          <TrackPhoto />
            <div className={styles.textColumn}>
              {filename ? (
                <div className={styles.trackName}>
                  {filename}
                </div>
                ) : (
                  <div className={styles.trackName}>
                    <input
                      type="text"
                      value={trackName}
                      onChange={handleTrackNameChange}
                      style={{ marginLeft: '15px', width: '30vw' }}
                    />
                  </div>
                )
              }          
            <div className={styles.icons}>
              <PiArrowsClockwiseBold
                style={{ marginLeft: 6, marginRight: 2, fontSize: 20, cursor: 'pointer' }}
                onClick={handleReplaceTrack}
              />
              <MdCancel
                style={{ fontSize: 30, cursor: 'pointer' }}
                onClick={handleDeleteFile}
              />
              {filename && (
                <>
                
                </>
              )}
          </div>
        </div>
        <div className={styles.progressBar}>
          {uploading && (
            <div className={styles.progress} style={{ width: `${progress}%` }}></div>
          )}
        </div>
        <button type="button" onClick={handleSubmit} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save'}
        </button>
      </div>
      </div>
    </div>
  );
};

export default TrackCard;
