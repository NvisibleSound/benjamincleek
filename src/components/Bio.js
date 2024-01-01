import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Bio.module.css'
import { BsInstagram, BsFacebook, BsTwitch, BsYoutube } from 'react-icons/bs'
import { FaPatreon } from 'react-icons/fa'
import BioPic from './BioPic';

function Bio() {

  return (
    <div>
      <div className={styles.Bio}>
          <div className={styles.customizeBioPic}>
            <BioPic
            />
          </div>
          <div className={styles.bioText}>
            <div className={styles.about}>
              Benjamin Cleek is a multi-disciplinary composer, sound designer, and producer/engineer. He began experimenting with music at age six. His current works draw influence from performance and production techniques, transcending genres while remaining steeped in an eclectic background in jazz, orchestra, experimentation, and all the beeps and bloops found int the modern electro-acoustic studio.

              Early on, Benjamin first became musically proficient on the saxophone, soon followed by the guitar. By high school he had advanced as a multi-instrumentalist and was recognized at an All-State level. By the time of graduation Benjamin had learned the tuba, bassoon, and double bass. He received the Louis Armstrong Jazz award in 2002, shortly before earning a scholarship to Berklee College of Music. Throughout this early period, he performed at jazz clubs throughout New England as a tenor saxophonist and quit performing from 2006-2008 to focus on developing skills in electro-acoustic music production, which led to his first projects in film scoring and eventually designing interactive media systems.

              Now, Benjamin continues to perform in solo and collaborative music where he exists as a multi-instrumentalist heavily centered around double bass, piano and keyboards, voice, and the studio. He has written and performed with visual, movement, and social artists, and has written music for 5 feature films, 10 shorts, and contributes to music catalogs for licensing.

              Aside from the more traditional uses of sound and music, he maintains a high interest in projects that have tangible influence in the real world, such as his work though interactive design and media content in VR and 360 video. Some of these projects have included medical VR experiences, branded content, and custom interactive environments for corporate events.
            </div>
            <div className={styles.filmography}>
              <div className={styles.header}>
                Filmography
              </div>
              <div>
                Lumberjack (2022) - Sound Recordist
              </div>
              <div>
                Lilly - feature film (2022) - Composer
              </div>
              <div>
                Two Funerals And A Freezer - short (2022) - Composer
              </div>
              <div>
                John Sunshine's Lost Rock n' Roll Tapes (2022) - Sound Designer
              </div>
              <div>
                Buzzfeed and Zelle Present - Transformation Mondays (2021) - Sound Mixer
              </div>
              <div>
                The Portland Sessions (2016 - 2020 . web series) - Recording and Mix Engineer
              </div>
              <div>
                Removed / Evolution of Evil (2018 feature) - Composer
              </div>
              <div>
                Casual Encounter (2017 short) - Sound Designer / Dialog Editor / Re-recording mixer
              </div>
              <div>
                House of Greeting Cards (2016 short) - Funny or Die Original - Composer
              </div>
              <div>
                Sdivding Scale (2016 short) - Funny or Die Original- Composer
              </div>
              <div>
                Nocturne (2015 short) - Composer / Sound Designer / Dialog Editor / Re-recording                
              </div>
              <div>
                The Mad Ones (2015 feature) - Composer
              </div>
              <div>
                Slowly Quickly (2010 short) - Composer / Dialog Editor / Recording Mixer
              </div>
              <div>
                Common Threads (2008 feature) - Composer
              </div>
              <div>
                ECT - A Story of Two Women (2008 short) - Composer / Sound Designer
              </div>
              <div>
                Super Go! (2008 short) - Composer / Sound Designer
              </div>
              <div>
                Food Not Bombs PSA (2007 short) - Composer / Sound Designer
              </div>
              <div>
                Desert (2007 short) - Composer / Sound Designer
              </div>
              <div>                
                Up and Down Again (2006 feature) - Composer
              </div>
              <div>                
                Buffalo Dreams (2005 feature) - Composer
              </div>
              <div>                
                Milk (2003 short) - Composer
              </div>
            </div>
            <div className={styles.summary}>
              Benjamin has worked on award winning films that have been screened internationally, including at the Geena Davis Film Festival, Portland Film Festival, Oregon Independent Film Festival, Alaska International Film Awards, Switzerland International Film Festival, and the Bentonville Film Festival.           
            </div>
          </div>
        </div>
        <div className={styles.activity}>
            <div>Recent Activity</div>
            <div className={styles.row1}>
              <div className={styles.fakeNewsCard}>
                latest release
                <img src={"https://generative-placeholders.glitch.me/image?width=600&height=300&style=triangles&gap=30"} /> 
              </div>
              <div className={styles.fakeNewsCard}>
                Performance
                <img src={"https://generative-placeholders.glitch.me/image?width=600&height=300&style=triangles&gap=30"} /> 
              </div>
              <div className={styles.fakeNewsCard}>
                other activity
                <img src={"https://generative-placeholders.glitch.me/image?width=600&height=300&style=triangles&gap=30"} /> 
              </div>
            </div>
          </div>
    </div>
  );
}
    
export default Bio;