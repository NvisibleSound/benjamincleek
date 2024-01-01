import React, { useState } from 'react';
import Message from './Message';
import Progress from './Progress.js';
import axios from 'axios';
import styles from './uploadSong.module.css'
import UploadCard from './UploadCard'

const UploadSongs = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('+');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        }
      });
      
      // Clear percentage
      setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0)
    }
  };

  return (
    <div className='card'>
      <UploadCard />
      <UploadCard />
      <UploadCard />
      <UploadCard />
      <UploadCard />
      <UploadCard />
      <UploadCard />
      <UploadCard />
      <ul>
        <h4>
          To Do
        </h4>
        <li>
          add multi-file uploads
        </li>
        <li>
          add song details and bind to object storage (audio, picture)
        </li>
        <li>
          save and cancel button functions
        </li>
        <li>
          bind to form data as metadata  
          album, audio and photo files, artist name, song name, release date, etc
        </li>
        <li>
          long term storage for objects and metadata
        </li>
      </ul>
    </div>
   
  );
};

export default UploadSongs;