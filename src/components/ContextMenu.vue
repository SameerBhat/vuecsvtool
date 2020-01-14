<template>
  <nav id="context-menu" class="context-menu" ref="context-menu">
    <input type="hidden" ref="selectedRow" value="-1" id="selectedRow" />

    <input type="hidden" ref="speakerColSelected" value="false" id="speakerColSelected" />

    <ul class="context-menu__items">
      <li
        :class="{
          'context-menu__item': true,
          'context-menu__item-multiple': isMultipleDropdown(mainMenuItem)
        }"
        v-for="(mainMenuItem, index) in contextMenuArray"
        :key="index"
        v-show="shouldShow(index)"
      >
        <a
          href="#"
          class="context-menu__link"
          @click="handleContextClick(mainMenuItem)"
          >{{ mainMenuItem }}
        </a>

        <!-- //START -->

        <ul
          class="context-menu__items context-menu__subitem context-menu-parent"
          v-if="isTopicDropdown(mainMenuItem)"
        >
          <li
            class="context-menu__sub-item context-menu__sub-item-multiple context-menu__sub-item-topic"
            v-for="(topicPropertyValue, topicPropertyName) in dropdownArrays['topic']"
            :key="topicPropertyName"
          >
            <a href="#" class="context-menu__link">
              {{ topicPropertyName }} &rarr; 
            </a>

             <ul class="context-menu__items context-menu__sub-subitem">
              
               <li
            class="context-menu__sub-item"
            v-for="topicSubItemValue in topicPropertyValue"
              :key="topicSubItemValue">
            <a href="#" class="context-menu__link"
            @click="handleDropdownClick(mainMenuItem, topicSubItemValue)">
              {{ topicSubItemValue }} 
            </a>
               </li>
            </ul>

           
            <!-- <ul
              class="context-menu__items context-menu__sub-subitem"
              v-for="topicSubItemValue in topicPropertyValue"
              :key="topicSubItemValue"
            >
              {{topicSubItemValue}} 
            </ul> -->
          </li>
        </ul>

        <ul
          class="context-menu__items context-menu__subitem"
          v-if="isPromiseDropdown(mainMenuItem)"
        >
          <li
            class="context-menu__sub-item context-menu__sub-item-multiple"
            v-for="promiseSubItem in dropdownArrays['promise']"
            :key="promiseSubItem"
          >
            <a
              href="#"
              class="context-menu__link"
              @click="handleDropdownClick(mainMenuItem, promiseSubItem)"
            >
              {{ promiseSubItem }}
            </a>
          </li>
        </ul>
        <!-- END -->
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.context-menu {
  display: none;
  position: absolute;
  z-index: 9999;
  padding: 12px 0;
  width: 240px;
  background-color: #fff;
  border: solid 1px #dfdfdf;
  box-shadow: 1px 1px 2px #cfcfcf;

  &--active {
    display: block;
  }

  & &__items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    display: block;
    margin-bottom: 4px;

    &-multiple:hover .context-menu__subitem {
      display: block !important;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  &__link {
    display: block;
    padding: 4px 12px;
    color: #0066aa;
    text-decoration: none;

    &:hover {
      color: #fff;
      background-color: #0066aa;
    }
  }

  &__subitem,
  &__sub-subitem {
    display: none;
    position: absolute;
    right: 0;
    transform: translateX(100%);
    background: white;
    top: 0;
    list-style: none;
  }
}

.context-menu__item-multiple > a::after {
  content: "\2192";
}

.context-menu__sub-item-multiple:hover .context-menu__sub-subitem {
  display: block !important;
}
.context-menu__item-multiple {
  position: relative;
}

.context-menu__sub-item-topic{
      position: relative;
}
</style>

<script>

import { clipboard } from './mixins/clipboard';

export default {
  
  props: ["firstRowTitles","isSpeakerSelected"],
  mixins: [clipboard],
  data() {
    return {
      contextMenuArray: [...this.firstRowTitles],
      dropdownArrays: {
        topic: {
          "CD DISC": ["Disconnect"],
          "CD BILL": ["Bill Explanation"],
          "CD EQIP": ["How to Setup/Activate", "Setup/Activation Issues"],
          "CD ACCT": [
            "Port Status",
            "Assumption of Liability",
            "Insurance (TEC/TMP)",
            "Corporate Information",
            "Call Message Block",
            "Change MTN",
            "Prepaid Information",
            "Spam/Spoof"
          ],
          "CD TRBL": [
            "Voice",
            "Date Connection/Browser",
            "Device Settings & Issues"
          ],
          "CD PYMT": ["Promise to Pay", "Make Payment INTL"],
          "CD INTL": ["Travel Pass", "International Plan Feature Optl"],
          "CD PLAN": ["Review Current PLAN", "Add/Change"],
          "CD UPGR": [
            "Marketing/Promotional Offers",
            "Device Trade in/Recycling"
          ],
          "CD BILL ELEU": ["Discount"]
        },
        promise: [
          "Call_back",
          "Drop_ship",
          "Dispatch",
          "Send_to_offline",
          "No_charge",
          "Transfer",
          "First_appointment",
          "Sooner_appointment",
          "Will_be_there_today",
          "Refer_to_other_group",
          "Outage_will_be_resolved_by_time",
          "OTHER",
          "NO_PROMISE",
          "BROKEN_PROMISE",
          "promise_cancelled"
        ]
      },
    };
  },
  mounted() {
    this.contextMenuArray.splice(0, 4);

    this.initializeClipboard(this.$refs["context-menu"]);
  
  
   
  },
  computed: {},
  methods: {
    shouldShow(index){
     
        if(this.isSpeakerSelected){
            if(index>16){
              return true;
            }else{
              return false;
            }
        }else{

          if(index<17){
        return true;
          }else{
            return false;
          }
        
        }

    },

    handleDropdownClick(mainMenuItem, topicSubItem) {
      const col = this.firstRowTitles.indexOf(mainMenuItem);
      const row = this.$refs["selectedRow"].value;

      this.$emit("send-result-values", {
        row: row,
        col: col,
        text: topicSubItem
      });
      
     
    },
    isMultipleDropdown(item) {
      if (
        item == "TOPIC1" ||
        item == "TOPIC2" ||
        item == "promise1" ||
        item == "promise2" ||
        item == "agent" ||
        item == "customer"
      ) {
        return true;
      } else {
        return false;
      }
    },
    isTopicDropdown(item) {
      return item.substring(0, item.length - 1).toLowerCase() == "topic"
        ? true
        : false;
    },
    isPromiseDropdown(item) {
      return item.substring(0, item.length - 1).toLowerCase() == "promise"
        ? true
        : false;
    },
    handleContextClick(item) {
      const col = this.firstRowTitles.indexOf(item);
      const row = this.$refs["selectedRow"].value;

      this.$emit("send-result-values", {
        row: row,
        col: col,
        text: this.getSelectionText()
      });
    },
    getSelectionText() {
      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }
      return text;
    }
  }
};
</script>
