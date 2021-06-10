/*
 * We have defined the multicast address and port in a file, that can be imported both by
 * thermometer.js and station.js. The address and the port are part of our simple 
 * application-level protocol
 */
const protocol = require('./orchestra-protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/* 
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);
  var data = JSON.parse(msg);
  orchestraAdd(data);
});

var moment = require('moment');

// Dictionary
var orchestra = {};

// Add musician to orchestra
function orchestraAdd(data){
  
  for(var key in orchestra){
    if(data.uuid.localeCompare(key) == 0){
      // update time
      orchestra[key][2] = moment();
      return;
    }
  }

  console.log("Add: " + data.uuid);

  var instrument;
  switch(data.sound){
  case 'ti-ta-ti':
    instrument = 'piano';
    break;
  case 'pouet':
    instrument = 'trumpet';
    break;
  case 'trulu':
    instrument = 'flute'
    break;
  case 'gzi-gzi':
    instrument = 'violin';
    break;
  case 'boum-boum':
    instrument = 'drum';
    break;

  }

  orchestra[data.uuid] = [data.uuid, instrument, moment()];
}

function updateO(){
  
  //var then = moment("2021-06-10T17:37:21+02:00");
  //var now = moment();
  
  console.log('update');
  for(var key in orchestra){
    console.log('diff: ' + moment().diff(orchestra[key][2], 's'));
    if (moment().diff(orchestra[key][2], 's') > 5){
      console.log('Delete: ' + key);
      delete orchestra[key];
      return;
    }
  }
}

setInterval(updateO, 5000);

var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send( orchestra );
});

app.listen(2205, function() {
  console.log('Accepting HTTP requests on port 2205');
});
