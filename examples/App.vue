<template>
  <div>
    <div style="width: 600px; margin: 100px auto">
      <div style="display: flex; justify-content: center">
        <img
          width="80px"
          style="margin-right: 10px"
          src="https://raw.githubusercontent.com/linzhe141/vue-change-marker/refs/heads/main/logo.jpg"
          alt="logo"
        />
      </div>
      <TodoList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TodoList from './components/TodoList.vue'
</script>
