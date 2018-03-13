
var airports =   require("./airport_jetstar.json");
var robot = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        webSecurityEnabled: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    },
    viewportSize: {
        width: 1024,
        height: 768
    }
});

robot.options.waitTimeout = 30000;

var isRunning = false;
var iSearchIndex =  -1;
var flightList = [];

setInterval(startRobots, 1000*60*30);
startRobots();

function startRobots() {

    if(isRunning == false){

        iSearchIndex =  -1;
        flightList = [];

        robot.start('https://booknow.jetstar.com/Search.aspx');
        for (var i = 0; i < airports.length; i++) {
          var port1 = airports[i];
          for (var j = 0; j < airports.length; j++) {
                var port2 = airports[j];
                if(port1 != port2)
                    runNewRobot({OriginAirport : port1 , DepartAirport : port2});
          }
        }

        robot.then(function(){
        console.log("exit");
          robot.exit();
          isRunning = false;

        });
        robot.run();
        isRunning = true;

    }

}

function runNewRobot(option){

    flightList.push(option);
    robot.thenOpen('https://booknow.jetstar.com/Search.aspx').then(function() {

          iSearchIndex ++;

          var conditions = {
              isOneWay : true,
              DepartDate : formatDate(new Date()),
              ReturnDate : null,
              isInfare : true,
              OriginAirport : flightList[iSearchIndex].OriginAirport,
              DepartAirport : flightList[iSearchIndex].DepartAirport
          };

          inputSearchInfo(robot,conditions,function(){

                    detectFlights(robot,function(){


                    });

          });
    });
}

function inputSearchInfo(robot,info,cbThen){

    robot.waitForSelector("#ControlGroupSearchView_AvailabilitySearchInputSearchView_TextBoxMarketOrigin1").then(function(){

        this.evaluate(function(info){
             document.querySelector('#ControlGroupSearchView_AvailabilitySearchInputSearchView_OneWay').setAttribute('checked', info.isOneWay);
             document.querySelector('#ControlGroupSearchView_AvailabilitySearchInputSearchView_TextboxDepartureDate1').setAttribute('value',info.DepartDate);
             document.querySelector('#ControlGroupSearchView_AvailabilitySearchInputSearchView_SearchLFF').setAttribute('checked', info.isInfare);
             document.querySelector('#ControlGroupSearchView_AvailabilitySearchInputSearchView_TextBoxMarketOrigin1').setAttribute('value',info.OriginAirport);
             document.querySelector('#ControlGroupSearchView_AvailabilitySearchInputSearchView_TextBoxMarketDestination1').setAttribute('value',info.DepartAirport);
         },info);

         this.thenClick("#ControlGroupSearchView_AvailabilitySearchInputSearchView_ButtonSubmit").wait(5000,function(){

               cbThen();
         });



    });

}

function detectFlights(robot,cbThen){

  robot.waitForSelector('div.low-fare-selector').wait(1000,function(){

      var flights = robot.evaluate(getFlights);
      flights.forEach(function(flight) {

          console.log(flightList[iSearchIndex].OriginAirport + " - "
                   +  flightList[iSearchIndex].DepartAirport
                   +  " : " + flight.Date + " - " + flight.Price );
       });

      cbThen();

  });

}

function getFlights(){

      var flights = [];

      $('div.low-fare-selector li')
        .each(function( index ) {

            var strDate = $( this ).attr('data-date');
            var strAmount =  $( this ).attr('data-price');
            if(strAmount != null && strAmount != "")
                flights.push ({ Date : strDate, Price : strAmount });

       });

       return flights;
}

function formatDate(value)
{
   var days = value.getDate();
	 days = days < 10 ? '0' + days : days;

 	 var month = value.getMonth() + 1;
 	 month = month < 10 ? '0' + month : month;

   return days + "/" + month + "/" + value.getFullYear();
}
