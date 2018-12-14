/**
 * @author CZQ
 * @version 1.0, 2018/12/7
 */
var queryParams = {};
//初始化input元素
function initElement() {
    using(['combobox','textbox','searchbox'],function () {
        require(['tyValidateRules'],function (tv) {
            $("#searchTree").searchbox({
                prompt: '支持档案表名称',
                validType: 'length[0,20]',
                searcher: searcherFn
            });
            $('input[name="field_name"]').textbox({
                width:150,
                prompt:"请输入字段名称"
            });
            initCombobox("is_fill",function (recode) {
                queryParams["search_required_eq"] = recode.state
            });
            initCombobox("is_maintain",function (recode) {
                queryParams["search_allow_update_eq"] = recode.state
            });
        })
    });
}

//初始化树
function archivesTree() {
    var paramConfig = {
        url:"/ps/recordClassify/list"
    };
    var setting = {
        view: {
            showLine: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: 0
            },
            key: {
                name: "recordClassifyName"
            }
        },
        callback: {
            onClick: zTreOnclick,
            beforeClick:zTreeBeforeClick
        }
    };

    //请求树数据
    Ajax["get"](paramConfig,function (res) {
        loadTree(res.content);
    },function (msg) {
        tips("error",msg);
    });
    //加载树
    function loadTree(data){
        $.fn.zTree.init($("#archivesTree"), setting, data);
        var zTree =  $.fn.zTree.getZTreeObj("archivesTree");
        zTree.expandAll(true);
        var nodes = zTree.getNodes();
        if (nodes.length>0) {
            if(nodes[0].children){
                if(nodes[0].children.length > 0){
                    zTree.selectNode(nodes[0].children[0]);
                    var node = nodes[0].children[0];
                    archivesGrid(node.recordTableName,node.recordClassifyName);
                }
            }
        }
    }
    //树节点点击事件
    function zTreOnclick(event, treeId, treeNode) {
        $("#field_name").textbox("clear");
        $("#is_fill").combobox("select",2);
        $("#is_maintain").combobox("select",2);
        queryParams["search_record_table_name_eq"] = treeNode.recordTableName;
        archivesGrid(treeNode.recordTableName,treeNode.recordClassifyName);
    }
    //树节点被点击前触发的事件
    function zTreeBeforeClick(treeId, treeNode) {
        return !!treeNode.classifyType;
    }
}

//搜索树
function searcherFn(value) {
    var zTree = $.fn.zTree.getZTreeObj("archivesTree");
    var nodeList1 = zTree.getNodesByParamFuzzy("recordClassifyName", value);
    $("#archivesTree").find(".searchNode").removeClass("searchNode");
    if (value) {
        for (var m = nodeList1.length; m--;) {
            zTree.selectNode(nodeList1[m]);
            zTree.cancelSelectedNode(nodeList1[m]);
            if (nodeList1[m].attributes == "1"){
                $("#" +nodeList1[m].tId+"_span").addClass("selectNode");
            }else{
                $("#" + nodeList1[m].tId).find("a").addClass("searchNode");
            }
        }
    }
}

//初始化字段表
function archivesGrid(tableName,classifyName){
    var config = {
        url: '/ps/recordField/page',
        method:"get",
        queryParams:{
            "search_record_table_name_eq":tableName

        },
        toolbar: "#archives_toolbar",
        excVertical:['archives_toolbar'],
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
                tips("error",data.message);
                return false;
            }
            return data.content;
        },
        onLoadSuccess:function () {
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
                field: 'recordTableName',
                align: 'left',
                title: '所属档案表',
                width: 120,
                formatter:function () {
                    return classifyName;
                }
            },
            {
                field: 'fieldName',
                align: 'left',
                title: '字段名称',
                width: 120
            },
            {
                field:'allowUpdate',
                title:'是否允许人工维护',
                width:100,
                align:'left',
                formatter:function (value) {
                    return !value ? "允许":value ===1?"不允许":"/";
                }
            },
            {
                field:'required',
                title:'是否必填',
                width:80,
                align:'left',
                formatter:function (value) {
                    return !value ? "是":value ===1?"否":"/";
                }
            },
            {
                field:'maintainer',
                title:'维护人员',
                width:80,
                align:'left',
                formatter:function (value) {
                    return !value ? "管理员及个人":value===-1?"/":"仅管理员";
                }
            },
            {
                field: 'option',
                align: 'center',
                title: '操作',
                width: 100,
                formatter: function (value, row) {
                    var objRow = escape(JSON.stringify(row));
                    return "<a id='setting' data-role='event' data-row="+objRow+" class='set'>权限设置</a>";
                }
            }
        ]]
    };
    $("#archivesTable").datagrid(config).datagrid("resizeExt");

}

//事件绑定
function bindEvent(){
    $('[data-role="event"]').unbind('click').click(function (e) {
        var _e = e||window.event,row;
        var target = _e.target||_e.srcElement,nodeId = target.id;
        if($(target).attr("data-row")){
            row = JSON.parse(unescape($(target).attr("data-row")));
        }
        nodeId === "setting" ? iframeFn("设置",row) : nodeId === "batchSet" ? batchSet() : searchArchives();
    });
}

//搜索字段
function searchArchives() {
    var fieldValue = $("#field_name").textbox("getValue");
    queryParams["search_field_name_like"] = fieldValue;
    $("#archivesTable").datagrid("load", queryParams);
}

//批量设置权限
function batchSet() {
    var rows = $("#archivesTable").datagrid("getSelections"),ids= [];
    if(!rows.length){
        tips("warning",$.fn.__ty__.modify.more);
        return false;
    }
    for(var i = rows.length;i--;){
        ids.push(rows[i].id);
    }
    iframeFn("批量设置",ids);
}

//抽离弹框 @param title 标题 param 参数
function iframeFn(title,param) {
    ty.createIframeDialog({
        title: title,
        src: "/ps/system_set/archives_field_set/batch_set.html",
        width: 420,
        height: 220,
        indata:param,
        minimizable: false,
        maximizable: false,
        callback: function (flag) {
            if (flag) {
                tips("success",$.fn.__ty__.modify.success);
                $("#archivesTable").datagrid("reload");
            }
        }
    });
}

//抽离下拉框
function initCombobox(name,callback) {
    var arr = [];
    if(name==="is_fill"){
        arr.push(
            {id:"0",text:'是',state:0},
            {id:"1",text:'否',state:1},
            {id:"2",text:'不限',state:"","selected":true});
    }else {
        arr.push(
            {id:"0",text:'允许',state:0},
            {id:"1",text:'不允许',state:1},
            {id:"2",text:'不限',state:"","selected":true});
    }
    $('input[name="'+name+'"]').combobox({
        data:arr,
        limitToList:true,
        editable:false,
        panelHeight:120,
        valueField:'id',
        textField:'text',
        onSelect:callback
    });
}

//抽离提示语
function tips(type,message) {
    $.message({
        type: type,
        text: message||"系统异常!"
    });
}

//引入必要的控件/组件.
var __control__ = ["jquery","tyUI","easyModule","zTree","Ajax"];
require(__control__, function ($,ty,el,tt,ztree,Ajax) {
    $(function () {
        using(["datagrid"],function () {
            initElement();
            archivesTree();
        });
    });
});