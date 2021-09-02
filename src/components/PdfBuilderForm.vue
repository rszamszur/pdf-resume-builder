<template>
  <v-form ref="form" lazy-validation>
    <h2 class="text-h5 text-sm-h3 text-md-h2">Step 1: Chose template</h2>
    <v-slide-group
      v-model="chosen"
      class="pa-4"
      center-active
      mandatory
      show-arrows
    >
      <v-slide-item
        v-for="(template, i) in templates"
        :key="i"
        v-slot="{ active, toggle }"
      >
        <v-img
          class="ma-4"
          max-width="200"
          :class="active ? 'chosen' : 'dimed'"
          :src="template.thumbnail"
          @click="toggle"
        >
          <v-row class="fill-height" align="center" justify="center">
            <v-scale-transition>
              <v-icon
                v-if="active"
                color="primary"
                size="64"
                v-text="'mdi-file-check'"
              ></v-icon>
            </v-scale-transition>
          </v-row>
        </v-img>
      </v-slide-item>
    </v-slide-group>
    <div class="text-subtitle-1">
      Chosen template: <strong>{{ templates[chosen].name }}</strong>
    </div>
    <p>
      <v-icon color="info">mdi-information</v-icon> In case chosen template
      isn't rendering as you'd like, you can further tweak some of its options:
      <v-btn text small @click="showOptions = !showOptions"
        ><span v-if="showOptions">Hide</span
        ><span v-else>MR Adjuster</span></v-btn
      >
      <v-btn
        v-if="showOptions"
        text
        small
        @click="
          templates[chosen].options = templates[chosen].class.defaultOptions()
        "
        >Reset</v-btn
      >
    </p>
    <div v-if="showOptions">
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-overline">Margins</div>
          <v-slider
            v-model="templates[chosen].options.margin.left"
            color="primary"
            label="Left"
            thumb-label
            min="5"
            max="30"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.margin.top"
            color="primary"
            label="Top"
            thumb-label
            min="5"
            max="30"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.margin.bottom"
            color="primary"
            label="Bottom"
            thumb-label
            min="5"
            max="30"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.margin.inner"
            color="primary"
            label="Inner"
            thumb-label
            min="1"
            max="20"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.margin.list"
            color="primary"
            label="List"
            thumb-label
            min="1"
            max="10"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.margin.between"
            color="primary"
            label="Between"
            thumb-label
            min="1"
            max="15"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="6">
          <div class="text-overline">Fonts</div>
          <v-slider
            v-model="templates[chosen].options.text.name"
            color="primary"
            label="Name"
            thumb-label
            min="20"
            max="45"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.text.tagline"
            color="primary"
            label="Tagline"
            thumb-label
            min="10"
            max="25"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.text.header"
            color="primary"
            label="Header"
            thumb-label
            min="12"
            max="25"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.text.sidebarContent"
            color="primary"
            label="Sidebar content"
            thumb-label
            min="8"
            max="14"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.text.subHeader"
            color="primary"
            label="Subheader"
            thumb-label
            min="8"
            max="14"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.text.content"
            color="primary"
            label="Content"
            thumb-label
            min="8"
            max="12"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="12">
          <div class="text-overline">Misc</div>
          <v-slider
            v-model="templates[chosen].options.sidebarWidth"
            color="primary"
            label="Sidebar width"
            thumb-label
            min="60"
            max="80"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.headerLineHeight"
            color="primary"
            label="Header line height"
            thumb-label
            min="6"
            max="12"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.lineHeight"
            color="primary"
            label="Line height"
            thumb-label
            min="4"
            max="10"
          ></v-slider>
          <v-slider
            v-model="templates[chosen].options.subLineHeight"
            color="primary"
            label="Subline height"
            thumb-label
            min="2"
            max="6"
          ></v-slider>
        </v-col>
      </v-row>
    </div>
    <v-divider class="mb-4 mt-2"></v-divider>
    <h2 class="text-h5 text-sm-h3 text-md-h2 mb-4">Step 2: Load JSON Data</h2>
    <p>
      <v-icon color="info">mdi-information</v-icon> If you don't know what
      data?!, then have a look at
      <a
        href="https://github.com/rszamszur/pdf-resume-builder/tree/master/examples"
        target="_blank"
        >examples</a
      >
      and
      <a href="https://github.com/rszamszur/pdf-resume-builder" target="_blank"
        >README</a
      >
    </p>
    <v-file-input
      ref="input"
      :rules="rules"
      accept="application/json"
      outlined
      prepend-icon="mdi-code-json"
      label="JSON Data"
      :show-size="1000"
      :error-messages="inputErrors"
      :loading="loading"
      :disabled="chosen != 0 || disabled"
      @change="loadJSON"
    ></v-file-input>
    <div v-if="schemaErrors">
      <v-alert
        dense
        outlined
        type="error"
        v-for="(error, i) in schemaErrors"
        :key="i"
      >
        {{ error.message }}
      </v-alert>
    </div>
    <div v-if="showAfter">
      <v-btn text color="primary" @click="generatePDF">Generate Again</v-btn>
      <v-btn text color="error" @click="reset">Reset</v-btn>
    </div>
    <v-divider class="mb-4 mt-2"></v-divider>
    <h2 class="text-h5 text-sm-h3 text-md-h2">Step 3... oh wait here is no step 3 :)</h2>
  </v-form>
