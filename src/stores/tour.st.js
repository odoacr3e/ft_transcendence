import { useSockStore } from './sock.st';
import { defineStore }  from 'pinia';

export const useTourStore = defineStore('tour', {
	state: () => ({
		pwd: null,
        status: null,
        error: null
	}),

	actions: 
	{
        createTour(tourName)
		{
            const socket = useSockStore().socket;
			socket.emit("create_tournament", {name: tourName}, ({resp}) => {
				if (resp.log.status == "OK")
				{
					this.pwd = resp.tournament_pwd;
					socket.off('update_tournament'); //meglio metterla in una funziona a fine torneo
					socket.on('update_tournament', ({resp}) => { if (!resp.log) { this.error = resp.log.error; } this.status = resp.round });
					return (resp);
				}
			});
		}
	}
})