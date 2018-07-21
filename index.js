const fs         = require('fs');
const express    = require('express');
const fileUpload = require('express-fileupload');
const app        = express();
const uid        = require('uid');
const config     = require('./config.json');
 
app.use(fileUpload());
 
app.post('/upload/:a/:b/', function(req, res) {

  if (!req.files)
    return res.status(500).send('No file uploaded');

  let newFileName;

  for(let k in req.files) {
    if(req.files.hasOwnProperty(k)) {

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
  }

  const url = config.baseUrl.replace('{{filename}}', newFileName);

  res.send(
`<response>
  <status>success</status>
  <url>${url}</url>
  <thumb>${url}</thumb>
</response>
`);

});

app.listen(config.listenPort);
