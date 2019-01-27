const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const uuidv1 = require('uuid/v1');
const gm = require('gm').subClass({ imageMagick: true });
const childProcess = require('child_process');

const port = process.env.PORT || 5000;
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

const backgroundPath = './background.jpg';

const votes = {};
let first = true;
fs.readdir('./images', (err, files) => {
  files.forEach((file) => {
    let fileName = file.substring(0, file.length - 4);
    if (fileName.endsWith('.overlaid')) return;
    console.log(fileName);
    votes[fileName] = 0;
    if (first === true) {
      votes[fileName] = 1;
      first = false;
    }
  });
});

app.get('/votes', (req, res) => {
  res.json(votes);
});

app.post('/update', (req, res) => {
  console.log(req.body);
  let id = req.body.add;
  let removes = req.body['remove[]'];
  if (id) {
    votes[id] += 1;
  }

  if (removes) {
    if (removes.constructor !== Array)
      removes = [removes];

    if (removes.length > 0) {
      removes.forEach((remove) => {
        votes[remove] -= 1;
        if (votes[remove] < 0) votes[remove] = 0;
      });
    }
  }

  socket.emit('votes', votes);
  return res.json(votes);
});

app.post('/upload', (req, res) => {
  if (Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let file = req.files[0];
  const uuid = uuidv1();
  votes[uuid] = 0;
  console.log(uuid);

  let fileName = `./images/${uuid}`;
  let filePath = `${fileName}.png`;
  let resizePath = `${fileName}.resize.png`;
  let distortPath = `${fileName}.distorted.png`;
  let overlaidPath = `${fileName}.overlaid.png`;
  file.mv(filePath, (err) => {
    if (err) {
      console.log('err');
      console.log(err);
      return res.status(500).send(err);
    }

    gm(filePath)
      .resize(1650, 904, '!')
      .write(resizePath, (err2) => {
        if (err2) {
          console.log('err2');
          console.log(err2);
          return res.status(500).send(err2);
        }

        const cp = childProcess.exec(`convert ${resizePath} -matte -virtual-pixel transparent -distort Perspective "0,0 130,178  1650,0 1521,301  0,904 184,563  1650,904 1439,801" ${distortPath}`);
        cp.stderr.on('data', (data) => {
          console.log('err3')
          console.log(err3);
          return res.status(500).send(err3);
        });

        cp.on('close', (code) => {
          gm()
            .command('composite')
            .in(distortPath)
            .in(backgroundPath)
            // .in(overlayPath)
            .write(overlaidPath, (err4) => {
              if (err4) {
                console.log('err4');
                console.log(err4);
                return res.status(500).send(err4);
              }

              fs.unlink(resizePath, () => {});
              fs.unlink(distortPath, () => {});
              console.log('success');
              return res.end();
            });
          });
    });
  });
});

app.use('/img', express.static('images'));
// app.use(express.static('public'));
app.use(express.static('../'));

server.listen(port, () => console.log(`Listening on port ${port}...`));
