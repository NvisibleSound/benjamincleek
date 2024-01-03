import React, { Component, useEffect, useState } from 'react';
import styles from './Film.module.css'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player'
import FilmTabs from './FilmTabs';
import Commercial from './Commercial'
import Composer from './Composer'
import SoundDesign from './SoundDesign'


const Film = () => {
  return (
    <div className={styles.film}>
      <FilmTabs/>
    </div>
  );
};



export default Film;
