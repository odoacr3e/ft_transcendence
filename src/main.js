import { createApp } 	from 'vue';
import { createPinia }	from 'pinia';
import { createI18n }	from 'vue-i18n';
import App				from './App.vue'
import router			from './router'
import 						 '@fontsource-variable/inter'
import { italian }		from './lang/italian.js'
import { english }		from './lang/english.js'


const app = createApp(App);
const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "it",
    messages :
    {
        "it" : italian.messages,
        "en" : english.messages
    }
});

app.use(createPinia());
app.use(router);
app.use(i18n);
await router.isReady();
app.mount('#app');