const axios = require("axios");
const cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson;
const request = require('request');
const convert = require('xml-js');
var mysql = require('mysql');

function basicAPI(req, res) {
    // res.status(200).json({
    //     "success":true
    //   });
    res.redirect('basic.html');
    console.log("index router clear");
}

function GetTestAPI(req, res) {
    const message = "this is message";
    res.status(200).json(message);
    console.log("index/test router clear");
}

function PostTestAPI(req, res) {
    const user_message = req.body.message;
    res.status(200).json({
        "message": user_message
    });
    console.log("index/post_test router clear");
}



function KorHistoryAPI(req, res, next) {
    console.log("index/KorHistory router start");
    //시험일정
    //테이블가져오기

    var url = 'http://www.historyexam.go.kr/pageLink.do?link=examSchedule';
    tabletojson.convertUrl(url).then(function (tablesAsJson) {
        var table = tablesAsJson[0][0];
        // var ff= table[0];
        var sss= table.구분;
        res.status(200).json({
            sss
        });
    });

    // console.log(tablesAsJson);

}

/*function ToeicAPI(req, res, next) {
    console.log("index/Toeic router start");
    //시험일정
    //테이블가져오기

    var url = 'https://appexam.ybmnet.co.kr/toeic/info/receipt_schedule.asp';
    tabletojson.convertUrl(url).then(function (tablesAsJson) {
        var table = tablesAsJson[0][0];
        // var ff= table[0];
        var sss= table.구분;
        res.status(200).json({
          sss
            }
        });
    });

    // console.log(tablesAsJson);

}*/
//토익 일정
function ToeicCalendarAPI(req, res, next) {
    console.log("index/ToeicCalendar router start");
    //시험일정

    tabletojson.convertUrl(
        'https://appexam.ybmnet.co.kr/toeic/info/receipt_schedule.asp',
        function (tablesAsJson) {
            res.status(200).json({
                tablesAsJson
            });
            // console.log(tablesAsJson[0][0]);
        }
    );
}
//토익 수수료
function ToeicReceiptAPI(req, res, next) {
    console.log("index/ToeicReceipt router start");
    //시험일정

    tabletojson.convertUrl(
        'https://appexam.ybmnet.co.kr/toeic/receipt/receipt.asp',
        function (tablesAsJson) {
            res.status(200).json({
                tablesAsJson
            });
            // console.log(tablesAsJson[0][0]);
        }
    );
}

//기술사 시험 시행일정 조회
function EngineerCalendarAPI(req, res, next){
  console.log("index/EngineerCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getPEList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//기능장 시험 시행일정 조회
function FunctionalCalendarAPI(req, res, next){
  console.log("index/FunctionalCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getPEList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//기사, 산업기사 시험 시행일정 조회
function IndustrialEngineerCalendarAPI(req, res, next){
  console.log("index/IndustrialEngineerCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getEList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//기능사 시험 시행일정 조회
function TechnicianCalendarAPI(req, res, next){
  console.log("index/TechnicianCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getCList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&stdt=2020&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//종목별 응시수수료 조회>요청변수 종목코드? >http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getFeeList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&jmcd=1320&

//종목별 시행일정 목록 조회> 종목코드? >http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&jmcd=1320&

//국가전문자격 시험 시행일정 정보>http://openapi.q-net.or.kr/api/service/rest/InquiryTestDatesNationalProfessionalQualificationSVC/getList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&seriesCd=21&


//db
function DBConnectAPI(req, res, next) {
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
    // console.log("show table :" + result);
    res.status(200).json({
        result
    });

  });
    connection.end();
}






//------------------------------------------------------------------
function HtmlTestAPI(req, res, next) {
    console.log("index/html_test router start");
    let url = 'https://www.yna.co.kr/sports/all';
    axios.get(url).then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div.list-type038 ul").children("li");
        //each : list 마다 함수 실행, forEach와 동일
        $bodyList.each(function (i, elem) {
            ulList[i] = {
                //find : 해당 태그가 있으면 그 요소 반환
                title: $(this).find('a strong.tit-news').text(),
                // url: $(this).find('strong.news-tl a').attr('href'),
                // image_url: $(this).find('p.poto a img').attr('src'),
                // image_alt: $(this).find('p.poto a img').attr('alt'),
                // summary: $(this).find('p.lead').text().slice(0, -11),
                // date: $(this).find('span.p-time').text()
            };
        });
        const data = ulList.filter(n => n.title);
        //json으로 변환하여 app으로 전송
        return res.json(data);
    })
}


module.exports = {
    basicAPI: basicAPI,
    GetTestAPI: GetTestAPI,
    PostTestAPI: PostTestAPI,
    HtmlTestAPI: HtmlTestAPI,
    KorHistoryAPI: KorHistoryAPI,
    DBConnectAPI: DBConnectAPI,
    ToeicCalendarAPI: ToeicCalendarAPI,
    ToeicReceiptAPI: ToeicReceiptAPI,
    EngineerCalendarAPI: EngineerCalendarAPI,
    FunctionalCalendarAPI: FunctionalCalendarAPI,
    IndustrialEngineerCalendarAPI: IndustrialEngineerCalendarAPI,
    TechnicianCalendarAPI: TechnicianCalendarAPI,
}
