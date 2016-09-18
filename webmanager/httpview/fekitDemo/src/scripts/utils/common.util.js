
var $ = require('../libs/jquery.js');

var common = {
    renderHTML: function(str){
        $('body').prepend(str);
    }
}
module.exports = common;