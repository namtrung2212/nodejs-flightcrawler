
var airports =   require("./airport_jetstar.json");
var moment = require('moment')

var JetStarUtil =   require("./JetStarUtil");

var isRunning = false;
var iSearchIndex =  -1;
var searchConditions = [];
var flightList = [];

setInterval(startRobots, 1000*60*30);
startRobots();

function startRobots() {

    if(isRunning == false){

        iSearchIndex =  -1;
        searchConditions = [];
        flightList = [];

        for (var i = 0; i < airports.length; i++) {
          for (var j = 0; j < airports.length; j++) {
                
                var port1 = airports[i];
                var port2 = airports[j];
                if(port1 != port2){
                  
                    var condition = {OriginAirport : port1 , DestinationAirport : port2, DepartDate : new Date("2017-06-26")};
                    var robot = JetStarUtil.initRobot();
                    JetStarUtil.search(robot,condition,function(flights){
                    

                        robot.exit();

                    });
               
                }
                    
          }
        }

    }

}

