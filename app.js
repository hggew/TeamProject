var express = require('express'); //express 모듈요청
var app = express(); //app을 express 프레임워크로 킴
const ejs = require("ejs"); //ejs 모듈 요청

var http = require('http');
var path = require('path');
var static = require('serve-static');

const bodyPaser = require('body-parser');//POST로 받기위해 body-parser 요청
const bodyParser = require("body-parser");

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");
var mysql = require('mysql');
const request = require('request');
const convert = require('xml-js');

'use strict';
const tabletojson = require("tabletojson").Tabletojson;

var Iconv = require('iconv').Iconv;
// var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore'); //코딩 변환 과정 중에 이해할 수 없는 값이 입력됐을 경우 이를 어떻게든 바꾸거나 (어떻게인지는 잘 모른다) 아니면 무시
var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
var fs = require("fs");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.set("view engine", "ejs"); //app에 view engine을 설치. ejs를 템플릿으로
app.use(express.static(__dirname + '/')); //view 폴더 경로는 프로젝트 폴더.(__dirname이 폴더위치)
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false })); //url인코딩 안함
app.use(bodyParser.json());//JSON 타입으로 파싱하게 설정


app.use('/', indexRouter);
app.use('/users', usersRouter);

//DB---------------------------------------------------------
var db_info = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'project'
}

var connection = mysql.createConnection(db_info);




//한국사------------------------------------------------------------------
var StringToDate = function (str) {
  var y = str.split("년 ")[0];
  var md = str.split("년 ")[1];
  var m = md.split("월 ")[0];
  var d = md.split("월 ")[1].split("일")[0];
  // console.log(y +"/"+ m+ "/"+ d);
  // var date = new Date(y,m,d).toUTCString();
  var date = y + "-" + m + "-" + d;
  console.log(date);
  return date;
}

var kor_time = [];
var kor_s_date = [];
var kor_e_date = [];
var kor_d_date = [];
var kor_r_date = [];

function KorHistoryAPI(req, res) {
  console.log("index/KorHistory router start");
  //시험일정
  //테이블가져오기
  var url = 'http://www.historyexam.go.kr/pageLink.do?link=examSchedule';
  tabletojson.convertUrl(url).then(function (tablesAsJson) {
    var TableList = tablesAsJson[0];
    for (var i = 0; i < TableList.length; i++) {

      var table = TableList[i];

      var tt=table.구분;
      kor_time[i] = tt.split("제")[1].split("회")[0];

      var s2e = table.접수기간;
      var start = s2e.split(" ~ ")[0];
      var end = s2e.split(" ~ ")[1];
      kor_s_date[i] = StringToDate(start);
      kor_e_date[i] = StringToDate(end);

      var examday = table.시험일시;
      kor_d_date[i] = StringToDate(examday);

      var resultday = table.합격자발표;
      kor_r_date[i] = StringToDate(resultday);

      //dbinsert certificate
      var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
      var params = [kor_time[i], '한국사능력검정시험', '자격증', '.'];
      connection.query(sql, params, function (err, results) {
        if (err) { console.log("err"); throw err; }
        else { console.log("kor insert success"); }
      });

      //dbinsert certificate_date
      sql = "insert into certificate_date(name,time, doc_d_day, doc_apply_start, doc_apply_end, doc_result_release) values(?,?,?,?,?,?);";
      params = ['한국사능력검정시험', kor_time[i], kor_d_date[i], kor_s_date[i], kor_e_date[i], kor_r_date[i]];
      connection.query(sql, params, function (err, results) {
        if (err) { console.log("err"); throw err; }
        else { console.log("kor insert success 2"); }
      });
    }
  });
}




//토익------------------------------------------------------------------
var toeic_time = [];
var toeic_s_date = [];
var toeic_e_date = [];
var toeic_d_date = [];
var toeic_r_date = [];

