(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[104],{3610:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticStyle:{"max-width":"800px",width:"100%"}},[a("q-toolbar",[a("q-btn",{attrs:{stretch:"",flat:"",label:"Prev"},on:{click:e.calendarPrev}}),a("q-separator",{attrs:{vertical:""}}),a("q-btn",{attrs:{stretch:"",flat:"",label:"Next"},on:{click:e.calendarNext}}),a("q-space")],1),a("q-separator"),a("div",{staticStyle:{overflow:"hidden"}},[a("q-calendar",{ref:"calendar",attrs:{view:"month",locale:"en-us","show-work-weeks":"",animated:"","transition-prev":"slide-right","transition-next":"slide-left"},model:{value:e.selectedDate,callback:function(t){e.selectedDate=t},expression:"selectedDate"}})],1)],1)},r=[],l={data:function(){return{selectedDate:""}},methods:{calendarNext:function(){this.$refs.calendar.next()},calendarPrev:function(){this.$refs.calendar.prev()}}},c=l,s=a("2877"),o=a("65c6"),i=a("9c40"),d=a("eb85"),p=a("2c91"),u=a("eebe"),f=a.n(u),h=Object(s["a"])(c,n,r,!1,null,null,null);t["default"]=h.exports;f()(h,"components",{QToolbar:o["a"],QBtn:i["a"],QSeparator:d["a"],QSpace:p["a"]})}}]);