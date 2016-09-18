//获取地址栏的数据
function UrlSearch()
{
    var name,value;
    var str=location.href; //取得整个地址栏
    var num=str.indexOf("?")
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        }
    }
}
var Request=new UrlSearch(); //实例化
var curAdmin = Request.adminName; //获取登录的用户名
if(!curAdmin){  //若未登录直接访问则会跳到登录页面
    window.location.assign("sign-in.html");
}else{ //右上角显示用户名
    $("#adminUserName").html(curAdmin);
}
//登录成功之后，点击主页为登录的状态
$("#home").click(function(){
    window.location.assign("index.html?adminName="+curAdmin);
});
$("#users").click(function(){
    window.location.assign("users.html?adminName="+curAdmin);
});
