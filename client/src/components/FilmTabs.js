import { useState } from "react";
import Composer from './Composer'
import SoundDesign from './SoundDesign'
import SoundRecordist from './SoundRecordist'
import Commercial from './Commercial'
import styles from './FilmTabs.module.css';


function FilmTabs() {
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
          Composer
        </button>
        <button
          className={toggleState === 2 ? styles["tabs active-tabs"] : styles.tabs}
          onClick={() => toggleTab(2)}
        >
          Sound Design
        </button>
        <button
          className={toggleState === 3 ? styles["tabs active-tabs"] : styles.tabs}
          onClick={() => toggleTab(3)}
        >
          Sound Recordist
        </button>   
        <button
          className={toggleState === 4 ? styles["tabs active-tabs"] : styles.tabs}
          onClick={() => toggleTab(4)}
        >
          Commercial
        </button>     
      </div>
      <div className={styles["content-tabs"]}>
      <div className={toggleState === 1 ? styles["content active-content"] : styles.content}>
          <div>
            <Composer/>
          </div>
        </div>

        <div className={toggleState === 2 ? styles["content active-content"] : styles.content}>
          <div>
            <SoundDesign/>
          </div>
        </div>

        <div className={toggleState === 3 ? styles["content active-content"] : styles.content}>
          <div>
            <SoundRecordist/>
          </div>
        </div>      

        <div className={toggleState === 4 ? styles["content active-content"] : styles.content}>
          <div>
            <Commercial/>
          </div>
        </div>        
      </div>
    </div>
  );
}

export default FilmTabs;