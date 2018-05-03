<template>
  <section class="container">
    <ul>
      <li><nuxt-link :to="{'name': 'blob'}">blob</nuxt-link></li>
      <li><nuxt-link :to="{'name': 'displacement'}">displacement</nuxt-link></li>
      <li><nuxt-link :to="{'name': 'mask'}">mask</nuxt-link></li>
      <li><nuxt-link :to="{'name': 'blobMask'}">blob mask</nuxt-link></li>
    </ul>
  </section>
</template>

<script>
export default {
  mounted() {
  }
}

</script>

<style>

</style>
