<template>
  <div class="flex justify-center items-center border">
    <apexchart
      type="pie"
      width="550"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed } from "vue";
import { SentimentDataPoint } from "../types";

const props = defineProps<{
  sentiment: SentimentDataPoint | null;
}>();

const chartOptions = {
  chart: {
    width: 550,
    type: "pie",
  },
  labels: ["Positive", "Negative", "Neutral"],
  colors: ["#65D39A", "#FF6062", "#FEEA5C"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

const series = computed(() => {
  return props.sentiment
    ? [
        props.sentiment.positive,
        props.sentiment.negative,
        props.sentiment.neutral,
      ]
    : [];
});
</script>
<style lang=""></style>
