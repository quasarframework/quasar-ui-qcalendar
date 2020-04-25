(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[79],{"5a6c":function(e,r,n){"use strict";n.r(r),r["default"]="<template>\n  <div style=\"max-width: 800px; width: 100%;\">\n    <div class=\"full-width q-pa-md\">\n      <q-select\n        outlined\n        dense\n        emit-value\n        map-options\n        label=\"Change theme\"\n        v-model=\"theme\"\n        :options=\"themesList\"\n        class=\"col-12\"\n      ></q-select>\n    </div>\n    <q-separator></q-separator>\n    <q-splitter\n      v-model=\"splitterModel\"\n      :limits=\"[30, 100]\"\n      emit-immediately\n    >\n      <template v-slot:before>\n        <div style=\"overflow: hidden;\">\n          <q-calendar\n            ref=\"calendar\"\n            v-model=\"selectedDate\"\n            view=\"month\"\n            locale=\"en-us\"\n            enable-theme\n            :theme=\"theme\"\n            :mini-mode=\"miniMode\"\n          />\n        </div>\n      </template>\n      <template v-slot:separator>\n        <q-avatar color=\"primary\" text-color=\"white\" size=\"40px\" icon=\"drag_indicator\" />\n      </template>\n      <template v-slot:after>\n        <div style=\"min-width: 20px\"></div>\n      </template>\n    </q-splitter>\n  </div>\n</template>\n\n<script>\nexport default {\n  data () {\n    return {\n      splitterModel: 90,\n      miniMode: false,\n      selectedDate: '',\n      theme: {\n        name: 'default'\n      },\n      themes: [\n        {\n          name: 'default'\n        },\n        {\n          name: 'dark',\n          // body\n          colorBody: 'grey-2',\n          backgroundBody: 'blue-grey-8',\n          colorBodyOutside: 'grey-6',\n          backgroundBodyOutside: 'blue-grey-9',\n          colorBodyPast: 'grey-11',\n          backgroundBodyPast: 'blue-grey-10',\n          colorBodyCurrent: 'blue-grey-2',\n          backgroundBodyCurrent: 'blue-grey-10',\n          colorBodyFuture: 'blue-grey-2',\n          backgroundBodyFuture: 'blue-grey-10',\n          // header - weekly only\n          colorHeader: 'blue-grey-2',\n          backgroundHeader: 'blue-grey-10',\n          colorHeaderOutside: 'blue-grey-2',\n          backgroundHeaderOutside: 'blue-grey-10',\n          // header - for daily only\n          colorHeaderPast: 'grey-11',\n          backgroundHeaderPast: 'blue-grey-10',\n          colorHeaderCurrent: 'blue-grey-2',\n          backgroundHeaderCurrent: 'blue-grey-10',\n          colorHeaderFuture: 'blue-grey-2',\n          backgroundHeaderFuture: 'blue-grey-10',\n          // work week - monthly only\n          colorWorkWeekPast: 'blue-grey-8',\n          backgroundWorkWeekPast: 'blue-grey-6',\n          colorWorkWeekCurrent: 'orange-4',\n          backgroundWorkWeekCurrent: 'blue-grey-10',\n          colorWorkWeekFuture: 'yellow-4',\n          backgroundWorkWeekFuture: 'blue-grey-10',\n          // label\n          colorDayLabelOutside: 'blue-grey-2',\n          backgroundDayLabelOutside: 'blue-grey-9',\n          colorDayLabelPast: 'yellow-4',\n          backgroundDayLabelPast: 'blue-grey-10',\n          colorDayLabelCurrent: 'orange-4',\n          backgroundDayLabelCurrent: 'blue-grey-10',\n          colorDayLabelFuture: 'yellow-4',\n          backgroundDayLabelFuture: 'blue-grey-10',\n          // interval body\n          colorIntervalHeader: 'grey-2',\n          backgroundIntervalHeader: 'blue-grey-10',\n          colorIntervalBody: 'grey-2',\n          backgroundIntervalBody: 'blue-grey-10',\n          colorIntervalText: 'grey-2',\n          backgroundIntervalText: 'blue-grey-10',\n          // scheduler body\n          colorSchedulerHeader: 'grey-2',\n          backgroundSchedulerHeader: 'blue-grey-10',\n          colorSchedulerBody: 'grey-2',\n          backgroundSchedulerBody: 'blue-grey-10',\n          colorSchedulerText: 'grey-2',\n          backgroundSchedulerText: 'blue-grey-10'\n        },\n        {\n          name: 'teal',\n          // body\n          colorBody: 'grey-2',\n          backgroundBody: 'teal-8',\n          colorBodyOutside: 'grey-6',\n          backgroundBodyOutside: 'teal-9',\n          colorBodyPast: 'grey-11',\n          backgroundBodyPast: 'teal-10',\n          colorBodyCurrent: 'teal-2',\n          backgroundBodyCurrent: 'teal-10',\n          colorBodyFuture: 'teal-2',\n          backgroundBodyFuture: 'teal-10',\n          // header - weekly only\n          colorHeader: 'teal-2',\n          backgroundHeader: 'teal-10',\n          colorHeaderOutside: 'teal-2',\n          backgroundHeaderOutside: 'teal-10',\n          // header - for daily only\n          colorHeaderPast: 'grey-11',\n          backgroundHeaderPast: 'teal-10',\n          colorHeaderCurrent: 'teal-2',\n          backgroundHeaderCurrent: 'teal-10',\n          colorHeaderFuture: 'teal-2',\n          backgroundHeaderFuture: 'teal-10',\n          // work week - monthly only\n          colorWorkWeekPast: 'teal-8',\n          backgroundWorkWeekPast: 'teal-6',\n          colorWorkWeekCurrent: 'orange-4',\n          backgroundWorkWeekCurrent: 'teal-10',\n          colorWorkWeekFuture: 'yellow-4',\n          backgroundWorkWeekFuture: 'teal-10',\n          // label\n          colorDayLabelOutside: 'teal-2',\n          backgroundDayLabelOutside: 'teal-9',\n          colorDayLabelPast: 'yellow-4',\n          backgroundDayLabelPast: 'teal-10',\n          colorDayLabelCurrent: 'orange-4',\n          backgroundDayLabelCurrent: 'teal-10',\n          colorDayLabelFuture: 'yellow-4',\n          backgroundDayLabelFuture: 'teal-10',\n          // interval body\n          colorIntervalHeader: 'grey-2',\n          backgroundIntervalHeader: 'teal-10',\n          colorIntervalBody: 'grey-2',\n          backgroundIntervalBody: 'teal-10',\n          colorIntervalText: 'grey-2',\n          backgroundIntervalText: 'teal-10',\n          // scheduler body\n          colorSchedulerHeader: 'grey-2',\n          backgroundSchedulerHeader: 'teal-10',\n          colorSchedulerBody: 'grey-2',\n          backgroundSchedulerBody: 'teal-10',\n          colorSchedulerText: 'grey-2',\n          backgroundSchedulerText: 'teal-10'\n        },\n        {\n          name: 'brown',\n          // body\n          colorBody: 'brown-2',\n          backgroundBody: 'brown-8',\n          colorBodyOutside: 'grey-6',\n          backgroundBodyOutside: 'brown-9',\n          colorBodyPast: 'grey-11',\n          backgroundBodyPast: 'brown-10',\n          colorBodyCurrent: 'brown-2',\n          backgroundBodyCurrent: 'brown-10',\n          colorBodyFuture: 'brown-2',\n          backgroundBodyFuture: 'brown-10',\n          // header - weekly only\n          colorHeader: 'brown-2',\n          backgroundHeader: 'brown-10',\n          colorHeaderOutside: 'brown-2',\n          backgroundHeaderOutside: 'brown-10',\n          // header - for daily only\n          colorHeaderPast: 'grey-11',\n          backgroundHeaderPast: 'brown-10',\n          colorHeaderCurrent: 'brown-2',\n          backgroundHeaderCurrent: 'brown-10',\n          colorHeaderFuture: 'brown-2',\n          backgroundHeaderFuture: 'brown-10',\n          // work week - monthly only\n          colorWorkWeekPast: 'brown-8',\n          backgroundWorkWeekPast: 'brown-6',\n          colorWorkWeekCurrent: 'orange-4',\n          backgroundWorkWeekCurrent: 'brown-10',\n          colorWorkWeekFuture: 'yellow-4',\n          backgroundWorkWeekFuture: 'brown-10',\n          // label\n          colorDayLabelOutside: 'brown-2',\n          backgroundDayLabelOutside: 'brown-9',\n          colorDayLabelPast: 'yellow-4',\n          backgroundDayLabelPast: 'brown-10',\n          colorDayLabelCurrent: 'orange-4',\n          backgroundDayLabelCurrent: 'brown-10',\n          colorDayLabelFuture: 'yellow-4',\n          backgroundDayLabelFuture: 'brown-10',\n          // interval body\n          colorIntervalHeader: 'grey-2',\n          backgroundIntervalHeader: 'brown-10',\n          colorIntervalBody: 'grey-2',\n          backgroundIntervalBody: 'brown-10',\n          colorIntervalText: 'grey-2',\n          backgroundIntervalText: 'brown-10',\n          // scheduler body\n          colorSchedulerHeader: 'grey-2',\n          backgroundSchedulerHeader: 'brown-10',\n          colorSchedulerBody: 'grey-2',\n          backgroundSchedulerBody: 'brown-10',\n          colorSchedulerText: 'grey-2',\n          backgroundSchedulerText: 'brown-10'\n        },\n        {\n          name: 'deep purple',\n          // body\n          colorBody: 'grey-2',\n          backgroundBody: 'deep-purple-8',\n          colorBodyOutside: 'grey-6',\n          backgroundBodyOutside: 'deep-purple-9',\n          colorBodyPast: 'grey-11',\n          backgroundBodyPast: 'deep-purple-10',\n          colorBodyCurrent: 'deep-purple-2',\n          backgroundBodyCurrent: 'deep-purple-10',\n          colorBodyFuture: 'deep-purple-2',\n          backgroundBodyFuture: 'deep-purple-10',\n          // header - weekly only\n          colorHeader: 'deep-purple-2',\n          backgroundHeader: 'deep-purple-10',\n          colorHeaderOutside: 'deep-purple-2',\n          backgroundHeaderOutside: 'deep-purple-10',\n          // header - for daily only\n          colorHeaderPast: 'grey-11',\n          backgroundHeaderPast: 'deep-purple-10',\n          colorHeaderCurrent: 'deep-purple-2',\n          backgroundHeaderCurrent: 'deep-purple-10',\n          colorHeaderFuture: 'deep-purple-2',\n          backgroundHeaderFuture: 'deep-purple-10',\n          // work week - monthly only\n          colorWorkWeekPast: 'deep-purple-8',\n          backgroundWorkWeekPast: 'deep-purple-6',\n          colorWorkWeekCurrent: 'orange-4',\n          backgroundWorkWeekCurrent: 'deep-purple-10',\n          colorWorkWeekFuture: 'yellow-4',\n          backgroundWorkWeekFuture: 'deep-purple-10',\n          // label\n          colorDayLabelOutside: 'deep-purple-2',\n          backgroundDayLabelOutside: 'deep-purple-9',\n          colorDayLabelPast: 'yellow-4',\n          backgroundDayLabelPast: 'deep-purple-10',\n          colorDayLabelCurrent: 'orange-4',\n          backgroundDayLabelCurrent: 'deep-purple-10',\n          colorDayLabelFuture: 'yellow-4',\n          backgroundDayLabelFuture: 'deep-purple-10',\n          // interval body\n          colorIntervalHeader: 'grey-2',\n          backgroundIntervalHeader: 'deep-purple-10',\n          colorIntervalBody: 'grey-2',\n          backgroundIntervalBody: 'deep-purple-10',\n          colorIntervalText: 'grey-2',\n          backgroundIntervalText: 'deep-purple-10',\n          // scheduler body\n          colorSchedulerHeader: 'grey-2',\n          backgroundSchedulerHeader: 'deep-purple-10',\n          colorSchedulerBody: 'grey-2',\n          backgroundSchedulerBody: 'deep-purple-10',\n          colorSchedulerText: 'grey-2',\n          backgroundSchedulerText: 'deep-purple-10'\n        },\n        {\n          name: 'indigo',\n          // body\n          colorBody: 'grey-2',\n          backgroundBody: 'indigo-8',\n          colorBodyOutside: 'grey-6',\n          backgroundBodyOutside: 'indigo-9',\n          colorBodyPast: 'grey-11',\n          backgroundBodyPast: 'indigo-10',\n          colorBodyCurrent: 'indigo-2',\n          backgroundBodyCurrent: 'indigo-10',\n          colorBodyFuture: 'indigo-2',\n          backgroundBodyFuture: 'indigo-10',\n          // header - weekly only\n          colorHeader: 'indigo-2',\n          backgroundHeader: 'indigo-10',\n          colorHeaderOutside: 'indigo-2',\n          backgroundHeaderOutside: 'indigo-10',\n          // header - for daily only\n          colorHeaderPast: 'grey-11',\n          backgroundHeaderPast: 'indigo-10',\n          colorHeaderCurrent: 'indigo-2',\n          backgroundHeaderCurrent: 'indigo-10',\n          colorHeaderFuture: 'indigo-2',\n          backgroundHeaderFuture: 'indigo-10',\n          // work week - monthly only\n          colorWorkWeekPast: 'indigo-8',\n          backgroundWorkWeekPast: 'indigo-6',\n          colorWorkWeekCurrent: 'orange-4',\n          backgroundWorkWeekCurrent: 'indigo-10',\n          colorWorkWeekFuture: 'yellow-4',\n          backgroundWorkWeekFuture: 'indigo-10',\n          // label\n          colorDayLabelOutside: 'indigo-2',\n          backgroundDayLabelOutside: 'indigo-9',\n          colorDayLabelPast: 'yellow-4',\n          backgroundDayLabelPast: 'indigo-10',\n          colorDayLabelCurrent: 'orange-4',\n          backgroundDayLabelCurrent: 'indigo-10',\n          colorDayLabelFuture: 'yellow-4',\n          backgroundDayLabelFuture: 'indigo-10',\n          // interval body\n          colorIntervalHeader: 'grey-2',\n          backgroundIntervalHeader: 'indigo-10',\n          colorIntervalBody: 'grey-2',\n          backgroundIntervalBody: 'indigo-10',\n          colorIntervalText: 'grey-2',\n          backgroundIntervalText: 'indigo-10',\n          // scheduler body\n          colorSchedulerHeader: 'grey-2',\n          backgroundSchedulerHeader: 'indigo-10',\n          colorSchedulerBody: 'grey-2',\n          backgroundSchedulerBody: 'indigo-10',\n          colorSchedulerText: 'grey-2',\n          backgroundSchedulerText: 'indigo-10'\n        },\n        {\n          name: 'blue',\n          // body\n          colorBody: 'grey-2',\n          backgroundBody: 'blue-8',\n          colorBodyOutside: 'grey-6',\n          backgroundBodyOutside: 'blue-9',\n          colorBodyPast: 'grey-11',\n          backgroundBodyPast: 'blue-10',\n          colorBodyCurrent: 'blue-2',\n          backgroundBodyCurrent: 'blue-10',\n          colorBodyFuture: 'blue-2',\n          backgroundBodyFuture: 'blue-10',\n          // header - weekly only\n          colorHeader: 'blue-2',\n          backgroundHeader: 'blue-10',\n          colorHeaderOutside: 'blue-2',\n          backgroundHeaderOutside: 'blue-10',\n          // header - for daily only\n          colorHeaderPast: 'grey-11',\n          backgroundHeaderPast: 'blue-10',\n          colorHeaderCurrent: 'blue-2',\n          backgroundHeaderCurrent: 'blue-10',\n          colorHeaderFuture: 'blue-2',\n          backgroundHeaderFuture: 'blue-10',\n          // work week - monthly only\n          colorWorkWeekPast: 'blue-8',\n          backgroundWorkWeekPast: 'blue-6',\n          colorWorkWeekCurrent: 'orange-4',\n          backgroundWorkWeekCurrent: 'blue-10',\n          colorWorkWeekFuture: 'yellow-4',\n          backgroundWorkWeekFuture: 'blue-10',\n          // label\n          colorDayLabelOutside: 'blue-2',\n          backgroundDayLabelOutside: 'blue-9',\n          colorDayLabelPast: 'yellow-4',\n          backgroundDayLabelPast: 'blue-10',\n          colorDayLabelCurrent: 'orange-4',\n          backgroundDayLabelCurrent: 'blue-10',\n          colorDayLabelFuture: 'yellow-4',\n          backgroundDayLabelFuture: 'blue-10',\n          // interval body\n          colorIntervalHeader: 'grey-2',\n          backgroundIntervalHeader: 'blue-10',\n          colorIntervalBody: 'grey-2',\n          backgroundIntervalBody: 'blue-10',\n          colorIntervalText: 'grey-2',\n          backgroundIntervalText: 'blue-10',\n          // scheduler body\n          colorSchedulerHeader: 'grey-2',\n          backgroundSchedulerHeader: 'blue-10',\n          colorSchedulerBody: 'grey-2',\n          backgroundSchedulerBody: 'blue-10',\n          colorSchedulerText: 'grey-2',\n          backgroundSchedulerText: 'blue-10'\n        }\n      ]\n    }\n  },\n  computed: {\n    themesList () {\n      const list = []\n      this.themes.forEach((theme) => {\n        list.push({\n          label: theme.name,\n          value: { ...theme }\n        })\n      })\n      return list\n    }\n  },\n  watch: {\n    splitterModel (val) {\n      const rect = this.$refs.calendar.$el.getBoundingClientRect()\n      this.miniMode = rect.width < 500\n    }\n  }\n}\n<\/script>\n"}}]);