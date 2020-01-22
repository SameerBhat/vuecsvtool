<template>
  <div>
    <!-- {{csvDataArray[0][5]}} -->
    <table id="newTable" class="table table-hover my-3">
      <tbody>
        <tr id="tableHead">
          <td
            :class="'col' + col"
            v-for="(firstRowTitle, col) in firstRowTitles"
            :key="'header-col-' + col"
            :ref="'col' + col"
            v-show="columVisibilityMap[col]"
          >
            <b> {{ firstRowTitle }} </b>
          </td>
        </tr>

        <tr
          v-for="(csvDataRows, row) in csvDataArray"
          :key="'table-row-' + row"
        >
          <td
            v-for="(csvDataCols, col) in csvDataRows"
            :key="'table-row-' + row + '-col-' + col"
            v-show="columVisibilityMap[col]"
          >
            <textarea
              :data-row="row"
              :data-col="col"
              :ref="'col' + col"
              v-if="
                (col == paragraphColumn + 1 && row == 0) ||
                  (col == cpnColumn && row == 0)
              "
              v-model.lazy="csvDataArray[row][col]"
              :rows="getTextAreaRows(col, csvDataCols)"
              :cols="getTextAreaCols(col, csvDataCols)"
              :readonly="col < readOnlyColumnsLength"
              :class="'col' + col"
              v-sameer="{
                col: col,
                annonCol: paragraphColumn + 1,
                cpnCol: cpnColumn,
                eventBus: eventBus
              }"
              v-on:some-event="someEvent"
              @contextmenu="selectSpeakerActive($event, col)"
            >
            </textarea>

            <textarea
              v-else
              :data-row="row"
              :data-col="col"
              :ref="'col' + col"
              v-model.lazy="csvDataArray[row][col]"
              :rows="getTextAreaRows(col, csvDataCols)"
              :cols="getTextAreaCols(col, csvDataCols)"
              :readonly="col < readOnlyColumnsLength"
              :class="'col' + col"
              @contextmenu="selectSpeakerActive($event, col)"
            >
            </textarea>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- fab -->
    <div
      class="circular-button-fab show-after-upload"
      @click="exportTableToCSV"
    >
      &darr;
    </div>

    <br />
    <br />

    <TableFooter
      :first-row-titles="firstRowTitles"
      :column-visibility-map="columVisibilityMap"
      :key="footerKey"
    />
    <ContextMenu
      :first-row-titles="firstRowTitles"
      @send-result-values="handleSelectedText"
      :is-speaker-selected="isSpeakerSelected"
      :paragraph-column="paragraphColumn"
      :speaker-column="speakerColumn"
      :context-menu-dropdown-arrays="contextMenuDropdownArrays"
    />
  </div>
</template>
<style lang="scss">
#tableHead td {
  position: sticky;
  top: 100px;
  background: steelblue;
  color: white;
}

