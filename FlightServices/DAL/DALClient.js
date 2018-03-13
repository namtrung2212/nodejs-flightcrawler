var Q = require('q');
const fs = require('fs');
var grpc = require('grpc');
var flightProto = grpc.load('./DAL/proto/Flight.proto');
var config = require('./config');
var grpcClient;

var exports = module.exports = {};

exports.connect = function(){

        let credentials = grpc.credentials.createSsl(fs.readFileSync('./DAL/certs/server.crt'));

        grpcClient = new flightProto.FlightCrawler.FlightService(config.grpcCrawlerAddress,credentials);
        //grpcClient = new flightProto.FlightCrawler.FlightService(config.grpcCrawlerAddress, grpc.credentials.createInsecure());
        console.log("connected to FlightCrawler");
}

exports.getFlights = function(condition){

        var defer = Q.defer();   

        grpcClient.getFlights(condition, function(error, flights) {
        if (error)
                defer.resolve({error_code : error,error_message : "Have no flights"});
        else
                defer.resolve(flights);
        });

        return defer.promise;
};


