const Express = require('express');
const app = Express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(Express.static(__dirname + "/../../build/"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('Node server listening on port: ' + PORT);
})
