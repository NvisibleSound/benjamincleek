import React, { useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import styles from './Playbar.module.css';

const VISIT_STATION = "Visit this station at ";

const Playbar = ({ selectedStation, selectedTrack, setSelectedTrack, selectedMountpoint }) => {
  const [src, setSrc] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false); // State variable to track if audio is playing


  useEffect(() => {
    if (selectedTrack) {
      setSrc(selectedTrack.location);
      setDisplayText(`${selectedTrack.title} - ${selectedTrack.artist}`);
    } else if (selectedStation) {
      setSrc(selectedStation.endpoint);
      setDisplayText(selectedStation.description);
    } else if (selectedMountpoint) {
      setSrc(selectedMountpoint);
      setDisplayText(selectedMountpoint);
    } else {
      setSrc('');
      setDisplayText('');
    }
  }, [selectedTrack, selectedStation, selectedMountpoint]);

  const toggleAudioPlayer = () => {
    if (isPlaying) {
      // If it's playing, pause it
      setIsPlaying(false);
    } else {
      // If it's paused, play it
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === " " || event.key === "Spacebar") {
        toggleAudioPlayer();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  return (
    <div className={styles.Playbar}>
      {displayText && (
        <div className={styles.DisplayText}>{displayText}</div>
      )}
      {selectedStation && (
        <div className={styles.stationInfoContainer}>
          {selectedStation.link && (
            <div className={styles.visitStation}>
              {VISIT_STATION}
              <a
                className={styles.link}
                href={selectedStation.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedStation.name}
              </a>
            </div>
          )}
        </div>
      )}
      <AudioPlayer
        src={src}
        layout="stacked"
        className={styles.AudioPlayer}
        autoPlay={isPlaying} // Use the state variable to control autoplay
      />
    </div>
  );
};

export default React.memo(Playbar);
