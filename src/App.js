import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import AlbumCreate from './components/AlbumCreate';
import AlbumPage from "./components/AlbumPage";
import AlbumEdit from "./components/AlbumEdit";
import AlbumList from './components/AlbumList';
import Bio from './components/Bio';
import Collaborations from './components/Collaborations';
import Film from './components/Film';
import Music from './components/Music';
import Sandbox from './components/Sandbox';
import TrackList from './components/TrackList';
import TrackEdit from './components/TrackEdit';
import VideoList from './components/VideoList';
import Zphoto from './components/Zphoto';
import ZphotoList from './components/ZphotoList';





function App() {

  const [selectedStation, setSelectedStation] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [selectedMountpoint, setSelectedMountpoint] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false); // State variable to track if audio is playing
    const [selectedItem, setSelectedItem] = useState(null);

    const changeStation = (station) => {
      setSelectedStation(station);
    };

    const changeTrack = (track) => {
      setSelectedTrack(track);
    };

    const handleTrackSelect = (track) => {
      setSelectedItem(track);
    };
  
    const handleMountpointSelect = (mountpoint) => {
      setSelectedItem(mountpoint);
    };
  
    const handleStationSelect = (station) => {
      setSelectedItem(station);
    };

    const handleSpacebarKeyPress = () => {
      if (isPlaying) {
        // Pause the audio player
        setIsPlaying(false);
      } else {
        // Play the audio player
        setIsPlaying(true);
      }
    };

  return (
    <div className={styles.App}>
      <Router>
        <Navbar/>
        <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Bio />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route exact path="/albumlist" element={<AlbumList />} />
          <Route exact path="/albumcreate" element={<AlbumCreate />} />
          <Route exact path="/AlbumEdit/:id" element={<AlbumEdit selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} handleTrackSelect={handleTrackSelect} changeTrack={changeTrack} />} />
          <Route exact path="/AlbumPage/:id" element={<AlbumPage selectedTrack={selectedTrack} />} />
          <Route exact path="/bio" element={<Bio />} />
          <Route exact path="/film" element={<Film />} />
          <Route exact path="/music" element={<Music />} />
          <Route exact path="/collaborations" element={<Collaborations />} />
          <Route exact path="/sandbox" element={<Sandbox />} />
          <Route exact path="/tracklist" element={<TrackList />} />
          <Route exact path="/TrackEdit/:id" element={<TrackEdit />} />
          <Route exact path="/videolist" element={<VideoList />} />
          <Route exact path="/zphoto" element={<Zphoto />} />
          <Route exact path="/zphotolist" element={<ZphotoList />} />

        </Routes>
        </div>
      </Router>
    </div>
  );
} 

export default App;
