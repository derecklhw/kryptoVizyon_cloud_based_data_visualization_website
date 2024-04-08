<template>
  <div class="flex flex-col h-screen">
    <Navbar />
    <main class="flex-grow">
      <div class="flex flex-col h-full bg-slate-100">
        <div class="flex-grow basis-1/3 border-t-2 border-slate-950">
          <h1 class="text-lg px-4 py-3 font-medium">Overview</h1>
          <div class="flex sm:flex-row flex-col">
            <ZoomableTimeSeries
              v-for="symbol in symbols"
              :key="symbol.name"
              :crypto="symbol.name"
            />
          </div>
        </div>
        <div class="flex-grow basis-2/3 border-y-2 border-slate-950">
          <div class="flex justify-between items-center">
            <h1 class="text-lg px-4 py-3 font-medium">
              {{ selectedSymbol.name }} Performance
            </h1>
            <Dropdown
              v-model="selectedSymbol"
              :options="symbols"
              optionLabel="name"
              class="m-4"
            />
          </div>
          <div class="flex sm:flex-row flex-col mx-4 h-5/6 items-center">
            <Candlestick />
            <Pie />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import ZoomableTimeSeries from "./components/ZoomableTimeSeries.vue";
import Candlestick from "./components/Candlestick.vue";
import Pie from "./components/Pie.vue";
import Dropdown from "primevue/dropdown";
import { ref } from "vue";
import { SYMBOL } from "./types";

const symbols: SYMBOL[] = [
  { name: "BTC" },
  { name: "ETH" },
  { name: "BNB" },
  { name: "SOL" },
  { name: "DOGE" },
];
const selectedSymbol = ref<SYMBOL>(symbols[0]);
</script>

<style scoped></style>
