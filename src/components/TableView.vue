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
            <b>{{ firstRowTitle }}</b>
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
              v-if="getTextAreaRows(csvDataCols) > 1"
              v-model="csvDataArray[row][col]"
              :rows="getTextAreaRows(csvDataCols)"
              :readonly="col < 4"
              :class="'col' + col"
              @contextmenu="selectSpeakerActive($event, col)"
            ></textarea>
            <input
              v-else
              :data-row="row"
              :data-col="col"
              :ref="'col' + col"
              type="text"
              v-model="csvDataArray[row][col]"
              :class="'col' + col"
              :readonly="col < 4"
              @contextmenu="selectSpeakerActive($event, col)"
            />
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

    <br>
    <br>

    <TableFooter
      :first-row-titles="firstRowTitles"
      :column-visibility-map="columVisibilityMap"
    />
    <ContextMenu
      :first-row-titles="firstRowTitles"
      v-on:send-result-values="handleSelectedText"
      :is-speaker-selected="isSpeakerSelected"
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


export default {
 
  components: {
    ContextMenu,
    TableFooter
  },
  
  props: ["csvDataArray", "fileName"],
  data() {
    return {
      firstRowTitles: [
        "fnum",
        "line",
        "speaker",
        "paragraph",
        "annotators_name",
        "TOPIC1",
        "twrd1",
        "pharse1",
        "TOPIC2",
        "twrd2",
        "pharse2",
        "sentiment_phrase1",
        "sentiment_phrase2",
        "promise1",
        "pwrd1",
        "promise_phrase1",
        "promise2",
        "pwrd2",
        "promise_phrase2",
        "promise_comment",
        "cpn_name",
        "agent",
        "customer"
      ],
      columVisibilityMap: [
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        true
      ],
      isSpeakerSelected:false
    
    };
  },
  mounted() {

    // const clipboardScript = document.createElement("script");
    // clipboardScript.setAttribute("src", "clipboard.js");
    // clipboardScript.async = true;
    // document.head.appendChild(clipboardScript);

  },
  methods: {
    getTextAreaRows(text) {
      var textLength = text.length;

      if (textLength > 22) {
        var rows = Math.ceil(textLength / 22);
        return rows;
      } else {
        return 1;
      }
    },
    exportTableToCSV() {
      var csvStringArray = [];
      csvStringArray.push(this.firstRowTitles.join(","));

      for (let i = 0; i < this.csvDataArray.length; i++) {
        const row = this.csvDataArray[i];
        const rowString = row.join(",");
        csvStringArray.push(rowString);
      }

      var csv = csvStringArray.join("\n");
      var csvFile;
      var downloadLink;
      csvFile = new Blob([csv], { type: "text/csv" });
      downloadLink = document.createElement("a");
      downloadLink.download = this.fileName;
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    },
    handleSelectedText(data) {
      // if (data.col == 5 || data.col == 8) {
      //   //alert("display topic dd");
      //   console.log("reached step topic dd")
      // } else if (data.col == 13 || data.col == 16) {
      //   // alert("display promise dd");
      //   console.log("reached step promise dd")
      // } else {


        if (data.text == "") {
          
          alert("empty text");
        } else {
         
          this.csvDataArray[data.row][data.col] = data.text;
        }
      

     

      this.$forceUpdate();
    },
    selectSpeakerActive(event, col){
      if(col ==2){

        var input = event.target;

        input.focus();
        input.select();

       
        this.isSpeakerSelected = true;
      }else{
               
        this.isSpeakerSelected = false;
      }
    }
  }
};
</script>
