require("dotenv").config();
const express = require ("express")
const app = express();
const cors = require("cors");
const pool = require("./db")
const s3Service = require('./s3Service');
const { s3DeleteFile, s3Uploadv2 } = require('./s3Service')

//middleware 
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("server has started on port 5000")
});

const multer = require('multer');

//store to local memory
const storage = multer.memoryStorage();

// s3 upload abstracted post to aws
const upload = multer({ storage });

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size limit exceeded" });
    }
  }
  if (error.message === 'Invalid file type') {
    return res.status(400).json({ message: "Invalid file type" });
  }
  next(error);
});

////////////////////////////////////////////////////////////////////////

// S3 CODE //

  // filter for s3 /busktracks
    const uploadBuskaudio = multer({
      storage,
      limits: {
        fileSize: 100 * 2048 * 2048, // 200MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a'];

        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'));
        }
      },
    });

  // get all tracks from s3
    app.get("/buskaudio/tracks", async (req, res) => {
      try {
        // Extract the genres and tags query parameters from the request
        const { genres, tags, title } = req.query;

        // Build the SQL query for fetching tracks with filtering
        let sqlQuery = "SELECT * FROM tracks";
        let queryParams = [];

        if (genres || tags) {
          sqlQuery += " WHERE";

          if (genres) {
            sqlQuery += " genres @> $1"; // Use the JSONB 'contains' operator for genres
            queryParams.push([genres]);
          }

          if (tags) {
            if (tags) {
              sqlQuery += " AND";
            }
            sqlQuery += " tags @> $2"; // Use the JSONB 'contains' operator for tags
            queryParams.push([tags]);
          }

          if (title) {
            if (title) {
              sqlQuery += " AND";
            }
            sqlQuery += " title @> $2"; // Use the JSONB 'contains' operator for tags
            queryParams.push([title]);
          }
        }

      // Execute the SQL query with the provided parameters
        const filteredTracks = await pool.query(sqlQuery, queryParams);

        res.json(filteredTracks.rows);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "error", message: "An error occurred while fetching tracks" });
      }
    });

    app.post("/buskaudio/tracks", uploadBuskaudio.single("file"), async (req, res) => {
      try {
        const file = req.file;
        
        if (!file) {
          return res.status(400).json({ status: "error", message: "No file was uploaded" });
        }
    
        const buskaudioBucketName = process.env.BUCKET_NAME_BUSKAUDIO;
        const folder = "tracks"; 
        const result = await s3Uploadv2(file, folder, buskaudioBucketName);
        const key = result.Key;
        // Return the location and key in the response
        res.status(200).json({ status: "success", location: result.Location, key });
      
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "An error occurred during file upload" });
      }
    });

  // delete audio file from s3
  app.delete('/buskaudio/tracks/:key/delete', async (req, res) => {
    const { key } = req.params;
    const bucketName = 'buskaudio'; 
  
    try {
      console.log('Key:', key); 
      await s3Service.s3DeleteFile(key, bucketName);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error); // Add this line for debugging
  
      res.status(500).json({ error: 'Error deleting the file' });
    }
  });
  

  // replace track file in s3
    app.put("/buskaudio/tracks/:id", uploadBuskaudio.single("file"), async (req, res) => {
      try {
        const { filename } = req.params;
        const file = req.file;
    
        if (!file) {
          return res.status(400).json({ status: "error", message: "No file was uploaded" });
        }
    
        // Delete the existing file from S3 using your existing logic
        await s3DeleteFile(filename);
    
        // Upload the new file to S3
        const buskaudio = process.env.BUCKET_NAME_BUSKAUDIO;
        const folder = "tracks"; // Provide the appropriate folder name
        const result = await s3Uploadv2(file, folder, buskaudio);
    
        res.status(200).json({ status: "success", location: result.Location });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "An error occurred during file replacement" });
      }
    });
  
        
