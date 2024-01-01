import React, { Component } from 'react';
import axios from 'axios';
import TrackCard from './TrackCard';
import styles from './TrackForm.module.css';
import GenresDropdown from '../dropdowns/GenresDropdown';
import TagsDropdown from '../dropdowns/TagsDropdown';
import Credits from './Credits';
import Dropzone from 'react-dropzone';
import { BsUpload } from 'react-icons/bs';
import TrackUploader from './TrackUploader';

export class TrackForm extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAlbum = this.onChangeAlbum.bind(this);
    this.onChangeArtist = this.onChangeArtist.bind(this);
    this.onChangeReleaseDate = this.onChangeReleaseDate.bind(this);
    this.onChangeISRC = this.onChangeISRC.bind(this);
    this.onChangeCredits = this.onChangeCredits.bind(this);
    this.onChangeGenres = this.onChangeGenres.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeKey = this.onChangeKey.bind(this);


    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      title: '',
      artist: '',
      album: '',
      releasedate: '',
      isrc: '',
      credits: '',
      genres: [],
      tags: [],
      description: '',
      location: '',
      key: '',
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }
  onChangeArtist(e) {
    this.setState({
      artist: e.target.value,
    });
  }
  onChangeAlbum(e) {
    this.setState({
      album: e.target.value,
    });
  }
  onChangeReleaseDate(e) {
    this.setState({
      releasedate: e.target.value,
    });
  }
  onChangeISRC(e) {
    this.setState({
      isrc: e.target.value,
    });
  }
  onChangeCredits = (selectedCredits) => {
    this.setState({
      credits: selectedCredits,
    });
  };
  onChangeGenres = (selectedGenres) => {
    this.setState({
      genres: selectedGenres,
    });
  };
  onChangeTags = (selectedTags) => {
    this.setState({
      tags: selectedTags,
    });
  }
  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onChangeLocation(location) {
    this.setState({
      location: location,
    });
  }

  onChangeKey(key) {
    this.setState({
      key: key,
    });
  }

  handleTrackUploadSuccess = (uploadedFileName, location, key) => {
    this.setState({
      title: uploadedFileName, // Update the 'title' field with the filename
      location: location,
      key: key,
    });
  };

  onSubmit(e) {
    e.preventDefault();

    const Track = {
      title: this.state.title,
      album: this.state.album,
      artist: this.state.artist,
      releasedate: this.state.releasedate,
      isrc: this.state.isrc,
      credits: this.state.credits,
      genres: this.state.genres.map((genres) => genres.value), // Get only the values from the selected genres
      tags: this.state.tags.map((tag) => tag.value), // Get only the values from the selected tags
      description: this.state.description,
      location: this.state.location,
      key: this.state.key,
    };

    console.log(Track);

    // window.location = '/TracksList';

    axios.post('http://localhost:5000/tracks/', Track).then((res) => console.log(res.data));
  }

  render() {
    return (
      <div className={styles.TrackPage}>x
        <div className="card" style={{ marginBottom: '500px'}}>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="card">
                <div className="card-header">
                  <h2>Track</h2>
                </div>
                <div className="card-body" >
                  <div className={styles.fileInput}>
                    <TrackUploader 
                    onChangeLocation={this.onChangeLocation} 
                    onChangeKey={this.onChangeKey} 
                    onUploadSuccess={this.handleTrackUploadSuccess} // Pass the function as a prop
                  />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.column1}>
                      <label>Title:</label>
                      <input
                        label="Title:"
                        name="title"
                        className="form-control"
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                      />
                      <label>Artist:</label>
                      <input
                        label="Artist:"
                        name="artist:"
                        className="form-control"
                        value={this.state.artist}
                        onChange={this.onChangeArtist}
                      />
                      <label>Album:</label>
                      <input
                        label="Album:"
                        name="album"
                        className="form-control"
                        value={this.state.album}
                        onChange={this.onChangeAlbum}
                      />
                      <label>ISRC:</label>
                      <input
                        label="ISRC:"
                        name="isrc"
                        className="form-control"
                        value={this.state.isrc}
                        onChange={this.onChangeISRC}
                      />
                    </div>
                    <div className={styles.column2}>
                      <label>Genres:</label>
                      <GenresDropdown
                        selectedItems={this.state.genres} 
                        onChange={this.onChangeGenres} 
                      />
                      <label>Tags:</label>
                      <TagsDropdown
                        selectedItems={this.state.tags} 
                        onChange={this.onChangeTags} 
                      />
                      <label>Description:</label>
                      <textarea
                        label="Description"
                        name="description"
                        className="form-control"
                        rows="4"
                        value={this.state.description}
                        onChange={this.onChangeDescription}
                      />
                    </div>
                  </div>
                  <label>Credits:</label>
                    <Credits
                      selectedItems={this.state.credits}
                      onChange={this.onChangeCredits}
                    />
                </div>
                <div className="card-footer">
                  <div className={styles.buttons}>
                    <input type="submit" value="Cancel" className="btn btn-outline-dark" />
                    <input type="submit" value="Save" className="btn btn-outline-primary" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default TrackForm;
