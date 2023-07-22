const fs         = require('fs');
const http       = require("http");
const express    = require('express');
const fileUpload = require('express-fileupload');
const app        = express();
const { uid }    = require('uid');
const config     = require('./config.json');

app.use(fileUpload());

app.use('/i', express.static(config.uploadDir))

app.post('/upload/:a/:b/', function(req, res) {

  if (!req.files)
    return res.status(500).send('No file uploaded');

  let newFileName;

  for(let k in req.files) {
      ((file) => {

        if(file.name.indexOf('thumb') == -1) {

          const split = file.name.split('.');
          const ext   = split.pop();
          fileName    = uid(8) + '.' + ext;
          let count   = 1;

          while(fs.existsSync(config.uploadDir + '/' + fileName))
            fileName = `${uid(8)}.${ext})`;

          file.mv(config.uploadDir + '/' + fileName, function(err) {
            if (err)
              return res.status(500).send(err);
          });

          newFileName = fileName;
        }

      })(req.files[k]);
  }

  const url  = config.baseUrl.replace('{{filename}}', newFileName);
  const body = `<response><status>success</status><share>${url}</share></response>
`
  res.send(body);
});

app.g

http
  .createServer(app)
  .listen(config.listenPort, () => {
    console.log('lightshot http server started on port ' + config.listenPort);
  })
;
