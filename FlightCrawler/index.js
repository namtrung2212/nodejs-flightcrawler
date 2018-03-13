const fs = require('fs');
var moment = require('moment');

const RedisServer = require('redis-server');
new RedisServer(6379).open(null);

var crawler = require('./crawlers');
crawler.start();

var grpc = require('grpc');
var proto = grpc.load('./proto/Flight.proto');
var credentials = grpc.ServerCredentials.createSsl(null,
                                                 [{private_key: fs.readFileSync('./certs/server.key'),
                                                   cert_chain: fs.readFileSync('./certs/server.crt')}]);
var server = new grpc.Server();
server.addService(proto.FlightCrawler.FlightService.service, {
    getFlights: function(call, callback) {

        console.log(JSON.stringify(call.request));

        crawler.getFlights({Origin : call.request.origin,Destiny : call.request.destiny, DepartDate : moment(call.request.depart_date, 'DD-MM-YYYY')}).then(function(flights){
    
                callback(null, {flights : flights,res_at : new Date().getTime()});

        });

    }
});

server.bind('0.0.0.0:50051',credentials);
//server.bind('0.0.0.0:50051',grpc.ServerCredentials.createInsecure());
console.log('Server running at http://0.0.0.0:50051');

server.start();