.circular-button-fab {
  border-radius: 30px;
  color: #fff;
  background-color: #d9534f;
  border-color: #d43f3a;
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 45px;
  padding: 16px;
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 20px;
  margin-bottom: 70px;
  z-index: 1003;
  &:hover {
    background-color: #d43f3a;
    cursor: pointer;
  }
}
</style>
<script>
import ContextMenu from "./ContextMenu";
import TableFooter from "./TableFooter";
import { bus } from "../main";
export default {
  components: {
    ContextMenu,
    TableFooter
  },

  props: [
    "csvDataArray",
    "fileName",
    "firstRowTitles",
    "columVisibilityMap",
    "readOnlyColumnsLength",
    "contextMenuDropdownArrays",
    "paragraphColumn",
    "speakerColumn",
    "cpnColumn"
  ],
  directives: {
    sameer: {
      bind: (el, binding, vnode) => {
        if (binding.value.col == binding.value.annonCol) {
          el.addEventListener("keyup", $event => {
            binding.value.eventBus.$emit(
              "changeAnnonatorValue",
              $event.target.value
            );
          });
        } else if (binding.value.col == binding.value.cpnCol) {
          el.addEventListener("keyup", $event => {
            binding.value.eventBus.$emit("changeCpnValue", $event.target.value);
          });
        }
      }
    }
  },
  created() {
    this.eventBus.$on("changeAnnonatorValue", data => {
      this.changeAnnonatorField(data);
    });

     this.eventBus.$on("changeCpnValue", data => {
      this.changeCpnField(data);
    });
  },
  data() {
    return {
      eventBus: bus,
      footerKey: 0,
      isSpeakerSelected: false,
      orginalColumVisibilityMap: [...this.columVisibilityMap]
    };
  },
  methods: {
    getTextAreaRows(col, text) {
      text = text.replace(/\./g, "");

      var maxTextLengthInRow;
      if (col == this.paragraphColumn) {
        maxTextLengthInRow = 35;
      } else {
        maxTextLengthInRow = 13;
      }

      var textLength = text.length;

      if (textLength > maxTextLengthInRow) {
        var rows = Math.ceil(textLength / maxTextLengthInRow);

        return rows;
      } else {
        return 1;
      }
    },
    getTextAreaCols(col, text) {
      if (col == this.paragraphColumn) {
        return 45;
      } else {
        return 20;
      }
    },
    exportTableToCSV() {
      var csvStringArray = [];
      csvStringArray.push(this.firstRowTitles.join(","));

      for (let i = 0; i < this.csvDataArray.length; i++) {
        const row = this.csvDataArray[i];
        for (let e = 0; e < this.csvDataArray[i].length; e++) {
          this.csvDataArray[i][e] = this.csvDataArray[i][e]
            .replace(/\n/g, "")
            .trim();
        }
        const rowString = row.join(",");
        csvStringArray.push(rowString);
      }

      var csv = csvStringArray.join("\n");
      var csvFile;
      var downloadLink;
      csvFile = new Blob([csv], { type: "text/plain", endings: "native" });
      downloadLink = document.createElement("a");
      downloadLink.download = "label_" + this.fileName;
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    },
    handleSelectedText(data) {
      if (data.text == "") {
        alert("empty text");
      } else {
        var textString = data.text.trim();
        const rowSpeakerString = this.csvDataArray[data.row][
          this.speakerColumn
        ];

        if (
          textString.toLowerCase() == "speaker1" ||
          textString.toLowerCase() == "speaker2" ||
          textString.toLowerCase() == "channel_1" ||
          textString.toLowerCase() == "channel_2"
        ) {
          var speakerRowsArray = [];

          for (let index = 0; index < this.csvDataArray.length; index++) {
            const speakerColNumber = this.csvDataArray[index].indexOf(
              rowSpeakerString
            );

            if (speakerColNumber != -1) {
              console.log(
                "I am here in row number " + index + " col no is " + data.col
              );
              this.csvDataArray[index][data.col] = rowSpeakerString;
            }
          }
        }

        this.csvDataArray[data.row][data.col] = textString;

        // this.replaceArray(this.columVisibilityMap, this.orginalColumVisibilityMap);
        this.columVisibilityMap[data.col] = true;
        this.forceRerenderFooter();
      }

      this.$forceUpdate();
      // this.TableFooter.$forceUpdate();
    },
    replaceArray(reference, array) {
      [].splice.apply(reference, [0, reference.length].concat(array));
    },
    selectSpeakerActive(event, col) {
      if (col == this.speakerColumn) {
        var input = event.target;

        input.focus();
        input.select();

        this.isSpeakerSelected = true;
      } else {
        this.isSpeakerSelected = false;
      }
    },
    forceRerenderFooter() {
      this.footerKey += 1;
    },
    changeAnnonatorField(value) {
      for (let index = 0; index < this.csvDataArray.length; index++) {
        this.csvDataArray[index][this.paragraphColumn + 1] = value;
      }
    },
    changeCpnField(value) {
      for (let index = 0; index < this.csvDataArray.length; index++) {
        this.csvDataArray[index][this.cpnColumn] = value;
      }
    },
    someEvent() {
      console.log("Some event");
    }
  }
};
</script>
