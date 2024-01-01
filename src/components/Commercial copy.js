import React, { Component, useEffect, useState } from 'react';
import styles from './Film.module.css'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player'


const Film = () => {
  return (
    <div className={styles.composer}>
      <div className={styles.header}>
        Composer 
      </div>
      <ReactPlayer 
        url='https://benjamincleek.s3.us-west-2.amazonaws.com/videos/4bbbad07-9a4c-4e07-9a32-4de3161862f5-5.+You+Want+A+Picture+-+7.5.23+-+real+pass.mov'
        controls
      />
       <ReactPlayer 
        url='https://www.youtube.com/watch?v=732w9e0MXzA'
        controls
      />        
      <ReactPlayer 
        url='https://www.youtube.com/watch?v=txF3Ykd976E'
        controls
      /> 

      <ReactPlayer 
        url='https://vimeo.com/130605743'
        controls
      /> 

      <ReactPlayer 
        url='https://www.youtube.com/watch?v=-YEDn6mSKJg'
        controls
      />
      <ReactPlayer 
        url='https://vimeo.com/14141165'
        controls
      />
    </div>
  );
};

export default Film;
