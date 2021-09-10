<template>
  <v-footer app padless>
    <v-card flat tile width="100%" color="footer" class="text-center">
      <v-card-text class="pa-2">
        <v-btn
          class="dim"
          text
          small
          target="_blank"
          href="https://github.com/rszamszur/pdf-resume-builder/issues"
        >
          <v-icon>mdi-bug</v-icon>
          Issues
        </v-btn>
        <v-btn
          class="dim"
          text
          small
          href="https://github.com/rszamszur/pdf-resume-builder"
        >
          <v-icon>mdi-github</v-icon>
          rszamszur/pdf-resume-builder
        </v-btn>
        <div>
          Made with <v-icon>mdi-heart-outline</v-icon> by:
          <strong
            ><a
              href="https://github.com/rszamszur"
            >
              Radosław Szamszur
            </a></strong
          >
          | PDFResumeBuilder Version:
          <strong>0.1.2</strong>
        </div>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.dim {
  opacity: 0.7;
}
</style>