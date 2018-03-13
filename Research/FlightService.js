const express = require('express')
const app = express();
var moment = require('moment')

app.get('/getFlights', function (req, res) {

    require('node-cmd').get(
            'casperjs jetstarbot.js SGN HAN 26-06-2017',
            function(err, data, stderr){
                
                res.write(JSON.stringify(JSON.parse(data)));

                 require('node-cmd').get(
                    'casperjs vietjetbot.js "Tp.Hồ Chí Minh" "Hà Nội" 26-06-2017',
                    function(err, data, stderr){
                        res.write(JSON.stringify(JSON.parse(data)));
                        res.end();
                    }
                );
            }
        );


   
    
});


app.listen(3000, function () {
  console.log('FlightServices listening on port 3000!')
})




