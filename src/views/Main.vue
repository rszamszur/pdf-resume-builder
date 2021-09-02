<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <PdfBuilderForm></PdfBuilderForm>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PdfBuilderForm from "../components/PdfBuilderForm.vue";

export default {
  name: "Main",
  components: {
    PdfBuilderForm,
  },
};
</script>

<style>
</style>