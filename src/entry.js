import css from './css/index.css';
import less from './css/black.less';
import scss from './css/main.scss';
//import test from './index.js';
//import $ from 'jquery'; //直接安装jquery，然后在使用时直接引用，然后调用。

var json = require("../config.json");

let jspanpString = "Hello JSPang!Hello jianshe"

//document.getElementById('title').innerHTML = jspanpString;

$("#title").html(jspanpString);

document.getElementById('json').innerHTML = json.name + ":" + json.web;

//test();