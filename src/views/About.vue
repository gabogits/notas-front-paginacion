<template>
  <div class="about">
    <h1>This is an about page</h1>

    <router-link :to="{query:{seccion: 1}}" class="btn btn-primary btn-block">1</router-link>
    <router-link :to="{query:{seccion: 2}}" class="btn btn-primary btn-block">2</router-link>
    <router-link :to="{query:{seccion: 3}}" class="btn btn-primary btn-block">3</router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  watch: {
    //para estar atentos al cambio de query
    "$route.query.seccion": {
      immediate: true, //para estar atento cuando se carque este componente, al arrancae la pagina
      handler(seccion) {
        console.log(`seccion a cambiado ${seccion}`);
      }
    }
  }
};
</script>
