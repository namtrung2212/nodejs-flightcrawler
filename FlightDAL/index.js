const fs = require('fs');
var grpc = require('grpc');
var credentials = grpc.ServerCredentials.createSsl(null,
                                                 [{private_key: fs.readFileSync('./certs/server.key'),
                                                   cert_chain: fs.readFileSync('./certs/server.crt')}]);
var server = new grpc.Server();
var flightProto = grpc.load('./proto/Flight.proto');

server.addService(flightProto.DAL.FlightService.service, {
    getFlights: function(call, callback) {

        var flights = [ 
        { flight_id: 123, airline: 'Jetstar', depart_code: 'HN', arrive_code : 'HCM', price : 1500000 }
        ];


        callback(null, {flights : flights,res_at : new Date().getTime()});
    }
});

server.bind('0.0.0.0:50051',credentials);
//server.bind('0.0.0.0:50051',grpc.ServerCredentials.createInsecure());
console.log('Server running at http://0.0.0.0:50051');

server.start();