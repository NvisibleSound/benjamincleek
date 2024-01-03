import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './albumEdit.module.css';
import AlbumPhoto from './AlbumPhoto';
import GenresDropdown from './dropdowns/GenresDropdown';
import TagsDropdown from './dropdowns/TagsDropdown';
import AlbumPriceDropdown from './dropdowns/AlbumPriceDropdown';
import TrackPriceDropdown from './dropdowns/TrackPriceDropdown';
import AlbumVersionDropdown from './dropdowns/AlbumVersionDropdown';
import AlbumPageTrackCard from './AlbumPageTrackCard';
import { AiOutlinePlus } from 'react-icons/ai'


const AlbumEdit = ({ selectedTrack, setSelectedTrack, albumid, artistid }) => {
  const { id } = useParams();
  // const [tracks, setTracks] = useState([]);


  const handleSelectTrack = (location) => {
    setSelectedTrack(location);
    console.log("selectedTrack", location)
  };

  const [album, setAlbum] = useState({
    id: '',
    fileurl: '',
    albumname: '',
    artistname: '',
    genres: [],
    tags: [],
    description: '',
    albumprice: [],
    trackprice: [],
    trackids: [],
  });

  const [trackData, setTrackData] = useState([]);
  


  function getTrackNumber(index) {
    return index + 1;
  }

  useEffect(() => {
    const albumUrl = `http://localhost:5000/albums/${id}`;

    console.log("genres", album.genres)

    axios
      .get(albumUrl)
      .then(({ data }) => {
        setAlbum(data);
        const trackidRegex = /"(\d+)"/g;
        const tracksString = data.trackids || '';
        const parsedTrackids = Array.from(
          tracksString.matchAll(trackidRegex),
          (match) => parseInt(match[1])
        );

        const promises = parsedTrackids.map((trackids) => {
          const trackUrl = `http://localhost:5000/tracks/${trackids}`;
          return axios.get(trackUrl);
        });

        Promise.all(promises)
          .then((responses) => {
            const trackDetails = responses.map((response) => response.data);
            setAlbum(data);
            setTrackData(trackDetails);

            console.log(trackDetails);

          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);

  const updateAlbumValue = (fieldName, value) => {
    setAlbum((prevAlbum) => ({
      ...prevAlbum,
      [fieldName]: value,
    }));
  };

  const handleImageSubmit = (fileurl) => {
    setAlbum((prevAlbum) => ({
      ...prevAlbum,
      fileurl: fileurl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = `http://localhost:5000/albums/${id}`;

    axios
      .put(url, album)
      .then((res) => {
        console.log('!!! put', res.data);
        window.location = '/AlbumList';
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.card1}>
          <div className={styles.header}>
            Album Info
            <div className={styles.buttons}>
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ marginRight: 5, width: 60, padding: 0, fontSize: 15 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: 5, width: 55, padding: 0, fontSize: 15 }}
              >
                Save
              </button>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.row1}>
              <div className={styles.column1}>
                <AlbumPhoto onSubmit={handleImageSubmit} fileurl={album.fileurl} />
              </div>
              <div className={styles.column2}>
                <input
                  label="Album Name"
                  name="albumname"
                  className="form-control form-control-sm"
                  value={album.albumname}
                  onChange={updateAlbumValue}
                />
                <input
                  label="Artist Name"
                  name="artistname"
                  className="form-control form-control-sm"
                  value={album.artistname}
                  onChange={updateAlbumValue}
                />
              </div>
              <div className={styles.column3}>
                <div>
                  <label>Genres</label>
                  <GenresDropdown
                    label="Genres"
                    name="genres"
                    value={album.genres}
                    selectedItems={album.genres}
                    onChange={(value) => updateAlbumValue('genres', value)}
                  />
                </div>
                <div>
                  <label>Tags</label>
                  <TagsDropdown
                    label="Tags"
                    name="tags"
                    value={album.tags}
                    selectedItems={album.tags}
                    onChange={(value) => updateAlbumValue('tags', value)}
                  />
                </div>
                <div>
                  <label>AlbumVersion</label>
                  <AlbumVersionDropdown
                    label="AlbumVersion"
                    name="albumversion"
                    value={album.albumversion}
                    selectedItems={album.albumversion}
                    onChange={(value) => updateAlbumValue('albumversion', value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.row2}>
              <textarea
                label="Description"
                name="description"
                value={album.description}
                onChange={updateAlbumValue}
              />
            </div>
          </div>
        </div>
        <div className={styles.card2}>
          <div className={styles.header}>Sale and Download Options</div>
          <div className={styles.row4}>
            <div className={styles.column4}>
              <label>Album Price</label>
              <AlbumPriceDropdown
                label="Albumprice"
                name="albumprice"
                value={album}
                selectedItems={album.albumprice}
                onChange={(value) => updateAlbumValue('albumprice', value)}
              />
            </div>
            <div className={styles.column4}>
              <label>Track Price</label>
              <TrackPriceDropdown
                label="TrackPrice"
                name="trackprice"
                value={album}
                selectedItems={album.trackprice}
                onChange={(value) => updateAlbumValue('trackprice', value)}
              />
            </div>
          </div>
        </div>
      </form>

      <div className={styles.tracks}>
        <div className={styles.uploadMusic}>
          <AiOutlinePlus style={{ marginRight: 2 }}/>
            Track
        <div className={styles.uploadMusic}>
            <AiOutlinePlus style={{ marginRight: 2 }}/>
            Album
        </div>
        {trackData.map((track, index) => (
          <AlbumPageTrackCard
            key={track.id}
            artistid={track.artistid}
            albumid={track.albumid}
            track={track}
            title={track.title}
            plays={track.plays}
            time={track.time}
            location={track.location}
            trackNumber={getTrackNumber(index)}
            onSelectTrack={handleSelectTrack}
            />
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.genres}>
          Genres: {album.genres}
        </div>
        <div className={styles.tags}>
          tags: {album.tags}
        </div>
        <div className={styles.credits}>
          credits: {album.credits}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AlbumEdit;
