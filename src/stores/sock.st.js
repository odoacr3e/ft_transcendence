import { io }				from 'socket.io-client'
import { useMsgStore }      from './msg.st';
import { defineStore }		from 'pinia';
import { listenGameSocket } from '../scripts/Data/SocketLink';

export const useSockStore = defineStore('sock', {
	state: () => ({
		usersOnline: new Set(),
		socket: null,
		socketReady: false
	}),

	getters: 
	{
		isUserOnline: (state) => (userId) => state.usersOnline.has(userId)
	},

	actions: 
	{
		connect()
		{
			if (this.socket) { return; }

			console.log("connessione al socket!");			
			this.socket = io({ withCredentials: true });
			
			listenGameSocket(this.socket);

			this.socket.on('connect', () => { console.log(`[sock.st] -> [connect]: Ricevuto connect: Socket id: ${this.socket.id}`); })
			this.socket.on('ready',				()			 =>	{ this.socketReady = true; });
			this.socket.on('disconnect',		()			 =>	{ this.socketReady = false; });
			this.socket.on('friend:online',		({ userId }) =>	{ this.usersOnline.add(userId); });
			this.socket.on('friend:offline',	({ userId }) =>	{ this.usersOnline.delete(userId); });
			this.socket.on('notification',		( msg )		 =>	{ useMsgStore().add(msg) });
		},

		disconnect() 
		{
			if (this.socket) {
				this.socket.disconnect();
				this.socket = null;
			}
			this.socketReady = false;
            this.usersOnline.clear();
		}
	}
})