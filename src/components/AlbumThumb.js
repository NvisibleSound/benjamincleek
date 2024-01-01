import React from 'react';
import './ArtistSite.module.css';

const AlbumThumb = ({src, alt}) => {
  const handleOnError = (err) => {
<i className="bi bi-person-circle"></i>
  }
  return (
    <div>
       {src ? (
          <img 
            src={src} 
            alt={alt} 
            onError={handleOnError}/> 
        ) : (
          <img 
            src={"https://generative-placeholders.glitch.me/image?width=600&height=300&style=triangles&gap=30"} 
            alt={alt} 
          /> 
        )}
    </div>
  )
}   

export default AlbumThumb;



