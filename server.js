var express =require('express');
var app =express();
var fs =require('fs');
var path =require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(2222,function(){
    console.log("Server is running on 127.0.0.1:2222");
});

var users=[{userName:'sudhir',password:'sud'},{userName:'mahesh',password:'mah'},{userName:'vikas',password:'vik'},{userName:'gaurav',password:'gau'},{userName:'rahul',password:'rah'}];
var html_dir=__dirname+'/html';
app.use(express.static(path.join(__dirname,'html')));
app.get('/',function(req,res) {
    res.sendFile(html_dir + '/login.html');
});

var uName;
var connectedUsers=[];
var clientNo=0;
var socketId;

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}


io.on('connection', function (socket) {
    socket.on('loginE', function (userName,password) {
        var i;
        for(i=0; i<users.length; i++) {
            if (users[i].userName == userName && users[i].password == password) {
                socket.emit('chat', "true");
                uName = userName;
                console.log(userName + " Connected");
                break;
            }
        }
        if(i >= users.length)
        {
            socket.emit('chat',"false");
        }
    });

    socket.on("logoutE", function(userName){
        var i = connectedUsers.findIndex(x => x.userName == userName);
        if(i != -1){
            connectedUsers.splice(i, 1);
        }
        io.emit("all_users",connectedUsers);
        console.log(userName + " has been logged out!!!");
    });



    socket.on("uname",function(){
        socketId=socket.id;
        var userData = {
            userName: uName ,
            sockId: socketId
        };
        connectedUsers[clientNo++] = userData;
        socket.emit('send_name',uName);
    });

    socket.on('msg_allE', function (data,userName) {

            io.emit('msg_all',data,userName);
    });

    socket.on("update",function () {
        io.emit("all_users",connectedUsers);
    });

    socket.on("send message",function (senderId,recieverId,sender,msg) {
        var temp=recieverId;
            socket.broadcast.to(recieverId).emit("get_message",temp,senderId,sender,msg);

    });

    socket.on("create chat",function(sender,reciever){
        for(var i = 0; i<connectedUsers.length; i++){
            if(connectedUsers[i] != null){
                if(connectedUsers[i].userName == reciever){
                    socket.emit("send socket id",connectedUsers[i].sockId,socket.id,reciever);
                    socket.broadcast.to(connectedUsers[i].sockId).emit("get message",socket.id,connectedUsers[i].sockId,sender);
                    break;
                }
            }
        }
    });

    socket.on("sign up",function(){
       app.get('/signup',function(req,res){
          res.sendFile(html_dir+'/signup.html');
       });
    });


    socket.on("save",function (userName,password) {

        for(var i = 0; i < users.length; i++) {
            if (users[i].userName == userName) {
                socket.emit("user exists", "true");
                break;
            }
        }
        if (i >= users.length){
            var userData = {
                userName: userName,
                password: password
            };
            users.push(userData);
            socket.emit("user exists","false");

        }

    });
});

