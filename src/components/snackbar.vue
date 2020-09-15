<template>
  <v-snackbars :objects.sync="snackbars" top right/>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import VSnackbars from "v-snackbars";

export default {
  name: 'Snackbars',
  computed: {
    ...mapFields(['snackbars'])
  },
  components: {
    "v-snackbars": VSnackbars
  },
}
</script>

<style>
</style>
