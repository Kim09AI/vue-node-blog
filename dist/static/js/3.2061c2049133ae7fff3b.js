webpackJsonp([3],{"2GDZ":function(t,o,e){"use strict";o.b=function(t){return s.a.get("postCollection/"+t)},o.d=function(t){return s.a.post("postCollection/create",{postId:t})},o.c=function(t){return s.a.post("postCollection/del",{postId:t})},o.a=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20;return s.a.get("postCollection",{params:{page:t,limit:o}})};var s=e("rC09")},Ifmi:function(t,o,e){(t.exports=e("BkJT")(!0)).push([t.i,"","",{version:3,sources:[],names:[],mappings:"",file:"collection.vue",sourceRoot:""}])},d7P4:function(t,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var s=e("4YfN"),i=e.n(s),n=e("9rMa"),l=e("ZN2C"),a=e("QxSH"),c=e("hhm8"),r=e("F4+m"),h=e("2GDZ"),u={name:"sollection",mixins:[r.b,r.c,r.a],data:function(){return{list:[],title:"收藏的文章",page:1,hasMore:!0,showCollectionBtn:!0,showDelBtn:!1}},methods:{postClick:function(t){var o=this.list[t].postId;this.$router.push("/post/"+o)},delCollection:function(t){var o=this,e=this.list[t].postId;Object(h.c)(e).then(function(e){e.data.code===c.a&&o.list.splice(t,1)}).catch(console.log)},_getUserPostCollection:function(){var t=this;this.hasMore&&!this.isGetDataNow&&(this.isGetDataNow=!0,Object(h.a)(this.page).then(function(o){var e=o.data;if(e.code===c.a)if(e.data.length>0){t.page++;var s=t.timeFormat(t.postFormat(e.data));t.list=t.list.concat(s)}else t.hasMore=!1}).catch(console.log).finally(function(){return t.isGetDataNow=!1}))}},created:function(){this._getUserPostCollection(),this.pullup(this._getUserPostCollection)},activated:function(){!this.isPopState&&this.intoPageCount++&&(this.list=[],this.page=1,this.hasMore=!0,this._getUserPostCollection())},computed:i()({},Object(n.c)(["isPopState"])),components:{OtherHeader:l.a,PostList:a.a}},p={render:function(){var t=this.$createElement,o=this._self._c||t;return o("div",[o("other-header",{attrs:{title:this.title}}),this._v(" "),o("post-list",{attrs:{list:this.list,showCollectionBtn:this.showCollectionBtn,showDelBtn:this.showDelBtn},on:{collectionIndex:this.delCollection,postClick:this.postClick}})],1)},staticRenderFns:[]},d=e("OF7X")(u,p,!1,function(t){e("y8kQ")},"data-v-b6e4d9d4",null);o.default=d.exports},y8kQ:function(t,o,e){var s=e("Ifmi");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);e("8bSs")("4c152b42",s,!0)}});
//# sourceMappingURL=3.2061c2049133ae7fff3b.js.map