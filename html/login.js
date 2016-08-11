var socket = io.connect("127.0.0.1:2222");
var userName;
var password;
function signup(){
    //socket.emit("sign up");
    window.open('signup.html','_self');
}

window.onload = function () {
    document.getElementById("pwd").addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementById("btn").click();
        }
    });
}

function login() {
    userName = document.getElementById("username").value;
    password = document.getElementById("pwd").value;
    socket.emit("loginE", userName, password);
    console.log(userName + " Connected");

    socket.on("alert",function(alertMessage,ret_val){
        if(ret_val == 1) {
            //socket.emit('uname',userName);
            window.open('home.html', '_self');

        }
        else {
            alert(alertMessage);
        }
    });

}
