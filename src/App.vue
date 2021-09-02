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
      <v-alert prominent text type="info" :value="!dismissed">
        <v-row align="center">
          <v-col class="grow">
            This application is stateless and does <strong>not</strong> store
            any data! Uploaded JSON file is only loaded into memory for the
            current session in order to populate PDF template with your data.
          </v-col>
          <v-col class="shrink">
            <v-btn color="info" outlined @click="closeAlert"> Okay </v-btn>
          </v-col>
        </v-row>
      </v-alert>
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
    return {
      dismissed:
        localStorage.getItem("disclaimer-dismissed") === "true" ? true : false,
    };
  },
  methods: {
    saveTheme() {
      localStorage.setItem("dark-theme", this.$vuetify.theme.dark.toString());
    },
    closeAlert() {
      this.dismissed = true;
      localStorage.setItem("disclaimer-dismissed", true.toString());
    },
  },
};
</script>