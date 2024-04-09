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
const chartOptions = {
  chart: {
    width: 550,
    type: "pie",
  },
  labels: ["Positive", "Negative", "Neutral"],
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
const series = [44, 55, 13];
</script>
<style lang=""></style>
