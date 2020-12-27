require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bodyParser = require('body-parser');
const urlMetadata = require('url-metadata')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(bodyParser.json());
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.post('/', async (req, res) => {
    let url = req.body.url;
    let data;
    await urlMetadata(url).then(
    function (metadata) { // success handler
        console.log(metadata);
        data = metadata;
    },
    function (error) { // failure handler
        console.log(error)
    })
    res.send(data);
});

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app