var SpliteToeicInfo = function (str, i) {
  toeic_time[i] = str.split("제")[1].split("회")[0];

  toeic_s_date[i] = str.split("정기접수")[1].split("(")[0];
  toeic_s_date[i] = toeic_s_date[i].replace(/\./g, "-"); //정규표현식으로 온점 >> -

  toeic_e_date[i] = str.split("~")[1].split("(")[0];
  toeic_e_date[i] = toeic_e_date[i].replace(/\./g, "-"); //정규표현식으로 온점 >> -

  toeic_d_date[i] = str.split("회")[1].split("(")[0];
  toeic_d_date[i] = toeic_d_date[i].replace(/\./g, "-"); //정규표현식으로 온점 >> -

  toeic_r_date[i] = str.split("분")[1].split("(")[0];
  toeic_r_date[i] = toeic_r_date[i].replace(/\./g, "-"); //정규표현식으로 온점 >> -

  console.log("time : " + toeic_time[i] + toeic_s_date[i] + toeic_e_date[i] + toeic_d_date[i] + toeic_r_date[i]);
}


function ToeicCalendarAPI(req, res, next) {
  console.log("index/ToeicCalendar router start");

  let url = 'https://appexam.ybmnet.co.kr/toeic/info/receipt_schedule.asp';

  var result;
  var options = { encoding: "binary", method: "GET", uri: url, json: true };
  request(options, function (err, response, html) {
    var contents = new Buffer(html, 'binary'); //인코딩 변환
    result = euckr2utf8.convert(contents).toString();
    //var result = euckr2utf8.convert(html).toString();
    // console.log(result);
    // console.log(typeof result);

    $ = cheerio.load(result);
    info_list = [];
    $('.table_info_print').find('tr').each(function (i, elem) {
      info_list[i++] = $(this).children().text();
    })
    // res.status(200).json({ info_list });

    for (var j = 1; j < info_list.length; j++) {
      console.log(info_list[j] + "@@@");
      //날짜 구하기
      SpliteToeicInfo(info_list[j], j - 1);
      // dbinsert certificate
      var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
      var params = [toeic_time[j - 1], '토익', '어학자격증', '.'];
      connection.query(sql, params, function (err, results) {
        if (err) { console.log("err"); throw err; }
        else { console.log("toeic insert success"); }
      });
      //dbinsert certificate_date
      sql = "insert into certificate_date(name,time, doc_d_day, doc_apply_start, doc_apply_end, doc_result_release) values(?,?,?,?,?,?);";
      params = ['토익', toeic_time[j - 1], toeic_d_date[j - 1], toeic_s_date[j - 1], toeic_e_date[j - 1], toeic_r_date[j - 1]];
      connection.query(sql, params, function (err, results) {
        if (err) { console.log("err"); throw err; }
        else { console.log("toeic insert success 2"); }
      });
    }
  });

}
// //토익 수수료
// function ToeicReceiptAPI(req, res, next) {
//     console.log("index/ToeicReceipt router start");
//     //시험일정

//     tabletojson.convertUrl(
//         'https://appexam.ybmnet.co.kr/toeic/receipt/receipt.asp',
//         function (tablesAsJson) {
//             res.status(200).json({
//                 tablesAsJson
//             });
//             // console.log(tablesAsJson[0][0]);
//         }
//     );
// }



//큐넷------------------------------------------------------------------
//json 깊이 수정
const RemoveJsonTextAttribute = (value, parentElement) => {
  try {
    const keyNo = Object.keys(parentElement._parent).length;
    const keyName = Object.keys(parentElement._parent)[keyNo - 1];
    parentElement._parent[keyName] = value;
  } catch (e) {
    console.log(e);
  }
};

//기술사 시험 시행일정 조회
var Engineer_time = [];
var Engineer_doc_s_date = [];
var Engineer_doc_e_date = [];
var Engineer_doc_d_date = [];
var Engineer_doc_r_date = [];
var Engineer_prac_s_date = [];
var Engineer_prac_e_date = [];
var Engineer_prac_d_date = [];
var Engineer_prac_r_date = [];

