$(function() {
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
    initProList(Request.userName);
    function initProList(userName){
        var curUser = userName; //获取登录进来的用户id
        if (curUser) {
            $("#welcome_user").html("您好" + curUser + ",欢迎来到虹领巾!");
            $("#loginTH,#registerTH").css({ "display": "none" });
            $("#logoutTH").css({ "display": "block" });
        }
    }
//获取json数据并显示
    var arrPro = [];
    var liStr = "";
    $.ajax({
        url: "http://localhost:8080/product/GetProductsByPage_get",
        data: {
            "pagesize": 10000,
            "pageindex": 1
        },
        success: function(data) {
            var j = 0;
            for (var i = 0; i < data.length; i++) {
                var getProduct = data[i].Id.split("_")[0];
                if (getProduct == "product") {
                    var dataObj = JSON.parse(data[i].Data);
                    var isWantPro = false;
                    if (dataObj.keyWord.indexOf(getKeyword, 0)!=-1 || dataObj.proName.indexOf(getKeyword)!=-1) {
                        isWantPro = true;
                    }
                    for(var k=0; k<dataObj.keyWord.length; k++){
                        if(getKeyword.indexOf(dataObj.keyWord[k])!=-1){
                            isWantPro = true;
                        }
                    }
                    if(isWantPro){
                    	if (dataObj.proPrice) {
                    	    arrPro[j] = "<li><div class = \"pic\" >" +
                    	        "<img src = \"proImg/" + dataObj.proImg + "\">" +
                    	        "</div> <div class = \"title\" >" +
                    	        "<a href = \"#\" >" + dataObj.proName + "</a> </div> <div class = \"price\" >" +
                    	        "<span> ￥" + dataObj.proPriceNow + "</span> <del>￥" + dataObj.proPrice + " </del> </div> <div class = \"btn\" >" +
                    	        "<a class = \"add\" href = \"#\" > 放入购物车 </a>" +
                    	        "<input class = \"btn-store\" type = \"button\" value = \"收藏\">" +
                    	        "</div> </li>";
                    	    j++;
                    	} else {
                    	    arrPro[j] = "<li><div class = \"pic\" >" +
                    	        "<img src = \"proImg/" + dataObj.proImg + "\">" +
                    	        "</div> <div class = \"title\" >" +
                    	        "<a href = \"#\" >" + dataObj.proName + "</a> </div> <div class = \"price\" >" +
                    	        "<span> ￥" + dataObj.proPriceNow + "</span></div> <div class = \"btn\" >" +
                    	        "<a class = \"add\" href = \"#\" > 放入购物车 </a>" +
                    	        "<input class = \"btn-store\" type = \"button\" value = \"收藏\">" +
                    	        "</div> </li>";
                    	    j++;
                    	}
                    }
                }
            }
            liStr = arrPro.join("");
            $(".sp-list").append(liStr);
        },
        dataType: "json"
    });

    //鼠标悬浮显示边框
    $(".sp-list").on("mouseenter", "li", function() {
        $(this).css({ "border-color": "#f7f7f7" });
    });
    $(".sp-list").on("mouseleave", "li", function() {
        $(this).css({ "border-color": "#fff" });
    });
    //点击商品进入详情页
    $(".sp-list").on("click", ".pic,.title", function() {
        // location.assign("proDetail.html"); 
        if (Request.userName) {
            var reqUrl = "http://localhost:8080/httpview/tianhong/proDetail.html?userName=" + Request.userName;
        } else {
            var reqUrl = "http://localhost:8080/httpview/tianhong/proDetail.html";
        }
        location.assign(reqUrl);
    });
    //价格筛选商品
    $("#getpro_price").click(function() {
        var liStrNew = "";
        var lowPrice = parseInt($("#low_price").val());
        var highPrice = parseInt($("#high_price").val());
        for (var i = 0; i < arrPro.length; i++) {
            var getCurPrice = arrPro[i].split("￥")[1].split("</span>")[0];
            if (getCurPrice < lowPrice || getCurPrice > highPrice) {
                arrPro.splice(i, 1);
                i--;
            }
        }
        $(".sp-list").html("");
        liStr = arrPro.join("");
        $(".sp-list").append(liStr);
    });
});

//搜索
$(".search-btn").click(function(){
    var proInfo = $("#search").val();
    var reqUrl = "http://localhost:8080/httpview/tianhong/productList.html?proInfo="+encodeURI(proInfo);
    location.assign(reqUrl);
});
