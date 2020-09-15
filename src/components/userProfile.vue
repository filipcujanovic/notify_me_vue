<template>
    <v-form
        ref="form"
    >
        <v-text-field
            label="Email"
            v-model="user.email"
            required
        />
        <v-text-field
            label="Username"
            v-model="user.username"
            required
        />
        <v-text-field
            label="First name"
            v-model="user.first_name"
            required
        />
        <v-text-field
            label="Last name"
            v-model="user.last_name"
            required
        />
        <v-btn @click="submit">submit</v-btn>
    </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'UserProfile',
    data() {
        return {
            user: {},
        };
    },
    created() {
        this.user = { ...this.getCurrentUser() };
    },
    computed: {
        ...mapGetters(['getCurrentUser']),
    },
    methods: {
        ...mapActions(['updateUserAction']),
        async submit () {
            await this.updateUserAction(this.user);
        }
    }
}
</script>