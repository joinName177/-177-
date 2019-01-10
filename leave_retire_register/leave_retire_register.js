/**
 * @author CZQ
 * @version 1.0, 2018/12/28
 */
var firstLoad = false;
var __control__ = ["jquery","tyUI","easyModule","zTree","Ajax"];
require(__control__, function ($,ty,el,ztree,Ajax) {
    using(["datagrid"],function () {
        $(function () {
            initText("userName","请输入姓名");
            initText("userCode","请输入工号");
            initRetireGrid();
            bindEvent();
        });
    });

    /**
     * 初始化表格数据
     */
    function initRetireGrid(){
        if(!firstLoad){
            firstLoad = true;
            $("#retireGrid").datagrid({
                url: '/ps/personRetire/pageAll',
                method:"POST",
                toolbar: "#toolbar",
                excVertical:['toolbar'],
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
                columns:[[
                    {
                        field: 'userName',
                        align: 'left',
                        title: '姓名',
                        width: 80
                    },
                    {
                        field: 'workNo',
                        align: 'left',
                        title: '工号',
                        width: 80
                    },
                    {
                        field:'sexName',
                        title:'性别',
                        width:80,
                        align:'left'
                    },
                    {
                        field:'orgName',
                        title:'部门',
                        width:80,
                        align:'left'
                    },
                    {
                        field:'retireTypeName',
                        title:'离退休类别',
                        width:80,
                        align:'left'
                    },
                    {
                        field:'retireDate',
                        title:'离退起始日期',
                        width:100,
                        align:'left'
                    },
                    {
                        field:'createDate',
                        title:'申请日期',
                        width:100,
                        align:'left'
                    },
                    {
                        field:'auditStatus',
                        title:'状态',
                        width:80,
                        align:'left',
                        formatter:auditStatus
                    },
                    {
                        field: 'opt',
                        align: 'center',
                        title: '操作',
                        width: 100,
                        formatter:operation
                    }
                ]]
            }).datagrid("resizeExt");
            function auditStatus(value) {
                var filterState = function (color,msg) {
                    return '<div class="p">' +
                        '   <i class="icon iconfont icon-yuandianxiao fa" style="color:'+color+'"></i>' +
                        '   <span>'+msg+'</span>' +
                        '   </div>'
                };
                switch (value) {
                    case "audit_pass":return filterState('#27d82e','已通过');
                    case "auditing":return filterState('#03A9F4','待审核');
                    case "reject":return filterState('#FF9800','已退回');
                }
            }
            function operation(value, row) {
                return "<a style='color: #008ffc;' id='detail' data-role='event' data-id="+row.id+">详情</a>";
            }
        }else {
            $("#retireGrid").datagrid("load",{
                name:$("#userName").val(),
                workNo:$("#userCode").val()
            });
        }
    }

    /**
     * 事件绑定
     */
    function bindEvent(){
        $("#container").on("click",'[data-role="event"]',function (e) {
            var _e = e||window.event,rowId,pageSrc;
            var target = _e.target||_e.srcElement;
            if($(target).attr("data-id")) rowId = $(target).attr("data-id");
            switch (target.id) {
                case "create":
                    pageSrc = "/ps/worker_change_mana/leave_retire_register/leave_retire_add.html";
                    createShowRetire("新增离退休",pageSrc,null);
                    break;
                case "detail":
                    pageSrc = "/ps/worker_change_mana/leave_retire_register/detail.html";
                    createShowRetire("离退休详情",pageSrc,rowId);
                    break;
                default:
                    initRetireGrid();
            }
        });
    }

    /**
     * 抽离弹窗
     * @param tit
     * @param src
     * @param param
     */
    function createShowRetire(tit,src,param) {
        var options = {
            title: tit,
            src: src,
            width:!param?760:1000,
            height:!param?325:600,
            indata:!param ? {} : param,
            buttons:!param?[{
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
                if (flag) {
                    $.message({
                        type: "success",
                        text: $.fn.__ty__.modify.success
                    });
                    $("#retireGrid").datagrid("reload");
                }
            }
        };
        ty.createIframeDialog(options);
    }

    /**
     * 文本框初始化抽离
     * @param name
     * @param prompt
     */
    function initText(name,prompt){
        using(["textbox"],function () {
            $('input[name="'+name+'"]').textbox({
                width:150,
                prompt:prompt
            });
        });
    }
});



