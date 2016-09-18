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
ininIndex(Request.userName);

function ininIndex(userName) {
    var curUser = userName; //获取登录进来的用户id
    if (curUser) {
        $("#welcome_user").html("您好" + curUser + ",欢迎来到虹领巾!");
        $("#loginTH,#registerTH").css({ "display": "none" });
        $("#logoutTH").css({ "display": "block" });
    }

    //客户服务的显示与隐藏
    $(".custom-service").first().hover(
        function() {
            $(".ci-right").first().css({ "backgroundPosition": "-141px -314px" });
            $(".custom-service").first().css({ "background": "#FFF" });
            $("#hide_service").css({ "display": "block" });
        },
        function() {
            $(".ci-right").first().css({ "backgroundPosition": "-141px -308px" });
            $(".custom-service").first().css({ "background": "none" });
            $("#hide_service").css({ "display": "none" });
        }
    );
    //nav索引的区域的显示和隐藏
    $(".pro-hasArea").each(function(index) {
        $(this).hover(
            function() {
                $("#content_div").css({ "display": "block" });
                $(".product-type").eq(index).css({ "display": "block" });
                $(".pro-hasArea s").eq(index).css({ "display": "block" });
                $(".pro-hasArea").eq(index).css({ "background": "#ec8600" });
            },
            function() {
                $("#content_div").css({ "display": "none" });
                $(".product-type").eq(index).css({ "display": "none" });
                $(".pro-hasArea s").eq(index).css({ "display": "none" });
                $(".pro-hasArea").eq(index).css({ "background": "none" });
                $(".product-type").eq(index).hover(
                    function() {
                        $("#content_div").css({ "display": "block" });
                        $(".product-type").eq(index).css({ "display": "block" });
                        $(".pro-hasArea s").eq(index).css({ "display": "block" });
                        $(".pro-hasArea").eq(index).css({ "background": "#ec8600" });
                    },
                    function() {
                        $("#content_div").css({ "display": "none" });
                        $(".product-type").eq(index).css({ "display": "none" });
                        $(".pro-hasArea s").eq(index).css({ "display": "none" });
                        $(".pro-hasArea").eq(index).css({ "background": "none" });
                    }
                );
            }
        );
    });

    $("#close_ad").click(function() {
        $("#ad").css({ "display": "none" });
    });
    //获取数据并显示
    $.ajax({
        url: "http://localhost:8080/product/GetProductsByPage_get",
        data: {
            "pagesize": 10000,
            "pageindex": 1
        },
        success: function(data) {
            //顶部广告的显示
            for (var i = 0; i < data.length; i++) {
                if (data[i].Id == "ad") {
                    var dataObj = JSON.parse(data[i].Data);
                    var adTopSrc = dataObj.adTopArr[0];
                    getAdTopSrc(adTopSrc);
                }
            }
            //轮播图src的获取
            for (var i = 0; i < data.length; i++) {
                if (data[i].Id == "banner") {
                    var dataObj = JSON.parse(data[i].Data);
                    var bannerSrc = dataObj.bannerSrc;
                    getBannerSrc(bannerSrc);
                }
            }
        },
        dataType: "json"
    })
}

function getAdTopSrc(adTopSrc) {
    $("#ad").css({ "display": "block" });
    $("#ad img").attr({ "src": "picture/" + adTopSrc });
}

function getBannerSrc(bannerArr) {
    var bannerObj = $(".weichuangyi_ul li img");
    for (var i = 0; i < bannerObj.length; i++) {
        bannerObj.eq(i).attr({ "src": "picture/" + bannerArr[i] });
    }
}

//所有的详细商品都指向一个商品详情页
$(".proDetail").on("click", "a", function() {
    $(this).attr({ "href": "proDetail.html", "target": "_blank" });
});

//获取关键字并转到相应的列表页
var proInfo;
//搜索
$(".search-btn").click(function() {
    proInfo = $("#search").val();
    getProList();
});
//导航的关键字
$("#content_div").on("click", "a", function() {
    proInfo = $(this).text();
    getProList();
});

function getProList() {
    if (Request.userName) {
        var reqUrl = "http://localhost:8080/httpview/tianhong/productList.html?userName=" + Request.userName + "&proInfo=" + encodeURI(proInfo);
    } else {
        var reqUrl = "http://localhost:8080/httpview/tianhong/productList.html?proInfo=" + encodeURI(proInfo);
    }
    location.assign(reqUrl);
}


//海外购等鼠标悬浮改变
$(".promotions-title").on("mouseenter", "li", function() {
    $(this).parent().children("li").css({ "border-color": "#333" });
    $(this).css({ "border-color": "#fe8d51" });
    $(this).parent().find("span").attr({ "class": "" });
    $(this).children("span").attr({ "class": "currSpan icon" });

    if ($(this).attr("class") == "pro1") {
        $(".promotions-content").css({ "display": "none" });
        $("#promotions-content1").css({ "display": "block" });
    } else if ($(this).attr("class") == "pro2") {
        $(".promotions-content").css({ "display": "none" });
        $("#promotions-content2").css({ "display": "block" });
    } else {
        $(".promotions-content").css({ "display": "none" });
        $("#promotions-content3").css({ "display": "block" });
    }
});

// floor层的显示和隐藏
$(".tab").on("mouseenter", "li", function() {
    $(this).parent().find("a").css({ "background-color": "#fff", "color": "#666" });
    $(this).children("a").css({ "background-color": "#948037", "color": "#fff" });

    var $classIndex = $(this).attr("class").split("floor")[1];
    var $class =  "#floor"+$classIndex;
    var $classNow = $class.replace("-", "_");

    $(this).parent().parent().parent().parent().find(".m2").css({ "display": "none" });
    $($classNow).css({ "display": "block" });


    // if ($(this).attr("class") == "floor1-1") {
    //     $(".m2").css({ "display": "none" });
    //     $("#floor1_1").css({ "display": "block" });
    // } else if ($(this).attr("class") == "floor1-2") {
    //     $(".m2").css({ "display": "none" });
    //     $("#floor1_2").css({ "display": "block" });
    // } else if ($(this).attr("class") == "floor1-3") {
    //     $(".m2").css({ "display": "none" });
    //     $("#floor1_3").css({ "display": "block" });
    // } else if ($(this).attr("class") == "floor1-4") {
    //     $(".m2").css({ "display": "none" });
    //     $("#floor1_4").css({ "display": "block" });
    // } else if ($(this).attr("class") == "floor1-5") {
    //     $(".m2").css({ "display": "none" });
    //     $("#floor1_5").css({ "display": "block" });
    // }
});
