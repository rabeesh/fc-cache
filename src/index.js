const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const app = express();


app.use(morgan('combined'));
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
})

// use api handlers
app.use(require('./api')());

app.listen(3000, () => {
    console.log('App listening on port 3000')
});

module.exports = app;
