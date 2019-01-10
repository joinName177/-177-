/**
 * @author CZQ
 * @version 1.0, 2019/1/7
 */
var taskId,runId,userId,opinionId,personRetireId,actInstId,uNitId,baseId;
var _$file_ = ["jquery","tyUI","easyModule","tyUpload",'../../common/util.js',"Ajax"];
require(_$file_, function ($,ty,el,tyUpload,util,Ajax) {
    $(function () {
        $.loading(650);
        using(['textbox','datebox','combobox','messager','dialog'], function () {
            initText("userName",1,0);
            initText("sexName",1,0);
            $("#retireDate").datebox();
            initText("payDepartment",0);
            initText("retireManagent",0);
            initText("placeOfResettlement",0);
            initCodeType();
            taskId = $.getUrlParam("taskId");
            loadFormData(taskId);
            bindClick();
            getUserId();
        });
    });
    /**
     * 获取userId
     */
    function getUserId () {
        Ajax.post({
            url: '/ps/common/getUser'
        }, function (res) {
            userId = res.content;
        })
    }
    /**
     * 获取最新的审批历史id
     */
    function getLastOptionId() {
        Ajax.postForm({
            url:"/ps/opinionAttachment/getLastOptionId",
            data: {
                runId: runId
            }
        },function (res) {
            opinionId = res.content
        },function (err) {
            $.message({
                type: "error",
                text: err
            });
        })
    }

    /**
     * input框初始化
     */
    function initText(ID,a,b) {
        $("#"+ID).textbox({
            width: 180,
            readonly: a ? true : false,
            required: b ? true : false
        });
    }

    /**
     * 表单数据加载
     * @param taskId
     */
    function loadFormData(taskId) {
        Ajax.postForm({
            url:"/ps/personRetire/getByTaskId",
            data:{taskId:taskId}
        },function (data) {
            using(["form"],function () {
                var row = data.content;
                $("#userName").textbox("setValue",row.personRetire.userName);
                $("#sexName").textbox("setValue",row.personRetire.sexName);
                $("#mainForm").form("load",row.personRetire);
                uNitId = row.personRetire.unitId;
                runId = row.runId;
                getLastOptionId();
                personRetireId = row.personRetire.id;
                actInstId = row.actInstId;
                baseId = row.personRetire.baseId;
                if(row.personRetire.unitId){
                    util.fileUploadInit({
                        container:"tempFile",
                        listContainer:"#fileBox",
                        formatHtmlConfig:{
                            isDelete: true
                        }
                    },row.personRetire.unitId);
                }
            });
        },function (error) {
            $.message({type: "error", text: error});
        })
    }
    /**
     * 事件绑定
     */
    function bindClick () {
        $("#toolBar").on("click",".easyui-linkbutton", function () {
            switch (this.id){
                case "agree":
                    agree();
                    break;
                case "detail":
                    detail();
                    break;
                case "history":
                    showHistory();
                    break;
                case "flowChart":
                    flowChart();
                    break;
            }
        });
    }
    /**
     * 同意
     */
    function agree () {
        var $form = $("#mainForm");
        if ($form.form("validate")) {
            if(!$("#fileBox a").length){
                $.message({
                    type: "warning",
                    text: "请上传申请资料！"
                });
                return
            }
            var formJson = $form.serializeJson();
            formJson.unitId = uNitId;
            Ajax.put({
                url:"/ps/personRetire/",
                data:formJson
            },function (res) {
                if(res && res.success){
                    affirm();
                }
            },function (err) {
                $.message({type: "error", text: err});
            })
        }
    }
    function affirm() {
        util.openOpinion("同意",function (content, unitId, dialogId) {
            var params = {
                personRetireJson: {
                    id: personRetireId
                },
                doNextJson:{
                    taskId:taskId,
                    voteAgree:1,
                    voteContent: content,
                    account:userId
                },
                type:"auditing",
                opinion: opinionId
            };
            if (unitId) params.opinionUnit = unitId;
            $.ajax({
                url: '/ps/personRetire/do/next',
                contentType: 'application/json',
                type: 'post',
                data: JSON.stringify(params),
                success: function (res) {
                    if (res && res.success) {
                        ty.closeIframeDialog(dialogId);
                        window.opener.$("#listGrid").datagrid("load");
                        $.message({type: 'success', text: $.fn.__ty__.modify.success});
                        setTimeout(function () {
                            window.opener=null;
                            window.open('','_self');
                            window.close();
                            return true;
                        },1000);
                    }else {
                        $.message({type: "error", text: res.message});
                    }
                }

            })
        });
    }
    /**
     * 查看详情
     */
    function detail () {
        window.open('/ps/worker_change_mana/positive_apply/infos/detail.html?userId='+baseId);
    }
    /**
     * 审批历史
     */
    function showHistory() {
        util.openHistory(runId)
    }
    /**
     * 流程图
     */
    function flowChart() {
        Ajax.post({
            url:"/ps/common/get/x3/address"
        },function (res) {
            var siteUrl = "/bpmx/platform/bpm/processRun/processImage.ht?actInstId=";
            ty.createIframeDialog({
                title: "流程示意图",
                src: res.content + siteUrl + actInstId,
                width: 1200,
                height: 500,
                buttons:[],
                minimizable: false,
                maximizable: false
            });
        },function (err) {
            $.message({type:"error",text:err});
        })
    }
    /**
     * 获取码表数据
     */
    function initCodeType() {
        Ajax.post({
            url:"/ps/item/getTreeByCodes",
            data:{"list":"LTHXSJB,LTLX"}
        },function (res) {
            var data = res.content;
            initCombobox("retireType",data["LTLX"],1);
            initCombobox("retireLevel",data["LTHXSJB"],0);
        },function (err) {
            $.message({type: "error", text: err});
        })
    }
    /**
     * 初始化下拉框
     * @param name
     * @param data
     * @param isFill
     */
    function initCombobox(name,data,isFill) {
        $("#"+name).combobox({
            data:data,
            width:180,
            required: !isFill ? false : true,
            limitToList:true,
            editable:false,
            valueField:'code',
            textField:'text',
            panelHeight:'auto'
        });
    }
});



