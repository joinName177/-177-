/**
 * @author CZQ
 * @version 1.0, 2018/12/10
 */
var dialogId,topData,firstSubmit = false,$file;
var _$file_ = ["jquery","tyUI","easyModule","tyUpload","/ps/common/util.js","Ajax"];
require(_$file_, function ($,ty,el,tyUpload,util,Ajax) {
    $(function () {
        $.loading(650);
        dialogId = $.getUrlParam("dialogId");
        topData = ty.getDataFromIframeDialog(dialogId);
        using(["textbox","combobox","datebox"],function () {
            require(['tyValidateRules'],function (tv) {
                $file = util.fileUploadInit({
                    container:"tempFile"
                },"");
                initCodeType();
                initText("userName",1,1,'icon iconfont icon-zhuceyaoqing');
                $(".icon-zhuceyaoqing").css({"text-align":"center","font-size":"18px","color":"#1990fc"});
                initText("sex",0,1);
                initText("payDepartment");
                initText("retireManagent");
                initText("placeOfResettlement");
                $("#retireDate").datebox({
                    required:true,
                    panelWidth:180
                });
                $("#retireDate").datebox("setValue",getDate());
                personEvent();
            });
        });

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

        /**
         * 人员选择/根据工号查询性别\
         */
        function personEvent() {
            $("#personIcon").unbind('click').click(function () {
                ty.createIframeDialog({
                    title: "选择",
                    src: "/ps/common/choosePersonOnly.html",
                    width: 760,
                    height: 350,
                    minimizable: false,
                    maximizable: false,
                    buttons:[{
                        id : "cancel",
                        name : "取消",
                        funcName : "dialogCancel"
                    },{
                        id : "sure",
                        name : "确定",
                        funcName : "dialogOk"
                    }],
                    callback: function (data) {
                        if($.isArray(data) && data[0]){
                            $("#userName").textbox("setValue",data[0].userName);
                            Ajax.get({
                                url:"/ps/personRetire/getSex",
                                data:{workNo:data[0].workNo}
                            },function (res) {
                                if(res.success){
                                    $("#baseId").val(res.content.baseId);
                                    $("#sex").textbox("clear");
                                    $("#sex").textbox("setValue",res.content.sexName);
                                }
                            },function (err) {
                                $.message({type: "error", text: err});
                            });
                        }
                    }
                });
            });
        }

        /**
         * 确定
         */
        window.dialogOk = function () {
            var $form = $("#mainForm");
            using(['form'],function () {
                if ($form.form("validate")) {
                    if(!$("#fileList a").length){
                        $.message({
                            type: "warning",
                            text: "请上传申请资料！"
                        });
                        return
                    }
                    if(!firstSubmit){
                        $.mask();
                        firstSubmit = true;
                        var formJson = $form.serializeJson();
                        formJson.unitId = $file.getUnitId();
                        Ajax.post({
                            url:"/ps/personRetire",
                            data:formJson
                        },function (res) {
                            if(res && res.success){
                                $.closeMask();
                                ty.closeIframeDialog(dialogId,1);
                            }
                        },function (err) {
                            $.message({type: "error", text: err});
                            $.closeMask();
                            firstSubmit = false;
                        })
                    }
                }
            })
        };
        /**
         * 取消
         */
        window.dialogCancel = function(){
            ty.closeIframeDialog(dialogId);
        };

        /**
         * 获取当前时间
         * @returns {string}
         */
        function getDate(){
            var t = new Date();
            var d = t.getDate(),m = t.getMonth() + 1,y = t.getFullYear();
            var newStr = y + "-";
            if(m < 10) newStr += "0";
            newStr += m + "-";
            if(d < 10) newStr += "0";
            newStr += d;
            return newStr;
        }

        /**
         * 初始化text输入框
         * @param name
         * @param isFill
         * @param isReadonly
         */
        function initText(name,isFill,isReadonly,iconCls) {
            $("#"+name).textbox({
                width:180,
                required:!isFill ? false : true,
                readonly:!isReadonly ? false : true,
                iconCls:iconCls ? iconCls : null
            });
        }
    });
});



