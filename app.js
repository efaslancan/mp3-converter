const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

app.post('/convert', (req, res) => {
    const videoUrl = req.body.videoUrl;
    const outputPath = 'output.mp3';
  
    ytdl(videoUrl, { filter: 'audioonly' })
      .pipe(fs.createWriteStream('temp.webm'))
      .on('finish', () => {
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
            res.send('An error occurred during conversion.');
          });
      });
  });
  

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
