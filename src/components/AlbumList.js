import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AlbumPhoto from './AlbumPhoto'
import { AiFillPlusCircle } from "react-icons/ai"
import { MdEdit, MdDelete } from "react-icons/md";
import { SiManageiq } from "react-icons/si";
import { BsDisc } from "react-icons/bs";
import styles from './AlbumList.module.css';

const Album = props => (
  <div className={styles.album}>
      <td className={styles.dropzone}>
        <AlbumPhoto fileurl={props.album.fileurl || "https://i.pravatar.cc"}/>
      </td>
    <td>{props.album.albumname}</td>
    <td>{props.album.id}</td>
    <td> 
      <Link to={"/ArtistPage/"+props.album.id}>
        {props.album.artistname}
      </Link>
      {props.album.artistid}

    </td>
    <td>{props.album.releasedate}</td>
      <td>
      <Link to={"/AlbumPage/"+props.album.id}>
          <BsDisc style={{ color:"black", margin:5, fontSize: 20 }} title="Album Page" />
        </Link>
        | 
        <Link to={"/AlbumEdit/"+props.album.id}>
          <MdEdit style={{ color:"black", margin:5, fontSize: 20 }} title="Edit Album" />
        </Link>
        | 
        <Link to={"/AlbumManage/"+props.album.id}>
          <SiManageiq style={{ color:"black", margin:5, fontSize: 20 }} title="Manage Album" />
        </Link>
        | 
        <a href="#" onClick={() => { props.deleteAlbum(props.album.id) }}>
          <MdDelete style={{ color:"black", fontSize: 20 }} title="Delete Album" />
        </a>
      </td>
  </div>
)

export default class AlbumsList extends Component {
  constructor(props) {
    super(props);

    this.deleteAlbum = this.deleteAlbum.bind(this)

    this.state = {albums: []};
  }

  componentDidMount() {
    const artistid = 3;
  
    axios.get(`http://localhost:5000/albums/artistid/${artistid}`)
      .then(response => {
        this.setState({ albums: response.data });
        console.log("Server response:", response);
      console.log("Data received from the server:", response.data);
      this.setState({ albums: response.data });
      })
      .catch(error => {
        console.error("Error fetching albums:", error);
      });
  }
  

  deleteAlbum(id) {
    axios.delete('http://localhost:5000/albums/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      albums: this.state.albums.filter(el => el.id !== id)
    })
  }

  albumList() {
    return this.state.albums.map(currentAlbum => {
      return <Album album={currentAlbum} deleteAlbum={this.deleteAlbum} key={currentAlbum.id}/>;
    })
  }

  render() {
    return (
      <div className={styles.albumList}>
        <h3>Albums</h3>
          <Link to="/AlbumCreate" className="nav-link" style={{ marginLeft:700}}>
              Create Album
            <AiFillPlusCircle style={{ fontSize:30, marginLeft:10,}}/>
          </Link>
        <td className="table">            
        { this.albumList() }

        </td>
      </div>
    )
  }
}