////////////////////////////////////////////////////////////////////////

  // get one postgres /track
    app.get("/tracks/:id", async (req, res) => {
      try {
        console.log(req.params);
        const { id } = req.params;
        const track = await pool.query("SELECT * FROM tracks WHERE id = $1", [id])
        res.json(track.rows[0])
      } catch (err) {
        console.error(err.message)
      }
    })

  app.get('/tracks', async (req, res) => {
  const { genres, tags, query } = req.query;

  if (query) {
    try {
      console.log('Received tracks query:', query);

      // Perform the search operation using the query parameter
      const searchResults = await pool.query(
        "SELECT id, title FROM tracks WHERE title ILIKE $1",
        [`%${query}%`]
      );

      console.log('Search results:', searchResults.rows);

      res.json(searchResults.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'An error occurred while searching for tracks.' });
    }
  } else {
    let sqlQuery = 'SELECT id, title, artistid, albumid FROM tracks WHERE TRUE';
    const params = [];

    if (genres && genres.length > 0) {
      const genresArray = genres.split(',');
      sqlQuery += ` AND genres @> $${params.length + 1}::text[]`;
      params.push(genresArray);
    }

    if (tags && tags.length > 0) {
      const tagsArray = tags.split(',');
      sqlQuery += ` AND tags @> $${params.length + 1}::text[]`;
      params.push(tagsArray);
    }

    console.log('Generated SQL query:', sqlQuery);
    console.log('Query parameters:', params);

    try {
      const result = await pool.query(sqlQuery, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

    
    
    app.post("/tracks", async(req, res) => {
      try {
        console.log(req.body);
        const { title } = req.body;
        const { album } = req.body;
        const { artistname } = req.body;
        const { releasedate } = req.body;
        const { description } = req.body;
        const { isrc } = req.body;
        const { credits } = req.body;
        const { genres } = req.body;
        const { tags } = req.body;
        const { location } = req.body;
        const { key } = req.body;
    
    
        const newtrack = await pool.query(
          "INSERT INTO tracks (title, album, artistname, releasedate, description, isrc, credits, genres, tags, location, key) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
          [title, album, artistname, releasedate, description, isrc, credits, genres, tags, location, key]
        );
        
        const insertedTrackId = newtrack.rows[0].id; // Extract the ID of the newly inserted track
        
        // Log the track ID
        console.log("New track created with ID:", insertedTrackId);
        
        res.json(newtrack.rows[0]);
            
      } catch (err) {
        console.error(err.message);
      }
    });

    app.put("/tracks/:id", async (req, res) => {
      try {
        const { title, artistname, album, releasedate, description, credits, location, key, genres, tags } = req.body;
        const { id } = req.params;
    
        const updatetrack = await pool.query(
          "UPDATE tracks SET title = $1, artistname = $2, album = $3, releasedate = $4, description = $5, credits = $6, location = $7, key = $8, genres = $9, tags = $10 WHERE id = $11 RETURNING *",
          [title, artistname, album, releasedate, description, credits, location, key, genres, tags, id]
        );
    
        console.log("Track updated successfully:", updatetrack.rows[0]);
        res.json(updatetrack.rows[0]);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while updating the track." });
      }
    });
    
  
  

  // delete a postgres /track
    app.delete("/tracks/:id", async(req, res) => {
      try {
        const{ id } = req.params;
        const deletetrack = await pool.query("DELETE FROM tracks WHERE id = $1", 
        [ id ]
        )
        res.json(deletetrack.rows[0])
      } catch (err) {
        console.log(err.message)
      }
      console.log("track deleted...")
    })

    
    
    
    
////////////////////////////////////////////////////////////////////////

const uploadBuskphotos = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'application/pdf', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

app.post("/buskphotos/:folder", uploadBuskphotos.single("file"), async (req, res) => {
  try {
    const folder = req.params.folder;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ status: "error", message: "No file was uploaded" });
    }

    const result = await s3Uploadv2(file, folder, process.env.BUCKET_NAME_BUSKPHOTOS);

    // Rest of your code

    res.status(200).json({ status: "success", Location: result.Location });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "An error occurred during file upload" });
  }
});



//////////////////////


//create a profile
app.post("/supporter", async(req, res) => {
  try {
    console.log(req.body);
    const { username } = req.body;
    const { first } = req.body;
    const { last } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { dob } = req.body;
    const { location } = req.body;
    const { fileurl } = req.body;

    const newProfile = await pool.query(
      "INSERT INTO supporter (username, first, last, email, password, dob, location, fileurl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [username, first, last, email, password, dob, location, fileurl]
    );
    
    res.json(newProfile.rows[0]);
    console.log("supporter created!")

  } catch (err) {
    console.error(err.message);
  }
});

