<template>
  <div id="app">
    <keep-alive include="makeFriend">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'App',
    beforeCreate: function () {
      this.isUserId();
    },
    created: function () {

    },
    mounted: function () {

    }
  }
</script>

<style>

</style>
