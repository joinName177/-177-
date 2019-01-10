/**
 * @author CZQ
 * @version 1.0, 2018/12/19
 */
var dialogId,topId,actInstId;
require(["jquery","tyUI","easyModule","Ajax"], function ($,ty,el) {
    $(function () {
        $.loading(650);
        dialogId = $.getUrlParam("dialogId");
        topId = ty.getDataFromIframeDialog(dialogId);
        loadForm(topId);
    })
});
//渲染表单数据
function loadForm(id) {
    var config = {url:"/ps/personBase/"+id};
    Ajax.get(config, function (suc) {
        var data = suc.content;
        using(['form'],function () {
            var formal = data.formal;
            $("#mainForm").form('load',data);
            $("#entryDepartment").val(formal["orgName"]);
            $("#dutyName").val(formal["dutyName"]);
            $("#entryPost").val(formal["positionName"]);
            $("#parttimeJob").val(data.parttimeJob ? "是" : "否");
            $("#tyTable").find('input').attr("disabled","disabled");
            actInstId = data.actInstId;
            //加载审批历史
            $("#approvalHistory").attr("src","/ps/common/history/history.html?runId=" + data.runId);
            //加载副岗信息
            if(data.parttimeJob){
                var res = data.pluralistics;
                for(var i =0,len=res.length;i<len;i++){
                    $('<tr class="tyStyle">' +
                        '    <th><label>兼职部门:</label></th>' +
                        '    <td>'+res[i].orgName+'</td>' +
                        '    <th><label>兼职岗位:</label></th>' +
                        '    <td>'+res[i].positionName+'</td>' +
                        '</tr>').appendTo($("#tyTable"));
                }
            }
        });
    }, function (err) {
        $.message({type: "error", text: err});
    });
}
//加载流程图
function flowChart() {
    $.mask();
    var __config = {url:"/ps/common/get/x3/address"};
    Ajax.post(__config,function (res) {
        var siteUrl = "/bpmx/platform/bpm/processRun/processImage.ht?actInstId=";
        ty.createIframeDialog({
            title: "流程示意图",
            src: res.content + siteUrl + actInstId,
            width: 1000,
            height: 600,
            buttons:[],
            minimizable: false,
            maximizable: false
        });
        $.closeMask();
    },function (err) {
        $.message({type:"error",text:err});
    })
}
//取消
function dialogCancel() {
    ty.closeIframeDialog(dialogId);
}