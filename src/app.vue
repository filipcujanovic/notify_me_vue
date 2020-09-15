<template>
  <v-app id="notify-me">
    <v-container class="d-flex pa-0 ma-0 h-100" fluid>
      <NavBar />
      <router-view></router-view>
    </v-container>
    <Snackbar />
  </v-app>
</template>

<script>
import Snackbar from './components/snackbar';
import NavBar from './components/navbar';
import { mapActions } from 'vuex';


export default {
  name: 'App',
  components: { Snackbar, NavBar },
  methods: {
    ...mapActions(['checkIsUserAuth'])
  },
  async created() {
    await this.checkIsUserAuth();
  }
}
</script>

<style lang="scss">
@import '@/design/index.scss';
</style>