// get all profiles
app.get("/supporter", async( req, res) => {
  try {
    const allProfiles = await pool.query("SELECT * FROM supporter");
    res.json(allProfiles.rows);

  } catch (err) {
    console.error(err.message);
  }
})

// get a supporter
app.get("/supporter/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const supporter = await pool.query("SELECT * FROM supporter WHERE id = $1", [id])
    res.json(supporter.rows[0])
  } catch (err) {
    console.error(err.message)
   }
})

//update a supporter
app.put("/supporter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const { first } = req.body;
    const { last } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { dob } = req.body;
    const { location } = req.body;
    const { fileurl } = req.body;

    const updateProfile = await pool.query( 
      "UPDATE supporter SET username = $1, first = $2, last = $3, email = $4, password = $5, dob = $6, location = $7, fileurl = $8 where id = $9",
    [username, first, last, email, password, dob, location, fileurl, id]
    )

    res.json(updateProfile.rows[0]);
    console.log("supporter updated!"); // Move this line inside the try block
  } catch (err) {
    console.error(err.message);
  }
});


// delete a supporter
app.delete("/supporter/:id", async(req, res) => {
  try {
    const{ id } = req.params;
    const deleteProfile = await pool.query("DELETE FROM supporter WHERE id = $1", 
    [ id ]
    )
    res.json(deleteProfile.rows[0])
  } catch (err) {
    console.log(err.message)
  }
  console.log("supporter deleted...")

})

////////////////////
//create an artist
app.post("/artist", async(req, res) => {
  try {
    console.log(req.body);
    const { artistname } = req.body;
    const { first } = req.body;
    const { last } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { dob } = req.body;
    const { location } = req.body;
    const { fileurl } = req.body;
    const { albums } = req.body;
    const { tracks } = req.body;

    const newartist = await pool.query(
      "INSERT INTO artist (artistname, first, last, email, password, dob, location, fileurl, albums, tracks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [artistname, first, last, email, password, dob, location, fileurl, albums, tracks]
    );
    
    res.json(newartist.rows[0]);
    console.log("artist created!")

  } catch (err) {
    console.error(err.message);
  }
});

// get all artists
app.get("/artist", async( req, res) => {
  try {
    const allartists = await pool.query("SELECT * FROM artist");
    res.json(allartists.rows);

  } catch (err) {
    console.error(err.message);
  }
})

