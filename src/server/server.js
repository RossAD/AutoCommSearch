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

function getAppInfo(input, response) {
  fetch(`https://itunes.apple.com/search?term=${input}&country=us&limit=10&entity=software&media=software`)
  .then(res => res.json())
  .then(data => {
    response.status(200).send(data.results);
  })
  .catch((error) => {throw error})
}

function sendAppEmail(userEmail, app, response) {
  //const app = this.state.currApp;
  sparky.transmissions.send({
    content: {
      from: 'admin@rossadavis.com',
      subject: 'App information for',
      //text: 'Testing'
      html:`<html><body><p>App Chosen by User is ${app.trackName}</p><p>Email of user who chose app: ${userEmail}</p></body></html>`
    },
    recipients: [
      {address: 'ross.ad@gmail.com'},
      //{address: userEmail}
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

app.get('/appsuggest/', (req, res) => {
  const searchterm = req.headers.searchterm;
  console.log('req body: ', req.headers.searchterm);
  getAppInfo(searchterm, res);
})

app.post('/email/', (req, res) => {
  const email = req.headers.user_email;
  const app = {
    trackName: req.headers.app_name,
    artworkUrl60: req.headers.app_img,
    trackViewUrl: req.headers.app_link
  }
  console.log('post headers', req.headers);
  console.log('email address: ', email);
  sendAppEmail(email, app, res);
})

app.listen(PORT, () => {
  console.log('Node server listening on port: ' + PORT);
})
