<template>
  <v-app>
    <v-app-bar app color="appbar" dark>
      <div class="d-flex align-center">
        <h2>PDF<span class="font-weight-light">ResumeBuilder</span></h2>
      </div>
      <v-spacer></v-spacer>
      <v-switch
        v-model="$vuetify.theme.dark"
        inset
        hide-details
        @change="saveTheme"
      >
        <template v-slot:label> Dark mode </template>
      </v-switch>
    </v-app-bar>

    <v-main>
      <Main />
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Main from "./views/Main.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Main,
    Footer,
  },
  data() {
    return {};
  },
  methods: {
    saveTheme() {
      localStorage.setItem("dark-theme", this.$vuetify.theme.dark);
    },
  },
};
</script>