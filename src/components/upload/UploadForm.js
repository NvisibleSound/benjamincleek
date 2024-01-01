
import React, { Component } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import UploadSongs from './UploadSongs'
import styles from './uploadForm.module.css'

export class UploadForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      album: {
        albumName:'', 
        photo:'',
        releaseDate:'',
        songs:'',
      }
    }
  }
  

  // componentDidMount() {
  //   const { id } = this.props.routeMatchParams
  //   const url = `http://localhost:5000/albums/`

  //   axios.get(url)
  //     .then(response => {
  //       this.setState({ album: response.data })
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  //   }

    updateAlbumValue = (fieldName, value) => {
      this.setState({ album: { ...this.state.song, [fieldName]: value } })
    }
    
    handleSubmit = e => {
      e.preventDefault()

      const { song } = this.state
      const url = `http://localhost:5000/albums/`

      axios.put(url, song).then(res => {
        console.log(res.data)
        window.location = '/'
      })
    }

    render() {
      const { album } = this.state

      return (
        <div className={styles.uploadPage}>
          <div className={styles.uploadForm}>
            <div className={styles.column1}>
              <div className='card'>
                <h3>Upload Songs</h3>
                <form >
                <div className= {styles.albumPhoto}>
							album picture
							<div className={styles.icon}>
								<i className="bi bi-plus"/>
							</div>
							<input 
								className={styles.chooseFile} 
								required
								type="file"	
							/>
						</div>
                  <FormField
                    label='Album Name:'
                    name='albumName'
                    values={album}
                    onChange={this.updateProfileValue}
                  />
                  <FormField
                    label='Photo:'
                    name='photo:'
                    values={album}
                    onChange={this.updateProfileValue}
                  />
                  <FormField
                    label='Release Date:'
                    name='releaseDate'
                    values={album}
                    onChange={this.updateProfileValue}
                  />
                  <FormField
                    label='Add Songs:'
                    name='addSongs'
                    values={album}
                    onChange={this.updateProfileValue}
                  />
                </form> 
              </div>
            </div>
            <div className={styles.column2}>
              <UploadSongs/>        
              <div className={styles.buttons}>
                <input type="submit" value="Cancel" className="btn btn-outline-dark" />
                <input type="submit" value="Save" className="btn btn-secondary" />
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default function (props) {
  const routeMatchParams = useParams()

  return (
    <UploadForm {...props} routeMatchParams={routeMatchParams} />
  )
}

export function FormField ({
  name,
  label,
  values,
  onChange: providedOnChange
}) {
  const onChange = event => providedOnChange(name, event.target.value)

  return (
    <div >
      <label>{label}</label>
      <input 
        type="text"
        name={name}
        className="form-control"
        value={values[name]}
        onChange={onChange}
      />
    </div>
  )
}