var SpliteEngineerInfo = function (str, i) {
  Engineer_time[i] = str.description.split('제')[1].split("회)")[0];
  Engineer_doc_s_date[i] = str.docregstartdt;
  Engineer_doc_e_date[i] = str.docregenddt;
  Engineer_doc_d_date[i] = str.docexamdt;
  Engineer_doc_r_date[i] = str.docpassdt;
  Engineer_prac_s_date[i] = str.pracregstartdt;
  Engineer_prac_e_date[i] = str.pracregenddt;
  Engineer_prac_d_date[i] = str.pracexamstartdt;
  Engineer_prac_r_date[i] = str.pracpassdt;
}

function EngineerCalendarAPI(req, res, next) {
  console.log("index/EngineerCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getPEList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, resp, body) => {

    if (err) {
      console.log(`err => ${err}`)
    }
    if (resp.statusCode == 200) {
      var result = body
      // console.log(`body data => ${result}`);
      var xmlToJson = convert.xml2json(result, { compact: true, spaces: 4, textFn: RemoveJsonTextAttribute });
      var jsonData = JSON.parse(xmlToJson);

      // console.log(`xml to json => ${xmlToJson}`);
      var items = jsonData.response.body.items;

      for (var j = 0; j < items.item.length; j++) {
        // Engineer_time[j]=items.item[j].description;
        // console.log(Engineer_time[j]);            
        SpliteEngineerInfo(items.item[j], j);
        //dbinsert certificate
        if (Engineer_time[j] != Engineer_time[j - 1]) { //중복제거
          var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
          var params = [Engineer_time[j], '정보관리기술사', '기술사', '.'];
          connection.query(sql, params, function (err, results) {
            if (err) { console.log("err"); throw err; }
            else { console.log("Engineer insert success "); }
          });
        }
        //dbinsert certificate_date
        sql = "insert into certificate_date(name,time, doc_d_day, doc_apply_start, doc_apply_end, doc_result_release,prac_d_day,prac_apply_start, prac_apply_end , prac_result_release) values(?,?,?,?,?,?,?,?,?,?);";
        params = ['정보관리기술사', Engineer_time[j], Engineer_doc_d_date[j], Engineer_doc_s_date[j], Engineer_doc_e_date[j], Engineer_doc_r_date[j], Engineer_prac_d_date[j], Engineer_prac_s_date[j], Engineer_prac_e_date[j], Engineer_prac_r_date[j]];
        connection.query(sql, params, function (err, results) {
          if (err) { console.log("err"); throw err; }
          else { console.log("Engineer insert success 2"); }
        });
      }
    }
  });
}



//기능장 시험 시행일정 조회
var Functional_time = [];
var Functional_doc_s_date = [];
var Functional_doc_e_date = [];
var Functional_doc_d_date = [];
var Functional_doc_r_date = [];
var Functional_prac_s_date = [];
var Functional_prac_e_date = [];
var Functional_prac_d_date = [];
var Functional_prac_r_date = [];


var SpliteFunctionalInfo = function (str, i) {
  Functional_time[i] = str.description.split('제')[1].split("회)")[0];
  Functional_doc_s_date[i] = str.docregstartdt;
  Functional_doc_e_date[i] = str.docregenddt;
  Functional_doc_d_date[i] = str.docexamdt;
  Functional_doc_r_date[i] = str.docpassdt;
  Functional_prac_s_date[i] = str.pracregstartdt;
  Functional_prac_e_date[i] = str.pracregenddt;
  Functional_prac_d_date[i] = str.pracexamstartdt;
  Functional_prac_r_date[i] = str.pracpassdt;
}

