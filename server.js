var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var tot = 0;

var tab = [];

var star1 = 0;
var star2 = 0;
var star3 = 0;

var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

function getRestaurant (firstPage, lastPage, url){

  for(var i = firstPage; i <= lastPage; i++){

  url = url + '/page-' + i;

    request(url, function(error, response, html){
          if(!error){
              var $ = cheerio.load(html);


              $('.poi-card-link').each(function(){
                 var data = $(this);
                 var tre = String(data);
                 var res = tre.split("\"");
                 tre = res[1]+res[2];
                 res = tre.split(" ");
                 tre = res[0];
                 var newUrl = 'https://restaurant.michelin.fr' + tre;

                 request(newUrl, function(error, response, html){
                       if(!error){
                           $ = cheerio.load(html);
                           var resto = new Object();



                           $('.poi_intro-display-title').filter(function(){
                              data = $(this);
                              var name = data.first().text();
                              res = name.split("\n");
                              name = res[1].trim();
                              resto.name = name;
                           })
                           $('.thoroughfare').filter(function(){
                              data = $(this);
                              var street = data.first().text();
                              resto.street = street;
                           })
                           $('.postal-code').filter(function(){
                              data = $(this);
                              var postal = data.first().text();
                              resto.postal = postal;
                           })
                           $('.locality').filter(function(){
                              data = $(this);
                              var locality = data.first().text();
                              resto.locality = locality;
                           })
                           $('.guide-icon').filter(function(){
                              data = ($(this)[0]).attribs.class.split(" ")[2];
                              var star = data;
                              var stars;
                              if(star == "icon-cotation1etoile"){
                                stars = "1";
                                //star1++;
                                //console.log("1 étoiles : " + star1);
                              }
                              else if(star == "icon-cotation2etoiles"){
                                stars = "2";
                                //star2++;
                                //console.log("2 étoiles : " + star2);
                              }
                              if(star == "icon-cotation3etoiles"){
                                stars = "3";
                                //star3++;
                                //console.log("3 étoiles : " + star3);
                              }
                              resto.stars = stars;
                           })
                           tab.push(resto);
                           tot++;
                           console.log(tot);

                           if(tot == 615){
                             fs.writeFile("newObject.json", JSON.stringify(tab, null, 4), (err) => {
                               if (err) {
                                 console.error(err);
                                 return;
                               };
                             });
                           }
                       }
                   })
              })
          }
      })

  }
}


getRestaurant(1,35,url);


exports = module.exports = app;
