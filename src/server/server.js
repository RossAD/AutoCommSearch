const Express = require('express');
const app = Express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(Express.static(__dirname + "/../../build/"));

const PORT = process.env.PORT || 8000;

app.get('/appsuggest/', (req, res) => {
  console.log('req body: ', req.headers.searchterm);
  res.status(200).send(JSON.stringify(['Real content upcoming']));
})

app.listen(PORT, () => {
  console.log('Node server listening on port: ' + PORT);
})
