<template>
  <div class="container">
    <h1>login</h1>
    <form @submit.prevent="login">
      <input type="text" class="form-control my-2" placeholder="email" v-model="usuario.email">
      <input type="text" class="form-control my-2" placeholder="pass" v-model="usuario.pass">
      <b-button class="btn-block" type="submit">Acceder</b-button>
    </form>
    <div v-if="mensaje !== ''">
      <p>{{mensaje}}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      usuario: {
        email: "",
        pass: ""
      },
      mensaje: ""
    };
  },
  methods: {
    ...mapActions(["guardarUsuario"]),

    login() {
      console.log(this.usuario);
      this.axios
        .post("/login", this.usuario)
        .then(res => {
          console.log(res.data);
          const token = res.data.token;
          this.guardarUsuario(token);
          this.$router.push({ name: "notas" });
        })
        .catch(e => {
          console.log(e.response);
          this.mensaje = e.response.data.mensaje;
        });
    }
  }
};
</script>

