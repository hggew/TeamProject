var express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson;
var mysql = require('mysql');
const request = require('request');
const convert = require('xml-js');

var router = express.Router();


const userController = require('../controllers');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
// router.get('/',function(req,res){
//   res.status(200).json({
//     "success":true
//   });
//   console.log("index router clear");
// });


router.get('/', userController.basicAPI);
router.get('/get_test', userController.GetTestAPI);
router.post('/post_test', userController.PostTestAPI);

// //html 가져오기
router.get('/html_test', userController.HtmlTestAPI);
// router.get('/html', function (req, res, next) {
//   let url = 'https://www.yna.co.kr/sports/all';

//   axios.get(url).then(html => {
//     let ulList = [];
//     const $ = cheerio.load(html.data);
//     const $bodyList = $("div.list-type038 ul").children("li");
//     //each : list 마다 함수 실행, forEach와 동일
//     $bodyList.each(function (i, elem) {
//       ulList[i] = {
//         //find : 해당 태그가 있으면 그 요소 반환
//         title: $(this).find('a strong.tit-news').text(),
//         // url: $(this).find('strong.news-tl a').attr('href'),
//         // image_url: $(this).find('p.poto a img').attr('src'),
//         // image_alt: $(this).find('p.poto a img').attr('alt'),
//         // summary: $(this).find('p.lead').text().slice(0, -11),
//         // date: $(this).find('span.p-time').text()
//       };
//     });
//     const data = ulList.filter(n => n.title);
//     //json으로 변환하여 app으로 전송
//     return res.json(data);
//   })
// });

router.get('/KorHistory', userController.KorHistoryAPI);
router.get('/ToeicCalendar', userController.ToeicCalendarAPI);
router.get('/ToeicReceipt', userController.ToeicReceiptAPI);
router.get('/ExamCalendar', userController.ExamCalendarAPI);
//db연결
router.get('/db', userController.DBConnectAPI);

module.exports = router;
