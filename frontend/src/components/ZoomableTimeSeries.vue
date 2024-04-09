<template>
  <div id="zoomable-time-series" class="flex-1 m-2 border">
    <apexchart type="area" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { CryptoDataPoint } from "../types";

const props = defineProps<{
  crypto: string;
  historicalData: CryptoDataPoint[];
  predictions: CryptoDataPoint[];
}>();

const chartOptions = {
  chart: {
    type: "area",
    stacked: false,
    zoom: {
      type: "x",
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: "zoom",
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  title: {
    text: props.crypto,
    align: "left",
    offsetX: 20,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toFixed(0);
      },
    },
    title: {
      text: "Price",
    },
  },
  xaxis: {
    type: "datetime",
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val: number) {
        return val.toFixed(2);
      },
    },
  },
};

// Convert historical data and predictions to series format
const series = computed(() => {
  // Process historical data
  const historicalSeries = {
    name: "historical",
    data: props.historicalData.map((dataPoint) => {
      return {
        x: new Date(dataPoint.timestamp * 1000),
        y: [dataPoint.open, dataPoint.high, dataPoint.low, dataPoint.close],
      };
    }),
  };

  // Process predictions
  const predictionSeries = {
    name: "prediction",
    data: props.predictions.map((dataPoint) => {
      return {
        x: new Date(dataPoint.timestamp * 1000),
        y: dataPoint.close,
      };
    }),
  };

  return [historicalSeries, predictionSeries];
});
</script>
<style lang=""></style>
