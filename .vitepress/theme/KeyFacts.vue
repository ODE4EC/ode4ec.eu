<template>
  <dl class="key-facts">
    <slot />
  </dl>
</template>

<style scoped>
.key-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  margin: 0;
}
</style>
