<template>
  <div
    class="todo-item"
    style="display: flex; justify-content: space-between; margin-bottom: 10px"
  >
    <label style="flex: 1">
      <input type="checkbox" v-model="checked" />
      <span :class="{ completed: checked }">{{ todo.text }}</span>
    </label>
    <button @click="removeTodo">Delete</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Todo {
  text: string
  completed: boolean
}

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'delete', todo: Todo): void
}>()

const checked = ref(props.todo.completed)

const removeTodo = () => {
  emit('delete', props.todo)
}
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: gray;
}
</style>
