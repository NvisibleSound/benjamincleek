import { useState } from "react";
import AlbumList from './AlbumList'
import TrackList from './TrackList'
import VideoList from './VideoList'
import styles from './AdminTabs.module.css'
import ZphotoList from './ZphotoList'

function AdminTabs() {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles["bloc-tabs"]}>

      
        <button
          className={toggleState === 1 ? styles["tabs active-tabs"] : styles.tabs}
          onClick={() => toggleTab(1)}
        >
          Albums
        </button>
        <button
          className={toggleState === 2 ? styles["tabs active-tabs"] : styles.tabs}
          onClick={() => toggleTab(2)}
        >
          Tracks        
        </button>
        <button
          className={toggleState === 3 ? styles["tabs active-tabs"] : styles.tabs}
          onClick={() => toggleTab(3)}
        >
          Videos
        </button>   
        <button
          className={toggleState === 4 ? styles["tabs active-tabs"] : styles.tabs}
          onClick={() => toggleTab(4)}
        >
          Photos
        </button>     
      </div>
      <div className={styles["content-tabs"]}>
      <div className={toggleState === 1 ? styles["content active-content"] : styles.content}>
          <div>
            <AlbumList/>
          </div>
        </div>

        <div className={toggleState === 2 ? styles["content active-content"] : styles.content}>
          <div>
            <TrackList/>
          </div>
        </div>

        <div className={toggleState === 3 ? styles["content active-content"] : styles.content}>
          <div>
            <VideoList/>
          </div>
        </div>      

        <div className={toggleState === 4 ? styles["content active-content"] : styles.content}>
          <div>
            <ZphotoList/>
          </div>
        </div>        
      </div>
    </div>
  );
}

export default AdminTabs;