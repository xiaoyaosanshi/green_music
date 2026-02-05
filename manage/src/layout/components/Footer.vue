<template>
  <div class="footer-container">
    <div class="footer-content">
      <span>© 2024 Green Music 后台管理系统</span>
      <span>|</span>
      <span>系统运行正常</span>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.footer-container {
  height: $footer-height;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-color;
  border-top: 1px solid $border-color-lighter;
  
  .footer-content {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}
</style>

