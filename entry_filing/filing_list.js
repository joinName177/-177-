/**
 * @author CZQ
 * @version 1.0, 2018/12/17
 */
//引入必要的控件/组件.
var $gridTable,isCreate,typeCode;//typeCode教工类型CODE
var __control__ = ["jquery","tyUI","easyModule","Ajax"];
require(__control__, function ($,ty,el,tt) {
    $(function () {
        $.loading(650);
        $gridTable = $("#filingList");
        using(["datagrid","combotree","textbox","combobox"],function () {
            initGrid();
        });
    });
});

/**
 * 初始化档案列表
 */
function initGrid(){
    $gridTable.datagrid({
        url:'/ps/personBase/page',
        method:"get",
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
            var err = {type: "error", text: data.message};
            return (!data.success ? $.message(err) : data.content);
        },
        onLoadSuccess:function () {
            bindEvent();
        },
        columns:[[
            {
                field: 'number',
                title: '序号', align: 'left',
                width: 50,
                formatter:revertNum
            },
            {
                field: 'userName',
                title: '姓名',
                align: 'left',
                width: 100
            },
            {
                field: 'sexName',
                title: '性别',
                align: 'left',
                width: 100
            },
            {
                field: 'identityCard',
                title: '身份证号',
                align: 'left',
                width: 130
            },
            {
                field:'staffTypeName',
                title:'教工类型',
                align:'left',
                width:100
            },
            {
                field:'dateOnBoard',
                title:'入职日期',
                align:'left',
                width:100
            },
            {
                field:'orgName',
                title:'入职部门',
                align:'left',
                width:100
            },
            {
                field:'createPersonBaseDate',
                title:'建档日期',
                align:'left',
                width:130
            },
            {
                field:'auditStatus',
                title:'流程状态',
                align:'left',
                width:100,
                formatter:auditStatus
            },
            {
                field: 'option',
                title: '操作',
                align: 'center',
                width: 100,
                formatter: option
            }
        ]]
    }).datagrid("resizeExt");
    $("#fieldName").textbox({prompt: '姓名/身份证号',width:150});
    initStaffType();
}

/**
 * 获取教工类型码表数据、渲染
 */
function initStaffType() {
    var __config = {url:"/ps/item/getTreeByCodes",data:{"list":"JGLX"}};
    Ajax.post(__config,function (response) {
        var data = response.content;
        data["JGLX"].unshift({"id":"00", "code":false, "text":"全部"});
        $("#staffType").combotree({
            data:data["JGLX"],
            panelHeight:'auto',
            onSelect:function (node) {
                typeCode = "";
                var childArr = node.children;
                if($.isArray(childArr) && childArr.length){
                    for(var i = childArr.length;i--;){
                        if(typeCode) typeCode += ",";
                        typeCode += childArr[i].code;
                    }
                }else {
                    typeCode = (node.code ? node.code : "");
                }
            },
            onShowPanel:function () {
                $(this).combobox('panel').width("auto");
            }
        });
    },function (error) {
        $.message({type: "error", text: error});
    })
}

/**
 * 事件绑定
 */
function bindEvent(){
    $('[data-role="event"]').unbind('click').click(function (e) {
        var _e = e||window.event,rowId;
        var target = _e.target||_e.srcElement;
        if($(target).attr("data-id")) rowId = $(target).attr("data-id");
        switch (target.id) {
            case "create":
                isCreate = true;
                entryFiling("入职建档","/ps/entry_work_mana/entry_filing/entry_filing.html",null);
                break;
            case "detail":
                isCreate = false;
                entryFiling("入职建档详情","/ps/entry_work_mana/entry_filing/entry_filing_detail.html",rowId);
                break;
            default:
                $gridTable.datagrid('load',{
                    "userNameOrIdentityCard":$("#fieldName").textbox('getValue'),
                    "staffTypes":typeCode || ""
                });
        }
    });
}

/**
 * 抽离dialog弹窗
 */
function entryFiling(title,srcUrl,id) {
    ty.createIframeDialog({
        title: title,
        src: srcUrl,
        width: !id ? 760 : 1000,
        height: !id ? 465 : 600,
        indata:id||{},
        buttons:!id ?[{
            id : "cancel",
            name : "取消",
            funcName : "dialogCancel"
        },{
            id : "sure",
            name : "确定",
            funcName : "dialogOk"
        }] : [{
            id : "cancel",
            name : "关闭",
            funcName : "dialogCancel"
        }],
        minimizable: false,
        maximizable: false,
        callback: function (flag) {
            if (flag && isCreate) {
                $gridTable.datagrid("reload");
                $.message({
                    type: "success",
                    text: $.fn.__ty__.add.success
                });
            }
        }
    });
}

/**
 * 状态,操作,序号
 */
function auditStatus(value) {
    var filterState = function (color,msg) {
        return '<div class="p">' +
            '   <i class="icon iconfont icon-yuandianxiao fa" style="color:'+color+'"></i>' +
            '   <span>'+msg+'</span>' +
            '   </div>'
    };
    switch (value) {
        case "new":return filterState("#03A9F4","新建");
        case "audit_pass":return filterState('#27d82e','审核通过');
        case "auditing":return filterState('#F44336','审核中');
        case "reject":return filterState('#7b0505','驳回');
    }
}
function option(value,row) {
    return"<a style='color:#008ffc;' id='detail' data-role='event' data-id="+row.id+">详情</a>";
}
function revertNum(value,row,index) {
    return index + 1;
}