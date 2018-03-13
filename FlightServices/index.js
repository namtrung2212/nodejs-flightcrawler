
const express = require('express')
const app = express();
var moment = require('moment');

var DALClient = require('./DAL/DALClient');
DALClient.connect();

app.get('/getFlights', function (req, res) {


   var condition = {       
                      origin : req.query.origin, 
                      destiny : req.query.destiny,
                      depart_date : req.query.depart_date
                    };

   DALClient.getFlights(condition).then(function(data){
        res.send(data);
    });
    
})

app.listen(3000, function () {
  console.log('FlightServices listening on port 3000!')
})