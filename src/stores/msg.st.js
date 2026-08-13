import { taskApi }			from '../router/api/task.api';
import { defineStore }		from 'pinia';

export const useMsgStore = defineStore('msg', {
	state: () => ({
		msgRecevied: new Set(),
		error: null
	}),

	actions: 
	{
		async getMsg()
		{
			try {
				const resp = await taskApi.msglist();
				Array.from(resp).slice().reverse().forEach((m, index) => { //Array.from(resp).slice(-10).reverse().forEach(m => this.msgRecevied.add(m));
					if (index < 10)
						this.msgRecevied.add(m);
				})
			}
			catch (err) { this.error = err.message; }
		},

        add(msg) {
            msg.status = "not read";
				if (this.msgRecevied.size === 10)
				{
					const firstRead = Array.from(this.msgRecevied).find(m => m.status === "read");
					if (firstRead) { this.msgRecevied.delete(firstRead); }
				}
				this.msgRecevied.add(msg);
				this.allert = true;
		},

		clear() { this.msgRecevied.clear(); }
	}
})