app.get('/artist', async (req, res) => {
  const { genres, tags, query } = req.query;

  if (query) {
    try {
      console.log('Received artist query:', query);

      // Perform the search operation using the query parameter
      const searchResults = await pool.query(
        "SELECT id, artistname FROM artists WHERE artistname ILIKE $1",
        [`%${query}%`]
      );

      console.log('Search results:', searchResults.rows);

      res.json(searchResults.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'An error occurred while searching for artists.' });
    }
  } else {
    let sqlQuery = 'SELECT id, artistname FROM artists WHERE TRUE';
    const params = [];

    if (genres) {
      const genresArray = genres.split(',');
      sqlQuery += ` AND genres @> $${params.length + 1}::text[]`;
      params.push(genresArray);
    }

    if (tags) {
      const tagsArray = tags.split(',');
      sqlQuery += ` AND tags @> $${params.length + 1}::text[]`;
      params.push(tagsArray);
    }

    console.log('Generated SQL query:', sqlQuery);
    console.log('Query parameters:', params);

    try {
      const result = await pool.query(sqlQuery, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching artists:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get("/artist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await pool.query("SELECT * FROM artist WHERE id = $1", [id]);
    if (artist.rows.length === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.json(artist.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



//update a artist
app.put("/artist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { artistname } = req.body;
    const { first } = req.body;
    const { last } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { dob } = req.body;
    const { location } = req.body;
    const { fileurl } = req.body;
    const { albums } = req.body;
    const { tracks } = req.body;

    const updateartist = await pool.query( 
      "UPDATE artist SET artistname = $1, first = $2, last = $3, email = $4, password = $5, dob = $6, location = $7, fileurl = $8 , albums = $9, tracks = $10, where id = $9",
    [artistname, first, last, email, password, dob, location, fileurl, albums, tracks, id]
    )

    res.json(updateartist.rows[0]);
    console.log("artist updated!"); // Move this line inside the try block
  } catch (err) {
    console.error(err.message);
  }
});


// delete a artist
app.delete("/artist/:id", async(req, res) => {
  try {
    const{ id } = req.params;
    const deleteartist = await pool.query("DELETE FROM artist WHERE id = $1", 
    [ id ]
    )
    res.json(deleteartist.rows[0])
  } catch (err) {
    console.log(err.message)
  }
  console.log("artist deleted...")

})



///////////// create an album ///////////////
app.post("/albums", async(req, res) => {
  try {
    console.log(req.body);
    //album info
    const { fileurl } = req.body;
    const { albumversion } = req.body;
    const { privacy } = req.body;
    const { albumname } = req.body;
    const { artistname } = req.body;
    const { genres } = req.body;
    const { description } = req.body;

    // sales and download options
    const { filetype } = req.body;
    const { albumprice } = req.body;
    const { trackprice } = req.body;
    const { bonusitem } = req.body;

    //extra options
    const { etc } = req.body;

    //metadata
    const { ismusic } = req.body;
    const { artistid } = req.body;
    const { publisher } = req.body;
    const { isrc } = req.body;
    const { composer } = req.body;
    const { buylink } = req.body;
    const { recordlabel } = req.body;
    const { releasedate } = req.body;
    const { barcode } = req.body;
    const { iswc } = req.body;
    const { pline } = req.body;
    const { explicit } = req.body;

    //privacy
    const { license } = req.body;

    //permissions const 
    const { downloadpermission } = req.body;
    const { embedcode } = req.body;
    const { offline } = req.body;
    const { appplayback } = req.body;
    const { rss } = req.body;

    //extra
    const { trackids } = req.body;
    const { credits } = req.body;
    const { catalognumber } = req.body;
    const { tags } = req.body;
    const { plays } = req.body;

    const newAlbum = await pool.query(
      "INSERT INTO albums (fileurl, albumversion, privacy, albumname, artistname, genres, description, filetype, albumprice, trackprice, bonusitem, ismusic, artistid, publisher, isrc, composer, buylink, recordlabel, releasedate, barcode, iswc, pline, explicit, license, downloadpermission, embedcode, offline, appplayback, rss, trackids, credits, catalognumber, tags, plays, etc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)",
      [fileurl, albumversion, privacy, albumname, artistname, genres, description, filetype, albumprice, trackprice, bonusitem, ismusic, artistid, publisher, isrc, composer, buylink, recordlabel, releasedate, barcode, iswc, pline, explicit, license, downloadpermission, embedcode, offline, appplayback, rss, trackids, credits, catalognumber, tags, plays, etc]
    )
    
    res.json(newAlbum.rows[0]);
    console.log("Album created!")
    

  } catch (err) {
    console.error(err.message);
  }
});


// get albums
app.get("/albums", async( req, res) => {
  try {
    const allAlbums = await pool.query("SELECT * FROM albums");
    res.json(allAlbums.rows);

  } catch (err) {
    console.error(err.message);
  }
})


//search albums
app.get('/Albums', async (req, res) => {
  const { genres, tags, query } = req.query;

  if (query) {
    try {
      console.log('Received albums query:', query);

      // Perform the search operation using the query parameter
      const searchResults = await pool.query(
        "SELECT id, albumname FROM tracks WHERE albumname ILIKE $1",
        [`%${query}%`]
      );

      console.log('Search results:', searchResults.rows);

      res.json(searchResults.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'An error occurred while searching for tracks.' });
    }
  } else {
    let sqlQuery = 'SELECT id, albumname FROM tracks WHERE TRUE';
    const params = [];

    if (genres) {
      const genresArray = genres.split(',');
      sqlQuery += ` AND genres @> $${params.length + 1}::text[]`;
      params.push(genresArray);
    }

    if (tags) {
      const tagsArray = tags.split(',');
      sqlQuery += ` AND tags @> $${params.length + 1}::text[]`;
      params.push(tagsArray);
    }

    console.log('Generated SQL query:', sqlQuery);
    console.log('Query parameters:', params);

    try {
      const result = await pool.query(sqlQuery, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// get an album
app.get("/albums/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching album details for id:", id);

    const album = await pool.query("SELECT * FROM albums WHERE id = $1", [id]);

    if (album.rows.length === 0) {
      console.log("Album not found for id:", id);
      return res.status(404).json({ error: 'Album not found' });
    }

    console.log("Fetched album details:", album.rows[0]);
    res.json(album.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//get tracks by artistid
app.get("/albums/artistid/:artistid", async (req, res) => {
  try {
    const { artistid } = req.params;
    console.log("Fetching albums for artistid:", artistid);

    const albums = await pool.query("SELECT * FROM albums WHERE artistid = $1", [artistid]);

    if (albums.rows.length === 0) {
      console.log("albums not found for artistid:", artistid);
      return res.status(404).json({ error: 'Albums not found' });
    }

    console.log("Fetched albums for artistid:", albums.rows);
    res.json(albums.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//update an album
app.put("/albums/:id", async (req, res) => {
  try {
    const { fileurl } = req.body;
    const { albumversion } = req.body;
    const { privacy } = req.body;
    const { albumname } = req.body;
    const { artistname } = req.body;
    const { genres } = req.body;
    const { description } = req.body;

    // sales and download options
    const { filetype } = req.body;
    const { albumprice } = req.body;
    const { trackprice } = req.body;
    const { bonusitem } = req.body;

    //extra options
    const { etc } = req.body;

    //metadata
    const { ismusic } = req.body;
    const { artistid } = req.body;
    const { publisher } = req.body;
    const { isrc } = req.body;
    const { composer } = req.body;
    const { buylink } = req.body;
    const { recordlabel } = req.body;
    const { releasedate } = req.body;
    const { barcode } = req.body;
    const { iswc } = req.body;
    const { pline } = req.body;
    const { explicit } = req.body;

    //privacy
    const { license } = req.body;

    //permissions const 
    const { downloadpermission } = req.body;
    const { embedcode } = req.body;
    const { offline } = req.body;
    const { appplayback } = req.body;
    const { rss } = req.body;

    //extra
    const { tracks } = req.body;
    const { credits } = req.body;
    const { catalognumber } = req.body;
    const { tags } = req.body;
    const { plays } = req.body;

    const { id } = req.params;


    const updateAlbum = await pool.query( 
      "Update albums SET fileurl = $1, albumversion = $2, privacy = $3, albumname = $4, artistname = $5, genres = $6, description = $7, filetype = $8, albumprice = $9, trackprice = $10, bonusitem = $11, ismusic = $12, artistid = $13, publisher = $14, isrc = $15, composer = $16, buylink = $17, recordlabel = $18, releasedate = $19, barcode = $20, iswc = $21, pline = $22, explicit = $23, license = $24, downloadpermission = $25, embedcode = $26, offline = $27, appplayback = $28, rss = $29, tracks = $30, credits = $31, catalognumber = $32, tags = $33, plays = $34, etc = $35 where id = $36",
      [fileurl, albumversion, privacy, albumname, artistname, genres, description, filetype, albumprice, trackprice, bonusitem, ismusic, artistid, publisher, isrc, composer, buylink, recordlabel, releasedate, barcode, iswc, pline, explicit, license, downloadpermission, embedcode, offline, appplayback, rss, tracks, credits, catalognumber, tags, plays, etc, id]
    )

    res.json(updateAlbum.rows[0])
  } catch (err) {
    console.error(err.message)
  }
    console.log("Album updated!")
})

app.put("/albums/:id/fileurl", async (req, res) => {
  try {
    const { fileurl } = req.body;
    const { id } = req.params;

    const updateAlbumFileurl = await pool.query(
      "UPDATE albums SET fileurl = $1 WHERE id = $2",
      [fileurl, id]
    );

    res.json({ message: "Album fileurl updated", updateAlbumFileurl});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// delete an Album
app.delete("/albums/:id", async(req, res) => {
  try {
    const{ id } = req.params;
    const deleteAlbum = await pool.query("DELETE FROM albums WHERE id = $1", 
    [ id ]
    )
    res.json(deleteAlbum.rows[0])
  } catch (err) {
    console.log(err.message)
  }
  console.log("Album deleted...")

})


//genres
app.get('/genres', async (req, res) => {
  try {
    const genres = await pool.query('SELECT * FROM genres ORDER BY genres')
    const genreStrings = genres.rows.map(genre => genre.genre)

    res.json(genreStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})


//tags
app.get('/tags', async (req, res) => {
  try {
    const tags = await pool.query('SELECT * FROM tags ORDER BY tags')
    const tagsStrings = tags.rows.map(tags => tags.tags)

    res.json(tagsStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//version
app.get('/albumversion', async (req, res) => {
  try {
    const albumversion = await pool.query('SELECT * FROM albumversion ORDER BY albumversion')
    const albumversionStrings = albumversion.rows.map(albumversion => albumversion.albumversion)

    res.json(albumversionStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//filetype
app.get('/filetype', async (req, res) => {
  try {
    const filetype = await pool.query('SELECT * FROM filetype ORDER BY filetype')
    const filetypeStrings = filetype.rows.map(filetype => filetype.filetype)

    res.json(filetypeStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//trackprice
app.get('/trackprice', async (req, res) => {
  try {
    const trackprice = await pool.query('SELECT * FROM trackprice ORDER BY trackprice')
    const trackpriceStrings = trackprice.rows.map(trackprice => trackprice.trackprice)

    res.json(trackpriceStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//albumprice
app.get('/albumprice', async (req, res) => {
  try {
    const albumprice = await pool.query('SELECT * FROM albumprice ORDER BY albumprice')
    const albumpriceStrings = albumprice.rows.map(albumprice => albumprice.albumprice)

    res.json(albumpriceStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//priceperplay
app.get('/priceperplay', async (req, res) => {
  try {
    const priceperplay = await pool.query('SELECT * FROM priceperplay ORDER BY priceperplay')
    const priceperplayStrings = priceperplay.rows.map(priceperplay => priceperplay.priceperplay)

    res.json(priceperplayStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})


//bonusitem
app.get('/bonusitem', async (req, res) => {
  try {
    const bonusitem = await pool.query('SELECT * FROM bonusitem ORDER BY bonusitem')
    const bonusitemStrings = bonusitem.rows.map(bonusitem => bonusitem.bonusitem)
    res.json(bonusitemStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//credits
app.get('/credits', async (req, res) => {
  try {
    const credits = await pool.query('SELECT * FROM credits ORDER BY credits')
    const creditsStrings = credits.rows.map(credits => credits.credits)

    res.json(creditsStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//etherrate
app.get('/etherrate', async (req, res) => {
  try {
    const etherrate = await pool.query('SELECT * FROM etherrate ORDER BY etherrate')
    const etherrateStrings = etherrate.rows.map(etherrate => etherrate.etherrate)

    res.json(etherrateStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

//liverate
app.get('/liverate', async (req, res) => {
  try {
    const liverate = await pool.query('SELECT * FROM liverate ORDER BY liverate')
    const liverateStrings = liverate.rows.map(liverate => liverate.liverate)

    res.json(liverateStrings)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})


//pdxbusk 

app.post("/pdxbusk", async(req, res) => {
  try {
    console.log("Pdxbusk route hit!"); // Add this line
    console.log(req.body);
    //album info
    const { email } = req.body;
    const { artistnews } = req.body;
    const { appnews } = req.body;
    const { livestream } = req.body;
    const { feedback } = req.body;
    const { message } = req.body;

    console.log(`email: ${email}`); // Add this line
    console.log(`artistnews: ${artistnews}`); // Add this line
    console.log(`appnews: ${appnews}`); // Add this line
    console.log(`livestream: ${livestream}`); // Add this line
    console.log(`feedback: ${feedback}`); // Add this line
    console.log(`message: ${message}`); // Add this line

    const pdxbusk = await pool.query(
      "INSERT INTO albums (email, artistnews, appnews, livestream, feedback, message) VALUES ($1, $2, $3, $4, $5, $6)",
      [email, artistnews, appnews, livestream, feedback, message]
    )
    
    res.json(pdxbusk.rows[0]);
    console.log("Pdxbusk entry created!")
    

  } catch (err) {
    console.error(err.message);
  }
});


////////////////////////////////////////////////////////////////
/////////////////       Personal         ///////////////////////
/////////////////       VIDEO UPLOAD     ///////////////////////
////////////////////////////////////////////////////////////////


// S3 CODE //

  // get all tracks from s3
  app.get("/benjamincleek/videos", async (req, res) => {
    try {
      // Extract the genres and tags query parameters from the request
      const { genres, tags, title } = req.query;

      // Build the SQL query for fetching tracks with filtering
      let sqlQuery = "SELECT * FROM tracks";
      let queryParams = [];

      if (genres || tags) {
        sqlQuery += " WHERE";

        if (genres) {
          sqlQuery += " genres @> $1"; // Use the JSONB 'contains' operator for genres
          queryParams.push([genres]);
        }

        if (tags) {
          if (tags) {
            sqlQuery += " AND";
          }
          sqlQuery += " tags @> $2"; // Use the JSONB 'contains' operator for tags
          queryParams.push([tags]);
        }

        if (title) {
          if (title) {
            sqlQuery += " AND";
          }
          sqlQuery += " title @> $2"; // Use the JSONB 'contains' operator for tags
          queryParams.push([title]);
        }
      } 

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: "error", message: "An error occurred while fetching tracks" });
    }
  });

  const uploadVideo = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['video/quicktime', 'video/mp4', 'video/mov', 'application/octet-stream'];
    
      // Check if the MIME type is allowed
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
      } else {
        cb(new Error('Invalid file type. Please select a .mov, .mp4, or .mov file.')); // Reject the file
      }
    },
  });
  
  

  app.post("/benjamincleek/videos", uploadVideo.single("file"), async (req, res) => {
    try {
      const file = req.file;
      console.log(file);
      if (!file) {
        return res.status(400).json({ status: "error", message: "No file was uploaded" });
      }
  
      const benjamincleekBucketName = process.env.BUCKET_NAME_BENJAMINCLEEK;
      const folder = "videos"; 
      const result = await s3Uploadv2(file, folder, benjamincleekBucketName);
      const key = result.Key;
      res.status(200).json({ status: "success", location: result.Location, key });
    
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", message: "An error occurred during file upload" });
    }
  });

  // delete audio file from s3
  app.delete('/benjamincleek/video/:key/delete', async (req, res) => {
    const { key } = req.params;
    const bucketName = 'benjamin'; 
  
    try {
      console.log('Key:', key); 
      await s3Service.s3DeleteFile(key, bucketName);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error); // Add this line for debugging
  
      res.status(500).json({ error: 'Error deleting the file' });
    }
  });
  

  // replace track file in s3
    app.put("/benjamincleek/videos/:id", uploadVideo.single("file"), async (req, res) => {
      try {
        const { filename } = req.params;
        const file = req.file;
    
        if (!file) {
          return res.status(400).json({ status: "error", message: "No file was uploaded" });
        }
    
        // Delete the existing file from S3 using your existing logic
        await s3DeleteFile(filename);
    
        // Upload the new file to S3
        const benjamin = process.env.BUCKET_NAME_BENJAMIN;
        const folder = "tracks"; // Provide the appropriate folder name
        const result = await s3Uploadv2(file, folder, benjamin);
    
        res.status(200).json({ status: "success", location: result.Location });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "An error occurred during file replacement" });
      }
    });

//postgreSQL 

// get all videos
app.get("/videos", async( req, res) => {
  try {
    const allVideos = await pool.query("SELECT * FROM videos");
    res.json(allVideos.rows);

    console.log("!!!backend allVideos log:", allVideos)

  } catch (err) {
    console.error(err.message);
  }
})

app.post("/videos", async(req, res) => {
  try {
    console.log(req.body);
    //album info
    const { name } = req.body;
    const { filename } = req.body;
    const { location } = req.body;
    const { key } = req.body;
    

    const newVideo = await pool.query(
      "INSERT INTO videos (name, filename, location, key) VALUES ($1, $2, $3, $4)",
      [name, filename, location, key]
    )
    
    res.json(newVideo.rows[0]);
    console.log("Video posted!")
    

  } catch (err) {
    console.error(err.message);
  }
});

// get all zphotos
app.get("/zphotos", async( req, res) => {
  try {
    const allZphotos = await pool.query("SELECT * FROM zphotos");
    res.json(allZphotos.rows);

    console.log("!!!backend allZphotos log:", allZphotos)

  } catch (err) {
    console.error(err.message);
  }
})
app.post("/zphotos", async(req, res) => {
  try {
    console.log(req.body);
    //album info
    const { artistid } = req.body;
    const { location } = req.body;
    const { filename } = req.body;
    const { key } = req.body;
    

    const newVideo = await pool.query(
      "INSERT INTO zphotos (artistid, filename, location, key) VALUES ($1, $2, $3, $4)",
      [artistid, filename, location, key]
    )
    
    res.json(newVideo.rows[0]);
    console.log("photo posted!")
    

  } catch (err) {
    console.error(err.message);
  }
});

/////////////////////////////////////////////////////////////////
/////////////////    S3    zphotos


app.get("/benjamincleek/photos", async (req, res) => {
    try {

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: "error", message: "An error occurred while fetching tracks" });
    }
  });

  const allowedImageTypes = ['image/jpeg', 'image/png'];

  const uploadZphoto = multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Check if the MIME type is allowed
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Please select a valid image or PDF file.')); // Reject the file
      }
    },
  });
  
  app.post("/benjamincleek/photos", uploadZphoto.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ status: "error", message: "No file was uploaded" });
      }
  
      const benjamincleekBucketName = process.env.BUCKET_NAME_BENJAMINCLEEK;
      const folder = "photos"; 
      const result = await s3Uploadv2(file, folder, benjamincleekBucketName);
      const key = result.Key;
      res.status(200).json({ status: "success", location: result.Location, key });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "An error occurred during file upload" });
    }
  });
  

  // delete audio file from s3
  app.delete('/benjamincleek/photos/:key/delete', async (req, res) => {
    const { key } = req.params;
    const bucketName = 'benjamincleek'; 
  
    try {
      console.log('Key:', key); 
      await s3Service.s3DeleteFile(key, bucketName);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error); // Add this line for debugging
  
      res.status(500).json({ error: 'Error deleting the file' });
    }
  });
  

  // replace track file in s3
    app.put("/benjamincleek/photos/:id", uploadZphoto.single("file"), async (req, res) => {
      try {
        const { filename } = req.params;
        const file = req.file;
    
        if (!file) {
          return res.status(400).json({ status: "error", message: "No file was uploaded" });
        }
    
        // Delete the existing file from S3 using your existing logic
        await s3DeleteFile(filename);
    
        // Upload the new file to S3
        const benjamin = process.env.BUCKET_NAME_BENJAMIN;
        const folder = "photos";
        const result = await s3Uploadv2(file, folder, benjamin);
    
        res.status(200).json({ status: "success", location: result.Location });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "An error occurred during file replacement" });
      }
    });

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const uploadBenjamincleek = multer({
  storage,
  limits: {
    fileSize: 100 * 2048 * 2048, // 200MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// get all tracks from s3
app.get("/benjamincleek/audio", async (req, res) => {
  try {
    // Extract the genres and tags query parameters from the request
    const { genres, tags, title } = req.query;

    // Build the SQL query for fetching tracks with filtering
    let sqlQuery = "SELECT * FROM tracks";
    let queryParams = [];

    if (genres || tags) {
      sqlQuery += " WHERE";

      if (genres) {
        sqlQuery += " genres @> $1"; // Use the JSONB 'contains' operator for genres
        queryParams.push([genres]);
      }

      if (tags) {
        if (tags) {
          sqlQuery += " AND";
        }
        sqlQuery += " tags @> $2"; // Use the JSONB 'contains' operator for tags
        queryParams.push([tags]);
      }

      if (title) {
        if (title) {
          sqlQuery += " AND";
        }
        sqlQuery += " title @> $2"; // Use the JSONB 'contains' operator for tags
        queryParams.push([title]);
      }
    }

  // Execute the SQL query with the provided parameters
    const filteredTracks = await pool.query(sqlQuery, queryParams);

    res.json(filteredTracks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "An error occurred while fetching tracks" });
  }
});

app.post("/benjamincleek/audio", uploadBenjamincleek.single("file"), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ status: "error", message: "No file was uploaded" });
    }

    const benjamincleekBucketName = process.env.BUCKET_NAME_BENJAMINCLEEK;
    const folder = "tracks"; 
    const result = await s3Uploadv2(file, folder, benjamincleekBucketName);
    const key = result.Key;
    // Return the location and key in the response
    res.status(200).json({ status: "success", location: result.Location, key });
  
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "An error occurred during file upload" });
  }
});

// 


