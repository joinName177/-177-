/**
 * @author CZQ
 * @version 1.0, 2018/12/11
 */
var dialogId;
//引入必要的控件/组件.
var __control__ = ["jquery","tyUI","easyModule","Ajax"];
require(__control__, function ($,ty,el,tt) {
    $(function () {
        $.loading(10);
        dialogId = $.getUrlParam("dialogId");
        using(["datagrid"],function () {
            initGrid();
        });
    });
});

//初始化字典列表
function initGrid(){
    $("#dictGrid").datagrid({
        url: '/platform/common/dict/list',
        toolbar: "#toolbar",
        fit: true,
        fitColumns: true,
        nowrap:false,
        singleSelect:true,
        pagination: true,
        pageSize: 30,
        pageList: [15, 30, 50, 100],
        scrollbarSize: 0,
        excVertical:['toolbar'],
        emptyMsg: '<span>暂无数据...</span>',
         loadFilter: function (data) {
             if(!data.success){
                 $.message({type: "error", text: data.message});
                 return false;
             }
             return data.content;
         },
        onLoadSuccess:function(){
            var p = $(".datagrid-pager").find("td");
            p.eq(2).hide();
            p.eq(10).hide();
        },
        columns:[[
            {
                field: 'name',
                align: 'left',
                title: '名称',
                width: 100
            },
            {
                field: 'code',
                align: 'left',
                title: '编码',
                width: 100
            }
        ]]
    }).datagrid("resizeExt");
    initSearch();
}

//初始化搜索框
function initSearch() {
    using(["searchbox"],function () {
        $("#search").searchbox({
            width:200,
            prompt: '名称搜索!',
            searcher: function (value) {
                var params = {};
                params["search_name_like"] = value;
                $("#dictGrid").datagrid('load', params);
            }
        })
    });
}

//确定
function dialogOk(){
    using(['form'],function () {
       var row = $("#dictGrid").datagrid("getSelected");
       if(!row){
           $.message({type: "info", text: $.fn.__ty__.modify.one});
           return;
       }
       ty.closeIframeDialog(dialogId,row);
    });
}

//取消
function  dialogCancel() {
    ty.closeIframeDialog(dialogId)
}



