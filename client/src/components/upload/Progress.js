import React from 'react';
import PropTypes from 'prop-types';
import styles from './uploadSong.module.css'

const Progress = ({ percentage }) => {
  return (
    <div className={styles.progress}>
      <div className='progress'>
        <div
          className='progress-bar bg-info'
          role='progressbar'
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired
};

export default Progress;