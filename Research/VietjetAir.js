
var airports =   require("./airport_vietjet.json");
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


console.log(robot);
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

        robot.start('http://www.vietjetair.com/');
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
    robot.thenOpen('http://www.vietjetair.com/').then(function() {

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

                robot.thenClick("#ctl00_UcRightV31_BtSearch").then(function(){

                        detectFlights(robot,function(){

                            //  this.capture("vietjetair.png").exit();

                        });

                });

          });
    });
}

function inputSearchInfo(robot,info,cbThen){

  robot.waitForSelector('#ctl00_UcRightV31_RbOneWay').then(function(){

       this.evaluate(function(info){

          document.querySelector('#ctl00_UcRightV31_RbOneWay').setAttribute('checked',info.isOneWay );
          document.querySelector('#ctl00_UcRightV31_TxtDepartDate').setAttribute('value',info.DepartDate);
          document.querySelector('#ctl00_UcRightV31_TxtReturnDate').setAttribute('value', info.ReturnDate != null ? info.ReturnDate : info.DepartDate);
          document.querySelector('#ctl00_UcRightV31_ChkInfare').setAttribute('checked', info.isInfare);

        },info);

        this.sendKeys('#ctl00_UcRightV31_CbbOrigin_TextBox',info.OriginAirport).wait(2000,function(){
              this.sendKeys('#ctl00_UcRightV31_CbbDepart_TextBox',info.DepartAirport).wait(1000,function(){
                  cbThen();
              });
        });


  });
}

function detectFlights(robot,cbThen){

  robot.waitForSelector('#ctrValueViewerDepGrid').wait(2000,function(){

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

console.log("getFlights");
      var flights = [];

      $('#ctrValueViewerDepGrid .vvDayFlight,.vvDayFlightHigh,.vvDayFlightLow,.vvDaySearchFlight,.vvDayFlightSelected ')
        .each(function( index ) {

            var strDate = $( this ).attr('id').replace('ctrValueViewerDep','');
            var strAmount =  $( this ).find('.vvFare').text().replace(' VND','').replace(',','').replace(',','');
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
