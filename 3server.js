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

function createJSONWithOffers(){
  var tab = [];
  var obj = JSON.parse(fs.readFileSync('restaurant.json', 'utf8'));
  //console.log(obj.length);
  obj.forEach(function(u){

  var monResto = u;
  var id = monResto.id_restaurant;

  var url = 'https://m.lafourchette.com/api/restaurant/'+id+'/sale-type'


  //Mise en forme pour la localite
  var name = monResto.name;

  var city = monResto.city;

  var postal_code = monResto.postal_code;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if(body != '[]'){
        var info = JSON.parse(body);
        info.forEach(function(o){
          if(o.is_special_offer == true){
            var myObj = new Object();
            myObj.id = id;
            myObj.name = name;
            myObj.city = city;
            myObj.postal_code = postal_code;
            myObj.offer = o.title;
            myObj.offer_exclusions = o.exclusions;
            myObj.discount_amount = o.discount_amount;
            tab.push(myObj);
            fs.writeFile("finalRestaurant.json", JSON.stringify(tab, null, 4), (err) => {
              if (err) {
                console.error(err);
                return;
              };
              console.log("File has been created");
            });
          }
          else{
            console.log("no offer");
          }
        })
      }
    }
})
})

}

createJSONWithOffers();
exports = module.exports = app;
