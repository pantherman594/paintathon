const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');

const path = require('path');
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
const overlayPath = './overlay.png';

const votes = {};
let first = true;
fs.readdir('./images', (err, files) => {
  files.forEach((file) => {
    if (file.substring(0, 1) === '.') return;
    let fileName = file.substring(0, file.length - 4);
    if (fileName.endsWith('.overlaid')) return;
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
    return res.status(400).send('No acceptable files were uploaded.');
  }

  let file = req.files[0];
  const origName = file['name'].toLowerCase();
  if (!(origName.endsWith('.jpg') || origName.endsWith('.jpeg') || origName.endsWith('.png'))) {
    return res.status(400).send('No acceptable files were uploaded.');
  }
  const uuid = uuidv1();
  votes[uuid] = 0;

  let filePath = path.join(__dirname, 'images', `${uuid}.png`)
  let resizePath = path.join(__dirname, 'images', `${uuid}.resize.png`)
  let distortPath = path.join(__dirname, 'images', `${uuid}.distort.png`)
  let combinedPath = path.join(__dirname, 'images', `${uuid}.combined.png`)
  let overlaidPath = path.join(__dirname, 'images', `${uuid}.overlaid.png`)
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
            .in(overlayPath)
            .in(distortPath)
            .write(combinedPath, (err4) => {
              if (err4) {
                console.log('err4');
                console.log(err4);
                return res.status(500).send(err4);
              }

              gm()
                .command('composite')
                .in(combinedPath)
                .in(backgroundPath)
                .write(overlaidPath, (err5) => {
                  if (err5) {
                    console.log('err5');
                    console.log(err5);
                    return res.status(500).send(err4);
                  }

                  fs.unlink(resizePath, () => {});
                  fs.unlink(distortPath, () => {});
                  fs.unlink(combinedPath, () => {});
                  console.log('success');
                  return res.end();
                });
            });
          });
    });
  });
});

app.use('/img', express.static('images'));

app.use((req, res, next) => {
  if (req.path.indexOf('.') === -1) {
    const file = `public${req.path}.html`;
    fs.exists(file, (exists) => {
      if (exists) {
        req.url += '.html';
      }
      next();
    });
  } else {
    next();
  }
});

app.use(express.static('public'));

server.listen(port, () => console.log(`Listening on port ${port}...`));
