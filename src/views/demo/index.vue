<template>
  <h1>demo</h1>
  <button @click="onClick">增肌</button>
  <div>{{ num }}</div>
  <div>{{ state.count }}</div>
</template>

<script setup name="Demo">
import { ref, reactive } from 'vue'
import useDemo from './useDemo.js'

const num = ref(0)
const state = reactive({
  count: 0
})

useDemo(num)

const onClick = () => {
  num.value += 1
  state.count += 1
}
</script>

<style lang="less"></style>
