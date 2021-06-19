// Connexion
var protocol = require('./orchestra-protocol');

var dgram = require('dgram');
var s = dgram.createSocket('udp4');


function Instrument(instrument){
    var moment = require('moment');
    var dateTime = moment();

    this.instrument = instrument;

    var sound;

    switch (instrument){
    case 'piano':
        console.log('piano');
        sound = 'ti-ta-ti';
        break;
    case 'trumpet':
        console.log('trumpet');
        sound = 'pouet';
        break;
    case 'flute':
        console.log('flute');
        sound = 'trulu';
        break;
    case 'violin':
        console.log('violin');
        sound = 'gzi-gzi';
        break;
    case 'drum':
        console.log('drum');
        sound = 'boum-boum';
        break;
    }

    // UUID
    const { v4: uuidv4 } = require('uuid');
    const UUID = uuidv4();

    // JSON
    var json = {
        'uuid' : UUID,
        'sound' : sound,
        'activeSince' : dateTime
    };

    // Send datagram
    const data = Buffer.from(JSON.stringify(json));

    Instrument.prototype.send = function(){
        s.send(data, 0, data.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes){
            console.log("Sending payload: " + data + " via port " + s.address().port);
        });
    }
    setInterval(this.send.bind(this), 1000);
}

// Instrument
var instrument = process.argv[2];
console.log('instrument is: ', instrument);

var inst = new Instrument(instrument);
// https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
// https://www.npmjs.com/package/uid-generator
// https://www.npmjs.com/package/uuid

