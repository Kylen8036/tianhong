//登录按钮鼠标悬浮变背景
$("#login_btn").hover(
    function() {
        $(this).css({ "background-position": "0 -41px" });
    },
    function() {
        $(this).css({ "background-position": "0 0" });
    }
);
//注册鼠标悬浮下划线
$(".registerBtn").hover(
    function() {
        $(this).css({ "text-decoration": "underline" });
    },
    function() {
        $(this).css({ "text-decoration": "none" });
    }
);

//登录判断
$("#login_btn").click(function() {
	var userName = $("#userName").val();
	var password = $("#user_pwd").val();
	var userFlag = false;

	$.ajax({
        url:"http://localhost:8080/product/GetProductsByPage_get",
        data:{
            "pagesize": 200,
            "pageindex": 1
        },
        success:function(data){
            console.log(data);

            for(var i=0;i<data.length;i++){
                var dataObj=JSON.parse(data[i].Data);
                if(dataObj.type == "user"){
                    if(dataObj.userName == userName){
                        userFlag = true;
                        if(dataObj.pwd == password){
                        	var reqUrl = "http://localhost:8080/httpview/tianhong/index.html?userName="+userName;
                        	location.assign(reqUrl);
                        }else{
                        	alert("密码错误！");
                        }
                    }
                }
            }
            if(!userFlag){alert("无此用户！")}
        },
        dataType:"json"
    });
});
