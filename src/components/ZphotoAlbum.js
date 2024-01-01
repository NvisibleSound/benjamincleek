import React, { Component } from 'react';
import axios from 'axios';
import styles from './albumCreate.module.css';
import AlbumPhoto from './AlbumPhoto';
import AlbumTrackUploader from './AlbumTrackUploader';
import { Link } from 'react-router-dom';
import GenresDropdown from './dropdowns/GenresDropdown';
import TagsDropdown from './dropdowns/TagsDropdown';


export default class AlbumCreate extends Component {
  constructor(props) {
    super(props);
  
    this.onChangeFileUrl = this.onChangeFileUrl.bind(this);
    this.onChangeAlbumName = this.onChangeAlbumName.bind(this);
    this.onChangeTrackIds = this.onChangeTrackIds.bind(this);
    this.onChangeArtistName = this.onChangeArtistName.bind(this);
    this.onChangeGenre = this.onChangeGenre.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.addTrackToAlbum = this.addTrackToAlbum.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  

    this.state = {
      album: {
        fileurl: '',
        albumname: '',
        artistname: '', 
        genres: [],
        tags: [],
        description: '',
        trackids: [],
      },
    };
  }
  
  
  onChangeFileUrl(fileurl) {
    this.setState(
      (prevState) => ({
        album: {
          ...prevState.album,
          fileurl: fileurl,
        },
      }),
      () => {
        console.log('File location:', this.state.album.fileurl);
      }
    );
  }


  onChangeAlbumName(e) {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        albumname: e.target.value,
      },
    }));
  }
  onChangeArtistName(artistname) {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        artistname: artistname,
      },
    }));
  }
  onChangeTrackIds(trackId) {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        trackids: [...prevState.album.trackids, trackId],
      },
    }));
  }  

 

  onChangeGenre(selectedGenres) {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        genres: selectedGenres,
      },
    }));
  }

  onChangeTags(selectedTagss) {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        tags: selectedTagss,
      },
    }));
  }

  onChangeDescription(e) {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        description: e.target.value,
      },
    }));
  }

  handleUploadTrackSuccess = (trackid) => {
  
    this.addTrackToAlbum(trackid);

  };

  onTrackSaved = (trackid) => {
    this.props.onTrackUploaded(trackid);
  };

  handleRemoveTrack = (trackKey) => {

  };

  addTrackToAlbum = (trackId) => {
    this.setState(
      (prevState) => ({
        album: {
          ...prevState.album,
          trackids: [...prevState.album.trackids, trackId],
        },
      }),
      () => {
        console.log('Album after adding track:', this.state.album.trackids);
      }
    );
  };
  
  
  onSubmit(e) {
    e.preventDefault();

    const { fileurl, albumname, artistname, genres, tags, description, trackids } = this.state.album;

    const Album = {
      fileurl: fileurl,
      albumname: albumname,
      artistname: artistname,
      genres: genres,
      tags: tags,
      description: description,
      trackids: trackids,
    };

    
    axios.post('http://localhost:5000/albums', Album)
      .then(res => {
        console.log(res.data);
        console.log(Album);
        console.log('Album created successfully!');
        window.location = '/albumList';
      })
      .catch(err => {
        console.error(err);
        console.log('An error occurred while creating the album.');
      });
  }
  handleSubmit(fileurl) {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        fileurl: fileurl,
      },
    }), () => {
      console.log("File URL:", this.state.album.fileurl);
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className={styles.card}>
            <div className={styles.header}>
              <label> Benjamin Cleek </label>
              <div className={styles.buttons}>
                <Link to="/AlbumList">
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    style={{ marginRight: 5, width: 60, padding: 0, fontSize: 15 }}
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginLeft: 5, width: 55, padding: 0, fontSize: 15 }}
                >
                  Save
                </button>
              </div>
            </div>
            <div>
              <div className={styles.row1}>
                <div>
                  <AlbumTrackUploader
                    onTrackSaved={this.handleUploadTrackSuccess}                    
                  />
                </div>
                <div>
                  <div className={styles.albumInfo}>
                    <div className={styles.customizeAlbumPhoto}>
                      <AlbumPhoto
                        onUploadSuccess={newZphoto.location} 
                      />
                    </div>
                    <input
                      label="AlbumName"
                      name="albumname"
                      className={styles.albumName}
                      value={this.state.album.albumname}
                      onChange={this.onChangeAlbumName}
                      placeholder="Album Title..." 
                    />
                  </div>
                  <div className={styles.albumInfo}>
                    <div className={styles.description}>
                      <textarea
                        label="Description"
                        name="description"
                        className="form-control form-control-sm"
                        rows="4"
                        value={this.state.album.description}
                        onChange={this.onChangeDescription}
                        placeholder="Description..." 
                      />
                    </div>
                    <div className={styles.genres}>
                      <label>Genres</label>
                      <GenresDropdown
                        label="Genres"
                        name="genres"
                        value={this.state.album.genres}
                        selectedItems={this.state.album.genres}
                        onChange={this.onChangeGenre}
                      />
                    </div>  
                    <div className={styles.genres}>
                      <label>Tags</label>
                      <TagsDropdown
                        label="Tags"
                        name="tags"
                        value={this.state.album.tags}
                        selectedItems={this.state.album.tags}
                        onChange={this.onChangeTags}
                      />
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
