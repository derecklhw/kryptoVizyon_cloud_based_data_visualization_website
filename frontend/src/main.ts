import { createApp } from 'vue'
import './style.css'
import VueApexCharts from "vue3-apexcharts";
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import App from './App.vue'

const app = createApp(App)
app.use(VueApexCharts)
app.use(PrimeVue)
app.mount('#app')