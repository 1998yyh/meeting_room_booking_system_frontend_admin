<template>
  <router-view v-slot="{ Component }">
     <!-- <keep-alive :exclude="['updateInfo']"> -->
        <component :is="Component" />
     <!-- </keep-alive> -->
  </router-view>
</template>

<script setup lang="ts">


</script>