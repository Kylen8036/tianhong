/*----------------------cityChoose-------------------------------*/

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
    initProDetail(Request.userName);

    function initProDetail(userName) {
        var curUser = userName; //获取登录进来的用户id
        if (curUser) {
            $("#welcome_user").html("您好" + curUser + ",欢迎来到虹领巾!");
            $("#loginTH,#registerTH").css({ "display": "none" });
            $("#logoutTH").css({ "display": "block" });
        }
    }
    var ischooseClick = false;
    // $("#fullAddress-wrap").on("", "em", function() {
    //     ischooseClick = !ischooseClick;

    //     $(this).css({ "border-bottom": "none" });
    //     $("#city_none").css({ "display": "block" });
    //     $("#fullAddress-wrap em").css({ "background-position": "-28px -19px" });
    // });
    $("#fullAddress-wrap").click(function() {
        ischooseClick = !ischooseClick;
        showOrnot();
        // $(this).css({ "border-bottom": "none"});
        // $("#city_none").css({ "display": "block"});
        // $("#fullAddress-wrap em").css({ "background-position": "-28px -19px"});
    });


    $(document).on("click", function() {
        ischooseClick = false;
        showOrnot();
    });

    function showOrnot() {
        if (ischooseClick) {
            $(this).css({ "border-bottom": "none" });
            $("#city_none").css({ "display": "block" });
            $("#fullAddress-wrap em").css({ "background-position": "-28px -19px" });
        } else {
            $(this).css({ "border-bottom": "1px solid #ddd" });
            // $("#city_none").css({ "display": "none"});
            $("#fullAddress-wrap em").css({ "background-position": "-19px -19px" });
        }
    }

    //商品数量加减
    $(".reducePro").on("click", function() {
        if (parseInt($("#proNum").val()) > 1) {
            $("#proNum").val(parseInt($("#proNum").val()) - 1);
        }
        return false;
    })
    $(".addPro").on("click", function() {
            $("#proNum").val(parseInt($("#proNum").val()) + 1);
            return false;
        })
        //商品颜色的选择
    $(".slt").on("click", "a", function() {
        $(this).parent().children("a").attr({ "class": "unselected" });
        $(this).attr({ "class": "selected" });
        return false;
    });

    //加入购物车
    $(".redBtn").click(function() {
        if (Request.userName) {
            var curUser = Request.userName;
            var proObj = {};
            proObj.imgsrc = "testimg.jpg";
            proObj.proInfo = $(".name h2").html()+"-"+$(".slt a.selected").eq(0).html()+"-"+$(".slt a.selected").eq(1).html();
            proObj.proPriceNow =parseFloat( $("#salePrice").html());
            proObj.proPrice = parseFloat($("#marketPrice").html());
            proObj.proNum = parseInt($("#proNum").val());
            // console.log(proObj);
            $.ajax({
                url: "http://localhost:8080/product/GetProductsByPage_get",
                data: {
                    "pagesize": 10000,
                    "pageindex": 1
                },
                success: function(data) {
                    for (var i = 0; i < data.length; i++) {
                        var dataObj = JSON.parse(data[i].Data);
                        if (dataObj.type == "user") {
                            var dataObj = JSON.parse(data[i].Data);
                            if(dataObj.userName == curUser){
                                if(dataObj.userCart){
                                    var isHave = false;;
                                    for(var j=0; j<dataObj.userCart.length; j++){
                                        if(proObj.proInfo == dataObj.userCart[j].proInfo){
                                            dataObj.userCart[j].proNum += proObj.proNum;
                                            isHave = true;
                                        }
                                    }
                                    if(!isHave){
                                        dataObj.userCart.unshift(proObj);
                                    }
                                }else{
                                    dataObj.userCart = [];  
                                    dataObj.userCart.unshift(proObj);
                                }
                                callAddPro(data[i].Id, dataObj);
                            }
                        }
                    }
                },
                dataType: "json"
            });
            function callAddPro(userId, dataObjNew){
                var dataObjStr = JSON.stringify(dataObjNew);
                $.ajax({
                    "url": "http://localhost:8080/product/CreateUpdateProduct_post",
                    "data": {
                        "id": userId,
                        "datajson": dataObjStr
                    },
                    success: function(data){
                        if(data == 1){
                            alert("物品已加入购物车");
                            // var reqUrl = "http://localhost:8080/httpview/tianhong/index.html?userName="+userName;
                            // location.assign(reqUrl); 
                        }else{
                            alert("加入失败");
                        }
                    },
                    error: function(){
                        alert("ajax error");
                    },
                    "type": "post",
                    "datatype": "json"
                });
            }
        } else {
            alert("请先登录");
            var reqUrl = "http://localhost:8080/httpview/tianhong/logout.html";
            location.assign(reqUrl);
        }
        return false;
    });

    $(".orgBtn").click(function() {
        alert("抱歉！现在只能看不能买~~~");
        return false;
    });

});
