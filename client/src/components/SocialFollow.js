import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faInstagram } from "@fortawesome/free-brands-svg-icons";
import styles from './socialFollow.module.css'

export default function SocialFollow() {
  return (
    <div className={styles.social}>
      <div className={styles.icons}>
        <a href="https://www.youtube.com/channel/UCeI5aoTXpi9pKKB2ECWs0vg" target="_blank">
          <FontAwesomeIcon 
            className={styles.youtube} 
            icon={faYoutube} 
            size="3x" 
          />
        </a>
        <a href="https://www.instagram.com/pushtwistpop" target="_blank">
          <FontAwesomeIcon 
            class={styles.instagram} 
            icon={faInstagram} 
            size="3x" 
            color="white" 
          />
        </a>
      </div>
    </div>
  );
}