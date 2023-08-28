const express = require('express');
const app = express();
const server = require('http').createServer(app);


const cors = require('cors');
app.use(cors());


const io = require('socket.io')(server , {
    cors : {
        origin : '*',       //allows access from all origins
        methods : ['GET' , 'POST']
    }
})

io.on('connection' , (socket) => {
    //defining socket handlers
    socket.emit('me' , socket.id);

    socket.on('disconnect' , () => {
        socket.broadcast.emit('call ended')
    })

    socket.emit('calluser' , ({userToCall , signalData , from, name}) => {
        io.to(userToCall).emit('calluser', {signal : signalData , from , name});
    } )

    socket.on('answercall' , (data) => {
        io.to(data.to).emit('callaccepted' , data.signal);
    })
})


app.listen(3002 , () =>{
    console.log('server running');
});

