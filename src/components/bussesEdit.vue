<template>
    <v-card>
        <v-list
            flat
            subheader
        >
            <v-toolbar flat>
                <v-toolbar-title>Busses</v-toolbar-title>
            </v-toolbar>
            <v-subheader>Please select busses you want to get nofitications for</v-subheader>

            <v-skeleton-loader type="list-item" v-show="loading && busses.length == 0"></v-skeleton-loader>
            <v-item-group
                v-model="user_busses"
                :multiple="true"
            >
                <v-container>
                    <v-row>
                        <v-col
                            v-for="bus in busses"
                            :key="bus.id"
                            cols="1"
                        >
                            <v-item 
                                v-slot:default="{ active, toggle }" 
                                :value="bus.id"
                            >
                                <v-hover>
                                    <template v-slot="{ hover }">
                                        <v-card
                                            :color="active ? 'primary' : ''"
                                            @click="toggle"
                                            :elevation="hover ? 24 : 4"
                                            width="70"
                                            height="65"
                                        >
                                            <v-card-title
                                                class="text-center d-block pl-0 pr-0"
                                            >
                                                {{ bus.bus_route_number }}
                                            </v-card-title>
                                        </v-card>
                                    </template>
                                </v-hover>
                            </v-item>
                        </v-col>
                    </v-row>
                </v-container>
            </v-item-group>
            <v-pagination v-model="page_number" :length="number_of_pages" @input="changePage" />
            <v-list-item>
                <v-list-item-content>
                    <v-btn @click="submit" :loading="loading">Save</v-btn>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
    export default {
        name: 'BussesEdit',
        data() {
            return {
                user_busses: [],
                page_number: 1,
            }
        },
        async created() {
            await this.getDataForBussesEditAction(this.page_number);

            this.user_busses = this.getCurrentUserBussesForDisplay();
        },
        computed: {
            ...mapState(['busses', 'loading', 'number_of_pages']),
            ...mapGetters(['getCurrentUserBussesForDisplay', 'getCurrentUserBusses']),
        },
        methods: {
            ...mapActions(['getDataForBussesEditAction', 'createUserBussesAction', 'deleteUserBussesAction']),
            async submit () {
                let dataForCreate = [],
                    dataForDelete = [],
                    old_user_busses = this.getCurrentUserBusses(),
                    old_user_busses_for_display = this.getCurrentUserBussesForDisplay();
                    
                dataForCreate = this.user_busses.filter((id) => !old_user_busses_for_display.includes(id)).map((id) => { return {"bus_id": id} });
                dataForDelete = old_user_busses.filter((bus) => !this.user_busses.includes(bus.bus_id));
                if (dataForCreate.length !== 0) {
                    this.createUserBussesAction(dataForCreate);
                }
                if (dataForDelete.length !== 0) {
                    this.deleteUserBussesAction(dataForDelete);
                }
            },
            async changePage() {
                await this.getDataForBussesEditAction(this.page_number);
                this.user_busses = this.getCurrentUserBussesForDisplay();
            }
        }
    }
</script>