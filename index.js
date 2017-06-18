const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9090 });
const sockets = new Map();
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