/**
 * @author CZQ
 * @version 1.0, 2019/1/7
 */
var taskId,runId,userId,opinionId,personRetireId,actInstId,x3Url,baseId,retireType;
var _$file_ = ["jquery","tyUI","easyModule","tyUpload",'../../common/util.js',"Ajax"];
require(_$file_, function ($,ty,el,tyUpload,util,Ajax) {
    $(function () {
        $.loading(650);
        taskId = $.getUrlParam("taskId");
        using(['textbox','messager','dialog'], function () {
            initText("userName");
            initText("sexName");
            initText("retireType");
            initText("retireDate");
            initText("retireLevel");
            initText("department");
            initText("manAgent");
            initText("distinctPlace");
            loadFormData(taskId);
            bindClick();
            getUserId();
            getX3Url();
        });
    });
    /**
     * 获取x3Url
     */
    function getX3Url(){
        Ajax.post({
            url:"/ps/common/get/x3/address"
        },function (res) {
            x3Url = res.content;
        },function (err) {
            $.message({type:"error",text:err});
        })
    }
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
                data: {runId: runId}
            },function (res) {
                opinionId = res.content
            },function (err) {
                $.message({type: "error", text: err});
            })
    }
    function initText(ID) {
        $("#"+ID).textbox({width:180, readonly:true});
    }
    /**
     * 获取>加载表单数据
     * @param taskId
     */
    function loadFormData(taskId) {
        Ajax.postForm({
            url:"/ps/personRetire/getByTaskId",
            data:{taskId:taskId}
        },function (data) {
            using(["form"],function () {
                var row = data.content;
                $("#mainForm").form("load",row.personRetire);
                if(row.personRetire.unitId){
                    $file = util.fileUploadInit({
                        listContainer:"#fileBox",
                        formatHtmlConfig:{
                            isDelete: false,
                            isDownLoad:true
                        }
                    },row.personRetire.unitId);
                    runId = row.runId;
                    getLastOptionId();
                    personRetireId = row.personRetire.id;
                    retireType = row.personRetire.retireType;
                    actInstId = row.actInstId;
                    baseId = row.personRetire.baseId;
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
                    commonality("同意",1,"audit_pass","操作成功!",1);
                    break;
                case "disagree":
                    commonality("驳回",3,"reject","驳回成功!",0);
                    break;
                case "detail"://查看详情
                    window.open('/ps/worker_change_mana/positive_apply/infos/detail.html?userId='+baseId);
                    break;
                case "history"://审批历史
                    util.openHistory(runId);
                    break;
                default:
                    if(x3Url){
                        ty.createIframeDialog({
                            title: "流程示意图",
                            src: x3Url + "/bpmx/platform/bpm/processRun/processImage.ht?actInstId=" + actInstId,
                            width: 1200,
                            height: 500,
                            buttons:[],
                            minimizable: false,
                            maximizable: false
                        });
                    }

            }
        });
    }

    /**
     * 公用方法抽离
     * @param title
     * @param voteAgree
     * @param type
     * @param tip
     * @param action
     */
    function commonality(title,voteAgree,type,tip,action) {
        util.openOpinion(title,function (content, unitId, dialogId) {
            var params = {
                personRetireJson: {
                    id: personRetireId
                },
                doNextJson:{
                    taskId:taskId,
                    voteAgree:voteAgree,
                    voteContent: content,
                    account:userId
                },
                type:type,
                opinion: opinionId
            };
            if (unitId) params.opinionUnit = unitId;
            if(!action){
                params.doNextJson.rejectLevels = "";
            }else {
                params.personRetireJson.retireType = retireType;
                params.personRetireJson.baseId = baseId;
            }
            $.ajax({
                url: '/ps/personRetire/do/next',
                contentType: 'application/json',
                type: 'post',
                data: JSON.stringify(params),
                success: function (res) {
                    if (res && res.success) {
                        ty.closeIframeDialog(dialogId);
                        window.opener.$("#listGrid").datagrid("load");
                        $.message({
                            type: 'success',
                            text: tip
                        });
                        setTimeout(function () {
                            window.opener=null;
                            window.open('','_self');
                            window.close();
                            return true;
                        },1000);
                    }else{
                        $.message({type: "error", text: res.message});
                    }
                }
            })
        })
    }
});



