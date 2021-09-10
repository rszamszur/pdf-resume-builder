<template>
  <v-form ref="form" lazy-validation>
    <h2 class="text-h5 text-sm-h3 text-md-h2">Step 1: Chose template</h2>
    <v-slide-group
      v-model="chosen"
      class="pa-4"
      center-active
      mandatory
      show-arrows
      @change="templateChanged"
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
      <span v-if="templates[chosen].link != null">
        (
        <a :href="templates[chosen].link" target="_blan">example.pdf</a>
        )
      </span>
    </div>
    <v-divider class="mb-4 mt-2"></v-divider>
    <h2 class="text-h5 text-sm-h3 text-md-h2 mb-4">Step 2: Load JSON Data</h2>
    <p>
      <v-icon color="info">mdi-information</v-icon> If you don't know what data?
      Have a look at:
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
      v-model="input"
      :rules="rules"
      accept="application/json"
      outlined
      prepend-icon="mdi-code-json"
      label="JSON Data"
      :show-size="1000"
      :error-messages="inputErrors"
      :loading="loading"
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
        {{ error.instancePath }} {{ error.message }}
      </v-alert>
    </div>
    <div v-if="showAfter">
      <v-btn text color="primary" @click="savePDF">Save PDF</v-btn>
      <v-btn text color="error" @click="reset">Reset</v-btn>
    </div>
    <p>
      <v-icon color="info">mdi-information</v-icon> In case chosen template
      isn't rendering as you'd like, you can further tweak some of its
      <a
        :href="
          'https://github.com/rszamszur/pdf-resume-builder/blob/master/examples/' +
          templates[chosen].name
        "
        target="_blank"
        >options</a
      >:
      <v-btn text small @click="showOptions = !showOptions"
        ><span v-if="showOptions">Hide</span
        ><span v-else>MR Adjuster</span></v-btn
      >
      <v-btn
        v-if="showOptions"
        text
        small
        @click="
          templates[chosen].options = templates[chosen].class.editableOptions()
        "
        >Reset</v-btn
      >
    </p>
    <div v-if="showOptions">
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-overline">Font size</div>
          <v-slider
            v-for="(item, i) in templates[chosen].options.text"
            :key="i"
            v-model="templates[chosen].options.model.text[item.key]"
            color="primary"
            :label="item.label"
            thumb-label
            :min="item.min"
            :max="item.max"
            @change="triggerRerender"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="6">
          <div class="text-overline">Line height</div>
          <v-slider
            v-for="(item, i) in templates[chosen].options.height"
            :key="i"
            v-model="templates[chosen].options.model.height[item.key]"
            color="primary"
            :label="item.label"
            thumb-label
            :min="item.min"
            :max="item.max"
            @change="triggerRerender"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="12">
          <div class="text-overline">Margin</div>
          <v-slider
            v-for="(item, i) in templates[chosen].options.margin"
            :key="i"
            v-model="templates[chosen].options.model.margin[item.key]"
            color="primary"
            :label="item.label"
            thumb-label
            :min="item.min"
            :max="item.max"
            @change="triggerRerender"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="12" v-if="templates[chosen].options.sidebarWidth">
          <div class="text-overline">Sidebar</div>
          <v-slider
            v-model="templates[chosen].options.model.sidebarWidth"
            color="primary"
            :label="templates[chosen].options.sidebarWidth.label"
            thumb-label
            :min="templates[chosen].options.sidebarWidth.min"
            :max="templates[chosen].options.sidebarWidth.max"
            @change="triggerRerender"
          ></v-slider>
        </v-col>
      </v-row>
    </div>
    <v-divider class="mb-4 mt-2"></v-divider>
    <h2 class="text-h5 text-sm-h3 text-md-h2">Step 3: Get hired</h2>
  </v-form>
</template>

<script>
import Ajv from "ajv";
import { LessIsBetter } from "../jspdf/less-is-better.js";
import { ShineLikeDiamond } from "../jspdf/shine-like-diamond.js";
import { LetsTalkAboutIt } from "../jspdf/lets-talk-about-it.js";

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
          link: "https://github.com/rszamszur/pdf-resume-builder/blob/master/examples/LessIsBetter/example.pdf",
          class: LessIsBetter,
          options: LessIsBetter.editableOptions(),
        },
        {
          name: "ShineLikeDiamond",
          thumbnail: require("../assets/ShineLikeDiamond.png"),
          link: "https://github.com/rszamszur/pdf-resume-builder/blob/master/examples/ShineLikeDiamond/example.pdf",
          class: ShineLikeDiamond,
          options: ShineLikeDiamond.editableOptions(),
        },
        {
          name: "LetsTalkAboutIt",
          thumbnail: require("../assets/LetsTalkAboutIt.png"),
          link: "https://github.com/rszamszur/pdf-resume-builder/blob/master/examples/LetsTalkAboutIt/example.pdf",
          class: LetsTalkAboutIt,
          options: LetsTalkAboutIt.editableOptions(),
        },
      ],
      input: null,
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
      timer: 0,
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
        const reader = new FileReader();

        reader.addEventListener("load", (event) => {
          var data = null;
          try {
            data = JSON.parse(event.target.result);
          } catch (error) {
            console.error(error);
            this.inputErrors.push(
              "Couldn't parse provided JSON file, most likely it is malformed. Details can be found in console."
            );
            return;
          }
          this.validateJSON(data);
        });
        reader.readAsText(file);
      }

      this.disabled = false;
      this.loading = false;
    },
    validateJSON(data) {
      const validate = this.ajv.compile(
        this.templates[this.chosen].class.schema()
      );
      var valid = validate(data);
      if (valid) {
        this.data = data;
        try {
          this.generatePDF();
        } catch (error) {
          console.error(error);
          this.inputErrors.push(
            "Couldn't generate PDF, details can be found in console. Feel free to submit an issue on GitHub."
          );
          return;
        }
        this.showAfter = true;
      } else {
        this.inputErrors.push("Provided JSON file doesn't pass schema.");
        this.schemaErrors = validate.errors;
      }
    },
    generatePDF() {
      const cv = new this.templates[this.chosen].class();
      var preview = cv.generatePDF(
        this.data,
        this.templates[this.chosen].options.model
      );
      this.$emit("update-preview", preview);
    },
    savePDF() {
      const cv = new this.templates[this.chosen].class();
      cv.generatePDF(
        this.data,
        this.templates[this.chosen].options.model,
        false
      );
      this.reset();
    },
    triggerRerender() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.loadJSON(this.input);
      }, 1500);
    },
    templateChanged() {
      this.input = null;
      this.data = null;
      this.inputErrors = [];
      this.schemaErrors = null;
      this.disabled = false;
      this.loading = false;
      this.showAfter = false;
      this.showOptions = false;
      this.$emit("update-preview", null);
    },
    reset() {
      this.data = null;
      this.inputErrors = [];
      this.schemaErrors = null;
      this.disabled = false;
      this.loading = false;
      this.showAfter = false;
      this.templates.forEach((template) => {
        template.options = template.class.editableOptions();
      });
      this.input = null;
      this.$refs.input.resetValidation();
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