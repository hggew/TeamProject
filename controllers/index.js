const axios = require("axios");
const cheerio = require("cheerio");


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
}