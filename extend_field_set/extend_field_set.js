/**
 * @author CZQ
 * @version 1.0, 2018/12/10
 */
//引入必要的控件/组件.
var $table;
var __control__ = ["jquery","tyUI","easyModule","zTree","Ajax"];
require(__control__, function ($,ty,el,tt,ztree) {
    $(function () {
        $.loading(650);
        $table = $("#fieldTable");
        using(["datagrid"],function () {
            initGrid();
        });
    });
});

//初始化搜索框
function initSearch() {
    using(["searchbox"],function () {
        $("#fieldName").searchbox({
            width:200,
            prompt: '请输入字段名称搜索...',
            searcher: function (value) {
                var option = $table.datagrid("options")["queryParams"];
                option["search_field_name_like"] = value;
                option["search_record_table_name_eq"] = "JBXX";
                $table.datagrid("reload");
            }
        });
    });
}

//事件绑定
function bindEvent(){
    $('[data-role="event"]').unbind('click').click(function (e) {
        var _e = e||window.event,target = _e.target||_e.srcElement,row;
        if($(target).attr("data-row")) row = JSON.parse(unescape($(target).attr("data-row")));
        switch (target.id) {
            case "add":
                setFiled("新增扩展字段",true,null);
                break;
            case "edit":
                setFiled("编辑字段",false,row);
                break;
            case "remove":
                deleteFiled(row.id);
                break;
        }
    });
}

//新增 编辑
function setFiled(title,bool,data) {
    ty.createIframeDialog({
        title: title,
        src: "/ps/system_set/extend_field_set/newly_field.html",
        width: 400,
        height: 220,
        indata:{"isAdd":bool,"row":data},
        minimizable: false,
        maximizable: false,
        callback: function (flag) {
            if (flag) {
                $.message({
                    type: "success",
                    text: !bool ? "修改成功" : $.fn.__ty__.add.success
                });
                $table.datagrid("reload");
            }
        }
    });
}

//删除
function deleteFiled(id) {
    ty.createTopConfirm({
        "content": $.fn.__ty__.del.body,
        "callback_yes": function () {
            Ajax["delete"]({
                url:"/ps/recordField/delete",
                data:{"id":id}|| ""
            },function () {
                $.message({type: "success", text: $.fn.__ty__.del.success});
                $table.datagrid("reload");
            },function (msg) {
                $.message({
                    type: "error",
                    text:msg
                })
            })
        }
    })
}

//初始化字段列表
function initGrid(){
    $table.datagrid({
        url: '/ps/recordField/page',
        method:"get",
        queryParams:{
            "search_is_extend_eq":0,
            "search_record_table_name_eq":"JBXX"
        },
        toolbar: "#filedToolbar",
        excVertical:['filedToolbar'],
        nowrap:false,
        fit: true,
        fitColumns: true,
        pagination: true,
        pageSize: 30,
        pageList: [15, 30, 50, 100],
        scrollbarSize: 0,
        emptyMsg: '<span>暂无数据...</span>',
         loadFilter: function (data) {
             if(!data.success){
                 $.message({type: "error", text: data.message});
                 return false;
             }
             return data.content;
         },
        onLoadSuccess:function (data) {
            var len = data["rows"].length,a = $("#add");
            if(len===10){
               if(!a.attr("disabled")){
                   a.attr("disabled","disabled");
               }
            }else {
               if(a.attr("disabled")){
                   a.removeAttr("disabled");
               }
            }
            bindEvent();
        },
        columns:[[
            {
                title: 'check',
                field: 'id',
                align: 'left',
                checkbox: true
            },
            {
                field: 'number',
                align: 'left',
                title: '序号',
                formatter:function (value,row,index) {
                    return index+1;
                }
            },
            {
                field: 'recordClassifyName',
                align: 'left',
                title: '所属档案表',
                width: 100,
                formatter:function () {
                    return "基本数据";
                }
            },
            {
                field: 'fieldName',
                align: 'left',
                title: '字段名称',
                width: 100
            },
            {
                field: 'controlTypes',
                align: 'left',
                title: '控件类型',
                width: 100
            },
            {
                field:'dataSource',
                title:'取值数据字典',
                width:100,
                align:'left'
            },
            {
                field: 'option',
                align: 'center',
                title: '操作',
                width: 100,
                formatter: function (value, row) {
                    var objRow = escape(JSON.stringify(row));
                    var e = "<a id='edit' data-role='event' data-row="+objRow+" class='set'>编辑</a>";
                    var n = "<a id='remove' data-role='event' data-row="+objRow+" class='nel'>删除</a>";
                    return e + n;
                }
            }
        ]]
    }).datagrid("resizeExt");
    initSearch();
}
