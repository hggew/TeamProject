const axios = require("axios");
const cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson;
const request = require('request');
const convert = require('xml-js');
var mysql = require('mysql');
var Iconv = require('iconv').Iconv;
// var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore'); //코딩 변환 과정 중에 이해할 수 없는 값이 입력됐을 경우 이를 어떻게든 바꾸거나 (어떻게인지는 잘 모른다) 아니면 무시
var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
var fs = require("fs");

function basicAPI(req, res) {
    res.render('index', {});
}

function searchAPI(req, res) {
    var request = req.query.searchKey;
    console.log(request);
    res.render('search', { request });
}

function mypageAPI(req, res) {
    res.render('mypage', {});
}

function joinAPI(req, res) {
    res.render('join', {});
}

function loginAPI(req, res) {
    res.render('login', {});
}

function boardAPI(req, res) {
    res.render('board', {});
}

function testAPI(req, res) {
    res.render('test', {});
}

function test2API(req, res) {
    res.render('test2', {});
}

function join2API(req, res) {
    var result = req.body
    console.log(result);
    res.render('join2', { result });
}

function submitAPI(req, res) {
    var request = req.body;
    console.log(request);
}



//종목별 응시수수료 조회>요청변수 종목코드? >http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getFeeList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&jmcd=1320&

//종목별 시행일정 목록 조회> 종목코드? >http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&jmcd=1320&

//국가전문자격 시험 시행일정 정보>http://openapi.q-net.or.kr/api/service/rest/InquiryTestDatesNationalProfessionalQualificationSVC/getList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&seriesCd=21&




// //DB---------------------------------------------------------
// var db_info = {
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'password',
//     database: 'project'
// }

// var connection = mysql.createConnection(db_info);


// function DBConnectAPI(req, res, next) {
//     connection.query("select * from user_info", function (err, results, fields) {
//         if (err) throw err;
//         console.log("Connected!");
//         var dataList = [];
//         for (var i = 0; i < results.length; i++) {
//             dataList.push(results[i]);
//         }
//         res.status(200).json({
//             dataList
//         });
//     });
//     // connection.end();
// }

// function DBInsertAPI(req, res, next) {
//     console.log("insert!");
//     connection.query("insert into user_info values('4','user4','password','email4@email.com','공대','컴퓨터공학과','.');", function (err, results) {
//         // console.log(arguments);
//         //insert 성공 확인
//         if (results.affectedRows > 0) {
//             console.log("1");
//             res.redirect("/db");
//             // res.status(200).json({ message: 'insert success' });
//         } else {
//             console.log("0");

//             // res.status(200).json({ message: 'insert fail' });
//         }

//     });
// }






module.exports = {
    basicAPI: basicAPI,
    searchAPI: searchAPI,
    mypageAPI: mypageAPI,
    joinAPI: joinAPI,
    loginAPI: loginAPI,
    boardAPI: boardAPI,
    testAPI: testAPI,
    test2API: test2API,
    join2API: join2API,
    submitAPI: submitAPI,

    // KorHistoryAPI: KorHistoryAPI,

    // ToeicCalendarAPI: ToeicCalendarAPI,
    // ToeicReceiptAPI: ToeicReceiptAPI,

    // EngineerCalendarAPI: EngineerCalendarAPI,
    // FunctionalCalendarAPI: FunctionalCalendarAPI,
    // IndustrialEngineerCalendarAPI: IndustrialEngineerCalendarAPI,
    // TechnicianCalendarAPI: TechnicianCalendarAPI,

    // DBConnectAPI: DBConnectAPI,
    // DBInsertAPI: DBInsertAPI,

    // GetTestAPI: GetTestAPI,
    // PostTestAPI: PostTestAPI,
    // HtmlTestAPI: HtmlTestAPI,
}


//TEST------------------------------------------------------------------
// function GetTestAPI(req, res) {
//     const message = "this is message";
//     res.status(200).json(message);
//     console.log("index/test router clear");
// }

// function PostTestAPI(req, res) {
//     const user_message = req.body.message;
//     res.status(200).json({
//         "message": user_message
//     });
//     console.log("index/post_test router clear");
// }

// function HtmlTestAPI(req, res, next) {
//     console.log("index/html_test router start");
//     let url = 'https://www.yna.co.kr/sports/all';
//     axios.get(url).then(html => {
//         let ulList = [];
//         const $ = cheerio.load(html.data);
//         const $bodyList = $("div.list-type038 ul").children("li");
//         //each : list 마다 함수 실행, forEach와 동일
//         $bodyList.each(function (i, elem) {
//             ulList[i] = {
//                 //find : 해당 태그가 있으면 그 요소 반환
//                 title: $(this).find('a strong.tit-news').text(),
//                 // url: $(this).find('strong.news-tl a').attr('href'),
//                 // image_url: $(this).find('p.poto a img').attr('src'),
//                 // image_alt: $(this).find('p.poto a img').attr('alt'),
//                 // summary: $(this).find('p.lead').text().slice(0, -11),
//                 // date: $(this).find('span.p-time').text()
//             };
//         });
//         const data = ulList.filter(n => n.title);
//         //json으로 변환하여 app으로 전송
//         return res.json(data);
//     })
// }