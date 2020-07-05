const axios = require("axios");
const cheerio = require("cheerio");
// const log = console.log;

//html 동기로 가져오기
// const getHtml = async () => {
//   try {
//     return await axios.get("https://www.yna.co.kr/sports/all");
//   } catch (error) {
//     console.error(error);
//   }
// };
// getHtml()
//   .then(html => {
//     let ulList = [];
//     const $ = cheerio.load(html.data);
//     const $bodyList = $("div.list-type038 ul").children("li");

//     $bodyList.each(function(i, elem) {
//       ulList[i] = {
//           title: $(this).find('a strong.tit-news').text(),
//       };
//     });

//     const data = ulList.filter(n => n.title);
//     return data;
//   })
//   .then(res => console.log(res));

//테이블 값 가져오기
// 'use strict';
// const tabletojson = require("tabletojson").Tabletojson; 
// tabletojson.convertUrl(
//   'https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes',
//   function(tablesAsJson) {
//       console.log(tablesAsJson[1]);
//   }
// );


//cheerio test
// $ = cheerio.load(html.toString());
// var data = [];
// $('table tr td table tr').each(function (i, td) {

//     var children = $(this).children();
//     var itemNum = children.eq(0);
//     var itemName = children.eq(1);
// });



var mysql = require('mysql');
var db_info = {
    host: 'localhost',
    port:'3306',
    user: 'root',
    password: 'password',
    database: 'project'
}

var connection = mysql.createConnection(db_info);


connection.query('show tables;',function(err, result) {
    if (err) throw err;
    console.log("Connected!");
    console.log("show table :" + result);

  });

connection.end();