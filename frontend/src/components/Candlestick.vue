<template>
  <div class="border">
    <apexchart
      type="candlestick"
      height="400"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { CryptoDataPoint } from "../types";

const props = defineProps<{
  historicalData: CryptoDataPoint[] | null;
}>();

const chartOptions = {
  chart: {
    type: "candlestick",
    height: 400,
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
};

// Convert historical data to series format
const series = computed(() => {
  if (!props.historicalData) return [];

  return [
    {
      data: props.historicalData.map((dataPoint: CryptoDataPoint) => ({
        x: new Date(dataPoint.timestamp * 1000),
        y: [dataPoint.open, dataPoint.high, dataPoint.low, dataPoint.close],
      })),
    },
  ];
});
</script>
<style lang=""></style>
