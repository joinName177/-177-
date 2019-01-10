/**
 * @author CZQ
 * @version 1.0, 2019/1/2
 */
var dialogId,inData,actInstId,baseId,x3Url;
var __library = ["jquery","tyUI","easyModule","/ps/common/util.js","Ajax"];
require(__library, function ($,ty,el,util,Ajax) {
    $(function () {
        $.loading(650);
        dialogId = $.getUrlParam("dialogId");
        inData = ty.getDataFromIframeDialog(dialogId);
        loadForm(inData);
        getX3url();
    })
});

/**
 * 获取x3Url
 */
function getX3url() {
    Ajax.post({
        url:"/ps/common/get/x3/address"
    },function (res) {
        if(res.success) x3Url = res.content;
    },function (err) {
        $.message({type:"error",text:err});
    })
}

/**
 * 渲染表单数据,附件,审批历史
 * @param id
 */
function loadForm(id) {
    Ajax.get({
        url:"/ps/personRetire/"+id
    }, function (suc) {
        var data = suc.content;
        using(['form'],function () {
            $("#mainForm").form('load',data);
            $file = util.fileUploadInit({
                listContainer:"#fileBox",
                formatHtmlConfig:{
                    isDelete: false,
                    isDownLoad:true
                }
            },data.unitId);
            actInstId = data.actInstId;
            baseId = data.baseId;
            $("#history").attr("src","/ps/common/history/history.html?runId=" + data.runId);
        });
    }, function (err) {
        $.message({type: "error", text: err});
    });
}

/**
 * 加载流程图
 */
function flowChart() {
    ty.createIframeDialog({
        title: "流程示意图",
        src: x3Url + "/bpmx/platform/bpm/processRun/processImage.ht?actInstId="+ actInstId,
        width: 1000,
        height: 600,
        buttons:[],
        minimizable: false,
        maximizable: false
    });
}

/**
 * 详情
 */
function showDetail() {
    window.open('/ps/worker_change_mana/positive_apply/infos/detail.html?userId='+baseId);
}
function dialogCancel() {
    ty.closeIframeDialog(dialogId);
}