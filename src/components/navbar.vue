<template>
    <v-navigation-drawer
        v-if="this.isAuth"
        class="deep-purple accent-4"
        dark
        permanent
    >
        <v-list>
            <v-list-item
                v-for="item in items"
                :key="item.title"
                @click="redirect(item.path)"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <template v-slot:append>
        <div class="pa-2">
            <v-btn block @click="logout()">Logout</v-btn>
        </div>
        </template>
    </v-navigation-drawer>
</template>

<script>
import router from '../router';
import { mapState, mapActions } from 'vuex';

  export default {
    name: 'NavBar',
    data () {
      return {
        items: [
          { title: 'Busses', icon: 'account_box', path: 'busses' },
          { title: 'Municipalities', icon: 'gavel', path: 'municipalities' },
        ],
      }
    },
    computed: mapState(['isAuth']),
    methods: {
        ...mapActions(['logoutUser']),
        logout() {
            this.logoutUser();
            router.push('login');
        },
        redirect(path) {
            if (router.currentRoute.name !== path) {
                router.push(path);
            }
        }
    }
  }
</script>