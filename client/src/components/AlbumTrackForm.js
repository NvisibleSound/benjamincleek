import React, { Component } from 'react';
import axios from 'axios';
import AlbumTrackUploader from './AlbumTrackUploader';

export class AlbumTrackForm extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAlbum = this.onChangeAlbum.bind(this);
    this.onChangeArtist = this.onChangeArtist.bind(this);
    this.onChangeReleaseDate = this.onChangeReleaseDate.bind(this);
    this.onChangeCredits = this.onChangeCredits.bind(this);
    this.onChangeGenres = this.onChangeGenres.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeKey = this.onChangeKey.bind(this);

    this.handleTrackUpload = this.handleTrackUpload.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      id: [],
      title: '',
      artist: '',
      album: '',
      releasedate: '',
      credits: '',
      genres: [],
      tags: [],
      description: '',
      location: '',
      key: '',
      tracks: [],
    };
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
  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }
 
  onChangeReleaseDate(e) {
    this.setState({
      releasedate: e.target.value,
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
  

  handleTrackUpload = (trackData) => {
    this.setState((prevState) => ({
      album: {
        ...prevState.album,
        tracks: [...prevState.album.tracks, trackData], // Append the uploaded track data to the array
      },
      trackIds: [...prevState.trackIds, trackData.id], // Append the track ID to the array
    }));
  };
  

  handleTrackUploadSuccess = (title, location, key) => {
    // Append the uploaded track data to the state's tracks array
    const newTrack = { title, location, key };
    this.setState((prevState) => ({
      tracks: [...prevState.tracks, newTrack],
    }));
  };

  onSubmit(e) {
    e.preventDefault();

    const Track = {
      title: this.state.title,
      album: this.state.album,
      artist: this.state.artist,
      releasedate: this.state.releasedate,
      credits: this.state.credits,
      genres: this.state.genres.map((genres) => genres.value),
      tags: this.state.tags.map((tag) => tag.value),
      description: this.state.description,
      location: this.state.location,
      key: this.state.key,
      tracks: this.state.tracks
    };

    console.log(Track);

    axios.post('http://localhost:5000/tracks/', Track).then((res) => console.log(res.data));
  }

  render() {
    return (
      <div>    
        <form onSubmit={this.onSubmit}>
          <div >
          <AlbumTrackUploader 
            onUploadTrackSuccess={this.handleTrackUploadSuccess} 
            onChangeLocation={this.onChangeLocation} 
            onChangeKey={this.onChangeKey} 
            />
          </div>
        </form>
      </div>
    );
  }
}

export default AlbumTrackForm;

