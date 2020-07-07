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




module.exports = router;