const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));

app.listen(3000, () => {
    console.log('App listening on port 3000')
});

module.exports = app;
