import {WebSocket} from 'ws'

export class ChatService{
    pingInterval = 5000;
    connections = []

    constructor(){
        setInterval(() => {
            for (const connection of this.connections){
                if (connection.ws.readyState === WebSocket.OPEN) {
                    connection.ws.ping(); 
                }
            }            
          }, this.pingInterval);
    }

    pushConnection(user, ws){
        this.connections.push({user, ws})
    }

    getConnectionByUser(user){
        return this.connections.find(connection => connection.user === user)
    }

    isUserAlreadyRegistered(user){
        return !!this.connections.find(connection => connection.user === user);
    }

    getUser(req){
        const url = new URL(req.url, `https://${req.headers.host}`);
        return url.searchParams.get('user');
    }

    sendOnlineUsers(){
        this.connections.forEach((connection)=>{        
        const onlineUsers = this.connections.map(connection => connection.user).filter(user => user !== connection.user)
            connection.ws.send(JSON.stringify({action: 'online-users', onlineUsers}))
        })
    }

    removeConnection(ws){                
        const connectionIndex = this.connections.indexOf(connection => connection.ws === ws)
        const removedConnection = this.connections.splice(connectionIndex, 1)
        console.log(`${removedConnection[0].user} Connection closed, sending users online to all users`);
        this.sendOnlineUsers()
    }
}