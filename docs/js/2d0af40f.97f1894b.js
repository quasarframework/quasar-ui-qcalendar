(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0af40f"],{"0e15":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("q-toolbar",[a("q-btn",{attrs:{stretch:"",flat:"",label:"Prev"},on:{click:e.calendarPrev}}),a("q-separator",{attrs:{vertical:""}}),a("q-btn",{attrs:{stretch:"",flat:"",label:"Next"},on:{click:e.calendarNext}}),a("q-space")],1),a("q-separator"),a("q-calendar",{ref:"calendar",staticStyle:{height:"400px"},attrs:{view:"month",locale:"en-us",animated:"","transition-prev":"slide-right","transition-next":"slide-left"},model:{value:e.selectedDate,callback:function(t){e.selectedDate=t},expression:"selectedDate"}})],1)},r=[],l={data:function(){return{selectedDate:"2019-04-01"}},methods:{calendarNext:function(){this.$refs.calendar.next()},calendarPrev:function(){this.$refs.calendar.prev()}}},c=l,s=a("2877"),i=Object(s["a"])(c,n,r,!1,null,null,null);t["default"]=i.exports}}]);