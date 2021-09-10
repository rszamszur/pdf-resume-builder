<template>
  <v-container fill-height fluid>
    <v-row align-content="center" justify="center">
      <v-col cols="12" md="6">
        <PdfBuilderForm @update-preview="update"></PdfBuilderForm>
      </v-col>
      <v-col cols="12" md="6" v-if="this.preview">
          <h2 class="text-h5 text-sm-h3 text-md-h2">Preview</h2>
          <embed
            class="pdfobject"
            :src="this.preview"
            type="application/pdf"
            style="width: 100%; height: 100vh"
          />
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
  data() {
    return {
      preview: null,
    };
  },
  methods: {
    update(data) {
      this.preview = data;
    },
  },
};
</script>

<style>
</style>