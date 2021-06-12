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
	//console.log("Data has arrived: " + msg + ". Source port: " + source.port);
  var data = JSON.parse(msg);
  orchestraAdd(data);
});

var moment = require('moment');

// Dictionary
var orchestra = [];

// Add musician to orchestra
function orchestraAdd(data){
  var here = false;
  orchestra.forEach(function(item) {
    if(item.uuid.localeCompare(data.uuid) == 0){
      // update time
      item.lastActive = moment();
      here = true;
      return;
    }
  });

  if (here == true){
    return;
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

  var tmp = {};
  tmp['uuid'] = data.uuid;
  tmp['instrument'] = instrument;
  tmp['activeSince'] = moment();
  tmp['lastActive'] = moment();

  orchestra.push(tmp);
}

function updateOrchestra(){
  orchestra.forEach(function(item, index) {
    if(moment().diff(item.lastActive, 's') > 5){
      console.log('Delete: ' + item.uuid);
      orchestra.splice(index, 1);
      return;
    }
  });
}

setInterval(updateOrchestra, 3000);


var net = require('net');

var server = net.createServer(function(socket) {
  var data = Buffer.from(JSON.stringify(orchestra));
	socket.write(data);
  console.log('Send data');
	socket.pipe(socket);
  socket.end();

});


server.listen(protocol.PROTOCOL_PORT);