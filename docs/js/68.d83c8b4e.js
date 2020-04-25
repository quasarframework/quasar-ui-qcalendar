(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[68],{"67d2":function(e,t,n){"use strict";n.r(t),t["default"]='<template>\n  <div style="max-width: 800px; width: 100%;">\n    <q-toolbar>\n      <q-btn stretch flat label="Prev" @click="calendarPrev" />\n      <q-separator vertical />\n      <q-btn stretch flat label="Next" @click="calendarNext" />\n      <q-space />\n    </q-toolbar>\n    <q-separator />\n    <q-splitter\n      v-model="splitterModel"\n      :limits="[30, 100]"\n      emit-immediately\n    >\n    <template v-slot:before>\n      <div style="overflow: hidden;">\n        <q-calendar\n          ref="calendar"\n          v-model="selectedDate"\n          view="month"\n          locale="en-us"\n          :mini-mode="miniMode"\n          animated\n          transition-prev="slide-right"\n          transition-next="slide-left"\n          :selected-dates="selectedDates"\n          @click:day="onToggleDate"\n          @click:date="onToggleDate"\n        />\n      </div>\n      </template>\n      <template v-slot:separator>\n        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />\n      </template>\n      <template v-slot:after>\n        <div style="min-width: 20px"></div>\n      </template>\n    </q-splitter>\n  </div>\n</template>\n\n<script>\nexport default {\n  data () {\n    return {\n      splitterModel: 90, // start at 90%\n      miniMode: false,\n      selectedDate: \'\',\n      selectedDates: []\n    }\n  },\n\n  watch: {\n    splitterModel (val) {\n      const rect = this.$refs.calendar.$el.getBoundingClientRect()\n      this.miniMode = rect.width < 500\n    }\n  },\n\n  methods: {\n    calendarNext () {\n      this.$refs.calendar.next()\n    },\n\n    calendarPrev () {\n      this.$refs.calendar.prev()\n    },\n\n    classDay (timestamp) {\n      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {\n        return this.getBetween(timestamp)\n      }\n    },\n\n    onToggleDate (timestamp) {\n      if (this.selectedDates.includes(timestamp.date)) {\n        // remove the date\n        for (let i = 0; i < this.selectedDates.length; ++i) {\n          if (timestamp.date === this.selectedDates[i]) {\n            this.selectedDates.splice(i, 1)\n            break\n          }\n        }\n      } else {\n        // add the date\n        this.selectedDates.push(timestamp.date)\n      }\n    }\n  }\n}\n<\/script>\n'}}]);