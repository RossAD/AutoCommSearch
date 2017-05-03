const Express = require('express');
const app = Express();
const bodyparser = require('body-parser');
const fetch = require('node-fetch');
const SparkPost = require('sparkpost');
const sparky = new SparkPost(process.env.sparkpost_key);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(Express.static(__dirname + "/../../build/"));

const PORT = process.env.PORT || 8000;

// Fetch apps from itunes based on search term
function getAppInfo(input, response) {
  fetch(`https://itunes.apple.com/search?term=${input}&country=us&limit=10&entity=software&media=software`)
  .then(res => res.json())
  .then(data => {
    response.status(200).send(data.results);
  })
  .catch((error) => {throw error})
}

// Send email using SparkPost
function sendAppEmail(userEmail, app, response) {
  sparky.transmissions.send({
    content: {
      from: 'admin@rossadavis.com',
      subject: 'App Search Result',
      html:`<html>
              <body>
                <div>
                  <p>App chosen by user was <img style="width:20px" src=${app.artworkUrl60} alt='app'/> ${app.trackName}</p>
                  <p>The email of the user that chose the app is ${userEmail}</p>
                  <p>A link to the page of the app is ${app.trackViewUrl}</p>
                  <p>Have a nice day!</p>
                </div>
              </body>
            </html>`
    },
    recipients: [
      {address: 'ross.ad@gmail.com'},
      {address: userEmail}
    ]
  })
  .then(data => {
    console.log('Woohoo! Email successful!');
    console.log(data);
    response.status(200).send(data);
  })
  .catch(err => {
    console.log('Whoops! Something went wrong');
    console.log(err);
  });
}

// Endpoints for email and suggestion call
app.get('/appsuggest/', (req, res) => {
  const searchterm = req.headers.searchterm;
  getAppInfo(searchterm, res);
})

app.post('/email/', (req, res) => {
  const email = req.headers.user_email;
  const app = {
    trackName: req.headers.app_name,
    artworkUrl60: req.headers.app_img,
    trackViewUrl: req.headers.app_link
  }
  sendAppEmail(email, app, res);
})

app.listen(PORT, () => {
  console.log('Node server listening on port: ' + PORT);
})
