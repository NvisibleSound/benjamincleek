import React, { useState } from 'react';
import styles from './EtherModule.css';
import { useNavigate, Link, BrowserRouter as Router } from 'react-router-dom';
import ActiveMountpoints from '../Broadcast/ActiveMountpoints';

const Ether = ({ selectedMountpoint, setSelectedMountpoint }) => {
  
  const handleMountpointSelect = (mountpoint) => {
    if (mountpoint !== selectedMountpoint) {
      setSelectedMountpoint(mountpoint);
    }
  };

    console.log('Ether Component - selectedMountpoint:', selectedMountpoint);


  return (
    <div className={styles.Ether}>
      <div className={styles.activeMountpoints}>
        {/* <EtherModule
          handleMountpointSelect={setSelectedMountpoint}
        /> */}
        <ActiveMountpoints
            selectedMountpoint={selectedMountpoint}
            handleMountpointSelect={handleMountpointSelect}
          />
      </div>
    </div>
  );
};

export default Ether;
