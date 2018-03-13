var casper = require('casper');
var moment = require('moment');
var codeHelper = require('../helpers/CodeHelper.js');

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
    Origin : codeHelper.getCode(robot.cli.get(0)),
    Destiny : codeHelper.getCode(robot.cli.get(1)),
    DepartDate : moment(robot.cli.get(2), 'DD-MM-YYYY').valueOf(),
    DepartDateString : moment(robot.cli.get(2), 'DD-MM-YYYY').format("DD/MM/YYYY"),
    isOneWay : true,
    ReturnDate : null,
    isInfare : false
};

search(condition,function(flights){

        console.log(JSON.stringify(flights));

});


function search(condition,cbThen){

    robot.condition = condition;

    robot.start('http://www.vietjetair.com/');
    robot.then(function() {
        
          inputSearchInfo(function(){

                robot.thenClick("#ctl00_UcRightV31_BtSearch").then(function(){

                       detectFlights(cbThen);

                });

          });

    });
    
    robot.run();

}

function inputSearchInfo(cbThen){

  robot.waitForSelector('#ctl00_UcRightV31_RbOneWay').then(function(){

       this.evaluate(function(info){

          document.querySelector('#ctl00_UcRightV31_RbOneWay').setAttribute('checked',info.isOneWay );
          document.querySelector('#ctl00_UcRightV31_TxtDepartDate').setAttribute('value',info.DepartDateString);
          document.querySelector('#ctl00_UcRightV31_TxtReturnDate').setAttribute('value', info.ReturnDate != null ? info.ReturnDate : info.DepartDateString);
          //document.querySelector('#ctl00_UcRightV31_ChkInfare').setAttribute('checked', false);

        },robot.condition);

        this.sendKeys('#ctl00_UcRightV31_CbbOrigin_TextBox',robot.condition.Origin.VJCode).wait(2000,function(){

              this.sendKeys('#ctl00_UcRightV31_CbbDepart_TextBox',robot.condition.Destiny.VJCode).wait(1000,function(){
                  
                    cbThen();
              });
        });


  });
}


function detectFlights(cbThen){

  robot.waitForSelector('.FlightsGrid').then(function(){

        var flights = robot.evaluate(getFlightsFromDOM,robot.condition);
        cbThen(flights);

  });

}

function getFlightsFromDOM(condition){

      var flights = [];

      $(".FlightsGrid tr[id^='gridTravelOptDep']")
        .each(function( index ) {

                try{
                            
                    var strFlightNo = $(this).find('.SegInfo').last().find('.airlineVJ').text().trim();
                    var strDepartTime = $(this).find('.SegInfo:nth-child(2)').html();
                    strDepartTime = strDepartTime.split('&nbsp;')[0]; 
                    
                    var strLandingTime = $(this).find('.SegInfo:nth-child(3)').html();
                    strLandingTime = strLandingTime.split('&nbsp;')[0];

                    var dPrice = $(this).find('[data-familyid=Eco] [id=total_complete_charges]').val().replace(" VND","").replace(",","");
                    dPrice = parseFloat(dPrice.replace(",",""));

                    if(strDepartTime != "" && strLandingTime != "" && dPrice > 0){
                    
                        var flight = {
                                airline         : 'Vietjet', 
                                code            : strFlightNo,
                                origin_code     : condition.Origin.VJCode,
                                origin_name     : condition.Origin.name,
                                destiny_code    : condition.Destiny.VJCode,
                                destiny_name    : condition.Destiny.name,
                                depart_date     : condition.DepartDate,
                                depart_time     : strDepartTime,
                                landing_time    : strLandingTime,
                                service_type    : "eco",
                                price           : dPrice,
                                craw_at         : new Date().getTime()
                        };

                        flights.push (flight);

                    }
                }
                catch (error){
                }

       });

       return flights;
}

