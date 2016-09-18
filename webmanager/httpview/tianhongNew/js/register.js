/**
 * Created by Administrator on 2016/9/9.
 */
var userCount;
var userNameFlag = true;
var userPwdFlag = true;
var userDataFlag = true;
var firstFocus = true;

//失去焦点是判断用户名是否可用
$("#userName").blur(function(){
    checkJsonData($("#userName").val());
});
//检查是否与数据库中数据冲突
function checkJsonData(userName){
    var userFlag = true;
    var counter;
    $.ajax({
        url:"http://localhost:8080/product/GetProductsByPage_get",
        data:{
            "pagesize": 10000,
            "pageindex": 1
        },
        success:function(data){
            console.log(data);

            for(var i=0;i<data.length;i++){
                if(data[i].Id == "counter"){
                    counter = i;
                }
                //把data 里面的string 主动转成对象；
                var dataObj=JSON.parse(data[i].Data);
                if(dataObj.type == "user"){
                    if(dataObj.userName == userName){
                        userFlag = false;
                    }
                }
            }
            callback(userFlag, JSON.parse(data[counter].Data).userCount);
        },
        dataType:"json"
    });
}
//回调函数
function callback(para, userCountData){
    if(para){  //如果用户名可用
        userCount = userCountData+1;
    }else{
        userNameFlag = false;
        alert("用户名已被占用！");
    }
}
//用户名获取焦点value为空
$("#userName").focus(function(){
    if(firstFocus){
        $(this).attr({"value": ""});
        firstFocus = false;
    }
});
$("#userName").blur(function(){
    if($(this).attr("value") == ""){
        $(this).attr({"value": "邮箱/用户名/手机号"});
        firstFocus = true;
    }
});

//失去焦点是判断两次密码是否一致
$("#confirm_pwd").blur(function(){
    if($("#pwd").val() != $(this).val()){
        userPwdFlag = false;
        alert("两次密码不一致");
    }
});

//检查是否同意协议
function checkAgree(){
    var chooseAgree = $("#agree").is(":checked");
    if(!chooseAgree){
        $("#submitBtn").attr("disabled", "true");
    }else{
        $("#submitBtn").removeAttr("disabled");
    }
}
$("#agree").click(function(){
    checkAgree();
});
//查看是否填写完整
function checkBlank(){
    var $inputTxt = $("input[type=\"text\"]");
    $inputTxt.each(function(){
        if($(this).val() == ""){
            console.log("信息不完整！");
            userDataFlag = false;
        }
    });
}
//点击判断提交
$("#submitBtn").click(function(){
    var userName = $("#userName").val();
    var pwd = $("#pwd").val();
    var confirmPwd = $("#confirm_pwd").val();
    var phone = $("#phone").val();

    checkBlank();
    if(userNameFlag && userPwdFlag && userDataFlag){        //信息填写完整才会添加
        var dataObj = {
            "type": "user",
            "userName": userName,
            "pwd": pwd,
            "confirmPwd": confirmPwd,
            "phone": phone
        }
        var dataObjStr = JSON.stringify(dataObj);
        $.ajax({
            "url": "http://localhost:8080/product/CreateUpdateProduct_post",
            "data": {
                "id": "user_"+userCount,
                "datajson": dataObjStr
            },
            success: function(data){
                if(data == 1){
                    addUser();
                    alert("用户已成功注册");
                    var reqUrl = "http://localhost:8080/httpview/tianhong/index.html?userName="+userName;
                    location.assign(reqUrl);
                }else{
                    alert("注册失败");
                }
            },
            error: function(){
                alert("ajax error");
            },
            "type": "post",
            "datatype": "json"
        });
    }
});

function addUser(){
    var dataObj = {
        "userCount": userCount,
    }
    var dataObjStr = JSON.stringify(dataObj);
    $.ajax({
        "url": "http://localhost:8080/product/CreateUpdateProduct_post",
        "data": {
            "id": "counter",
            "datajson": dataObjStr
        },
        success: function(data){
            if(data == 1){
                console.log("修改成功");
            }else{
                console.log("修改失败");
            }
        },
        error: function(){
            alert("ajax error");
        },
        "type": "post",
        "datatype": "json"
    })
}