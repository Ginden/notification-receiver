'use strict';

const express = require('express');
const notifier = require('node-notifier');
const bodyParser = require('body-parser');
const Promise = require('bluebird');

const {port} = require('../package').config;
const app = express();
const jsonParser = bodyParser.json();

app.post('/', jsonParser, async (req, res) => {

    try {
        await displayNotification(req.body, req.ip);
        res.json({
            ack: true
        });
    } catch(err) {
        console.log(req.body, err);

        res.json({
            error: err.message
        });
    }


});

app.get('/', async (req, res) => {
    try {
        await displayNotification(req.query, req.ip);
        res.json({
            ack: true
        });
    } catch(err) {
        console.log(req.query, err);
        res.json({
            error: err.message
        });
    }
});

async function displayNotification(data, from) {
    const {
        title = `Message from ${from}`,
        message = throwOnEmpty('message'),
        sound: soundRaw = false,
        wait: waitRaw = false
    } = data;
    const wait = parseBoolean(waitRaw);
    const sound = parseBoolean(soundRaw);
    return Promise.fromCallback(done => notifier.notify({
        title,
        message,
        icon: null,
        sound,
        wait
    }, done)).then(console.log);
}

function throwOnEmpty(name) {
    throw new Error(`Missing param ${name}`)
}

function parseBoolean(val) {
    if (typeof val === 'boolean') return val;
    return val === 'true';
}

app.listen(port);

console.log(`Running on http://localhost:${port}/`);
console.log(`Test: http://localhost:${port}/?message=foobar`);