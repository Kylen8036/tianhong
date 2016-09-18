
var $ = require('./libs/jquery.js');

var common = require('./utils/common.util.js');

var tplHeader = require('./tpls/header.string');
var tplIndexBody = require('./tpls/index.body.string');
var tplFooter = require('./tpls/footer.string');

$(function(){
    common.renderHTML(tplHeader+tplIndexBody+tplFooter);
})
