const WebSocket = require('ws');
const session = require('express-session');
var express = require('express');
const http = require('http');

var app = express();
//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
});
//
// Serve static files from the 'public' folder.
//
app.use(express.static('public'));
app.use(sessionParser);

//
// Create HTTP server by ourselves.
//
const server = http.createServer(app);
// const wss = new WebSocket.Server({ port: 9090 }, server);
const wss = new WebSocket.Server({
    // verifyClient: (info, done) => {
    //     console.log('Parsing session from request...');
    //     sessionParser(info.req, {}, () => {
    //         console.log('Session is parsed!');
    //         //
    //         // We can reject the connection by returning false to done(). For example,
    //         // reject here if user is unknown.
    //         //
    //         done(true);
    //     });
    // },
    server
});
var socketsid = 0;
wss.on('connection', ws => {

    ws.on('message', message => {
        console.log('received: %s', message);
        if (message == 'reg') {
            ws.extensions = socketsid++;
            ws.send('reg' + ws.extensions);
            console.log('send:' + 'reg' + ws.extensions)
        }
        if (message.indexOf('login') != -1) {
            var loginWS = message.split('-');
            var login = parseInt(loginWS[1]);
            var loginSuccess = false;
            wss.clients.forEach(ws2 => {
                console.log("websocket--" + ws2.extensions)
                if (ws2.extensions == login) {
                    ws.send('loginSuccess')
                    ws2.send('loginSuccess')
                    loginSuccess = true;
                }
            })
            if (!loginSuccess) {
                ws.send('二维码已过期,请刷新页面再试')
                console.log('send:' + '二维码已过期')
            }

        }
    });

});
server.listen(9090, () => console.log('Listening on http://localhost:9090'));