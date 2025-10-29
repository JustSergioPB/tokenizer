<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <ULink :to="localePath('/')" class="tile-sm">
    <img src="/spark-logo.png" alt="logo" class="size-8 rounded-md" >
    <span class="heading-6 text-gray-900 dark:text-white">Tokenizer</span>
  </ULink>
</template>
