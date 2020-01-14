<template>
  <div>
    <div class="container">
      <form enctype="multipart/form-data">
        <div class="input-group">
          <div class="custom-file">
            <input
              type="file"
              ref="file"
              class="custom-file-input"
              id="custom-file"
              @change="uploadFile"
            />
            <label class="custom-file-label" for="custom-file">{{
              selectedFileName
            }}</label>
          </div>
          <div class="input-group-append">
            <!-- <button class="btn btn-primary" type="button" @click="uploadFile">
            Upload
          </button> -->
          </div>
        </div>
      </form>
    </div>

    <TableView v-if="csvDataArray.length > 0" :csv-data-array="csvDataArray"  :file-name="selectedFileName"/>
  </div>
</template>

<script>
import TableView from "./TableView.vue";

export default {
  components: {
    TableView
  },
  data() {
    return {
      selectedFileName: "Choose File",
      csvFile: null,
      initialTableDataArray: [],
      columnNamesArray: [],
      cpn_name: "",
      csvDataArray: []
    };
  },
  methods: {
    getExtension(filename) {
      filename = filename.toString();
      var parts = filename.split(".");
      return parts[parts.length - 1].trim();
    },
    readFile() {
      console.log("i am here ");
      var reader = new FileReader();
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader.onload = e => {
          var rows = e.target.result.split("\n");

          this.csvDataArray = [];

          for (var i = 1; i < rows.length; i++) {
            var cells = rows[i].split(",");

            if (cells.length <= 22) {
              rows[i] = rows[i] + ",,,,,,,,,,,";
              cells = rows[i].split(",");
            }

            var row = [];
            for (var j = 0; j < cells.length; j++) {
              row.push(cells[j]);
            }
            this.csvDataArray.push(row);
          }
        };
        reader.readAsText(this.file);
      } else {
        alert("The File APIs are not fully supported in this browser.");
      }
    },
    uploadFile() {
      this.file = this.$refs.file.files[0];

      if (this.file && this.file.name && this.getExtension(this.file.name)) {
        this.selectedFileName = this.file.name.toString();
        this.readFile();
      } else {
        alert("Invalid file, Please upload a csv file");
      }
    }
  }
};
</script>
