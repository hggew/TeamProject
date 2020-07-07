var express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson; 
var mysql = require('mysql');
const request = require('request');
const convert = require('xml-js');

var router = express.Router();

const userController = require('../controllers');


router.get('/', userController.basicAPI);

router.get('/search',userController.searchAPI);
router.get('/mypage',userController.mypageAPI);
router.get('/join',userController.joinAPI);
router.get('/login',userController.loginAPI);
router.get('/board',userController.boardAPI);
router.get('/test',userController.testAPI);
router.get('/test2',userController.test2API);
router.post('/join2',userController.join2API);
router.post('/submit',userController.submitAPI);






//한국사
router.get('/KorHistory', userController.KorHistoryAPI);

//토익 일정, 수수료
router.get('/ToeicCalendar', userController.ToeicCalendarAPI);
router.get('/ToeicReceipt', userController.ToeicReceiptAPI);

//큐넷
router.get('/EngineerCalendar', userController.EngineerCalendarAPI);
router.get('/FunctionalCalendar', userController.FunctionalCalendarAPI);
router.get('/IndustrialEngineerCalendar', userController.IndustrialEngineerCalendarAPI);
router.get('/TechnicianCalendar', userController.TechnicianCalendarAPI);


//db연결 test
router.get('/db', userController.DBConnectAPI);
router.get('/db_insert', userController.DBInsertAPI);



module.exports = router;


//test-----------------------------------------------
// router.get('/get_test', userController.GetTestAPI);
// router.post('/post_test', userController.PostTestAPI);

// // //html 가져오기
// router.get('/html_test', userController.HtmlTestAPI);
// // router.get('/html', function (req, res, next) {
// //   let url = 'https://www.yna.co.kr/sports/all';

// //   axios.get(url).then(html => {
// //     let ulList = [];
// //     const $ = cheerio.load(html.data);
// //     const $bodyList = $("div.list-type038 ul").children("li");
// //     //each : list 마다 함수 실행, forEach와 동일
// //     $bodyList.each(function (i, elem) {
// //       ulList[i] = {
// //         //find : 해당 태그가 있으면 그 요소 반환
// //         title: $(this).find('a strong.tit-news').text(),
// //         // url: $(this).find('strong.news-tl a').attr('href'),
// //         // image_url: $(this).find('p.poto a img').attr('src'),
// //         // image_alt: $(this).find('p.poto a img').attr('alt'),
// //         // summary: $(this).find('p.lead').text().slice(0, -11),
// //         // date: $(this).find('span.p-time').text()
// //       };
// //     });
// //     const data = ulList.filter(n => n.title);
// //     //json으로 변환하여 app으로 전송
// //     return res.json(data);
// //   })
// // });