<template>
  <div class="hello">

  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {}
    },
    created: function () {
      if (sessionStorage.getItem('loginNum') == undefined) {
        if (this.WX_UserId != null && this.WX_UserId != '') {
          this.$router.push({
            path: '/love/makeFriend'
          });
        }
      }else{
        sessionStorage.removeItem('loginNum');
        WeixinJSBridge.call('closeWindow');
      }
    },
    mounted: function () {

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
