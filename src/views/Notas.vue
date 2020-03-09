<template>
  <div class="container">
    <h1>Notas</h1>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="mensaje.color"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >{{mensaje.texto}}</b-alert>

    <form @submit.prevent="editarNota(notaEditar)" v-if="editar">
      <h3>Editar nota</h3>
      <input type="text" class="form-control my-2" placeholder="nombre" v-model="notaEditar.nombre">
      <input
        type="text"
        class="form-control my-2"
        placeholder="descripcion"
        v-model="notaEditar.descripcion"
      >
      <b-button class="btn-warning my-2 mx-2" type="submit" @click="editar = false">Cancelar</b-button>
      <b-button class="my-2" type="submit">Editar</b-button>
    </form>

    <form @submit.prevent="agregarNota()" v-if="!editar">
      <h3>Agregar nueva nota</h3>
      <input type="text" class="form-control my-2" placeholder="nombre" v-model="nota.nombre">
      <input
        type="text"
        class="form-control my-2"
        placeholder="descripcion"
        v-model="nota.descripcion"
      >
      <b-button class="btn-success my-2 btn-block" type="submit">Agregar</b-button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Fecha</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in notas" :key="index">
          <th scope="row">{{item._id}}</th>
          <td>{{item.nombre}}</td>
          <td>{{item.descripcion}}</td>
          <td>{{item.date}}</td>
          <td>
            <b-button class="btn-warning btn-sm mx-2" @click="activarEdicion(item._id)">Actualizar</b-button>
            <b-button class="btn-danger btn-sm mx-2" @click="eliminarNota(item._id)">Eliminar</b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': paginaActual ===1 }">
          <router-link class="page-link" :to="{ query: { pagina:paginaActual-1}}">Anterior</router-link>
        </li>
        <li
          class="page-item"
          v-for="(item, index) in cantidadPaginas"
          :key="index"
          :class="{'active':paginaActual === index+1}"
        >
          <router-link :to="{ query: { pagina:index+1}}" class="page-link" href="#">{{index+1}}</router-link>
        </li>
        <li class="page-item" :class="{'disabled': paginaActual === cantidadPaginas }">
          <router-link class="page-link" href="#" :to="{ query: { pagina:paginaActual+1}}">Siguiente</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      totalNotas: 0,
      limite: 5,
      paginaActual: 1,
      notas: [],
      dismissSecs: 5,
      dismissCountDown: 0,
      mensaje: { color: "", texto: "" },
      nota: {
        nombre: "",
        descripcion: ""
      },
      editar: false,
      notaEditar: {}
    };
  },
  computed: {
    ...mapState(["token"]),
    cantidadPaginas() {
      return Math.ceil(this.totalNotas / this.limite);
    }
  },
  watch: {
    "$route.query.pagina": {
      immediate: true,
      handler(pagina) {
        pagina = parseInt(pagina) || 1;
        this.paginacion(pagina);
        this.paginaActual = pagina;
      }
    }
  },
  /*
  created() {
    this.listarNotas();
  },
  */
  methods: {
    paginacion(pagina) {
      let config = {
        headers: {
          token: this.token
        }
      };
      let skip = (pagina - 1) * this.limite;

      this.axios
        .get(`/nota?limite=${this.limite}&skip=${skip}`, config)
        .then(res => {
          this.notas = res.data.notaDB;
          this.totalNotas = res.data.totalNotas;
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    listarNotas() {
      let config = {
        headers: {
          token: this.token
        }
      };
      this.axios
        .get("/nota", config)
        .then(res => {
          console.log(res.data);
          this.notas = res.data.notaDB;
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    agregarNota() {
      let config = {
        headers: {
          token: this.token
        }
      };
      this.axios
        .post("/nueva-nota", this.nota, config) //aqui mandamos los headers en config como lo haciamos en postman
        .then(res => {
          this.notas.push(res.data);
          this.nota.nombre = "";
          this.nota.descripcion = "";
          this.mensaje.color = "success";
          this.mensaje.texto = "nota agregada";
          this.showAlert();
        })
        .catch(e => {
          console.log(e.response);
          if (e.response.data.error.errors.nombre.message) {
            this.mensaje.texto = e.response.data.error.errors.nombre.message;
          } else {
            this.mensaje.texto = "error de sistema";
          }
          this.mensaje.color = "danger";
          this.showAlert();
        });
    },
    eliminarNota(id) {
      console.log(id);
      this.axios
        .delete(`/nota/${id}`)
        .then(res => {
          const index = this.notas.findIndex(item => item._id === res.data._id);
          this.notas.splice(index, 1);
          this.mensaje.color = "success";
          this.mensaje.texto = "nota eliminada";
          this.showAlert();
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    activarEdicion(id) {
      this.editar = true;
      console.log(id);

      this.axios
        .get(`/nota/${id}`)
        .then(res => {
          this.notaEditar = res.data;
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    alerta() {
      this.mensaje.color = "success";
      this.mensaje.texto = "probando alerta";
      this.showAlert();
    },
    editarNota(item) {
      this.axios
        .put(`/nota/${item._id}`, item)
        .then(res => {
          const index = this.notas.findIndex(n => n._id === res.data._id);
          this.notas[index].nombre = res.data.nombre;
          this.notas[index].descripcion = res.data.descripcion;
          this.mensaje.color = "success";
          this.mensaje.texto = "nota editada";
          this.showAlert();
          this.editar = false;
        })
        .catch(e => {
          console.log(e.response);
        });
    }
  }
};
</script>
