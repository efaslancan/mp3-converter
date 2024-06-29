const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

app.post('/convert', (req, res) => {
  const videoUrl = req.body.videoUrl;

  // Check if the video URL is null or empty
  if (!videoUrl) {
    return res.status(400).send('Please enter a YouTube video URL.');
  }

  // Check if the video URL is valid
  const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (!urlPattern.test(videoUrl)) {
    return res.status(400).send('Please enter a valid YouTube video URL.');
  }

  const outputPath = 'output.mp3';

  // Download the YouTube video
  ytdl(videoUrl, { filter: 'audioonly' })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('An error occurred while downloading the video.');
    })
    .pipe(fs.createWriteStream('temp.webm'))
    .on('finish', () => {
      // Convert the video to MP3
      ffmpeg('temp.webm')
        .toFormat('mp3')
        .saveToFile(outputPath)
        .on('end', () => {
          console.log('Conversion finished!');
          fs.unlink('temp.webm', (err) => {
            if (err) console.error(err);
            else res.download(outputPath, (err) => {
              if (err) console.error(err);
              else fs.unlink(outputPath, (err) => {
                if (err) console.error(err);
              });
            });
          });
        })
        .on('error', (err) => {
          console.error(err);
          res.status(500).send('An error occurred during conversion.');
        });
    });
});
  

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
