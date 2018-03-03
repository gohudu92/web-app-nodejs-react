var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var stringSimilarity = require('string-similarity');
var dame = 1;

function getPictureRestaurant(url){
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      $('.slick-track').filter(function(){
         var data = $(this);
         console.log(data);
         var image = data.first().attr("src");
         image = String(image);
         //console.log(image);
         return image;
       })
    }
  })
}

function miseEnForme(objet){
  objet = objet.toLowerCase();
  objet = objet.replace(/é/g, "e");
  objet = objet.replace(/â/g, "a");
  objet = objet.replace(/è/g, "e");
  objet = objet.replace(/-/g, "");
  objet = objet.replace(/  /g, " ");
  objet = objet.replace(/ /g, "-");
  objet = objet.replace(/'/g, "-");
  return objet;
}

exports.createJSONWithOffers = function(){
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

  var image = monResto.image;

  var stars = monResto.stars;


  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if(body != '[]'){
        var info = JSON.parse(body);
        info.forEach(function(o){
          if(o.is_special_offer == true){

            name = String(name);
            var myObj = new Object();
            var name_mef = miseEnForme(name);

            myObj.id = id;
            myObj.name = name;
            myObj.name_mef = name_mef;
            myObj.city = city;
            myObj.postal_code = postal_code;
            myObj.offer = o.title;
            myObj.offer_exclusions = o.exclusions;
            myObj.discount_amount = o.discount_amount;
            myObj.url = "https://www.lafourchette.com/restaurant/"+ name_mef +"/"+ id;
            myObj.number = String(dame);
            dame++;
            myObj.image = "";
            myObj.image = image;
            myObj.stars = stars;
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
