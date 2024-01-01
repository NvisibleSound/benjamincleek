import React, { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import TrackCard from './TrackCard';
import styles from './TrackForm.module.css';
import GenresDropdown from './dropdowns/GenresDropdown';
import TagsDropdown from './dropdowns/TagsDropdown';

export class TrackEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {
        title: '',
        artist: '',
        releasedate: '',
        album: '',
        credits: '',
        genres: [],
        tags:[],
        description: '',
      },
    };
  }

  componentDidMount() {
    const { id } = this.props.routeMatchParams;
    const url = `http://localhost:5000/Tracks/${id}`;

    axios
    .get(url)
    .then(({ data }) => {
      const genres = data.genres ? data.genres : [];
      const tags = data.tags ? data.tags : [];
  
      this.setState({
        track: {
          ...data,
          genres,
          tags,
        },
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }



  updateTrackValue = (fieldName, value) => {
    this.setState((prevState) => ({
      track: { ...prevState.track, [fieldName]: value },
    }));
  };

 

  handleSubmit = (e) => {
    e.preventDefault();

    const { track } = this.state;
    const url = `http://localhost:5000/tracks/${this.props.routeMatchParams.id}`;

    axios.put(url, track).then((res) => {
      console.log('Track updated!');
      console.log(res.data);
    });
  };

  render() {
    const { track } = this.state;

    return (
      <div className={styles.TrackPage}>
        <div className='card'>
          <div className='card-body'>
            <form onSubmit={this.handleSubmit}>
              <div className='card'>
                <div className={styles.header}>
                  <h2>Edit track</h2>
                </div>
                <div className='card-body'>
                  <div>
                  <TrackCard
                    filename={track.title}
                    id={this.props.routeMatchParams.id} // Pass the id to TrackCard
                    metadata={{
                      trackName: track.title,
                      fileName: track.originalFileName,
                      // ... other metadata fields ...
                    }}
                    onMetadataChange={(newMetadata) => {
                      this.updateTrackValue('title', newMetadata.trackName);
                      this.updateTrackValue('originalFileName', newMetadata.fileName);
                      // ... update other metadata fields ...
                    }}
                  />
                </div>
                  <div className={styles.row}>
                    <div className={styles.column1}>
                      <FormField
                        label='Title:'
                        name='title'
                        className='form-control'
                        value={track.title}
                        onChange={this.updateTrackValue}
                      />
                      <FormField
                        label='Artist:'
                        name='artist'
                        className='form-control'
                        value={track.artist}
                        onChange={this.updateTrackValue}
                      />
                      <FormField
                        label='Release Date:'
                        name='releasedate'
                        className='form-control'
                        value={track.releasedate}
                        onChange={this.updateTrackValue}
                      />
                      <FormField
                        label='Album:'
                        name='album'
                        className='form-control'
                        value={track.album}
                        onChange={this.updateTrackValue}
                      />
                    </div>
                    <div className={styles.column2}>
                      <FormField
                        label='Credits:'
                        name='credits'
                        className='form-control'
                        value={track.credits}
                        onChange={this.updateTrackValue}
                      />
                      <div className={styles.column3}>
                        <label>Genres</label>
                        <GenresDropdown
                          label='Genres'
                          name='genres'
                          value={track.genres}
                          selectedItems={track.genres}
                          onChange={(value) => this.updateTrackValue('genres', value)}
                        />
                      </div>
                      <label>Tags</label>
                        <TagsDropdown
                          label='Tags'
                          name='tags'
                          value={track.tags}
                          selectedItems={track.tags}
                          onChange={(value) => this.updateTrackValue('tags', value)}
                        />
                      <Description
                        label='Description'
                        name='description'
                        className='form-control'
                        rows='4'
                        value={track.description}
                        onChange={this.updateTrackValue}
                      />
                    </div>
                  </div>
                </div>
                <div className='card-footer'>
                  <div className={styles.buttons}>
                    <Link to='/TrackList'>
                      <input type='submit' value='Cancel' className='btn btn-outline-dark' />
                    </Link>
                    <Link to='/TrackList'>
                      <input type="submit" className="btn btn-outline-primary" />
                    </Link>
                    <button type="submit" className="btn btn-outline-primary">
                      Save
                    </button>                   
                  </div>
                </div>
              </div>
              <h4>To Do</h4>
              <li>Redo back end with routes and models are scalable</li>
              <li>Object storage for photo and audio</li>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default function TrackEditWrapper(props) {
  const { id } = useParams();

  return <TrackEdit {...props} routeMatchParams={{ id }} />;
}

export function FormField({ name, label, value, onChange }) {
  const handleChange = (e) => {
    console.log(`Updating ${name} to:`, e.target.value); // Add this line
    onChange(name, e.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type='text'
        name={name}
        className='form-control'
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export function Description({ name, label, value, onChange }) {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <textarea
        name={name}
        className='form-control'
        value={value}
        onChange={handleChange}
        rows='4'
      />
    </div>
  );
}