function FunctionalCalendarAPI(req, res, next) {
  console.log("index/FunctionalCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getMCList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, resp, body) => {

    if (err) {
      console.log(`err => ${err}`)
    }
    if (resp.statusCode == 200) {
      var result = body
      var xmlToJson = convert.xml2json(result, { compact: true, spaces: 4, textFn: RemoveJsonTextAttribute });
      var jsonData = JSON.parse(xmlToJson);

      var items = jsonData.response.body.items;

      for (var j = 0; j < items.item.length; j++) {
        SpliteFunctionalInfo(items.item[j], j);
        //dbinsert certificate
        var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
        var params = [Functional_time[j], '조리기능장', '기능장', '.'];
        connection.query(sql, params, function (err, results) {
          if (err) { console.log("err"); throw err; }
          else { console.log("Functional insert success "); }
        });
        //dbinsert certificate_date
        sql = "insert into certificate_date(name,time, doc_d_day, doc_apply_start, doc_apply_end, doc_result_release,prac_d_day,prac_apply_start, prac_apply_end , prac_result_release) values(?,?,?,?,?,?,?,?,?,?);";
        params = ['조리기능장', Functional_time[j], Functional_doc_d_date[j], Functional_doc_s_date[j], Functional_doc_e_date[j], Functional_doc_r_date[j], Functional_prac_d_date[j], Functional_prac_s_date[j], Functional_prac_e_date[j], Functional_prac_r_date[j]];
        connection.query(sql, params, function (err, results) {
          if (err) { console.log("err"); throw err; }
          else { console.log("Functional insert success 2"); }
        });
      }
    }
  });
}





//기사, 산업기사 시험 시행일정 조회
var Industrial_time = [];
var Industrial_doc_s_date = [];
var Industrial_doc_e_date = [];
var Industrial_doc_d_date = [];
var Industrial_doc_r_date = [];
var Industrial_prac_s_date = [];
var Industrial_prac_e_date = [];
var Industrial_prac_d_date = [];
var Industrial_prac_r_date = [];

var SpliteIndustrialInfo = function (str, i) {
  Industrial_time[i] = str.description.split('제')[1].split("회)")[0];
  Industrial_doc_s_date[i] = str.docregstartdt;
  Industrial_doc_e_date[i] = str.docregenddt;
  Industrial_doc_d_date[i] = str.docexamdt;
  Industrial_doc_r_date[i] = str.docpassdt;
  Industrial_prac_s_date[i] = str.pracregstartdt;
  Industrial_prac_e_date[i] = str.pracregenddt;
  Industrial_prac_d_date[i] = str.pracexamstartdt;
  Industrial_prac_r_date[i] = str.pracpassdt;
}

function IndustrialEngineerCalendarAPI(req, res, next) {
  console.log("index/IndustrialEngineerCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getEList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, resp, body) => {

    if (err) {
      console.log(`err => ${err}`)
    }
    if (resp.statusCode == 200) {
      var result = body
      var xmlToJson = convert.xml2json(result, { compact: true, spaces: 4, textFn: RemoveJsonTextAttribute });
      var jsonData = JSON.parse(xmlToJson);

      var items = jsonData.response.body.items;

      //json에서정보 구하기
      for (var j = 0; j < items.item.length; j++) {
        SpliteIndustrialInfo(items.item[j], j);
      }
      //db에 넣을 정보 편집
      for (var j = 0; j < items.item.length; j++) {
        for (var k = 0; k < items.item.length; k++) {
          if (j != k && Industrial_time[j] == Industrial_time[k]) {
            if (Industrial_doc_e_date[j] - Industrial_doc_s_date[k] == -1) {
              Industrial_doc_e_date[j] = Industrial_doc_e_date[k];
              Industrial_doc_s_date[k] = Industrial_doc_s_date[j];
            }
            if (Industrial_doc_s_date[j] - Industrial_doc_e_date[k] == 1) {
              Industrial_doc_s_date[j] = Industrial_doc_s_date[k];
              Industrial_doc_e_date[k] = Industrial_doc_e_date[j];
            }
          }
        }
      }


      //db 저장
      for (var j = 0; j < items.item.length; j++) {
        //dbinsert certificate
        if (Industrial_time[j] != Industrial_time[j - 1]) {//중복제거
          var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
          var params = [Industrial_time[j], '정보처리기사', '기사,산업기사', '.'];
          connection.query(sql, params, function (err, results) {
            if (err) { console.log("err"); throw err; }
            else { console.log("Industrial insert success "); }
          });
          //dbinsert certificate_date
          sql = "insert into certificate_date(name,time, doc_d_day, doc_apply_start, doc_apply_end, doc_result_release,prac_d_day,prac_apply_start, prac_apply_end , prac_result_release) values(?,?,?,?,?,?,?,?,?,?);";
          params = ['정보처리기사', Industrial_time[j], Industrial_doc_d_date[j], Industrial_doc_s_date[j], Industrial_doc_e_date[j], Industrial_doc_r_date[j], Industrial_prac_d_date[j], Industrial_prac_s_date[j], Industrial_prac_e_date[j], Industrial_prac_r_date[j]];
          connection.query(sql, params, function (err, results) {
            if (err) { console.log("err"); throw err; }
            else { console.log("Industrial insert success 2"); }
          });
        }
      }

    }
  });
}





