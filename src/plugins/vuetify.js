import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        dark: false,
        themes: {
            light: {
                appbar: "#1976D2",
                primary: '#1976D2',
                footer: "#eeeeee",
            },
            dark: {
                appbar: "#272727",
                primary: "#2196F3",
                footer: "#313131",
            },
            options: {
                themeCache: {
                    get: key => localStorage.getItem(key),
                    set: (key, value) => localStorage.setItem(key, value),
                },
            },
        },
    },
});
