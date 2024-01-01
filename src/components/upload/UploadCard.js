import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress.js';
import axios from 'axios';
import styles from './uploadSong.module.css'

const UploadSong = () => {
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
    <div>
       {message ? <Message msg={message} /> : null}
       {uploadedFile ? (
              <div>
                <h3>{uploadedFile.fileName}</h3>
              </div>
            ) : null}
      <div className='card'>
        <form onSubmit={onSubmit}>
          <div className={styles.uploadSong}>
                <input
                type='file'
                id='customFile'
                onChange={onChange}
                />            
            <Progress percentage={uploadPercentage} />
            <label className='custom-file-label' >
              {filename}
            </label>
            <input
              type='submit'
              value='Upload'
            />
           {/* {uploadedFile ? (
              <div>
                <h3>{uploadedFile.fileName}</h3>
              </div>
            ) : null} */}
          </div>
        </form>        
      </div>
      {/* {uploadedFile ? (
              <div>
                <h3>{uploadedFile.fileName}</h3>
              </div>
            ) : null} */}
      {/* <ul>
        <li>
          write as a new component that can iterate
        </li>
        <li>
          add multi-file uploads for albums
        </li>
        <li>
          bind to form data as metadata - artist name, song name, release date, etc
        </li>
        <li>
          move message to top of upload list or make smaller so 'card' size isn't effected
        </li>
        <li>
          long term storage for objects and metadata
        </li>
      </ul> */}
    </div>
  );
};

export default UploadSong;