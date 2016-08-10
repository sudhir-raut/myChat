var socket = io.connect("127.0.0.1:2222");
var userName;
var password;

function save() {
    var userName = document.getElementById("username").value;
    var pwd1 = document.getElementById("pwd1").value;
    var pwd2 = document.getElementById("pwd2").value;
    if(pwd1 != pwd2)
    {
        alert("Password doesn't match!!!");
        window.open('signup.html','_self');
    }
    else{
        socket.emit("save",userName,pwd1);
        userName = '';
        pwd1 = '';
        pwd2 = '';
    }

}
socket.on("alert",function (alertMessage,ret_val) {
    if(ret_val == 1){
        alert(alertMessage);
        window.open('signup.html','_self');
    }
    else {
        alert(alertMessage);
        window.open('login.html','_self');
    }

});
