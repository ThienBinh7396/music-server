var io = null;

let helper = require('../helpers/helper');

const model = require('../models');

const { Users } = model;


function connection(socket) {
    console.log("Connected: " + socket.id);

    socket.on('mping', (data) => {
        io.sockets.emit(`mpong/${helper.encryptBase64(data.to)}`, data);
    });

    socket.on('mpong', (data) => {
        io.sockets.emit(`mping/${helper.encryptBase64(data.to)}`, data);
    })

    socket.on('init', (data) => {

        console.log(helper.decryptBase64(data));
        socket.uuser = JSON.parse(helper.decryptBase64(data));

    });


    socket.on('disconnect', function() {
        console.log("Disconnect: " + socket.id);
        console.log(socket.uuser);
        if (socket.uuser) {
            if (socket.uuser.type == 'client') {
                Users.update({
                    latestOnline: Date.now()
                }, {
                    where: {
                        id: socket.uuser.id
                    }
                });
            }
        }
    })
}

function connect(server) {
    if (io != null) {
        try {
            io.close();

        } catch (err) {
            console.log(err);
        }

    }

    io = require('socket.io').listen(server);
    console.log("yyyy");

    io.sockets.on('connection', connection);
}

function send(event, data) {
    if (io) {
        io.sockets.emit(event, data);
    }
}

module.exports = {
    io: io,
    connect: connect,
    send: send
}