<template>
  <v-card>
    <v-list
      flat
      subheader
      single-line
    >
    <v-toolbar flat>
        <v-toolbar-title>Municipalities</v-toolbar-title>
    </v-toolbar>
      <v-subheader>Please select municipalities you want to get nofitications for</v-subheader>

      <v-skeleton-loader type="list-item" v-show="loading && municipalities.length == 0"></v-skeleton-loader>
      <v-container>
      <v-row>
        <v-virtual-scroll :items="municipalities" item-height="40" height="400">
          <template v-slot="{ item }">
            <v-list-item-group multiple v-model="user_municipalities">
              <v-list-item :value="item.id">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </template>
        </v-virtual-scroll>
      </v-row>
      </v-container>
      <v-list-item>
        <v-list-item-content>
          <v-btn @click="submit" :loading="loading">Save</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

  export default {
    name: 'MunicipalitiesEdit',
    data() {
        return {
            user_municipalities: [],
        };
    },
    computed: {
        ...mapGetters(['getCurrentUserMunicipalities', 'getCurrentUserMunicipalitiesForDisplay']),
        ...mapState(['municipalities', 'loading']),
    },
    async created() {
        await this.getMunicipalitiesAction();
        await this.getUserMunicipalitiesAction();
        this.user_municipalities = this.getCurrentUserMunicipalitiesForDisplay();
    },
    methods: {
        ...mapActions(['getMunicipalitiesAction','getUserMunicipalitiesAction','createUserMunicipalitiesAction', 'deleteUserMunicipalitiesAction']),
        async submit () {
          let dataForCreate = [],
              dataForDelete = [],
              old_user_municipalities = this.getCurrentUserMunicipalities(),
              old_user_municipalities_for_display = this.getCurrentUserMunicipalitiesForDisplay();

          dataForCreate = this.user_municipalities.filter((id) => !old_user_municipalities_for_display.includes(id)).map((id) => { return {"municipality_id": id} });

          dataForDelete = old_user_municipalities.filter((municipality) => !this.user_municipalities.includes(municipality.municipality_id));
          if (dataForCreate.length !== 0) {
            this.createUserMunicipalitiesAction(dataForCreate);
          }
          if (dataForDelete.length !== 0) {
            this.deleteUserMunicipalitiesAction(dataForDelete);
          }
        }
    }
}
</script>