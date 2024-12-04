<template>
  <div class="todo-list">
    <h2>My To-Do List</h2>
    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="New task" />
    <div v-for="todo in todos" :key="todo.text">
      <TodoItem :todo="todo" @delete="deleteTodo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

interface Todo {
  text: string
  completed: boolean
}

const newTodo = ref('')
const todos = ref<Todo[]>([
  { text: 'Learn Vue 3', completed: false },
  { text: 'Write some code', completed: false },
])

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({ text: newTodo.value, completed: false })
    newTodo.value = ''
  }
}

const deleteTodo = (todo: Todo) => {
  todos.value = todos.value.filter((t) => t !== todo)
}
</script>

<style scoped>
.todo-list {
  margin: 0 auto;
}

input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px 0;
}

button {
  padding: 5px 10px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: darkred;
}
</style>
