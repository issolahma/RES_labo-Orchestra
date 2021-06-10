// Date
var datetime = new Date();

// Connexion
var protocol = require('./orchestra-protocol');

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

// Instrument
var instrument = process.argv.slice(2);
console.log('instrument: ', instrument);

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
case 'piano':
    console.log('flute');
    sound = 'trulu';
    break;
case 'violin':
    console.log('violin');
    sound = 'gzi-gzi';
    break;
case 'drum':
    console.log('drum');
    sound = 'boumboum';
    break;
}

// UUID
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

// Sync
const UUID = uidgen.generateSync();

// JSON
var json = {
    'uuid' : UUID,
    'instrument' : instrument,
    'activeSince' : datetime
};

// Send datagram
const data = Buffer.from(JSON.stringify(json));

socket.send(data, 0, data.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS);
console.log("Send multicast >", data);

// https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
// https://www.npmjs.com/package/uid-generator

