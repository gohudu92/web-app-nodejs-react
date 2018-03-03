var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var stringSimilarity = require('string-similarity');


function miseEnForme(objet){
  objet = encodeURI(objet);
  return objet;
}

exports.addRestaurantFromLF = function(){
  var tab = [];
  var obj = JSON.parse(fs.readFileSync('newObject.json', 'utf8'));
  //console.log(obj.length);
  obj.forEach(function(u){


  var monResto = u;
  var realPostal = monResto.postal;

  //Mise en forme pour la localite
  var localite = monResto.locality;
  var the2RealLocality = miseEnForme(localite);
  //console.log(the2RealLocality);

  //Mise en forme pour le nom du resto
  var name = monResto.name;
  var the2RealName = miseEnForme(name);

  url = 'https://m.lafourchette.com/api/restaurant-prediction?name='+ the2RealName;
  console.log(url)
  var id;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if(body != '[]'){
        var info = JSON.parse(body)
        info.forEach(function(o){
          if(o.address.postal_code == realPostal){
            var similarity = stringSimilarity.compareTwoStrings(name, o.name);
            console.log("percent : " + similarity);
            if(similarity >= 0.8){
              var myObj = new Object();
              myObj.id_restaurant = o.id;
              myObj.name = o.name;
              myObj.city = o.address.address_locality;
              myObj.postal_code = o.address.postal_code;
              myObj.stars = monResto.stars;
              myObj.image = monResto.image;
              tab.push(myObj);
              fs.writeFile("restaurant.json", JSON.stringify(tab, null, 4), (err) => {
                if (err) {
                  console.error(err);
                  return;
                };
                console.log("File has been created");
              });
              return;
            }
            else{
              var aze = name.split(" ");
              var long = aze.length;
              var newOName = o.name.split(" ");
              var iuy = newOName[0];
              for(var x = 1; x < long; x++){
                iuy = iuy + newOName[x];
              }
              console.log(name + " and " + iuy);
              var similarity = stringSimilarity.compareTwoStrings(name, iuy);
              console.log("percent : " + similarity);
              if(similarity >= 0.8){
                var myObj = new Object();
                myObj.id_restaurant = o.id;
                myObj.name = o.name;
                myObj.city = o.address.address_locality;
                myObj.postal_code = o.address.postal_code;
                myObj.stars = monResto.stars;
                myObj.image = monResto.image;
                tab.push(myObj);
                fs.writeFile("restaurant.json", JSON.stringify(tab, null, 4), (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  };
                  console.log("File has been created");
                });
                return;
              }
            }
          }
        })
      }
    }
})
})

}

addRestaurantFromLF();
