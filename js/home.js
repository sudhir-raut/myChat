var socket = io.connect("127.0.0.1:2222");
var myName;
var onlineUsers=[{userName:"",sockId:""}];
var userNo;
socket.emit("uname");
socket.on("send_name",function(name){
    myName = name;
    document.getElementById("dropdown").innerHTML =  (myName+document.getElementById("dropdown").innerHTML);
    socket.emit("update");

});

function privateMessage(recieverNo){
    var id = "id" + recieverNo;
    var reciever = document.getElementById(id).innerText;
    socket.emit("create chat", myName, reciever);

}

function sendMessage(sender,reciever){
    console.log("name:",sender,reciever);
    var socketIdS,socketIdR;
    for(var i=0; i < onlineUsers.length; i++){
        if(onlineUsers[i].userName == sender){
            socketIdS = onlineUsers[i].sockId;
        }
        if(onlineUsers[i].userName == reciever){
            socketIdR = onlineUsers[i].sockId;
        }
    }
    console.log(socketIdS,socketIdR);
    var rId = "sender_" + socketIdR;
    var reciever = document.getElementById(rId).value;
    var msg = document.getElementById(reciever).value;
    document.getElementById(reciever).value="";
    document.getElementById(socketIdR).innerHTML = ('<div class="chat">' + "<b style='color: darkgreen'>" + msg + "</b>" + document.getElementById(socketIdR).innerHTML + '</div>');
    socket.emit("send message", socketIdS, socketIdR, myName,reciever,msg);

}

function close() {
    this.parentNode.parentNode.removeChild(this.parentNode);
    return false;
}


function logout() {
    socket.emit("logoutE", myName);
    window.open('html/login.html', '_self');
}

function sendM() {
    var data = document.getElementById("msg_id").value;
    document.getElementById("msg_id").value="";
    socket.emit("msg_allE", data, myName);
}




socket.on("all_users",function (connectedUsers) {
    onlineUsers = connectedUsers;
    document.getElementById("users").innerHTML = '';
    for (var i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i] != null && connectedUsers[i].userName != myName) {
            //document.getElementById("users").innerHTML = ( "<br />" + "<a onclick='privateMessage(" + i + ");' style='cursor: pointer;cursor: hand;'> <b id ='id" + i + "'>" + connectedUsers[i].userName + "</b></a>" + document.getElementById("users").innerHTML);
            document.getElementById("users").innerHTML = ( "<div class='user'>" + "<a onclick='privateMessage(" + i + ");'><img height='30' width='30' src='images/images.jpg'/> <span id ='id" + i + "'>" + connectedUsers[i].userName + "</span></a></div>" + document.getElementById("users").innerHTML);
        }
        if (connectedUsers[i].userName == myName) {
            userNo = i;
        }
    }
} );
var msg;


socket.on("send socket id", function (socketIdR, socketIdS, reciever,msgs) {
    if(!document.getElementById(socketIdR)) {
        document.getElementById("Pchat").innerHTML = ("<div class='pop-up'><h1>" + reciever + "<span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x</span></h1><div id='" + socketIdR + "'></div><div class='pInput'><input type='text' class='text' id='" + reciever + "'/> <input type='hidden' id='sender_" + socketIdR + "' value='" + reciever + "'/>  <button onclick=\"sendMessage('" + myName + "','" + reciever + "');\">Send</button></div></div>" + document.getElementById("Pchat").innerHTML)
    }
    if(msgs != "") {
        var msgs2Display;
        if(msgs.length < 3){
            msgs2Display = msgs.length;
        }
        else {
            msgs2Display = 3;
        }

        for (var i = (msgs.length-msgs2Display); i < msgs.length; i++) {
            if (msgs[i].from == myName) {
                document.getElementById(socketIdR).innerHTML = ("<div class='chat'><b style='color: darkgreen'>" + msgs[i].message + "</b>" + document.getElementById(socketIdR).innerHTML + "</div>");
            }
            else {
                document.getElementById(socketIdR).innerHTML = ("<div class='chat'><b style='color: darkred'>" + msgs[i].message + "</b>" + document.getElementById(socketIdR).innerHTML + "</div>");
            }
        }
    }
});


socket.on("get message", function (socketIdS, socketIdR, sender, reciever,msgs) {
    if(!document.getElementById(socketIdS)) {
        document.getElementById("Pchat").innerHTML = ("<div class='pop-up'><h1>" + sender + "<span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x</span></h1><div id='" + socketIdS + "' ></div><div class='pInput'><input type='text' class='text' id='" + sender + "'/><input type='hidden' id='sender_" + socketIdS + "' value='" + sender + "'/><button onclick=\"sendMessage('" + myName + "','" + sender + "')\">Send</button></div></div>" + document.getElementById("Pchat").innerHTML);
    }
    /*if(msgs != "") {

     for (var i = (msgs.length-3); i < msgs.length; i++) {
     if (msgs[i].from == myName) {
     //console.log("send:",msgs[i].from);
     document.getElementById(socketIdS).innerHTML = ("<div class='chat'><b style='color: darkgreen'>" + msgs[i].message + "</b>" + document.getElementById(socketIdS).innerHTML + "</div>");
     }
     else {
     //console.log("rec:",msgs[i].message);
     document.getElementById(socketIdS).innerHTML = ("<div class='chat'><b style='color: darkred'>" + msgs[i].message + "</b>" + document.getElementById(socketIdS).innerHTML + "</div>");
     }
     }
     }*/

});


socket.on("get_message", function (recieverId, senderId, sender, msg) {
    var chatId = senderId;
    document.getElementById(chatId).innerHTML = ('<div class="chat">' + "<b style='color: maroon'>" + msg + "</b>" + document.getElementById(chatId).innerHTML + '</div>');
});


socket.on("msg_all", function (data, userName) {
    if (userName == myName) {
        document.getElementById("chat").innerHTML = ('<div class="chatAll">' + "<hr/> Me : " + data + document.getElementById("chat").innerHTML) + '</div>'
    }
    else {
        document.getElementById("chat").innerHTML = ('<div class="chatAll">' + "<hr/>" + userName + " : " + data + document.getElementById("chat").innerHTML) + '</div>'
    }
});
