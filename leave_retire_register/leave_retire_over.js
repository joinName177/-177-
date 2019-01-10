/**
 * @author CZQ
 * @version 1.0, 2019/1/7
 */
var taskId,runId,actInstId,x3Url,baseId;
var _$file_ = ["jquery","tyUI","easyModule","tyUpload",'../../common/util.js',"Ajax"];
require(_$file_, function ($,ty,el,tyUpload,util,Ajax) {
    $(function () {
        $.loading(650);
        runId = $.getUrlParam("runId");
        using(['textbox','messager','dialog'], function () {
            initText("userName");
            initText("sexName");
            initText("retireType");
            initText("retireDate");
            initText("retireLevel");
            initText("department");
            initText("manAgent");
            initText("place");
            loadFormData(runId);
            bindClick();
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
     * 初始化input输入框
     * @param ID
     */
    function initText(ID) {
        $("#"+ID).textbox({width:180, readonly:true});
    }

    /**
     * 加载表单数据,附件渲染
     * @param taskId
     */
    function loadFormData(runId) {
        Ajax.get({
            url:"/ps/personRetire/getByRunId",
            data:{
                runId: runId
            }
        },function (data) {
            using(["form"],function () {
                var row = data.content;
                $("#mainForm").form("load",row.personRetire);
                actInstId = row.personRetire.actInstId;
                baseId = row.personRetire.baseId;
                if(row.personRetire.unitId){
                    $file = util.fileUploadInit({
                        listContainer:"#fileBox",
                        formatHtmlConfig:{
                            isDelete: false,
                            isDownLoad:true
                        }
                    },row.personRetire.unitId);
                }

            });
        },function (error) {
            $.message({type: "error", text: error});
        })
    }

    /**
     * 按钮事件绑定
     */
    function bindClick () {
        $("#toolBar").on("click",".easyui-linkbutton", function () {
            switch (this.id){
                case "history": //审批历史
                    util.openHistory(runId);
                    break;
                case "detail": //查看详情
                    window.open('/ps/worker_change_mana/positive_apply/infos/detail.html?userId='+baseId);
                    break;
                default: //加载流程图
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
        });
    }
});



