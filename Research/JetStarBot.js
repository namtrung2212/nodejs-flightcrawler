var casper = require('casper');
var moment = require('moment')

var robot = casper.create({
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

var condition = {
    Origin : robot.cli.get(0),
    Destiny : robot.cli.get(1),
    DepartDate : moment(robot.cli.get(2), 'DD-MM-YYYY') 
};

search(condition,function(flights){

        console.log(JSON.stringify(flights));

});


function search(condition,cbThen){

    robot.condition = condition;

    var strURL = 'http://www.jetstar.com/vn/vi/home?adult=1&flexible=1&currency=VND&flight-type=1'
                + '&origin=' + condition.Origin 
                + '&destination=' + condition.Destiny 
                + '&selected-departure-date=' + condition.DepartDate.format('DD-MM-YYYY');

    robot.start('http://www.jetstar.com/vn/vi/home/');
    robot.thenOpen(strURL).then(function() {

        robot.waitForSelector(".flight-summary__btn-submit").then(function(){

                this.thenClick(".flight-summary__btn-submit").then(function(){

                    detectFlights(cbThen);
                
                });

        });

    });
    
    robot.run();

}


function detectFlights(cbThen){

  robot.waitForSelector('div.display-currency-VND').then(function(){

        var flights = robot.evaluate(getFlightsFromDOM,robot.condition);
        
        cbThen(flights);

  });

}

function getFlightsFromDOM(condition){

      var flights = [];

      $('[data-cabintype=economy] .flight-card-wrapper')
        .each(function( index ) {

            var strDepartTime = $(this).find('.itinerary-info__time').first().text().trim();
            var strLandingTime = $(this).find('.itinerary-info__time').last().text().trim();
            var strFlightNo = $(this).find('.first-leg .flight-info__flightNubmer .medium-9').text().trim();
            var dPrice = $(this).find('.js-price').attr('data-amount');

            if(strDepartTime != "" && strLandingTime != "" && dPrice > 0)
                flights.push ({ 
                    Origin : condition.Origin ,
                    Destiny : condition.Destiny ,
                    DepartDate : condition.DepartDate, 
                    FlightNo : strFlightNo,
                    DepartTime : strDepartTime,
                    LandingTime : strLandingTime,
                    Price : dPrice,
                    Type : "Economy" ,
                    Airline : "Jetstar"
                    });

       });

       return flights;
}


