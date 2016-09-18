//获取地址栏的数据
function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}
var Request = new UrlSearch(); //实例化
var getKeyword = decodeURI(Request.proInfo);

// 判断是否登录
initCart(Request.userName);

function initCart(userName) {
    var curUser = userName; //获取登录进来的用户id
    if (curUser) {
        $("#welcome_user").html("您好" + curUser + ",欢迎来到虹领巾!");
        $("#loginTH,#registerTH").css({ "display": "none" });
        $("#logoutTH").css({ "display": "block" });
    }
}

$.ajax({
    url: "http://localhost:8080/product/GetProductsByPage_get",
    data: {
        "pagesize": 10000,
        "pageindex": 1
    },
    success: function(data) {
        var curUser = Request.userName;
        for (var i = 0; i < data.length; i++) {
            var dataObj = JSON.parse(data[i].Data);
            if (dataObj.type == "user") {
                var dataObj = JSON.parse(data[i].Data);
                if(dataObj.userName == curUser){
                    if(dataObj.userCart){
                        var str = "";
                        for(var j=0; j<dataObj.userCart.length; j++){
                            str += "<div class=\"cart-item\">"+
                                    "<div class=\"num\">"+
                                         "<div class=\"f1\">"+
                                            "<input type=\"checkbox\" name=\"child_check\">"+
                                        "</div>"+
                                    "</div>"+
                                    "<div class=\"ProInfo\">"+
                                        "<div class=\"img\">"+
                                            "<a href=\"#\"><img src=\"picture/"+dataObj.userCart[j].imgsrc+"\"></a>"+
                                        "</div>"+
                                        "<div class=\"name\">"+
                                            "<a href=\"#\">"+dataObj.userCart[j].proInfo+"</a>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div class=\"ProPrice\">"+
                                        "<del class=\"grayC\">￥ "+dataObj.userCart[j].proPrice+"</del>"+
                                        "<span>￥ "+dataObj.userCart[j].proPriceNow+"</span>"+
                                    "</div>"+
                                    "<div class=\"quantity\">"+
                                       "<div class=\"buyNum\">"+
                                            "<a href=\"#\" class=\"btn-reduce icon\"></a>"+
                                            "<input class=\"proNum\" type=\"text\" value=\""+dataObj.userCart[j].proNum+"\">"+
                                            "<a href=\"#\" class=\"btn-add icon\"></a>"+
                                        "</div>"+
                                    "</div>"+

                                    "<div class=\"promotion\">"+
                                        "<span class=\"zhonghuax\">——</span>"+
                                    "</div>"+
                                    "<div class=\"weight\">"+0.500*dataObj.userCart[j].proNum+"kg</div>"+
                                    "<div class=\"subtotal\">￥ "+198.00*dataObj.userCart[j].proNum+"</div>"+
                                    "<div class=\"action\">"+
                                        "<div>"+
                                            "<a href=\"#\">删除</a>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>";
                        }
                        $(".cartList").append(str);
                    }else{
                        alert("购物车为空");
                    }
                }
            }
        }
    },
    dataType: "json"
});


// 商品的增减
$(".cartList").on("click", ".btn-reduce", function(){
    var $num = $(this).parent().parent().parent().find(".proNum");
    if (parseInt($num.val()) > 1) {
        $num.val(parseInt($num.val()) - 1);
    }
    return false;
});

$(".cartList").on("click", ".btn-add", function(){
    var $num = $(this).parent().parent().parent().find(".proNum");
    $num.val(parseInt($num.val()) + 1);
    return false;
});

