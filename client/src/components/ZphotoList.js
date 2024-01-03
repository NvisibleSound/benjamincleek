import React, { Component } from 'react';
import axios from 'axios';
import { FaCopy } from 'react-icons/fa'; // Import the copy icon from an icon library
import styles from './ZphotoList.module.css';
import ZphotoUploader from './ZphotoUploader.js';
import Zphoto from './Zphoto.js';
import ZphotoTextCard from './ZphotoTextCard.js';
import { IoCopyOutline } from "react-icons/io5";


export default class ZphotoList extends Component {
  constructor(props) {
    super(props);

    this.deleteAlbum = this.deleteAlbum.bind(this);

    this.state = { zphoto: [] };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/zphotos/')
      .then(response => {
        this.setState({ zphoto: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteAlbum(id) {
    axios.delete('http://localhost:5000/zphotos/' + id)
      .then(response => { console.log(response.data) });

    this.setState({
      zphoto: this.state.zphoto.filter(el => el.id !== id)
    });
  }

  handleCopyToClipboard = (src) => {
    // Create a temporary textarea to copy the URL to the clipboard
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = src;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);

    // You can add a UI feedback or notification here if needed
    alert('Copied to clipboard!');
  };

  render() {
    return (
      <div>
        <div>
          <ZphotoUploader />
        </div>
        <div className={styles.zphotoList}>
          {this.state.zphoto.map(currentZphoto => (
            <div className={styles.photoCard} key={currentZphoto.id}>
              <Zphoto
                src={currentZphoto.location} 
                deleteZphoto={this.deleteAlbum}
              />
              <div>
                <div onClick={() => this.handleCopyToClipboard(currentZphoto.location)}>
                  <IoCopyOutline 
                    fontSize={25}
                  /> 
                </div>
                {currentZphoto.filename}
              </div>
              
              {/* <div>{currentZphoto.location}</div> */}
            </div>
          ))}
        </div>
        {/* <div className={styles.zphotoList}>
          {this.state.zphoto.map(currentZphoto => (
            <ZphotoTextCard
              key={currentZphoto.id}
              metadata={currentZphoto} 
              deleteZphoto={this.deleteAlbum}
            />
          ))}
        </div> */}
      </div>
    );
  }
}
