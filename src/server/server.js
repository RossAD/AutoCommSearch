const Express = require('express');
const app = Express();
const bodyparser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyparser.json());
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

function sendAppEmail() {
  //const app = this.state.currApp;
  sparky.transmissions.send({
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Hello, World!',
      text: 'Testing'
      //html:'<html><body><p>App Chosen by User is ${app.trackName}</p><p>Email of user who chose app: ${this.state.userEmail}</p></body></html>'
    },
    recipients: [
      {address: 'ross.ad@gmail.com'}
    ]
  })
  .then(data => {
    console.log('Woohoo! You just sent your first mailing!');
    console.log(data);
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

app.listen(PORT, () => {
  console.log('Node server listening on port: ' + PORT);
})