</template>

<script>
import Ajv from "ajv";
import { LessIsBetter } from "../jspdf/less-is-better.js";

export default {
  name: "PdfBuilderForm",
  data() {
    return {
      chosen: 0,
      showOptions: false,
      ajv: new Ajv({ allErrors: true }),
      templates: [
        {
          name: "LessIsBetter",
          thumbnail: require("../assets/LessIsBetter.png"),
          link: null,
          class: LessIsBetter,
          options: LessIsBetter.defaultOptions(),
        },
        {
          name: "ShineLikeDiamond",
          thumbnail: require("../assets/ShineLikeDiamond-cs.png"),
          link: null,
          class: LessIsBetter,
          options: LessIsBetter.defaultOptions(),
        },
        {
          name: "WebGyver",
          thumbnail: require("../assets/WebGyver-cs.png"),
          link: null,
          class: LessIsBetter,
          options: LessIsBetter.defaultOptions(),
        },
      ],
      rules: [
        (v) => !!v || "JSON is required!",
        (v) => !v || v.type == "application/json" || "Not a JSON file!",
        (v) => !v || v.size < 1000000 || "JSON size should be less than 1 MB!",
      ],
      inputErrors: [],
      schemaErrors: null,
      disabled: false,
      loading: false,
      showAfter: false,
      data: null,
    };
  },
  methods: {
    loadJSON(file) {
      this.inputErrors = [];
      this.schemaErrors = null;
      this.disabled = true;
      this.loading = true;
      this.showAfter = false;
      this.data = null;
      if (this.$refs.form.validate()) {
        console.log(file);
        const reader = new FileReader();

        reader.addEventListener("load", (event) => {
          try {
            const data = JSON.parse(event.target.result);
            this.validateJSON(data);
          } catch {
            this.inputErrors.push(
              "Coudlnt parse provided JSON file, most likely it is malformed."
            );
            return;
          }
        });
        reader.readAsText(file);
      }

      this.disabled = false;
      this.loading = false;
    },
    validateJSON(data) {
      console.log(data);
      const validate = this.ajv.compile(
        this.templates[this.chosen].class.schema()
      );
      var valid = validate(data);
      if (valid) {
        this.data = data;
        this.generatePDF();
        this.showAfter = true;
      } else {
        this.inputErrors.push("Provided JSON file doesn't pass schema.");
        this.schemaErrors = validate.errors;
      }
    },
    generatePDF() {
      const cv = new this.templates[this.chosen].class();
      cv.generatePDF(this.data, this.templates[this.chosen].options);
    },
    reset() {
      this.data = null;
      this.inputErrors = [];
      this.schemaErrors = null;
      this.disabled = false;
      this.loading = false;
      this.showAfter = false;
      this.templates.forEach((template) => {
        template.options = template.class.defaultOptions();
      });
      this.$refs.input.reset();
    },
  },
};
</script>

<style scoped>
.chosen {
  opacity: 1;
  cursor: pointer;
}
.dimed {
  opacity: 0.5;
  cursor: pointer;
}
</style>