//기능사 시험 시행일정 조회
var Technician_type = [];
var Technician_time = [];
var Technician_doc_s_date = [];
var Technician_doc_e_date = [];
var Technician_doc_d_date = [];
var Technician_doc_r_date = [];
var Technician_prac_s_date = [];
var Technician_prac_e_date = [];
var Technician_prac_d_date = [];
var Technician_prac_r_date = [];

var SpliteTechnicianInfo = function (str, i) {//(2020년도 제1회)
  Technician_type[i] = str.description.split('년 ')[1].split(' 기능사 ')[0] + '기능사';
  Technician_time[i] = str.description.split('기능사 ')[1].split("회")[0];
  Technician_doc_s_date[i] = str.docregstartdt;
  Technician_doc_e_date[i] = str.docregenddt;
  Technician_doc_d_date[i] = str.docexamdt;
  Technician_doc_r_date[i] = str.docpassdt;
  Technician_prac_s_date[i] = str.pracregstartdt;
  Technician_prac_e_date[i] = str.pracregenddt;
  Technician_prac_d_date[i] = str.pracexamstartdt;
  Technician_prac_r_date[i] = str.pracpassdt;
  // var ttt=Technician_prac_e_date[i]-Technician_prac_s_date[i];
  // console.log(ttt);
}

function TechnicianCalendarAPI(req, res, next) {
  console.log("index/TechnicianCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getCList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, resp, body) => {

    if (err) {
      console.log(`err => ${err}`)
    }
    if (resp.statusCode == 200) {
      var result = body
      var xmlToJson = convert.xml2json(result, { compact: true, spaces: 4, textFn: RemoveJsonTextAttribute });
      var jsonData = JSON.parse(xmlToJson);

      var items = jsonData.response.body.items;

      for (var j = 0; j < items.item.length; j++) {
        SpliteTechnicianInfo(items.item[j], j);
        //dbinsert certificate
        if (Technician_time[j] != Technician_time[j - 1]) { //중복제거
          var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
          var params = [Technician_time[j], '웹디자인기능사', Technician_type[j], '.'];
          connection.query(sql, params, function (err, results) {
            if (err) { console.log("err"); throw err; }
            else { console.log("Technician insert success "); }
          });
          //dbinsert certificate_date
          sql = "insert into certificate_date(name,time, doc_d_day, doc_apply_start, doc_apply_end, doc_result_release,prac_d_day,prac_apply_start, prac_apply_end , prac_result_release) values(?,?,?,?,?,?,?,?,?,?);";
          params = ['웹디자인기능사', Technician_time[j], Technician_doc_d_date[j], Technician_doc_s_date[j], Technician_doc_e_date[j], Technician_doc_r_date[j], Technician_prac_d_date[j], Technician_prac_s_date[j], Technician_prac_e_date[j], Technician_prac_r_date[j]];
          connection.query(sql, params, function (err, results) {
            if (err) { console.log("err"); throw err; }
            else { console.log("Technician insert success 2"); }
          });
        }
      }
    }
  });
}





KorHistoryAPI();
ToeicCalendarAPI();
EngineerCalendarAPI();
FunctionalCalendarAPI();
IndustrialEngineerCalendarAPI();
TechnicianCalendarAPI();





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
