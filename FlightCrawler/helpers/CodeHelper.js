var airlinecodes =   require("./airlinecodes.json");

var exports = module.exports = {};

exports.getCode = function(code){

    for (var i = 0; i < airlinecodes.length; i++) {
         
          if(airlinecodes[i].code == code )
            return airlinecodes[i];

    }

}


exports.getFlightPairs = function(){

    return  [
                {Origin : "SGN", Destiny : "BMV"},
                {Origin : "SGN", Destiny : "CXR"},
                {Origin : "SGN", Destiny : "DAD"},
                {Origin : "SGN", Destiny : "HAN"},
                {Origin : "SGN", Destiny : "HPH"},
                {Origin : "HAN", Destiny : "SGN"},
                {Origin : "HAN", Destiny : "BMV"},
                {Origin : "HAN", Destiny : "CXR"},
                {Origin : "HAN", Destiny : "DAD"}
            ]

}