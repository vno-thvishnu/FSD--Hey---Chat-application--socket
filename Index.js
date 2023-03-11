// const { Socket } = require('socket.io')

const io=require('socket.io')("https://hey-chat-application-socket-io.onrender.com",{
    cors:{
        orgin: "https://fsd-hey-chat-application-frontend.vercel.app",
    },
})

let activeUsers=[];

io.on("connection",(socket)=>{

    //add new User
    socket.on("new-user-add",(newUserId)=>{
        //if user in not added previously
        if(!activeUsers.some((user)=>user.userId === newUserId))
        {
            activeUsers.push({
                userId:newUserId,
                socketId: socket.id 
            })
        }
        // console.log("Connected Users",activeUsers)

        io.emit("get-users",activeUsers)
    })




    socket.on("disconnect",()=>{
        activeUsers=activeUsers.filter((user)=>user.socketId !== socket.id)

        // console.log("user Disconnected",activeUsers)
        io.emit("get-users",activeUsers)

    })

        //send message
        socket.on("send-message",(data)=>{
            const{receiverId}=data
            const user=activeUsers.find((user)=>user.userId===receiverId)
            // console.log("sending from socket to :", receiverId)
            // console.log("Data",data)
            if(user){
                io.to(user.socketId).emit("receive-message",data)
            }
        })


// Socket.on
})