
var Q = require('q');
var moment = require('moment');
var codeHelper = require('../helpers/CodeHelper.js');
var redisClient;

var flightPairs = codeHelper.getFlightPairs();
var pairIndex = -1;
var currentDate = moment();
var addDays = 0;

var exports = module.exports = {};

exports.start = function(){

    redisClient = require('redis').createClient(6379,"localhost");
    setInterval(autoCraw, 1000*20*1);

}

function autoCraw(){

        if(flightPairs.length <=0)
             return;

        pairIndex++;
        if(pairIndex > flightPairs.length - 1){

            pairIndex = 0;
           
            addDays++;
            if(addDays > 30)
                addDays = 0;
            currentDate = moment().add(addDays, 'd');
        }
        

        var condition = {
            Origin  : flightPairs[pairIndex].Origin,
            Destiny : flightPairs[pairIndex].Destiny,
            DepartDate : currentDate
        };

        autoCrawVietJet(condition);
        autoCrawJetstar(condition);

}

function autoCrawVietJet(condition){

        var cmd = "cd crawlers \n casperjs vietjetbot.js \"" + condition.Origin + "\" \"" +   condition.Destiny + "\" " + condition.DepartDate.format('DD-MM-YYYY');
        require('node-cmd').get(cmd,function(err, data, stderr){

                                 if(data && data.trim() != "" && data.trim() != "null"){
                                    var key = 'VJ-' + condition.Origin + "-" +condition.Destiny + "-" + condition.DepartDate.format('DD-MM-YYYY');
                                    redisClient.set(key, data);
                                 }
                            }
        );

}
function autoCrawJetstar(condition){

         var cmd = "cd crawlers \n casperjs jetstarbot.js \"" + condition.Origin + "\" \"" +   condition.Destiny + "\" " + condition.DepartDate.format('DD-MM-YYYY');    
         require('node-cmd').get(cmd,function(err, data, stderr){

                                 if(data && data.trim() != "" && data.trim() != "null"){

                                    var key = 'JS-' + condition.Origin + "-" +condition.Destiny + "-" + condition.DepartDate.format('DD-MM-YYYY');
                                    redisClient.set(key, data);
                                 }
                            }
        );

}

exports.getFlights = function(condition){
        
    var deferred = Q.defer();
    
    Q.all([getVietJetFlights(condition),getJetstarFlights(condition)])
      .spread(function(vjFlights,jsFlights){

            var flights = [];

            for (var i = 0; i < vjFlights.length; i++) {

                flights.push(vjFlights[i]);
            }

            for (var i = 0; i < jsFlights.length; i++) {

                flights.push(jsFlights[i]);
            }


            deferred.resolve(flights);
      });

     return deferred.promise;

}

function getVietJetFlights(condition){
        
    var deferred = Q.defer();

    var key = 'VJ-' + condition.Origin + "-" +condition.Destiny + "-" + condition.DepartDate.format('DD-MM-YYYY');
    redisClient.get(key, function(err, reply) {

          if(reply != null  && reply != undefined && reply.trim() != ""  && reply.trim() != ''){

                try{
                    deferred.resolve(JSON.parse(reply));
                }
                catch (error){
                    deferred.resolve([]);
                }

          }else{

                deferred.resolve([]);
          }
    });


    return deferred.promise;

}

function getJetstarFlights(condition){
        
    var deferred = Q.defer();

    var key = 'JS-' + condition.Origin + "-" +condition.Destiny + "-" + condition.DepartDate.format('DD-MM-YYYY');
    redisClient.get(key, function(err, reply) {

          if(reply != null  && reply != undefined && reply.trim() != ""  && reply.trim() != ''){

                try{
                    deferred.resolve(JSON.parse(reply));
                }
                catch (error){
                    deferred.resolve([]);
                }

          }else{

                deferred.resolve([]);
          }
    });


    return deferred.promise;

}