/**
 * javascript 严格模式
 */
'use strict'

const GoalgoExecute = function () {

    /**
     * 服务接口地址
     */
    let newtaskInfo = ''
    let newresourceInfo = ''
    let newdemotioneingInfo = ''
    const electron = nodeRequire('electron')

    const loginService = electron.remote.getGlobal("sharedObject").loginService

    const fileService = electron.remote.getGlobal("sharedObject").fileService

    const ipc = electron.ipcRenderer
    //原始唯一控件uuid
    let orginArr = []
    //唯一控件uuid
    let uuid = []
    let OnlyElementUuid = ""
    let copyObj = {}
    let formulaInfo = [];
    /**
     * 审批数据名称
     */
    let custom = ''
    //唯一控件表单id
   
    /**
     * 审批类型
     * 0 自定义 1工作流
     */
    let approvalType
    let baseFormIds = []
    /**
     * 创建节点人
     */
    let dataHtml = ''

    //审批人
    let nodeUsers = []

    /**
     * 抄送人
     */
    let copyUsers = []

    /**
     * 文件key
     */
    let filesKey = []
    let testFiles = []
    let getEditKey = []

    /**
     * 表单内容
     */
    let formsData = []

    /**
     * 传输参数
     */
    let info = '';

    /**
     * feign服务地址
     */
    //复制的table信息
    let arryCopy = []
    let callBackUrl = '';
    let reSendApprovalId = ''
    // 审批表单模板配置信息
    let approvalFormModels = [];
    // 审批表单模板默认人员信息
    let approvalFormDefInfo = {};
    // 上传文件
    let fileUploader;
    // 发送审批的id
    let approvalIdTmp = '';
    // 记录上传的附件
    let attmFiles = [];
    // 表格
    let formTableHot;
    // 表格数据
    let tableData = [];
    // 记录表格宽度
    let tdWidths = [];
    // 表格高度
    let tableRows = [];
    // 记录下一轮发起的审批的默认人员部门岗位数据
    let nextDefData = {};
    // 是否是基础表单
    let isBasicForm = false;
    // 表格控件数据
    let tablePlugInfo = {};
   
    // 表格合并数据
    let tableMergeArr = [];
    let heightDataArr = [];
    // 表格重复行数据
    let resetRowArr = [];
    // 记录表格初始行数
    let rowNumInit = 0;
    //缓存流程审批节点
    let nodeArr = []
    //立项审批审批数据
    let newprojectInfo = ''
    //操作的节点数据集合
    let handleDataInfo = []
    //职务授权审批数据
    let postAuthInfo = ''
    //缓存查询后的流程节点
    let startOld = []
    let endOld = []
    //流程设计画布
    let proceeDesignPaper = null
    //界面宽高缓存
    let window_w
    let window_h
    let endX = 0
    //end节点的父节点
    let endPid
    //开始和结束矩形的宽高
    let offset_start_l = 130
    let rect_start_w = 102
    let rect_start_h = 60
    let rect_start_r = 8
    let start_attr = { //发起者样式
        "fill": "#4285F4", //填充
        "stroke": "#4285F4", //边框
        "stroke-width": 2,
        "stroke-linejoin": "round",
        "cursor": "pointer"
    };
    let end_attr = { //END样式
        "fill": "#CCCCCC", //填充
        "stroke": "#B3B3B3", //边框
        "stroke-width": 2,
        "stroke-linejoin": "round"
    };
    // 审批节点的矩形的宽高
    let rect_approval_w = 168
    let rect_approval_h = 100
    let rect_approval_r = 8
    let arrow_w = 77 //箭头长度
    let approval_attr = { //审批节点样式
        "fill": "#fff",
        "stroke": "#E6E6E6", //边框
        "stroke-width": 1,
        "stroke-linejoin": "round"
    }

    //父级节点信息缓存
    let _parentX //输出节点的x坐标
    let _parentY = 0 //输出节点的y坐标

    //多层并行节点y坐标起点值缓存
    let _allTop = 0

    //计算所有节点最大宽度
    let _allWidth = 0

    //记录历史多个节点的outId
    let oldOutId = []

    // 记录流程审批开始节点resourceId，保存时候传给后台
    let startNodeId = '';

    //缓存线条outId
    let childLine = []
    let lineIndex = 0
    let groupLineId = []
    let nextGroupItem
    let startItem = {}
    let hasGroup = true
    let historyArr = []
    let newApprovalId = '';
    let minTop = 0
    let maxTop = 0
    let allNodeLineArr = []
    // 记录进入发起审批的时间
    let openInTime = ''
    let getNowDate = ''
    //缓存自定义表单标题信息
    let titleDisposes = ''
    /**
     * 发起审批跳转
     */
    let showStartApproval = () => {
        $('#approvalList').on('click', () => {
            $('#commonUse').removeClass('type-selected')
            $('#approvalList').addClass('type-selected')
            $('.team-list').hide()
            $('.approval-list').show()
            getTeamList()
        })

        $('#commonUse').on('click', () => {
            $('#approvalList').removeClass('type-selected')
            $('#commonUse').addClass('type-selected')
            $('.team-list').show()
            $('.approval-list').hide()
            queryCommonuse()
        })

        $('#returnList').on('click', () => {
            queryApprovalList()
            $('.folder-name').hide()
        })

        $('#addType').on('click', () => {
            $('#typeName').val('')
            $('#createFormType').modal('show')
        })

        $('#createType').on('click', () => {
            $('#createFormType').modal('hide')
        })

        ipc.on('query_event_list', () => {
            // 把原有日期控件销毁
            $('.form_datetime').datetimepicker('remove')
            $(".datetimepicker").remove()
            CommonPlupload.uploadFail('ref_approval_upload_file_list')

            newtaskInfo = electron.remote.getGlobal("execute").taskInfo
            newdemotioneingInfo = electron.remote.getGlobal("execute").demotioneingInfo
            newresourceInfo = electron.remote.getGlobal("execute").resourceInfo
            let eventId = electron.remote.getGlobal("execute").eventId
            tableFirst = true;

            getProcessDataOld(eventId)
            queryCustomForm();

        })


        /**
         * 审批数量控件
         */
        $('.spinner-up').on('click', () => {
            if (parseInt($('.spinner-input').val()) < parseInt($('.approval-count').html())) {
                $('.spinner-input').val(parseInt($('.spinner-input').val()) + 1)
            }
        })

        /**
         * 审批数量控件
         */
        $('.spinner-down').on('click', () => {
            if (parseInt($('.spinner-input').val()) > 1) {
                $('.spinner-input').val(parseInt($('.spinner-input').val()) - 1)
            }
        })
    }

    /**
     * 设置边框导航高度
     */
    let updateSidebar = () => {
        let $height = $(window).height()
        $(".provide-body").height($height - 105)
        $(".start-approval-concent").height($height - 10)
        $(window).resize(function () {
            let $height = $(window).height()
            $(".provide-body").height($height - 105)
            $(".start-approval-concent").height($height - 10)
        })
    }
    /**
     * 基础表单调试
     */
    let basicFormSet = () => {
        $('.approvale-ul>li').each((index, item) => {
            //权限申请宏
            if ($(item).attr('data-id') == 'radio') {
                if ($(item).children('pre').html() == '授权时限') {
                    $(item).next().hide()
                    $(item).next().next().hide()
                    $(item).find('input').on('ifClicked', function (event) {
                        let index = $(this).attr('data-index');
                        if (index == 0) {
                            $(item).next().hide()
                            $(item).next().next().hide()
                        } else {
                            $(item).next().show()
                            $(item).next().next().show()
                        }
                    })
                }
            }
        });
    }
    /**
     * 查询自定义表单
     */
    let queryCustomForm = () => {
        // 记录进入时间
        openInTime = new Date().getTime();
        // flags 是否是编辑
        let flags = electron.remote.getGlobal("execute").isEdit
        $('.resource-approval-div').html('')
        $(".spinner-input").val('1')
        nodeUsers = []
        copyUsers = []
        $('.approval-count-div').hide()
        $("#syx_add_member").remove()
        $(".modal-backdrop").hide()
        if (electron.remote.getGlobal("execute").newApprovalId !== '') { //下一轮审批
            // 下一轮审批使用自定义loading
            $('.myLoadingMask').css({
                'display': 'block'
            });
            $('.blockMsg').hide();
            App.unblockUI(window)
            setTimeout(function () {
                getFormInfo();
                $('.myLoadingMask').css({
                    'display': 'none'
                });
            }, 10);
        } else {
            let eventId = electron.remote.getGlobal("execute").eventId
            let param = {
                eventId: eventId,
                ascriptionId: electron.remote.getGlobal("execute").teamId,
                userId: electron.remote.getGlobal('sharedObject').userId,
            }
            if (startNodeId) {
                param.resourceId = startNodeId
            }
            $.ajax({
                type: "post",
                url: loginService + "/approval/approval/findPhoneApprovalForm", //"/approval/approval/findApprovalForm",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("system", "oa");
                    App.blockUI(window);
                },
                dataType: "json",
                data: param,
                // async: false,
                success: function (data) {
                    $('.approvale-ul').html('')
                    if (data.returnCode === 0) {
                        getNowDate = formatDateTime(new Date(), data.dateType);

                        if (data.data !== null) {

                            // 自定义审批及自定义审批发起下一轮不需要查流程设计图
                            // if (data.data.type == 1) {
                            //     getProcessDataOld(eventId)
                            // }
                            if (data.data.isDefault == 0) { //自己创建的
                                isBasicForm = false;
                                //基础表单不允许修改名称
                                $('.work-printf').show()
                                $(".approval-header-icon").show()
                                let eventId = electron.remote.getGlobal("execute").eventId
                                onlyPage.onlyData(eventId)
                                titleDisposes = data.data.titleDisposes || [];
                                // getProcessDataOld(data.data.modelId)
                            } else { //基础表单
                                isBasicForm = true;
                                $('.work-printf').hide()
                                $(".approval-header-icon").hide()
                            }
                            loadTitleInfo();
                            approvalFormModels = data.data.approvalFormElementModels || [];
                            approvalFormDefInfo = data.data.postModel || {};
                            $('.approvale-ul').html(data.data.html)
                            //隐藏自带的审批内容信息
                            setTimeout(function () {
                                let $plugLeftTit = $('.approvale-ul').find('.plugLeftTit')
                                $($plugLeftTit).each(function (i, node) {
                                    if ($(node).text() == '审批内容' || $(node).text() == '附加信息') {
                                        $(node).parent('li').hide();
                                    }
                                })
                            }, 200)
                            $('.textarea-pre').each(function (i, item) {
                                if ($(item).css('display') != 'none') {
                                    $(item).next().hide()
                                }
                            })
                            if (flags) {
                                // 重新发起
                                $('.custom-work').show()
                                $('.activiti-img').hide();
                                addNodeBtn('node-user-show', 'node-user', 'addNode')
                                addNodeBtn('send-user-show', 'copy-user', 'addNodeCopy')
                                let editDatass = JSON.parse(electron.remote.getGlobal("execute").editDatas)
                                $('.activiti-img').show()
                                $.each(editDatass.formContentModels, (i, item) => {
                                    if (item.type == 'attachment') {
                                        let uuid = item.elementValue.split(':::')[0].split('.')[0]
                                        getEditKey.push(uuid)
                                    }
                                })
                                reSendApprovalId = editDatass.approvalid
                                if (data.data.approvalFormElementModels) { //自定义表单
                                    formElementHandle();
                                } else { //基础表单
                                    getEditFormInfo(editDatass.formContentModels);
                                    // getApprovalPer(editDatass.trailModels)
                                    // 基础表单样式调试：添加基础类名 调节宽度
                                    $('.approvale-ul>li').addClass('basic');
                                    $('.approvale-ul>li>pre:not(.textarea-pre)').addClass('plugLeftTit');
                                    $('.approvale-ul>li .textarea-plug,.approvale-ul>li .input-plug').css({
                                        'width': '80%'
                                    });
                                    $('#approvaleUl input,.approval-took input').iCheck({
                                        checkboxClass: 'icheckbox_flat-blue',
                                        radioClass: 'iradio_flat-blue'
                                    });
                                    // basicFormSet();
                                }
                                $("[data-toggle='tooltip']").tooltip();
                                if (data.data.type == 1) { //流程设计
                                    $('.activiti-img').show()
                                    $('.custom-work').hide()
                                    $('.work-printf').show()
                                    approvalType = 1
                                    // getProcessDataOld(data.data.modelId)
                                } else if (data.data.type == 0) { //表单设计
                                    approvalType = 0
                                    $('.work-printf').hide()
                                }
                                //如果是职务授权  重新发起时需要查询出
                                if ((electron.remote.getGlobal("execute").authId || '') != "") {
                                    let str = electron.remote.getGlobal("execute").approvalType
                                    let type = str;
                                    if (typeof (str) == 'string' && str.indexOf('职务授权') > -1) {
                                        type = 1;
                                    }
                                    if (typeof (str) == 'string' && str.indexOf('个人权限申请') > -1) {
                                        type = 0;
                                    }
                                    Approval.authMouldShow(type)
                                }

                            } else {
                                $('.custom-work').show()
                                //自定义流程知会单选问题（单选按钮不展示）
                                $('#approvaleUl input').iCheck({
                                    checkboxClass: 'icheckbox_flat-blue',
                                    radioClass: 'iradio_flat-blue'
                                });
                                $('.activiti-img').hide();
                                //自定义审批，添加节点按钮
                                addNodeBtn('node-user-show', 'node-user', 'addNode')
                                addNodeBtn('send-user-show', 'copy-user', 'addNodeCopy')
                                if (data.data.approvalFormElementModels) { //自定义表单
                                    $('.approvale-ul>li').removeClass('basic');
                                    formElementHandle()
                                } else { //基础表单
                                    // 基础表单样式调试：添加基础类名 调节宽度
                                    $('.approvale-ul>li').addClass('basic');
                                    $('.approvale-ul>li>pre:not(.textarea-pre)').addClass('plugLeftTit');
                                    $('.approvale-ul>li .textarea-plug,.approvale-ul>li .input-plug').css({
                                        'width': '80%'
                                    });
                                    $('#approvaleUl input').iCheck({
                                        checkboxClass: 'icheckbox_flat-blue',
                                        radioClass: 'iradio_flat-blue'
                                    });
                                    // 审批知会人
                                    $('.approval-took input').iCheck({
                                        checkboxClass: 'icheckbox_flat-blue',
                                        radioClass: 'iradio_flat-blue'
                                    });
                                    // basicFormSet();
                                }

                                $('.approval-count').html('1')
                                info = ''
                                callBackUrl = ''
                                custom = ''
                                if ((electron.remote.getGlobal("execute").authId || '') != "") {
                                    let str = electron.remote.getGlobal("execute").approvalType
                                    let type = str;
                                    if (typeof (str) == 'string' && str.indexOf('职务授权') > -1) {
                                        type = 1;
                                    }
                                    if (typeof (str) == 'string' && str.indexOf('个人权限申请') > -1) {
                                        type = 0;
                                    }
                                    Approval.authMouldShow(type)
                                    // queryAuthInfo()
                                } else if ((electron.remote.getGlobal("execute").ruleInfo || '') != "") {
                                    queryRuleInfo()
                                } else if (electron.remote.getGlobal("execute").taskInfo != null && electron.remote.getGlobal("execute").taskInfo != '') {
                                    queryTaskInfo()
                                } else if (electron.remote.getGlobal("execute").resourceInfo != null &&
                                    electron.remote.getGlobal("execute").resourceInfo != '') {
                                    queryResourceInfo()
                                } else if (electron.remote.getGlobal("execute").fileInfo != null && electron.remote.getGlobal("execute").fileInfo != '') {
                                    getTaskFile()
                                } else if (electron.remote.getGlobal("execute").meetInfo != null && electron.remote.getGlobal("execute").meetInfo != '') {
                                    getMeetFile()
                                } else if ((electron.remote.getGlobal("execute").chatInviteInfo || '') != '') {
                                    getInviteInfo()
                                } else if (electron.remote.getGlobal("execute").projectInfo != null && electron.remote.getGlobal("execute").projectInfo != '') {
                                    getprojectInfo()
                                } else if (electron.remote.getGlobal("execute").demotioneingInfo != null && electron.remote.getGlobal("execute").demotioneingInfo != '') {
                                    demotioneingInfo()
                                }

                                $('[name="file"]').each((index, item) => {
                                    $(item).on('mouseover', () => {
                                        $(item).prev().prev().prev().prev().attr('src', '../../common/image/team/form/attachment-over.png')
                                    })
                                    $(item).on('mouseout', () => {
                                        $(item).prev().prev().prev().prev().attr('src', '../../common/image/team/form/attachment.png')
                                    })
                                })

                            }

                            if (data.data.type == 1) { //流程设计
                                $('.activiti-img').show()
                                $('.custom-work').hide()
                                approvalType = 1
                                // getProcessDataOld(data.data.modelId)
                            } else if (data.data.type == 0) { //表单设计
                                approvalType = 0
                            }

                            //查询审批内容详情START
                            let _eventType = data.data.eventType;
                            let type = electron.remote.getGlobal("execute").approvalType
                            $("#task-detail-box").hide();
                            $(".approvalDetails").hide();
                            if (_eventType == 2) {
                                let meetInfo = JSON.parse(electron.remote.getGlobal("execute").meetInfo);
                                queryInfos(meetInfo.meetingId, meetInfo.userId);
                            } else if (_eventType == 1) {
                                let taskId = electron.remote.getGlobal("execute").taskId
                                let userId = electron.remote.getGlobal("sharedObject").userId
                                queryTaskDetaile(taskId, userId)
                            }

                            if (data.data.onlyElementUuid !== null) {
                                OnlyElementUuid = data.data.onlyElementUuid
                                onlyPage.appendOnly(data.data.onlyElementUuid)
                            }
                            //查询审批内容详情END
                        }
                        loadTitleInfo();
                        $('.start-row').show()
                    } else {
                        toastr["error"](data.returnMessage, "信息提示")
                        $('.start-row').hide()
                    }
                },
                error: function () {
                    toastr["error"]('查看自定义表单失败，请重试', "信息提示")
                    $('.start-row').hide()
                },
                complete: function (data) {
                    App.unblockUI(window);
                }
            })
        }
    }
    /**
     * 查询任务详情
     * @param {*} id 
     * @param {*} userId 
     */
    let queryTaskDetaile = (id, userId) => {
        $("#task-detail-box").show();
        $(".approvalDetails").hide();
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: loginService + '/task/query/id',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa")
                xhr.setRequestHeader("type", "0")
            },
            data: {
                "userId": userId,
                "id": id
            },
            success: function (data) {
                if (data.returnCode == 0) {
                    let titleNames = data.data.name
                    $('.task-detail-base-info .title-name .name').attr({
                        'data-original-title': titleNames,
                        'data-toggle': "tooltip"
                    })
                    $("[data-toggle='tooltip']").tooltip();
                    let info = data.data || ""
                    let ascriptionType = info.ascriptionType
                    //是否有开始时间和结束时间
                    let hasTime = false
                    let endDate = ''
                    let startDate = ''
                    //缓存任务状态
                    $("#task-chat-box").attr("data-type", info.flag)
                    $(".consume-time").empty().text(`已消耗${info.spend}小时`);
                    //清除开始时间和结束时间缓存
                    $(".startTime").html("")
                    $(".endTime").html("")
                    $('.property').html('无')
                    $('.description').html('')
                    $('.attachment').html('')
                    $('.task-detailHide').hide() //清空任务详情所有信息
                    $('.approval-stakeholder ul').empty()
                    $(".task-detail-Drecording").hide()
                    $('#taskStatus').attr('class', 'task-child-context-none')

                    $('.approval-taskName input,#dateTimeRangeInputApproval,.approval-estimate input').attr('disabled', true)
                    $('#dateTimeRangeInputApproval').next().css({
                        'cursor': 'not-allowed'
                    })
                    //任务属性
                    $('.property').html(info.property == 0 ? '公开' : '私密')
                    //开始时间 结束时间
                    let oldTime = GoalgoExecute.findOldTaskTime(info.id, userId)
                    startDate = oldTime.startTime
                    endDate = oldTime.endTime
                    if (startDate && endDate) {
                        $("#dateTimeRangeInputApproval").val(`${startDate}至${endDate}`)
                        // queryCommunicatesApproval('dateTimeRangeInputApproval', 'task-approval-time-div', startDate, endDate)
                        hasTime = true
                    }

                    //任务名称
                    $('.approval-taskName input').val(info.name)
                    //任务描述
                    $('.approval-describe').html(info.description)
                    //任务优先级
                    if (info.priority != undefined || info.priority != null) {
                        $('#taskStatus').css("borderLeft", `4px solid ${info.priority.rgb}`);
                        $('#taskStatus').text(info.priority.name)
                    }
                    //预估时间
                    $('.approval-estimate input').val(info.expectSpend)
                    //任务干系人
                    if (info.relationUsers && info.relationUsers.length > 0) {
                        $('.approval-stakeholder ul').html(setOtherProperty_stakeholder(info.relationUsers))
                    }
                    //任务附件
                    if (info.fileModels && info.fileModels.length > 0) {
                        $('.task-detail-attach').show()
                        $(".detail-attach-content").append('<ul class="file_normal_box_list"></ul>')
                        $(".detail-attach-content ul").html(`${fileListHtml(info.fileModels || [])}`)
                    }
                    //任务来源
                    if (info.source && info.source.sourceName != null) {
                        $('.task-detail-source').show()
                        $('.detail-source-content p').html(`<p>${info.source.sourceName}</p>`)
                    }
                    //含金量
                    if (info.attachModel != null) {
                        $('.goalgo-gold span').removeClass()
                        $('.goalgo-gold').parents('.task-detail-status').show()
                        $('.goalgo-gold span').attr('data-ascriptionId', info.ascriptionId)
                        $('.goalgo-gold span').addClass(`star_${info.attachModel.star}`)
                        $('.goalgo-gold-title').off().click(function () { //点击设置含金量
                            showGoldContent('goalgo', info.ascriptionId, info.id)
                        })
                    } else {
                        $('.goalgo-gold').parents('.task-detail-status').hide()
                    }
                    $('.task-detail-level').html(info.level)
                    $('.task-detail-child-count').html(info.childCount)
                    $('.task-spend').html('计划使用' + (info.expectSpend || 0) + '个小时，已消耗' + (info.spend || 0) + '小时')
                    $('.execute-time').html(info.executeTime || '无')
                    if (info.finishTime) {
                        $('.finish-time').parent(".task-detail-status").show()
                        $('.finish-time').html(info.finishTime)
                    } else {
                        $('.finish-time').parent(".task-detail-status").hide()
                    }

                    let status = info.status || 0
                    let statusStr = '未开始'
                    let statusColor = 'not-beginning'
                    if (status == 1) {
                        statusStr = '进行中'
                        statusColor = 'pass'
                    } else if (status == 2) {
                        statusStr = '已完成'
                        statusColor = ''
                    } else if (status == 3) {
                        statusStr = '已延迟'
                        statusColor = 'refuse'
                    }
                    $('#task-run-status').html('(' + statusStr + ')')
                    // $('.task-state').html('(' + statusStr + ')')
                    $('#task-run-status').attr('class', statusColor + ' task-run-status')

                    let approvalText = ''
                    let approvalStatus = info.approvalState
                    if (approvalStatus == 1) {
                        approvalText = '（任务流转审批）'
                    } else if (approvalStatus == 2) {
                        approvalText = '（干系人审批）'
                    } else if (approvalStatus == 5) {
                        approvalText = '（归档审批）'
                    } else {
                        approvalText = ''
                    }
                    $('#task-approval-status').html(approvalText)
                    let ascriptionName = ''
                    let ascriptionTypeName = ''
                    if (ascriptionType == 0) {
                        ascriptionName = $('.liableUser').text()
                        ascriptionTypeName = '个人任务'
                    } else if (ascriptionType == 1) {
                        ascriptionName = info.ascriptionName || ''
                        ascriptionTypeName = '团队任务'
                    } else if (ascriptionType == 2) {
                        ascriptionName = `${info.ascriptionName + '-'}${info.deptName ? info.deptName + '-' : ''}${info.roleName}`
                        ascriptionTypeName = '企业任务'
                    }
                    //设置任务归属信息
                    $('.ascription-name').text(ascriptionName).attr("data-original-title", ascriptionName)

                    if (info.cycleModel != null) {
                        let dimensionality = ''
                        let cyclePeriod = ''
                        if (info.cycleModel.cycleType == 1) {
                            dimensionality = '每天'
                        } else if (info.cycleModel.cycleType == 2) {
                            dimensionality = '每周'
                        } else if (info.cycleModel.cycleType == 3) {
                            dimensionality = '每月'
                        } else if (info.cycleModel.cycleType == 4) {
                            dimensionality = '每季度'
                        } else if (info.cycleModel.cycleType == 5) {
                            dimensionality = '每半年'
                        } else if (info.cycleModel.cycleType == 6) {
                            dimensionality = '每年'
                        }
                        if (info.cycleModel.cyclePeriod == 0) {
                            cyclePeriod = ''
                        } else if (info.cycleModel.cyclePeriod == 1) {
                            cyclePeriod = '第1月'
                        } else if (info.cycleModel.cyclePeriod == 2) {
                            cyclePeriod = '第2月'
                        } else if (info.cycleModel.cyclePeriod == 3) {
                            cyclePeriod = '第3月'
                        }
                        let showData = ''
                        if (info.cycleModel.cycleType == 2 || info.cycleModel.cycleType == 1) { //每周 每天 去掉'号'字
                            showData = '(' + dimensionality + cyclePeriod + (info.cycleModel.cycleTime == 'undefined' ? '' : info.cycleModel.cycleTime + '') + ')' + info.cycleModel.triggerTime + '循环'
                        } else {
                            showData = '(' + dimensionality + cyclePeriod + (info.cycleModel.cycleTime == 'undefined' ? '' : info.cycleModel.cycleTime + '号') + ')' + info.cycleModel.triggerTime + '循环'
                        }
                        $('.loop-time').html(showData)
                        $('.loop-time').parent().show()
                    }
                    //设置责任人 
                    if (info.liable) {
                        $(".liableUser").html('<span class="detail-approval-left">责任人</span><div class="detail-approval-right">' + (info.liable.username || '') + '</div>')
                    }
                    //设置执行人
                    if (info.execute) {
                        $(".executorUser").html('<span class="detail-approval-left">执行人</span><div class="detail-approval-right">' + (info.execute.username || '') + '</div>')
                    }
                    let executeUsername = info.execute.username || '';
                    if (executeUsername) {
                        let str = '';
                        if (executeUsername.length > 2) {
                            str = executeUsername.slice(-2);
                        } else {
                            str = executeUsername;
                        }
                        $(".task-user-name").text(str).attr({
                            "data-toggle": "tooltip",
                            "data-original-title": executeUsername
                        })
                    } else {
                        $(".task-user-name").text('无')
                    }
                    $("[data-toggle='tooltip']").tooltip();
                    //设置进度
                    setProgess(info.percent)
                }
            },
            error: function () {
                App.unblockUI(window)
                toastr["error"]('查询任务详情失败！', "信息提示");
            }
        })
    }
    /**
     * 含金量
     */
    let showGoldContent = (type, ascriptionId, taskId) => {
        $('#taskGoldContentGoalgo').modal('show')
        $('#taskGoldContentGoalgo').attr('data-taskId', '')
        $('#taskGoldContentGoalgo').attr('data-ascriptionId', '')
        $('#taskGoldContentGoalgo').attr('data-taskId', taskId)
        $('#taskGoldContentGoalgo').attr('data-ascriptionId', ascriptionId)
        inquireGoldContent(type, ascriptionId) //查询含金量
        defaultGoldContent(type) //含金量默认事件
    }
    /**
     * 查询含金量
     * type:
     * 'task' 修改含金量弹框 右侧任务列表含金量 只更新左侧星级展示
     * 'deta' 详情内点击查询含金量
     *
     */
    let inquireGoldContent = (type, ascriptionId) => {
        //清空数据
        $('.task_goldmain_title').text('')
        $('.task_goldmain_count').html('')
        $('.star_hint').hide()
        $('.task_goldmain_statistics ul li').attr('data-id', '')
        $('.task_goldmain_statistics ul li').attr('data-remainNum', '')
        $('.task_goldmain_statistics ul li .task_goldmain_remain').html('(剩余0个)').removeClass('red')
        $('.task_goldmain_statistics ul li .task_goldmain_yet').html('已创建 0 个')
        $('.task_goldmain_list_sum').html('0') //含金量总数
        $('.task_goldmain_occupy i').text('0') //已占用
        $.ajax({
            type: 'post',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            url: loginService + '/task/glod/findUseByTeamId',
            data: {
                teamId: ascriptionId
            },
            success: function (data) {
                if (data.returnCode === 0) {
                    let datas = data.data.startModels || [];
                    //左侧各星级统计
                    let startDom = $('.task_goldmain_statistics ul li')
                    let startCount = ''
                    $.each(datas, function (index, item) {
                        if (item.star == 0) { //总含金量
                            $('.task_goldmain_list_sum').html(item.number) //含金量总数
                            $('.task_goldmain_occupy i').text(item.useNum) //已占用
                        } else {
                            $.each(startDom, function (i, dom) {
                                if (item.star == $(dom).attr('data-typeid')) {
                                    $(dom).attr('data-id', item.id)
                                    $(dom).attr('data-remainNum', item.remainNum)
                                    $(dom).find('.task_goldmain_remain').text(`(剩余${item.remainNum}个)`) //剩余个数
                                    $(dom).find('.task_goldmain_yet').text(`已创建 ${item.useNum} 个`) //使用个数
                                    startCount += `${item.star}星任务${item.useNum}个,`
                                    if (item.remainNum <= 2) {
                                        $(dom).find('.task_goldmain_remain').addClass('red')
                                    }
                                }
                            })
                        }
                    })
                    $('.task_goldmain_count').html(`(${startCount})`)
                    if (type == 'task') { //修改含金量弹框 右侧任务列表含金量 只更新左侧星级展示
                        return
                    }
                    //右侧任务统计
                    let dataList = data.data.taskModels || []
                    let openDom = ''
                    $.each(dataList, function (index, item) {
                        let settingStar = ''
                        for (var int = 1; int <= 6; int++) {
                            if (int <= item.star) {
                                settingStar += `<i class='star_on'></i>`
                            } else {
                                settingStar += `<i></i>`
                            }
                        }
                        openDom += `
                        <li data-id='${item.taskId}'>
                            <p>${item.taskName}</p>
                            <span>${item.star}星任务</span>
                            <span class="star_box">
                                ${settingStar}
                            </span>
                        </li>
                        `
                    })
                    $('.task_goldmain_list ul').html(openDom)
                    //默认获取上次的星级
                    let starIndex = $('.goalgo-gold span').attr('class').split('_')[1]
                    if (starIndex == undefined || starIndex == '' || starIndex == '0') {
                        $('.task_goldmain_setting .star_box i').removeClass()
                    } else {
                        $.each($('.task_goldmain_setting .star_box i'), function (index, item) {
                            $(item).removeClass('star_on')
                            if ($(item).index() + 1 <= starIndex) {
                                $(item).addClass('star_on')
                            }
                        })
                    }
                    defaultGoldContent() //含金量默认事件
                } else {
                    toastr["error"](data.returnMessage, "信息提示");
                }
            },
            error: function (data) {
                ErrorToastr.authorityMessage(data)
            }
        })
    }
    /**
     * 设置附件、干系人、目标、资源
     */
    let setOtherProperty_stakeholder = (value) => {
        let html = ''
        //干系人(不是个人且有团队 显示)
        $.each(value, function (index, item) {
            let txt = ''
            let noticeType = item.noticeType
            let types = item.type
            if (noticeType == 0 && types == 0) {
                txt = '执行通知'
            } else if (noticeType == 0 && types == 1) {
                txt = '变更通知'
            } else if (noticeType == 0 && types == 2) {
                txt = '完成通知'
            } else if (noticeType == 0 && types == 3) {
                txt = '延迟通知'
            } else if (noticeType == 1 && types == 0) {
                txt = '执行审批'
            } else if (noticeType == 1 && types == 1) {
                txt = '变更审批'
            } else if (noticeType == 1 && types == 2) {
                txt = '完成审批'
            } else if (noticeType == 1 && types == 2) {
                txt = '延迟审批'
            }
            let selectedHtmlcontent = ''
            $.each(item.userList, function (index, contents) {
                selectedHtmlcontent += `
                    <i>${contents.username}</i>
                `
            })
            html += `
                <li>
                    <span>${txt}</span>
                    ${selectedHtmlcontent}
                </li>
                `
        })
        return html
    }
    /**
     * 任务日期控件
     * @param {*} id
     * @param {*} parent
     * @param {*} _start
     * @param {*} _end
     */
    let queryCommunicatesApproval = (id, parent, _start, _end) => {
        if (!_start && !_end) {
            _start = moment(new Date()).format('YYYY/MM/DD') + ' 00:00'
            _end = moment(new Date()).format('YYYY/MM/DD') + ' 23:59'
            $('div.' + parent + ' input.beginTime').val(_start)
            $('div.' + parent + ' input.endTime').val(_end)
        }

        //初始化日期插件
        let dateRangeParam = {
            dateRange: $('#' + id), // 时间存放位置元素
            beginTime: $('div.' + parent + ' input.beginTime'), //开始时间值存放位置元素
            endTime: $('div.' + parent + ' input.endTime'), //结束时间值存放位置元素
            dateFormat: 'YYYY/MM/DD HH:mm', //日期格式
            url: '', //跳转、渲染地址
            parentObj: $('.' + parent), //父节点
            startDate: _start, //默认开始时间
            endDate: _end, //默认结束时间
            isDefaultDate: true, //是否显示默认时间
            isTimePicker: true, //是否显示小时、分钟
            cancelLabel: '取消', //取消按钮显示文案默认“取消”
            isCancleClick: false, //是否绑定取消事件
        }

        $('.' + parent).dateRangeCustom(dateRangeParam)

    }
    /**
     * 含金量设置默认事件
     */
    let defaultGoldContent = (type) => {
        $('.task_goldmain_title').text($('#task-detail-box .approval-taskName input').val())
        //本任务 设置星级交互
        $('.task_goldmain_setting .star_box i').off().click(function () {
            if ($('.task_goldmain_setting .star_box i.star_on:last').index() == $(this).index()) { //再次点击星级取消
                $('.task_goldmain_setting .star_box i').removeClass('star_on')
            } else {
                $(this).prevAll().addClass('star_on')
                $(this).nextAll().removeClass('star_on')
                $(this).addClass('star_on')
            }
            //验证星级是否达到上限
            $('.star_hint').hide()
            let starIndex = parseInt($(this).index()) + 1
            let taskStar = $(`.task_goldmain_statistics ul li[data-typeid=${starIndex}]`).attr('data-remainNum')
            if (taskStar == 0) {
                $('.star_hint').show().html(`${starIndex}星任务已达上限，请选择其他星级`)
            }
        })
        //右侧任务列表 设置星级交互
        $('.task_goldmain_list ul li .star_box i').off().click(function () {
            let star = parseInt($(this).index()) + 1
            saveGoldContent(this, star) //设置任务星级
        })
        //保存含金量
        $('#taskGoldSaveG').off().click(function () {
            if (!$('.star_hint').is(':hidden')) {
                toastr["error"]($('.star_hint').text(), "信息提示");
                return
            }
            let starNum = $('.task_goldmain_setting .star_box .star_on').length
            taskGoldSaveGoalgo(starNum)
        })
    }
    /**
     * 设置进度
     * @param {*} process
     */
    let setProgess = (process) => {
        let progressRun = $('.recode-progress>.recode-progress-run')
        let progressDef = $('.recode-progress>.recode-progress-default')
        let progressDes = $('.task-detail-recode-describe>.recode-progress-run')
        let progressDesComp = $('.task-detail-recode-describe>.recode-progress-complete')
        if (process == 0) {
            progressRun.hide()
            progressDef.show()
            progressDef.css('width', '100%')
            progressDes.html('')
            progressDes.hide()
            progressDesComp.show()
            progressDesComp.css('width', '95%')
        } else if (process < 100) {
            progressRun.show()
            progressDef.show()
            progressDes.show()
            progressDesComp.show()
            progressDef.css('width', (100 - process) + '%')
            progressRun.css('width', process + '%')
            progressDes.html(process + '%')
            progressDes.css('width', process + '%')
            progressDesComp.css('width', (95 - process) + '%')
        } else {
            progressRun.show()
            progressDef.hide()
            progressDes.show()
            progressDesComp.hide()
            progressDes.html(process + '%')
            progressDes.css('width', '95%')
            progressRun.css('width', '100%')
        }
    }
    /**
     * 会议详情
     * @param {*} meetingId  会议id
     * @param {*} userId  
     */
    let queryInfos = (meetingId, userId) => {
        $("#task-detail-box").hide();
        $(".approvalDetails").show();
        let param = {
            'meetingId': meetingId,
            'userId': userId,
            'type': 0
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: param,
            url: loginService + '/public/meeting/info',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('system', 'oa');
                xhr.setRequestHeader("type", 0);
                App.blockUI(window)
            },
            success: function (data) {
                if (data.returnCode == 0) {
                    let datas = data.data || []
                    setDetails(datas)
                }
            },
            complete: function () {
                App.unblockUI(window)
            },
            error: function (data) {
                // toastr['error'](data.returnMessage, "信息提示")
                ErrorToastr.authorityMessage(data)
            }
        })
    }
    /**
     * 渲染会议信息
     * @param {} data 
     */
    let setDetails = (data) => {
        $('.approvalDetails').empty().html(`<div id="meeting-info-box" class="show-info-box">
        <div class="meet-header"><span>审批内容</span><span>会议所属：${data.teamName || ''}</span></div>
        <div class="meeting-info-title">${data.name}</div>
        <div style="padding: 15px;">
            <div class="meeting-info-msg">
                <div class="meeting-info-headImg">
                    <img src="../../common/image/company/meeting-myzone/none_meeting_room.png">
                </div>
                <div>
                    <div class="meet-room">${data.meetingRoomName}<span></span></div>
                        <div class="meet-time">${data.startTime}-${data.endTime}</div>
                    </div>
                    <div style="position: absolute;right:20px;">
                        <div class="meeting-head-right">
                            <span class="m-r-icon"></span><span class="m-r-cont">未开启</span>
                        </div>
                        <div class="meeting-all-time">距离会议开始时间${data.overTime}</div>
                    </div>
                </div>
                <div class="meeting-org">
                    <span class="meeting-org-org-icon"></span><span class="meeting-org-name">${data.teamName}</span>
                    <span class="meeting-org-user-icon"></span><span class="meeting-org-user">${data.originator}</span>
                </div>
                <div class="meetTit-box">
                ${renderMeetIssue(data.subjects || [])}
                </div>
                <div class="infos joinUsers">
                    <span>参会成员</span>
                    <p>${getSubUser(data.joinUsers, '1')}</p>
                </div>
                <div class="infos attr attr-file-box">
                    <span>附件</span>
                    <div class="attr-box">
                        ${renderMeetFile(data.meetingFileModels || [])}
                    </div>
                </div>
            </div>
        </div>`)
        $("[data-toggle='tooltip']").tooltip()
    }
    /**
     * 渲染会议附件
     * @param {附件} list 
     */
    let renderMeetFile = (list) => {
        let fileLi = ''
        $.each(list, (i, item) => {
            item = item.file || {}
            let ext = item.fileKey.toLowerCase().split('.').splice(-1)[0];
            if ($.inArray(ext, constants.image) != -1) {
                let imgUrl = CommonPlupload.getOnlineImg(item.fileKey, item.dir)
                fileLi += `<li>
                    <img src='${imgUrl}' class="img_file img_around" data-key="${item.fileKey}" data-size="${item.fileSize}" onclick="CommonPlupload.previewImg(this,event, '${item.fileName}', ${item.fileSize},'true','.file_box_list')">
                    <a onclick = "downLoadFile.init('${imgUrl}', '${item.fileName}', ${item.fileSize}, '${ext}', event)"
                    class = "download_icon"> </a>
                </li>`
            } else {
                if ($.inArray(ext, constants.isShowIcon) != -1) {
                    ext = CommonPlupload.changeExt(ext)
                    fileLi += `<li title="${item.fileName}" data-toggle="tooltip" onclick="filePreviewCommon.showFile('${item.dir}', ${item.fileSize}, '${item.fileName}', '${item.fileKey}', '${item.uploadDate}', '${item.uploadUser}', event)">
                        <img src="../../common/image/task/total-process-manage/${ext}.png">
                        <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=${item.dir}', '${item.fileName}', ${item.fileSize}, '${ext}', event)" class="download_icon"></a>
                    </li>`
                } else {
                    fileLi += `<li title="${item.fileName}" data-toggle="tooltip" onclick="filePreviewCommon.showFile('${item.dir}', ${item.fileSize}, '${item.fileName}', '${item.fileKey}', '${item.uploadDate}', '${item.uploadUser}', event)">
                        <img src="../../common/image/task/total-process-manage/normal.png">
                        <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=${item.dir}', '${item.fileName}', ${item.fileSize}, '${ext}', event)" class="download_icon"></a>
                    </li>`
                }
            }
        })
        return fileLi
    }
    /**
     * 获取议题列席成员
     * @param {*} users 
     * @param {*} flag 0:列席成员 1:参会成员
     */
    let getSubUser = (users, flag) => {
        let userHtml = ''
        $.each(users, (i, item) => {
            if (flag == '1') {
                userHtml += `<span data-id="${item.userId}" title="${item.username}" data-toggle="tooltip">
                【${item.deptName}】${item.username}
            </span>`
            } else {
                userHtml += `<span data-id="${item.userId}" title="${item.username}" data-toggle="tooltip" >
                ${item.username}
            </span>`
            }
        })
        return userHtml
    }

    /**
     * 会议详情附件渲染
     * @param {} list 
     */
    let showAttachmentList = (list) => {
        let html = ''
        $.each(list, function (index, item) {
            let file = item.file
            let key = file.fileKey
            let name = file.fileName
            let size = file.fileSize
            let dir = file.dir
            let preview = ''
            let ext = key.toLowerCase().split('.').splice(-1)[0];
            let download = `<a><div class="download-file" onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${key}&fileName=${name}&dir=approval', '${name}', ${size}, '${ext}', event, 'provide')"></div></a>`
            if (ext == "bmp" || ext == "png" || ext == "gif" || ext == "jpg" || ext == "jpeg") {
                preview = `<div onclick="GoalgoExecute.onlinePreviewImage('${key}','${dir}')" class="preview-img"></div>`
            }
            if (name.length == 0) {
                download = ''
            }
            html += `<div class="attachment-preview"><div class="provide-reason" data-toggle="tooltip" title="${name}">${name}</div>${preview}${download}</div>`
        })
        return html
    }

    /**
     * 渲染会议议题,达到目标,列席人员
     * @param {} discussData 
     */
    let renderMeetIssue = (discussData) => {
        let htmls = ''
        $.each(discussData, (i, item) => {
            htmls += `<div class="meeting-box">
            <div class="infos topics">
            <span>会议议题</span>
            <p>${item.topic}</p>
            </div>
            <div class="infos goals">
            <span>达到目标</span>
            <p>${item.goal}</p>
            </div>
            <div class="infos userNames">
            <span>列席成员</span>
            <p>${item.users.length != 0 ? getSubUser(item.users, '0') : ''}</p>
            </div></div>`
        })
        return htmls
    }





    /**
     * 查询流程设计图
     */
    let getProcessDataOld = (_modelId) => {
        $.ajax({
            type: 'post',
            dataType: 'json',
            // url: loginService + '/approval/findActModel',
            url: loginService + '/approval/findByEventId',
            // data: {
            //     "modelId": _modelId
            // },
            data: {
                "eventId": _modelId
            },
            beforeSend: function (xhr) {
                App.blockUI(window);
            },
            async: false,
            success: function (data) {
                if (data.returnCode == 0) {
                    if (data.data) {
                        let dataList = data.data.childShapes || []
                        if (dataList.length != 0) {
                            drawOldProcess(dataList)
                            // 记录开始节点id，保存时传给后台
                            $(dataList).each(function (i, item) {
                                if (item.stencil.id == 'StartNoneEvent') {
                                    startNodeId = item.resourceId || '';
                                }
                            });
                        }
                    }

                } else {
                    toastr["error"]("查询流程设计失败", "信息提示")
                }
            },
            error: function (res) {
                toastr["error"](res.returnMessage, "信息提示")
            },
            complete: function (data) {
                App.unblockUI(window);
            }
        })
    }

    /**
     * 绘制历史流程图
     */
    let drawOldProcess = (dataList) => {
        handleDataInfo = []
        let userTaskArr = []
        $.each(dataList, (i, item) => {
            if (item.stencil.id == 'StartNoneEvent') { //开始节点
                startOld = [{
                    "id": item.resourceId,
                    "stencil": item.stencil.id,
                    "outId": item.outgoing,
                }]
                startItem = item
            } else if (item.stencil.id == 'UserTask' || item.stencil.id == 'SequenceFlow') { //审批节点及线条
                userTaskArr.push(item)
            } else if (item.stencil.id == 'EndNoneEvent') { //end节点
                endOld = [{
                    "id": item.resourceId,
                    "stencil": item.stencil.id,
                }]
            }
        })
        //转换查询的数据为前端需要的数据
        getDataInfoByFlow(userTaskArr)
    }

    /**
     * 判断是否在上级节点的outid里面
     */
    let isInOutId = (arr, _id) => {
        let isIn = false
        $.each(arr, (i, item) => {
            if (item.resourceId == _id) {
                isIn = true
                return
            }
        })
        return isIn
    }

    /**
     * 根据线条数据匹配节点
     */
    let getDataInfoByFlow = (arr) => {
        let newArr = arr.concat([])
        historyArr = newArr
        childLine = []
        //遍历数组
        if ($.isEmptyObject(startItem)) {
            return
        }
        getNodeByLineId(startItem, newArr)
        setTimeout(() => {
            resizeDrawSvg()
        }, 50);
    }
    /**根据线条id找节点 */
    let getNodeByLineId = (pItem, arr, obj, parentObj) => {
        let newArr = arr.concat([])
        let nextArr = []
        let nextResourceId = []
        if (pItem.outgoing.length == 1 && !obj) { //串行节点开头
            lineIndex = 1
        }
        //根据节点outgoing找线条集合
        if ((pItem.outgoing.length > 1 && !obj) || obj) {
            $.each(newArr, (i, item) => {
                if (isInOutId(pItem.outgoing, item.resourceId)) {
                    //已并行节点开头
                    if (lineIndex == 1 && childLine.indexOf(item.outgoing[0].resourceId) != -1 && hasGroup && item.outgoing[0].resourceId != endOld[0].id && !isInArray(groupLineId, item.outgoing[0].resourceId)) {
                        groupLineId.push(item.outgoing[0].resourceId)
                        nextGroupItem = pItem
                        hasGroup = false
                    }
                    if (isInOutId(pItem.outgoing, item.resourceId) && !isInArray(nextArr, item.outgoing[0].resourceId)) {
                        nextArr.push(item.outgoing[0].resourceId)
                        nextResourceId.push(item.resourceId)
                    }
                    if (lineIndex == 0 && !isInArray(childLine, item.outgoing[0].resourceId)) {
                        childLine.push(item.outgoing[0].resourceId)
                    }
                }
            })
        } else if (pItem.outgoing.length = 1 && !obj) {
            $.each(newArr, (i, item) => {
                if (isInOutId(pItem.outgoing, item.resourceId) && !isInArray(nextArr, item.outgoing[0].resourceId)) {
                    nextArr.push(item.outgoing[0].resourceId)
                    nextResourceId.push(item.resourceId)
                }
            })
        }
        let childData = []
        let findChild = true
        let childLineId = [] //
        let childLineIdNext = []
        $.each(nextArr, (i, idx) => {
            if (!obj && i == 0 && nextArr.length != 1) {
                childLine = []
                lineIndex = 0
            } else if (!obj && i != 0 && nextArr.length != 1) {
                lineIndex = 1
            } else if (nextArr.length == 1 && !obj && i == 0) {
                lineIndex = 1
                findChild = false
            }
            if (i == 0 && obj) {
                childLineId = []
                childLineIdNext = []
            }
            $.each(newArr, (j, item) => {
                if (idx == item.resourceId && item.stencil.id == 'UserTask') {
                    let _val = item.properties.usertaskassignment.assignment.candidateUsers[0].value
                    // candidateUsers不知道谁加的，只能先判断不让报错影响流程
                    let showId = _val ? _val.split("#")[0] + '#' + _val.split("#")[1] : ''
                    let _id = item.outgoing
                    let newObj = {
                        "name": item.properties.name.split("#")[0],
                        "nodeType": item.properties.multiinstance_type || '',
                        "condition": item.properties.multiinstance_condition || '',
                        "variable": item.properties.multiinstance_variable || '',
                        "noticeUsers": item.noticeUsers || [],
                        "approvalName": item.properties.name.split("#")[1],
                        "value": _val,
                        "id": showId,
                        "resourceId": item.resourceId,
                        "outId": _id,
                        "childrenData": [],
                        "prevLineId": nextResourceId[i],
                        "relationEvent": item.relationEvent || '',
                        "approvalType": item.approvalType || 0
                    }
                    childData.push(newObj)
                    if (findChild) {
                        if (i == 0 && obj && nextArr.length != 0) {
                            childLineId = isPointOne(item.outgoing)
                        } else if (i != 0 && obj && nextArr.length != 0) {
                            childLineIdNext = isPointOne(item.outgoing)
                        }
                        // childLineId.push(item.outgoing[0].resourceId)
                        getNodeByLineId(item, newArr, newObj, obj)
                    } else {
                        groupLineId.push(item.outgoing[0].resourceId)
                        nextGroupItem = item
                    }
                    return
                }
            })
        })
        if (obj) {
            if (childData.length != 0) {
                obj.childrenData.push(childData)
                if (arrayEqual(childLineId, childLineIdNext) && childData[0].childrenData.length != 0 && childData[0].childrenData[0].length == 1) {
                    $.each(childData, (i, item) => {
                        item.childrenData = []
                    })
                    obj.childrenData = []
                    obj.childrenData.push(childData)
                    // obj.childrenData.push(nowChildData)
                }
            }
        } else {
            //删除不是当前组的节点
            childData = delGroupNode(childData, groupLineId)
            if (childData.length != 0) {
                handleDataInfo.push(childData)
            }
            if (groupLineId.length != 0 && !isInArray(groupLineId, endOld[0].id)) {
                childLine = []
                lineIndex = 0
                hasGroup = true
                groupLineId = []
                getNodeByLineId(nextGroupItem, newArr)
            }
        }
    }

    let isPointOne = (outArr) => {
        let showoutArr = []
        $.each(outArr, (i, item) => {
            $.each(historyArr, (j, idx) => {
                if (item.resourceId == idx.resourceId) {
                    showoutArr.push(idx.outgoing[0].resourceId)
                    return
                }
            })

        })
        return showoutArr
    }

    let arrayEqual = (arr1, arr2) => {
        if (arr1 === arr2) return true;
        if (arr1.length != arr2.length) return false;
        for (var i = 0; i < arr1.length; ++i) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    /**
     * 去除不是该组的多余节点
     */
    let delGroupNode = (arr, delId, parentArr) => {
        let newArr = arr
        if (delId.length == 0) {
            return newArr
        }
        $.each(newArr, (i, item) => {
            $.each(delId, (j, idx) => {
                if (item && item.resourceId == idx) {
                    newArr = []
                    if (newArr.length == 0 && parentArr) {
                        parentArr.childrenData = []
                    }
                }
                if (item && item.childrenData && item.childrenData.length != 0) {
                    if (item.childrenData[0].length == 0) {
                        item.childrenData = []
                    } else {
                        delGroupNode(item.childrenData[0], delId, item)
                    }
                }
            })
        })
        return newArr
    }

    /**
     * 判断元素是否在数组中
     */
    let isInArray = (arr, val) => {
        let isIn = false
        $.each(arr, (i, item) => {
            if (item == val) {
                isIn = true
                return
            }
        })
        return isIn
    }

    /**绘制流程图 */
    let resizeDrawSvg = (isFresh) => {
        //设置画布宽高
        if (!isFresh) {
            window_w = 462
            window_h = $(window).height();
        }
        proceeDesignPaper ? proceeDesignPaper.remove() : ''
        nodeArr = []
        _allWidth = 0
        _allTop = 0
        proceeDesignPaper = new Raphael("activiti", window_w, window_h);
        //绘制流程起点
        let rect_start = proceeDesignPaper.rect(offset_start_l, (window_h - rect_start_h) * 0.5, rect_start_w, rect_start_h, rect_start_r).attr(start_attr);
        nodeArr.push({
            type: 'start',
            target: rect_start,
            id: startOld[0].id,
            outId: []
        })
        /**只有开始节点室end的x坐标 */
        endX = offset_start_l + rect_start_w + 77
        endPid = [startOld[0].id]
        $(rect_start.node).data("id", startOld[0].id)
        $(rect_start.node).data("stencil", startOld[0].stencil)
        $(rect_start.node).data("name", "发起者")
        if (startOld[0].outId.length != 0) {
            $(rect_start.node).data("outId", startOld[0].outId)
        }

        /**操作数据不为空时 */
        if (handleDataInfo.length != 0) {
            $.each(handleDataInfo, (i, item) => {
                if (i == 0) { //第一个节点父级信息设置
                    _parentX = offset_start_l + rect_start_w + arrow_w
                    _parentY = parseInt(window_h * 0.5)
                    minTop = maxTop = _parentY
                }
                drawProcessDesign(item, i)
            })
        }
        //绘制流程终点
        window_h = maxTop - minTop + 500
        window_w = endX + 600
        $("#activiti svg").css({
            "width": window_w,
            "height": window_h,
            "transform": "translateY(-50%)",
            "top": "50%"
        })
        $("#activiti").width(window_w)
        $("#activiti").height(window_h)
        $(".activiti-img").height(window_h)
        //绘制流程终点
        let rect_end = moveRectToRectRight(proceeDesignPaper);
        nodeArr.push({
            type: 'end',
            pId: endPid,
            id: endOld[0].id,
            target: rect_end
        })
        $(rect_end.node).data("id", endOld[0].id)
        $(rect_end.node).data("stencil", endOld[0].stencil)
        $(rect_end.node).data("pId", endPid)
        $(rect_end.node).data("name", "END")
        //文字描述
        insertRectText(proceeDesignPaper, rect_start, "发起者", "#fff");
        insertRectText(proceeDesignPaper, rect_end, "END", "#fff");
        //强制改变文字偏移
        $("#activiti svg").find("tspan").attr("dy", 4)

        /**绘制流程线条 */
        drawNodeLine(nodeArr)

        if (!isFresh) {
            resizeDrawSvg(true)
        }
    }
    //设置结束矩形位置
    let moveRectToRectRight = (root) => {
        let y = Math.round($(nodeArr[0].target.node).attr("y")); //获取开始节点的y坐标
        let rectNew = root.rect(endX, y, rect_start_w, rect_start_h, rect_start_r).attr(end_attr);
        return rectNew;
    }

    /**
     * 绘制节点之间的线条
     */
    let drawNodeLine = (arr) => {
        allNodeLineArr = []
        //绘制节点之间线条
        let noneMatch = false
        $.each(arr, (i, item) => {
            $.each(arr, (j, idx) => {
                if (item.outId && idx.pId && idx.pId.indexOf(item.id) != -1 && item.type != 'line' && idx.type != 'line') {
                    if (idx.type == 'end') {
                        moveArrowToRightConcurren(item.target, idx.target, 'end')
                    } else {
                        moveArrowToRightConcurren(item.target, idx.target)
                    }
                    noneMatch = true
                    return
                }
            })
            if (noneMatch) {
                return
            }
        })
    }

    /**设置上级节点的outId */
    let resetPrevOutId = (_pid, nowLineId, _nextId) => {
        $.each(nodeArr, (i, item) => {
            if (item.id == _pid) {
                item.outId.push({
                    "resourceId": nowLineId
                })
                return
            }
        })
        $.each(nodeArr, (i, item) => {
            if (item.id == _nextId) {
                // item.pId = nowLineId
                $(item.target.node).data("pId", nowLineId)
                return
            }
        })
    }

    //绘制线条
    let moveArrowToRightConcurren = (rectangle1, rectangle2, endType) => {
        let x = Math.round($(rectangle1.node).attr("x"));
        let y = Math.round($(rectangle1.node).attr("y"));
        let w = Math.round($(rectangle1.node).attr("width"));
        let h = Math.round($(rectangle1.node).attr("height"));
        let xNew = x + w + 8
        let yNew = y + h * 0.5
        let xEnd = Math.round($(rectangle2.node).attr("x"))
        let xTo = xEnd - arrow_w
        let yTop = Math.round($(rectangle2.node).attr("y")) + Math.floor($(rectangle2.node).attr("height") / 2);

        let _path = "M" + xNew + "," + yNew + "L" + xTo + "," + yNew + "L" + xTo + "," + yTop + "L" + xEnd + "," + yTop
        if (xNew > xTo) {
            _path = "M" + xTo + "," + yNew + "L" + xNew + "," + yNew + "L" + xNew + "," + yTop + "L" + xEnd + "," + yTop
        }
        if (Math.abs(xTo - xNew) < 30) {
            _path = "M" + xTo + "," + yNew + "L" + xEnd + "," + yTop
        }
        let _rectType1 = $(rectangle1.node).data('type')
        let _rectType2 = $(rectangle2.node).data('type')
        let _rectGroupName1 = $(rectangle1.node).data('groupName')
        let _rectGroupName2 = $(rectangle2.node).data('groupName')
        //两组并行节点线条
        if ((_rectType1 == 1 && _rectType2 == 1) && (_rectGroupName1 != _rectGroupName2)) {
            let xMid = xEnd - arrow_w * 2
            let yMid = $(rectangle2.node).data("midHeight")
            _path = "M" + xNew + "," + yNew + "L" + xMid + "," + yNew + "L" + xMid + "," + yMid + "L" + xTo + "," + yMid + "L" + xTo + "," + yTop + "L" + xEnd + "," + yTop
        }

        //线条结尾加箭头
        let newPath = proceeDesignPaper.path(_path).attr({
            "stroke": "#AED2F2",
            "stroke-width": 2,
            'arrow-end': 'classic-wide-long'
        })
        /**重设父级节点的outId */
        let nowLineId
        if ($(rectangle2.node).data("prevLineId") && $(rectangle1.node).data("type") != 1 && !endType) {
            nowLineId = $(rectangle2.node).data("prevLineId")
        } else if ($(rectangle2.node).data("prevLineId") && $(rectangle1.node).data("type") == 1 && !endType) {
            let prevOutId = $(rectangle1.node).data("outId")
            if (prevOutId.length == 1) {
                nowLineId = $(rectangle1.node).data("outId")[0].resourceId
            } else if (prevOutId.length > 1) {
                if ($(rectangle2.node).data("type") == 1) {
                    $.each(prevOutId, (i, item) => {
                        if (!isInArray(allNodeLineArr, item.resourceId)) {
                            nowLineId = item.resourceId
                            return false
                        }
                    })
                } else {
                    nowLineId = "sid-" + Math.uuid()
                }
            } else {
                nowLineId = "sid-" + Math.uuid()
            }
        } else if ($(rectangle1.node).data("outId") && endType && endType == 'end') {
            let prevNodeOut = $(rectangle1.node).data("outId")
            if (prevNodeOut.length == 0) {
                nowLineId = "sid-" + Math.uuid()
            } else {
                nowLineId = prevNodeOut[0].resourceId
            }
        } else {
            nowLineId = "sid-" + Math.uuid()
        }
        //强行去重
        if (!isInArray(allNodeLineArr, nowLineId)) {
            allNodeLineArr.push(nowLineId)
        } else {
            nowLineId = "sid-" + Math.uuid()
            allNodeLineArr.push(nowLineId)
        }
        resetPrevOutId($(rectangle1.node).data("id"), nowLineId, $(rectangle2.node).data("id"))
        nodeArr.push({
            lineType: $(rectangle2.node).data("type"),
            type: 'line',
            target: newPath,
            id: nowLineId,
            outId: $(rectangle2.node).data("id")
        })
        $(newPath.node).data("id", nowLineId)
        $(newPath.node).data("startName", $(rectangle1.node).data("name"))
        $(newPath.node).data("endName", $(rectangle2.node).data("name"))
        $(newPath.node).data("stencil", "SequenceFlow")
        $(newPath.node).data("prevType", $(rectangle1.node).data("type"))
        $(newPath.node).data("outId", $(rectangle2.node).data("id"))
    }

    //给矩形增加居中的文字
    let insertRectText = (root, rectangle, str, _color) => {
        let x = Math.round($(rectangle.node).attr("x"));
        let y = Math.round($(rectangle.node).attr("y"));
        let w = $(rectangle.node).attr("width");
        let h = $(rectangle.node).attr("height");
        let newStr = ''
        if (str.length * 12 > 132) {
            newStr = str.substring(0, 11) + '…'
        } else {
            newStr = str
        }
        let textStr = root.text(x + w / 2, y + h / 2, newStr).attr({
            fill: _color,
        });
        textStr.attr({
            "fill": _color,
            "font-size": "12px",
        });
        rectangle.data("cooperative", textStr);
    }

    //给矩形增加居左文字
    let insertRectTextLeft = (root, rectangle, str) => {
        let x = Math.round($(rectangle.node).attr("x"));
        let y = Math.round($(rectangle.node).attr("y"));
        let w = $(rectangle.node).attr("width");
        let h = $(rectangle.node).attr("height");
        let newStr = ''
        let ellispisLen = 0
        if (str.length * 10 > 132) {
            newStr = str.substring(0, 9) + '…'
            ellispisLen = 1
        } else {
            newStr = str
        }
        let numLen = newStr.replace(/[^0-9]/ig, "").length;
        let stringLen = newStr.replace(/[^a-zA-Z]/ig, "").length
        let symbolLen = newStr.replace(/[^,]/ig, "").length
        let longLen = newStr.length - numLen - stringLen - symbolLen
        let textStr = root.text(x + (longLen - ellispisLen) * 6 + (numLen + stringLen + symbolLen) * 3 + 30, y + h / 2, newStr).attr({
            fill: "#5c5c5c"
        });
        textStr.attr({
            "fill": "#808080",
            "font-size": "12px",
        });
        rectangle.data("cooperative", textStr);
    }

    /**
     * 用raphael绘制流程图
     * commonOut 并行时共同输出节点
     */
    let drawProcessDesign = (moke, groupIndex, commonOut, parentTop, parentLeft) => {
        let _len = moke.length //根据数组长度判定是串行还是并行
        _allTop = 0
        if (_len == 1) { //串行
            let newEnd = endPid
            let nowEndArr = []
            let cLeft = _parentX //串行节点的x坐标
            if (parentLeft && parentLeft != 0) {
                cLeft = parentLeft
            }
            let cTop = parseInt(_parentY - rect_approval_h * 0.5) //串行节点的y坐标
            if (parentTop && parentTop != 0) {
                cTop = parseInt(parentTop)
            }
            $.each(moke, (i, item) => {
                let nowTop = cTop
                if (nowTop < minTop) {
                    minTop = nowTop
                }
                if (nowTop > maxTop) {
                    maxTop = nowTop
                }
                let rectName = `rect_approval_${item.id}` //审批节点矩形
                let rectTitle = `rect_title_${item.id}` //审批节点头部矩形
                let rectContText = `rect_cont_${item.id}` //审批节点内容矩形
                let rectSymbol = `rect_symbol_${item.id}` //审批节点标签矩形
                let rectRadiusBottomLeft = `rect_radius_bottomL_${item.id}`
                let rectRadiusBottomRight = `rect_radius_bottomR_${item.id}`
                //渲染节点矩形
                rectName = proceeDesignPaper.rect(cLeft, cTop, rect_approval_w, rect_approval_h, rect_approval_r).attr(approval_attr)
                //渲染节点title
                rectTitle = proceeDesignPaper.rect(cLeft - 1, cTop, rect_approval_w + 2, 30, 8).attr({
                    "fill": "#4285F4",
                    "stroke": 'none'
                })
                //节点title文本
                insertRectText(proceeDesignPaper, rectTitle, item.name, "#fff");
                //渲染底部遮挡
                rectRadiusBottomLeft = proceeDesignPaper.rect(cLeft - 1, cTop + 22, 8, 8, 0).attr({
                    "fill": "#4285F4",
                    "stroke": 'none'
                })
                rectRadiusBottomRight = proceeDesignPaper.rect(cLeft + rect_approval_w - 7, cTop + 22, 8, 8, 0).attr({
                    "fill": "#4285F4",
                    "stroke": 'none'
                })

                //显示审批类型
                let showApprovalTypeTxt = '审'
                if (item.approvalType == 1) {
                    showApprovalTypeTxt = '协'
                }

                //渲染节点审批人矩形
                if (item.noticeUsers.length == 0) {
                    rectContText = proceeDesignPaper.rect(cLeft, cTop + 30, rect_approval_w, 42, 0).attr({
                        "stroke": 'none'
                    })
                    //节点审批人标签
                    let approvalSymbolRect = proceeDesignPaper.rect(cLeft + 8, nowTop + 43, 16, 16, 2).attr({
                        "stroke": '#4285F4'
                    })
                    insertRectText(proceeDesignPaper, approvalSymbolRect, showApprovalTypeTxt, "#4285F4");
                } else {
                    rectContText = proceeDesignPaper.rect(cLeft, cTop + 30, rect_approval_w, 25, 0).attr({
                        "stroke": 'none'
                    })
                    //节点审批人标签
                    let approvalSymbolRect = proceeDesignPaper.rect(cLeft + 8, nowTop + 35, 16, 16, 2).attr({
                        "stroke": '#4285F4'
                    })
                    insertRectText(proceeDesignPaper, approvalSymbolRect, showApprovalTypeTxt, "#4285F4");
                    let showUsers = ''
                    $.each(item.noticeUsers, (j, idx) => {
                        if (j != item.noticeUsers.length - 1) {
                            showUsers += idx.split("#")[2] + ','
                        } else {
                            showUsers += idx.split("#")[2]
                        }
                    })
                    let noticUserText = proceeDesignPaper.rect(cLeft, cTop + 55, rect_approval_w, 25, 0).attr({
                        "stroke": 'none'
                    })
                    //节点知会人标签
                    let noticeSymbolRect = proceeDesignPaper.rect(cLeft + 8, nowTop + 60, 16, 16, 2).attr({
                        "stroke": '#4285F4'
                    })
                    insertRectText(proceeDesignPaper, noticeSymbolRect, "知", "#4285F4");
                    insertRectTextLeft(proceeDesignPaper, noticUserText, showUsers)
                }

                //节点审批人文本
                insertRectTextLeft(proceeDesignPaper, rectContText, item.approvalName)

                //渲染节点标签矩形
                rectSymbol = proceeDesignPaper.rect(cLeft + 126, cTop + 72, 36, 22, 0).attr({
                    "fill": "#EFF8FF",
                    "stroke": 'none'
                })
                /**
                 * 对比确定end节点x坐标
                 */
                if (cLeft + rect_approval_w + 154 > endX) {
                    if (commonOut) {
                        endX = cLeft + 154 + rect_approval_w
                    } else {
                        endX = cLeft + 77 + rect_approval_w
                    }
                }

                $(rectName.node).data("id", item.resourceId)
                //渲染节点标签文本
                let showTypeTxt = ''
                if (item.nodeType == 'None') {
                    showTypeTxt = '或签'
                } else if (item.nodeType == 'Parallel' && item.approvalType == 0) {
                    showTypeTxt = '会签'
                } else if (item.nodeType == 'Parallel' && item.approvalType == 1) {
                    showTypeTxt = '协同'
                } else if (item.nodeType == 'DefineUser') {
                    showTypeTxt = '指定'
                } else {
                    showTypeTxt = '自定义'
                }
                //核定或签
                if (item.relationEvent) {
                    showTypeTxt = '核定'
                }

                insertRectText(proceeDesignPaper, rectSymbol, showTypeTxt, "#4285F4");
                let nowPid
                if (item.childrenData && item.childrenData.length != 0 && item.childrenData[0].length != 0) { //并行中包含并行
                    endPid = [item.resourceId]
                    $.each(item.childrenData, (j, idx) => {
                        nowPid = drawProcessDesign(idx, groupIndex, item, cTop, cLeft + (rect_approval_w + arrow_w) * (j + 1))
                    })
                } else {
                    nowPid = [item.resourceId]
                }
                let _type = commonOut ? 1 : 0
                nodeArr.push({
                    type: _type,
                    realType: 0,
                    pId: newEnd,
                    id: item.resourceId,
                    outId: [],
                    target: rectName,
                    groupName: groupIndex,
                    nodeType: item.nodeType || 'None',
                    variable: item.variable || '',
                    noticeUsers: item.noticeUsers || [],
                    condition: item.condition || '',
                    prevLineId: item.prevLineId || '',
                    approvalType: item.approvalType || 0
                })
                $(rectName.node).data("stencil", "UserTask")
                $(rectName.node).data("outId", [])
                $(rectName.node).data("pId", '')
                $(rectName.node).data("type", _type)
                $(rectName.node).data("approvalType", item.approvalType || 0)
                $(rectName.node).data("realType", 0)
                $(rectName.node).data("groupName", groupIndex)
                $(rectName.node).data("nodeType", item.nodeType || 'None')
                $(rectName.node).data("variable", item.variable || '')
                $(rectName.node).data("noticeUsers", item.noticeUsers || [])
                $(rectName.node).data("condition", item.condition || '')
                $(rectName.node).data("outName", item.approvalName)
                $(rectName.node).data("outVal", item.value)
                $(rectName.node).data("name", item.name)
                $(rectName.node).data("prevLineId", item.prevLineId || '')
                if (commonOut) {
                    if (cLeft + rect_approval_w + arrow_w > _parentX) {
                        _parentX = cLeft + rect_approval_w + arrow_w * 2
                    }
                } else if (cLeft + rect_approval_w + arrow_w > _parentX) {
                    _parentX = cLeft + rect_approval_w + arrow_w
                }
                nowEndArr = nowEndArr.concat(nowPid)
            })
            endPid = nowEndArr
            if (commonOut) {
                return nowEndArr
            }
        } else { //并行
            let newEnd = endPid
            let nowEndArr = []
            let bLeft = _parentX
            if (parentLeft && parentLeft != 0) {
                bLeft = parentLeft + 77
            }
            let allHeight = getNodeAllHeight(moke)
            // }
            let bTop = _parentY - parseInt((allHeight - 64) * 0.5)
            if (parentTop && parentTop != 0) {
                bTop = parentTop + rect_approval_h * 0.5 - parseInt((allHeight - 64) * 0.5)
            }
            let newTop = bTop
            $.each(moke, (i, item) => {
                let nowTop = newTop
                _allTop = 0
                if (item.childrenData && item.childrenData.length != 0 && item.childrenData[0].length > 0) {
                    let childHeight = getNodeAllHeight(item.childrenData[0])
                    nowTop = newTop + ((childHeight - 164) / 2)
                    newTop = nowTop + ((childHeight - 164) / 2) + 164
                } else {
                    newTop = nowTop + 164
                }
                if (nowTop < minTop) {
                    minTop = nowTop
                }
                if (nowTop > maxTop) {
                    maxTop = nowTop
                }
                let rectName = `rect_approval_${item.id}` //审批节点矩形
                let rectTitle = `rect_title_${item.id}` //审批节点头部矩形
                let rectContText = `rect_cont_${item.id}` //审批节点内容矩形
                let rectSymbol = `rect_symbol_${item.id}` //审批节点标签矩形
                let rectRadiusBottomLeft = `rect_radius_bottomL_${item.id}`
                let rectRadiusBottomRight = `rect_radius_bottomR_${item.id}`
                //渲染节点矩形
                rectName = proceeDesignPaper.rect(bLeft + 77, nowTop, rect_approval_w, rect_approval_h, rect_approval_r).attr(approval_attr)
                //渲染节点title
                rectTitle = proceeDesignPaper.rect(bLeft + 76, nowTop, rect_approval_w + 2, 30, 8).attr({
                    "fill": "#4285F4",
                    "stroke": 'none'
                })
                //节点title文本
                insertRectText(proceeDesignPaper, rectTitle, item.name, "#fff");
                //渲染底部遮挡
                rectRadiusBottomLeft = proceeDesignPaper.rect(bLeft + 76, nowTop + 22, 8, 8, 0).attr({
                    "fill": "#4285F4",
                    "stroke": 'none'
                })
                rectRadiusBottomRight = proceeDesignPaper.rect(bLeft + rect_approval_w + 70, nowTop + 22, 8, 8, 0).attr({
                    "fill": "#4285F4",
                    "stroke": 'none'
                })

                //显示审批类型
                let showApprovalTypeTxt = '审'
                if (item.approvalType == 1) {
                    showApprovalTypeTxt = '协'
                }

                //渲染节点审批人矩形
                if (item.noticeUsers.length == 0) {
                    rectContText = proceeDesignPaper.rect(bLeft + 77, nowTop + 30, rect_approval_w, 42, 0).attr({
                        "stroke": 'none'
                    })
                    //节点审批人标签
                    let approvalSymbolRect = proceeDesignPaper.rect(bLeft + 85, nowTop + 43, 16, 16, 2).attr({
                        "stroke": '#4285F4'
                    })
                    insertRectText(proceeDesignPaper, approvalSymbolRect, showApprovalTypeTxt, "#4285F4");
                } else {
                    rectContText = proceeDesignPaper.rect(bLeft + 77, nowTop + 30, rect_approval_w, 25, 0).attr({
                        "stroke": 'none'
                    })
                    //节点审批人标签
                    let approvalSymbolRect = proceeDesignPaper.rect(bLeft + 85, nowTop + 35, 16, 16, 2).attr({
                        "stroke": '#4285F4'
                    })
                    insertRectText(proceeDesignPaper, approvalSymbolRect, showApprovalTypeTxt, "#4285F4");
                    let showUsers = ''
                    $.each(item.noticeUsers, (j, idx) => {
                        if (j != item.noticeUsers.length - 1) {
                            showUsers += idx.split("#")[2] + ','
                        } else {
                            showUsers += idx.split("#")[2]
                        }
                    })
                    let noticUserText = proceeDesignPaper.rect(bLeft + 77, nowTop + 55, rect_approval_w, 25, 0).attr({
                        "stroke": 'none'
                    })
                    //节点知会人标签
                    let noticeSymbolRect = proceeDesignPaper.rect(bLeft + 85, nowTop + 60, 16, 16, 2).attr({
                        "stroke": '#4285F4'
                    })
                    insertRectText(proceeDesignPaper, noticeSymbolRect, "知", "#4285F4");
                    insertRectTextLeft(proceeDesignPaper, noticUserText, showUsers)
                }
                //节点审批人文本
                insertRectTextLeft(proceeDesignPaper, rectContText, item.approvalName)

                //渲染节点标签矩形
                rectSymbol = proceeDesignPaper.rect(bLeft + 203, nowTop + 72, 36, 22, 0).attr({
                    "fill": "#EFF8FF",
                    "stroke": 'none'
                })

                //渲染节点标签文本
                let showTypeTxt = ''
                if (item.nodeType == 'None') {
                    showTypeTxt = '或签'
                } else if (item.nodeType == 'Parallel' && item.approvalType == 0) {
                    showTypeTxt = '会签'
                } else if (item.nodeType == 'Parallel' && item.approvalType == 1) {
                    showTypeTxt = '协同'
                } else if (item.nodeType == 'DefineUser') {
                    showTypeTxt = '指定'
                } else {
                    showTypeTxt = '自定义'
                }
                //核定或签
                if (item.relationEvent) {
                    showTypeTxt = '核定'
                }
                insertRectText(proceeDesignPaper, rectSymbol, showTypeTxt, "#4285F4");
                /**
                 * 对比确定end节点x坐标
                 */
                if (bLeft + rect_approval_w + 231 > endX) {
                    endX = bLeft + rect_approval_w + 231
                }
                if (bLeft + rect_approval_w + 231 > _parentX) {
                    _parentX = bLeft + rect_approval_w + 231
                }
                let nowPid
                if (item.childrenData && item.childrenData.length != 0 && item.childrenData[0].length != 0) { //并行中包含并行
                    endPid = [item.resourceId]
                    let showLe = 0
                    let moreLen = 0 //超出长度记录
                    $.each(item.childrenData, (j, idx) => {
                        let parentL = bLeft + rect_approval_w + arrow_w + moreLen
                        if (idx.length > 1) {
                            showLe = 2
                            moreLen += showLe * 77 + rect_approval_w + arrow_w
                        } else {
                            showLe = 0
                            moreLen += rect_approval_w + arrow_w
                            parentL = parentL + 77
                        }
                        nowPid = drawProcessDesign(idx, groupIndex, item, nowTop, parentL)
                    })
                } else {
                    nowPid = [item.resourceId]
                }
                nodeArr.push({
                    type: 1,
                    realType: 1,
                    target: rectName,
                    outId: [],
                    pId: newEnd,
                    groupName: groupIndex,
                    id: item.resourceId,
                    nodeType: item.nodeType || 'None',
                    variable: item.variable || '',
                    noticeUsers: item.noticeUsers || [],
                    condition: item.condition || '',
                    prevLineId: item.prevLineId || '',
                    approvalType: item.approvalType || 0
                })
                $(rectName.node).data("id", item.resourceId)
                $(rectName.node).data("stencil", "UserTask")
                $(rectName.node).data("outId", item.outId)
                $(rectName.node).data("pId", '')
                $(rectName.node).data("type", 1)
                $(rectName.node).data("approvalType", item.approvalType || 0)
                $(rectName.node).data("realType", 1)
                $(rectName.node).data("midHeight", _parentY)
                $(rectName.node).data("groupName", groupIndex)
                $(rectName.node).data("nodeType", item.nodeType || 'None')
                $(rectName.node).data("variable", item.variable || '')
                $(rectName.node).data("noticeUsers", item.noticeUsers || [])
                $(rectName.node).data("condition", item.condition || '')
                $(rectName.node).data("outName", item.approvalName)
                $(rectName.node).data("outVal", item.value)
                $(rectName.node).data("name", item.name)
                $(rectName.node).data("prevLineId", item.prevLineId || '')
                nowEndArr = nowEndArr.concat(nowPid)
            })
            endPid = nowEndArr
            if (commonOut) {
                return nowEndArr
            }
        }
    }
    /**
     * 计算所有节点的总高度
     */
    let getNodeAllHeight = (data, _num) => {
        let len = data.length
        let num = _num ? _num : 0
        _allTop += 164 * (len - num)
        $.each(data, (i, item) => {
            if (item.childrenData && item.childrenData.length != 0 && item.childrenData[0].length > 1) {
                getNodeAllHeight(item.childrenData[0], 1)
            }
        })
        return _allTop
    }

    /**
     * 计算所有节点的总宽度
     */
    let getNodeAllWidth = (data, _num) => {
        let len = data.length
        let num = _num ? _num : 0
        _allWidth += (168 + 77) * (len - num) //一个节点的宽度+一个箭头的宽度 再乘上节点个数 全部是串行节点的情况下
        $.each(data, (i, item) => {
            $.each(item, (j, idx) => {
                if (idx.childrenData && idx.childrenData.length != 0) {
                    _allWidth += 231
                    getNodeAllWidth(idx.childrenData, 1)
                } else {
                    _allWidth += 245
                }
            })
        })
        return _allWidth
    }


    /**
     * 填充审批人 抄送人
     */

    let getApprovalPer = (datas) => {
        // 审批人
        let approvalPer = []
        // 抄送人
        let copyPer = []
        $.each(datas, (i, items) => {
            approvalPer.push(items.approvers)
            copyPer.push(items.notices)
        })
        setApprivalPerson('.node-user-show', approvalPer, 0)
        setApprivalPerson('.send-user-show', copyPer, 1)

    }

    let setApprivalPerson = (perentNode, datas, flag) => {
        let htmls = ''
        $(perentNode).html('')
        // let data = []
        $.each(datas, (i, items) => {
            $.each(items, (index, childArr) => {
                let username = '';
                if (childArr.username.length > 2) {
                    username = childArr.username.slice(-2);
                } else {
                    username = childArr.username;
                }
                htmls += `<div class="provide-node-value">
                                    <div class="imgtest">
                                        <div class="figure-img" data-toggle="tooltip" data-placement="top" title="" data-original-title="${childArr.username}">
                                            <span>${username}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span>${childArr.username}</span>
                                    </div>
                                </div>`
            })
        })
        $(perentNode).html(htmls)
    }

    /**
     * 如果附件后缀为以下格式，显示预览按钮
     * @param {后缀} types
     */
    let isPicture = (types) => {
        let flag = false
        if (types == ".BMP" || types == ".PNG" || types == ".GIF" || types == ".JPG" || types == ".JPEG") {
            flag = true
        }
        return flag
    }

    /**
     * 获取编辑表单内容
     */
    let getEditFormInfo = (forms) => {

        $('.approvale-ul li').each((lindex, item) => {
            let type = $(item).attr('data-id');
            if (type == 'attachment') {

                let deleteFile = '<div onclick="GoalgoExecute.deleteFile(this)" class="delete-file"></div>'
                let preview = `<div onclick="" class="preview-img"></div>`

                $('.approvale-ul li').eq(lindex).children('.file-name').after(deleteFile)
                $('.approvale-ul li').eq(lindex).children('.file-name').after(preview)

            }


            $.each(forms, (findex, datas) => {

                let datasType = datas.type
                let values = datas.elementValue
                let valIndex = datas.elementPosition
                let names = datas.elementName

                if (type !== 'CuttingLine') {}

                //纯文本
                if (type == 'text') {
                    if (datasType == 'text') {
                        $(item).children('.textarea-pre').html(values)
                    }

                };
                //下拉框
                if (type == 'select') {
                    if (datasType == 'select') {

                        $(item).find('select option').each((oindex, oVal) => {
                            let htmls = $(oVal).html()
                            if (values == htmls) {
                                $('.approvale-ul li').eq(valIndex).find('select option').eq(oindex).attr('selected', 'selected')
                            }
                        })
                    }

                }
                //时间
                if (type == 'time') {
                    if (datasType == 'time') {
                        $('.approvale-ul li').eq(valIndex).children('label').children('input').val(values)
                    }
                }
                //单行输入框
                if (type == 'input') {
                    if (datasType == 'input') {

                        $('.approvale-ul li').eq(valIndex).children('input').val(values)
                    }
                }
                //多行输入框
                if (type == 'textarea') {
                    if (datasType == 'textarea') {
                        $('.approvale-ul li').eq(valIndex).children('textarea').val(values)
                        $('.approvale-ul li').eq(valIndex).children('.textarea-pre').html(values)

                        if (names == "申请原因") {
                            $('.approvale-ul li').eq(valIndex).children('textarea').val(values)
                        }
                    }
                }
                //附件
                if (type == 'attachment') {
                    if (datasType == 'attachment') {

                        let name = values.split(":::")[1]
                        let key = values.split(":::")[0]
                        let dir = 'approval'
                        let showOrHide = false


                        $('.approvale-ul li').eq(valIndex).children('.file-name').html(name).attr('dataKey', values)

                        // 如果有附件，显示删除按钮
                        if (values != '') {
                            showOrHide = true
                        }
                        let extStart = name.lastIndexOf(".");
                        let exts = name.substring(extStart, name.length).toUpperCase()


                        // $('.approvale-ul li').eq(valIndex).children(".form-file").each((index, item) => {
                        //     $(item).on("change", function() {
                        //         let newFileName = $(item).val().split("\\").pop()
                        //         let dots = newFileName.lastIndexOf(".");

                        //         let suffix = newFileName.substring(dots, newFileName.length).toUpperCase()

                        //         $('.approvale-ul li').eq(valIndex).children('.file-name').html(newFileName).attr('dataKey', '')

                        //         $('.approvale-ul li').eq(valIndex).children('.preview-img').attr('onclick', 'GoalgoExecute.previewImage(this)').css('display', isPicture(suffix) ? 'block' : 'none')
                        //         $('.approvale-ul li').eq(valIndex).children('.delete-file').css('display', newFileName != '' ? 'block' : 'none')

                        //     })
                        // })

                        $('.approval-count').html('1')
                        // $('.approvale-ul li').eq(valIndex).children('.preview-img').attr('onclick', 'GoalgoExecute.onlinePreviewImage(\'' + key + '\',\'' + dir + '\')').css('display', isPicture(exts) ? 'block' : 'none')
                        // $('.approvale-ul li').eq(valIndex).children('.delete-file').css('display', showOrHide ? 'block' : 'none')


                    }

                }
                //分割线
                if (type == 'CuttingLine') {

                }
                //单选框
                if (type == 'radio') {
                    if (datasType == 'radio') {
                        $(item).find('label').each((laindex, lVal) => {
                            let htmls = $(lVal).children('.radio-span').html()
                            if (values == htmls) {
                                $('.approvale-ul li').eq(valIndex).find('label').eq(laindex).children('div input').iCheck('check')
                            }
                        })
                    }

                }
                //多选框
                if (type == 'checkbox') {
                    if (datasType == 'checkbox') {
                        let cVal = values.split(',')
                        $('.approvale-ul li').eq(valIndex).children('label').each((laindex, lVal) => {
                            $.each(cVal, (cIndex, cVals) => {
                                let htmls = $(lVal).children('.radio-span').html()
                                if (cVals == htmls) {

                                    $('.approvale-ul li').eq(valIndex).find('label').eq(laindex).children('div input').iCheck('check')
                                    // $(lVal).eq(laindex).children('div input').iCheck('check')


                                } else if (cVal.indexOf(htmls) == -1) {
                                    $('.approvale-ul li').eq(valIndex).find('label').eq(laindex).children('div input').iCheck('uncheck')
                                    // $(lVal).children('div input').iCheck('uncheck')
                                }
                            })

                        })
                    }
                }


            })
        })


        $('input').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });
        //绑定时间类型
        $('[data-id="time"]').each((index, item) => {
            //改变时间类型
            if ($(item).attr('data-time') == 'yyyy/mm/dd') {
                $(item).children('label').datetimepicker({
                    pickerPosition: 'bottom-left',
                    language: 'cn',
                    format: 'yyyy/mm/dd',
                    autoclose: true, //自动关闭
                    minView: 2, //最精准的时间选择为日期0-分 1-时 2-日 3-月
                    weekStart: 1
                });
            } else {
                $(item).children('label').datetimepicker({
                    pickerPosition: 'bottom-left',
                    language: 'cn',
                    format: 'yyyy/mm/dd hh:ii',
                    autoclose: true, //自动关闭
                    minView: 1, //最精准的时间选择为日期0-分 1-时 2-日 3-月
                    weekStart: 1
                });
            }
        });
        $("[data-toggle='tooltip']").tooltip();
    }

    /**
     * 查询申请权限信息
     */
    let queryAuthInfo = (state) => {
        let authId = electron.remote.getGlobal("execute").authId
        let approvalType = electron.remote.getGlobal("execute").approvalType
        if (state) {
            approvalType = state
        }
        $.ajax({
            type: "post",
            url: loginService + "/team/permission/info/callback",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            dataType: "json",
            data: {
                authInfoId: authId,
                type: approvalType,
                account: electron.remote.getGlobal("sharedObject").account,
                teamId: electron.remote.getGlobal("execute").teamId
            },
            success: function (data) {
                if (data.returnCode === 0) {
                    postAuthInfo = data.data.info
                    $("#post-auth-box").show();
                    //渲染职务详情信息
                    let info = data.data.authorityModel
                    //申请新增
                    renderPermission(info.addPermission || [], 'permissionModels', 'post-auth-add');
                    //申请删除
                    renderPermission(info.delPermission || [], 'permissionModels', 'post-auth-del');
                    //新增数据范围
                    renderPermission(info.addDataPermissions || [], 'permissionModels', 'post-auth-addRange');
                    //删除数据范围
                    renderPermission(info.delDataPermissions || [], 'permissionModels', 'post-auth-delRange');
                    //隐藏不需要显示的权限类
                    if (info.addPermission && info.addPermission.length > 0) {
                        $("#post-auth-box .post-auth-add").show()
                    } else {
                        $("#post-auth-box .post-auth-add").hide()
                    }
                    if (info.delPermission && info.delPermission.length > 0) {
                        $("#post-auth-box .post-auth-del").show()
                    } else {
                        $("#post-auth-box .post-auth-del").hide()
                    }
                    if (info.addDataPermissions && info.addDataPermissions.length > 0) {
                        $("#post-auth-box .post-auth-addRange").show()
                    } else {
                        $("#post-auth-box .post-auth-addRange").hide()
                    }
                    if (info.delDataPermissions && info.delDataPermissions.length > 0) {
                        $("#post-auth-box .post-auth-delRange").show()
                    } else {
                        $("#post-auth-box .post-auth-delRange").hide()
                    }
                    let allIput = $("#post-auth-box").find('input');
                    $.each(allIput, (i, item) => {
                        $(item).attr('disabled', 'disabled')
                    })
                    $("[data-toggle='tooltip']").tooltip()
                    $('[name="nodeUsers"]').iCheck({
                        checkboxClass: 'icheckbox_flat-blue',
                        radioClass: 'iradio_flat-blue'
                    })
                    $('#post-auth-box input[name=nodeUsers]').each(function () {
                        $(this).iCheck('check');
                        $(this).attr('default-authority', 'true');
                    })

                    let datas = data.data.models || []
                    info = data.data.info
                    callBackUrl = data.data.callBackUrl
                    $('.approvale-ul li').each((index, plug) => {
                        $.each(datas, (subscript, data) => {
                            if (data.position == index) {
                                $(plug).children('.textarea-pre').html(data.value)
                                return true
                            }
                        })
                    })
                    FormTextArea.updatePre()
                } else {
                    $("#post-auth-box").hide();
                    toastr["error"](data.returnMessage, "信息提示")
                }
            },
            error: function () {
                toastr["error"]('查询申请权限信息，请重试', "信息提示")
            }
        })
    }

    /**
     * 渲染职务授权信息
     * @param {} arr 
     * @param {} modules 
     * @param {} nodeId 
     */
    let renderPermission = (arr, modules, nodeId) => {
        if (arr.length !== 0) {
            $("." + nodeId).show();
            let domHtml = '';
            $.each(arr, function (i, item) {
                domHtml += `<div class="post-info-box">
                    <span class="post-item-title" data-id="${item.functionId}"><span>${item.functionName}</span></span>`;
                if (nodeId.indexOf('del') > -1) {
                    domHtml += `<span class="post-item-info post-item-delbox">`;
                    $.each(item[modules] || [], (index, el) => {
                        domHtml += `<span class="post-info-span" data-toggle="tooltip" title="${el.permissionName}">${el.permissionName}</span>`
                    })
                } else {
                    domHtml += `<span class="post-item-info">`;
                    $.each(item[modules] || [], (index, el) => {
                        domHtml += `<li><label class="adaptive_title-person-list">
                        <input type="checkbox" data-id="${el.id}"data-value="${el.permissionName}" name="nodeUsers"style="position: absolute; opacity: 0;">
                        <span data-toggle="tooltip" title="${el.permissionName}">${el.permissionName}</span>
                        </label></li>`
                    })
                }
                domHtml += `</span>`;
                domHtml += `</div>`;
            })
            $(`.${nodeId} .post-item`).empty().html(domHtml)
        } else {
            $("." + nodeId).hide();
        }
    }

    /**
     * 查询制度信息
     */
    let queryRuleInfo = () => {
        let ruleInfo = electron.remote.getGlobal("execute").ruleInfo
        let userId = electron.remote.getGlobal("execute").userId
        ruleInfo = $.parseJSON(ruleInfo)
        custom = ruleInfo.name
        $.ajax({
            type: "post",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            url: loginService + "/public/rule/info/callback",
            dataType: "json",
            data: {
                "ruleId": ruleInfo.id,
                "userId": userId
            },
            success: function (data) {
                if (data.returnCode === 0) {
                    info = data.data.info
                    callBackUrl = data.data.callBackUrl
                    electron.remote.getGlobal("execute").approvalType = data.data.typeName
                    $('.approvale-ul li').each((index, plug) => {
                        if (index == 0) {
                            $(plug).children('.textarea-pre').html(data.data.typeName)
                            return true
                        }

                        if (index == 1) {
                            $(plug).children('.textarea-pre').html(data.data.name)
                            return true
                        }

                        if (index == 3) {
                            $(plug).children('.textarea-pre').html(ruleInfo.name)
                            return true
                        }
                    })
                    FormTextArea.updatePre()
                } else {
                    toastr["error"](data.returnMessage, "信息提示")
                }
            },
            error: function () {
                toastr["error"]('查询申请权限信息，请重试', "信息提示")
            }
        })
    }


    /**
     * 查询信息
     */
    let queryTaskInfo = () => {
        let taskInfoStr = electron.remote.getGlobal("execute").taskInfo || ''
        let taskInfo = $.parseJSON(taskInfoStr)
        custom = taskInfo.name
        info = taskInfo.info
        callBackUrl = taskInfo.callBackUrl

        if (taskInfo.approvalEventName.indexOf('资源') != -1) {
            getResourceInfo(taskInfo.returnResource, taskInfo)
        } else {
            $('.approvale-ul li').each((index, plug) => {
                if (index == 0) {
                    $(plug).children('.textarea-pre').html(taskInfo.approvalEventName)
                }
                if (index == 1) {
                    $(plug).children('.textarea-pre').html(electron.remote.getGlobal('sharedObject').userName)
                }

                if (index == 4) {
                    $(plug).children('.textarea-pre').html(taskInfo.name)
                }

                if (index == 5) {
                    $(plug).children('.textarea-pre').html(taskInfo.liableUsername)
                }
            })
        }
        FormTextArea.updatePre()
    }

    /**
     * 查询信息 升降级
     */
    let demotioneingInfo = () => {
        let taskInfoStr = electron.remote.getGlobal("execute").demotioneingInfo || ''
        let taskInfo = $.parseJSON(taskInfoStr)
        custom = taskInfo.name
        info = taskInfo.info
        callBackUrl = taskInfo.callBackUrl

        if (taskInfo.approvalEventName.indexOf('资源') != -1) {
            getResourceInfo(taskInfo.returnResource, taskInfo)
        } else {
            $('.approvale-ul li').each((index, plug) => {
                if (index == 0) {
                    $(plug).children('.textarea-pre').html(taskInfo.approvalEventName)
                }
                if (index == 1) {
                    $(plug).children('.textarea-pre').html(electron.remote.getGlobal('sharedObject').userName)
                }

                if (index == 4) {
                    $(plug).children('.textarea-pre').html(taskInfo.name)
                }

                if (index == 5) {
                    $(plug).children('.textarea-pre').html(taskInfo.liableUsername)
                }
            })
        }
        FormTextArea.updatePre()
    }


    /**
     * 查询信息
     */
    let queryResourceInfo = () => {
        let resourceInfo = electron.remote.getGlobal("execute").resourceInfo || ''
        resourceInfo = $.parseJSON(resourceInfo)
        info = resourceInfo.info
        custom = resourceInfo.taskName
        callBackUrl = resourceInfo.callBackUrl
        setResourceApprovalInfo(resourceInfo.resourceModels, resourceInfo.taskName, resourceInfo.approvalEventName)
        FormTextArea.updatePre()
    }

    /***
     * 查询沟通邀请信息
     * inviteType 1 加入审批 2 立项审批
     */
    let getInviteInfo = () => {
        let chatInviteInfo = electron.remote.getGlobal("execute").chatInviteInfo || ''
        let inviteType = electron.remote.getGlobal("execute").inviteType
        chatInviteInfo = $.parseJSON(chatInviteInfo)
        info = chatInviteInfo.info
        custom = chatInviteInfo.name
        callBackUrl = chatInviteInfo.callBackUrl
        $('.approvale-ul li.textarea-li').each((index, plug) => {
            if (index == 0) {
                $(plug).children('.textarea-pre').html(chatInviteInfo.approvalEventName)
            }
            if (index == 1) {
                $(plug).children('.textarea-pre').html(electron.remote.getGlobal('sharedObject').userName)
            }
            if (index == 3 && inviteType == 1) {
                let html = `申请加入项目组【${chatInviteInfo.name}】`
                $(plug).children('.textarea-pre').html(html)
            }
            if (index == 3 && inviteType == 2) {
                let html = `名称:${chatInviteInfo.name}<br>项目经理:${chatInviteInfo.managerName}<br>项目级别:${chatInviteInfo.deptId == null ? `企业级，${chatInviteInfo.teamName}` : `部门级，${chatInviteInfo.teamName}——${chatInviteInfo.deptName}`}<br>起止时间:${chatInviteInfo.startTime}至${chatInviteInfo.endTime}<br>SOW目标:${chatInviteInfo.description}<br>`
                html += `里程碑:`
                $.each(chatInviteInfo.milestones, (i, item) => {
                    if (i == 0) {
                        html += `${i + 1}.${item.description}`
                    } else {
                        html += `<br>        ${i + 1}.${item.description}`
                    }
                })
                html += `<br>`
                html += `参与组织:`
                $.each(chatInviteInfo.personModels, (i, item) => {
                    if (i == 0) {
                        html += `${item.belongName}`
                    } else {
                        html += `<br>        ${item.belongName}`
                    }
                })
                html += `<br>`
                $(plug).children('.textarea-pre').html(html)
            }
            if (index == 4 && inviteType == 1) {
                let html = `名称:${chatInviteInfo.name}<br>项目经理:${chatInviteInfo.managerName}<br>项目级别:${chatInviteInfo.deptId == null ? `企业级，${chatInviteInfo.teamName}` : `部门级，${chatInviteInfo.teamName}——${chatInviteInfo.deptName}`}<br>起止时间:${chatInviteInfo.startTime}至${chatInviteInfo.endTime}<br>SOW目标:${chatInviteInfo.description}<br>`
                html += `里程碑:`
                $.each(chatInviteInfo.milestones, (i, item) => {
                    if (i == 0) {
                        html += `${i + 1}.${item.description}`
                    } else {
                        html += `<br>        ${i + 1}.${item.description}`
                    }
                })
                html += `<br>`
                html += `发起组织:${chatInviteInfo.teamName}<br>`
                html += `参与组织:`
                $.each(chatInviteInfo.personModels, (i, item) => {
                    if (i == 0) {
                        html += `${item.belongName}`
                    } else {
                        html += `<br>        ${item.belongName}`
                    }
                })
                html += `<br>`

                $(plug).children('.textarea-pre').html(html)
            }
        })
        FormTextArea.updatePre()
    }

    /**
     * 查询沟通创建项目信息 （//立项审批）
     */
    let getprojectInfo = () => {
        let projectInfo = electron.remote.getGlobal("execute").projectInfo || ''
        projectInfo = $.parseJSON(projectInfo)
        newprojectInfo = projectInfo
        callBackUrl = projectInfo.callBackUrl
        let milestonesText = ''
        let personModelsText = ''
        $.each(projectInfo.milestones, function (index, item) {
            milestonesText += `${index + 1}、${item.description} `
        })
        $.each(projectInfo.personModels, function (index, item) {
            personModelsText += `${item.username} ${item.belongName} `
        })
        $('.approvale-ul li.textarea-li').each((index, plug) => {
            if (index == 0) {
                $(plug).children('.textarea-pre').html(projectInfo.approvalEventName)
            }
            if (index == 1) {
                $(plug).children('.textarea-pre').html(electron.remote.getGlobal('sharedObject').userName)
            }
            // if (index == 3){
            //     let html = `申请加入项目组【${projectInfo.name}】`
            //     $(plug).children('.textarea-pre').html(html)
            // }
            if (index == 3) {
                let html = `名称:${projectInfo.name}<br>负责人:${projectInfo.managerName}<br>项目组归属:${projectInfo.teamName} ${projectInfo.deptName}<br>起止时间:${projectInfo.startTime}至${projectInfo.endTime}<br>SOW目标:${projectInfo.description}<br>里程碑:${projectInfo.milestones.length == 0 ? '' : milestonesText}<br>参与组织:${projectInfo.personModels.length == 0 ? '' : personModelsText}`
                $(plug).children('.textarea-pre').html(html)
            }
        })
        FormTextArea.updatePre()
    }

    /**
     * 查询会议信息
     */
    let getMeetFile = () => {
        let meetInfo = electron.remote.getGlobal("execute").meetInfo || ''
        meetInfo = $.parseJSON(meetInfo)
        info = meetInfo.info
        custom = meetInfo.name
        callBackUrl = meetInfo.callBackUrl
        $('.approvale-ul li.textarea-li').each((index, plug) => {
            if (index == 0) {
                $(plug).children('.textarea-pre').html(meetInfo.approvalEventName)
            }
            if (index == 1) {
                $(plug).children('.textarea-pre').html(electron.remote.getGlobal('sharedObject').userName)
            }
            if (index == 3) {
                let html = ''
                html = `会议名称:${meetInfo.name}<br>开始时间:${meetInfo.startTime}<br>结束时间:${meetInfo.endTime}<br>申请会议室:${meetInfo.meetingRoom == null ? '无' : `${meetInfo.meetingRoomName}(容纳人数${meetInfo.peopleNum}人)`}<br>`
                html += `会议议题:`
                $.each(meetInfo.subjects, (i, item) => {
                    if (i == 0) {
                        html += `${i + 1}.${item.topic}`
                    } else {
                        html += `<br>        ${i + 1}.${item.topic}`
                    }
                })
                html += `<br>`
                html += `参会人数:${meetInfo.userNum}<br>`
                // html += `关联任务:${meetInfo.taskName ? meetInfo.taskName : ''}<br>`
                $(plug).children('.textarea-pre').html(html)
            }
            if (index == 4) {
                let html = ''
                html = `所属机构:${meetInfo.teamName || ''}<br>所属部门:${meetInfo.deptName || ''}<br>`
                $(plug).children('.textarea-pre').html(html)
            }
        })
        FormTextArea.updatePre()
    }


    /**
     * 查询归档信息
     */
    let getTaskFile = () => {
        let fileInfo = electron.remote.getGlobal("execute").fileInfo || ''
        fileInfo = $.parseJSON(fileInfo)
        info = fileInfo.info
        callBackUrl = fileInfo.callBackUrl
        let userId = electron.remote.getGlobal("sharedObject").userId
        $.ajax({
            type: 'post',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            url: loginService + '/task/find/id',
            data: {
                "userId": userId,
                "taskId": electron.remote.getGlobal("execute").taskId
            },
            success: function (data) {
                if (data.returnCode == 0) {
                    let task = data.data || ''
                    let propertys = task.taskPropertyModels || []
                    let html = ''
                    let taskName = ''
                    let attrInfo = ''
                    taskName = electron.remote.getGlobal("execute").taskName
                    // $.each(propertys, function (i, item) {
                    //     let val = item.value
                    //     let arrt = item.arrt
                    //     if (arrt == 'name') {
                    //         taskName = val
                    //         return false
                    //     }
                    // })
                    custom = taskName
                    let status = task.status
                    let statusName = ''
                    if (status == 3) {
                        statusName = '已延迟'
                    } else if (status == 2) {
                        statusName = '已完成'
                    } else {
                        statusName = '进行中'
                    }

                    if (task.flag == 1) {
                        statusName = '冻结'
                    }
                    $($('.approvale-ul li')[2]).children('.textarea-pre').html(`<div>【${taskName}】</div>`)
                    $($('.approvale-ul li')[3]).children('.textarea-pre').html(`<div style="width:50%;float:left">任务状态：${statusName}</div>
                                                                                    <div style="width:50%;float:left">任务进度：${task.process}%</div>`)
                    $($('.approvale-ul li')[0]).children('.textarea-pre').html(`${electron.remote.getGlobal("sharedObject").userName}【${fileInfo.approvalEventName}】审批`)
                    FormTextArea.updatePre()
                } else {
                    toastr["error"]('查询任务详情失败！', "信息提示");
                }

            },
            error: function () {
                toastr["error"]('查询任务详情失败！', "信息提示");
            }
        })
    }


    /**
     * 设置归档归还资源审批数据
     * @param {*} list
     * @param {*} taskName
     * @param {*} approvalEventName
     */
    let setResourceApprovalInfo = (list, taskName, approvalEventName) => {
        let html = ''
        let resourceList = []
        let comment = '资产备注'
        if (approvalEventName == '资源归还') {
            comment = '损坏说明'
        }
        // $('.resource-approval-div').html('')
        $.each(list, function (i, item) {
            resourceList.push(item.id)
            let damageName = '没有损坏'
            if (item.damage == 0) {
                damageName = '无法使用我要报损'
            }
            if (item.damage == 2) {
                damageName = '有损坏但不影响使用'
            }
            html += `<tr>
                        <td>${i + 1}</td>
                        <td><span title="${item.category}" data-toggle="tooltip">${item.category}<span></td>
                        <td><span title="${item.name}" data-toggle="tooltip">${item.name}</span></td>
                        <td><span title="${item.brand}" data-toggle="tooltip">${item.brand}</span></td>
                        <td>T${item.number}</td>
                        <td>${item.needRepay == 0 ? '是' : '否'}</td>
                        <td>${damageName}</td>
                        <td><span title="${item.comment}" data-toggle="tooltip">${item.comment == null ? "无" : item.comment}</td>
                    </tr>`
        })
        let info = `<table>
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>类别</th>
                                <th>品牌</th>
                                <th>物品</th>
                                <th>编号</th>
                                <th>是否需要归还</th>
                                <th>是否有损坏</th>
                                <th>${comment}</th>
                            </tr>
                        </thead>
                        <tbody>${html}</tbody>
                    </table>`
        $($('.approvale-ul li')[2]).children('.textarea-pre').html(`<div>【${taskName}】</div><input type="hidden" value="${resourceList}" class="approval-resource-ids"/>`)
        $($('.approvale-ul li')[0]).children('.textarea-pre').html(`${electron.remote.getGlobal("sharedObject").userName}【${approvalEventName}】审批`)
        $('.resource-approval-div').html(info)
        $("[data-toggle='tooltip']").tooltip()
        electron.remote.getGlobal("execute").taskInfo = ''
        electron.remote.getGlobal("execute").resourceInfo = ''
        electron.remote.getGlobal("execute").fileInfo = ''
    }

    /**
     * 获取任务物资信息
     * @param {*} resourceList
     * @param {*} taskInfo
     */
    let getResourceInfo = (resourceList, taskInfo) => {
        $.ajax({
            type: "post",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            url: loginService + "/task/findTaskResource",
            dataType: "json",
            traditional: true,
            data: {
                ids: resourceList
            },
            success: function (data) {
                if (data.returnCode === 0) {
                    setResourceApprovalInfo(data.dataList || [], taskInfo.name, taskInfo.approvalEventName)
                }
            }
        })
    }

    /**
     * 表格行列宽高
     */
    let tableRowColSize = (item) => {
        // 赋初始值
        let rowNum = item.rowNum || 1;
        let colNum = item.colNum || 1;
        // 表格宽高
        let widths = [],
            heights = [];
        let widthPercent = []; //百分比宽度
        if (item.widthArrPx) {
            widths = JSON.parse(item.widthArrPx) || [];
            heights = JSON.parse(item.heightArr) || [];
        } else if (item.widthArr && item.heightArr) {
            let widthArr = JSON.parse(item.widthArr) || [];
            heights = JSON.parse(item.heightArr) || [];
            let perSum = 0;
            $.each(widthArr, (index, perItem) => {
                let wid = perItem;
                if (!perItem) {
                    perSum += 0;
                } else {
                    perSum += perItem;
                }
                if (index == widthArr.length - 1 && perSum > 100) { //大于100%去除多余
                    let diffPer = perSum - 100;
                    wid = wid - diffPer;
                }
                widthPercent.push(wid || '');
            });
            $.each(widthPercent, (index, colItem) => {
                let pwidth = $('.approvale-ul').width() - 70;
                let wid = parseInt((colItem / 100 * pwidth).toFixed(2));
                widths.push(wid || '');
            });
        } else {
            let widthArr = [];
            let heightArr = [];
            let widExist = false;
            let heiExist = false;
            for (let r = 0; r < rowNum; r++) {
                let heiObj = {
                    sort: r,
                    val: ''
                }
                heightArr.push(heiObj);
            }
            for (let c = 0; c < colNum; c++) {
                let widObj = {
                    sort: c,
                    val: '',
                    percent: ''
                }
                widthArr.push(widObj);
            }
            $.each(item.tableElements || [], (index, tbItem) => {
                let getRow = tbItem.coord.split(',')[0];
                let getCol = tbItem.coord.split(',')[1];
                $.each(widthArr, (index, widItem) => {
                    if (widItem.sort == getCol && tbItem.colChild < 2 && tbItem.wide > 0) {
                        let pwidth = $('.approvale-ul').width() - 70;
                        widItem.val = parseInt((tbItem.wide / 100 * pwidth).toFixed(2))
                        widItem.percent = tbItem.wide;
                    }
                });
                $.each(heightArr, (index, heiItem) => {
                    if (heiItem.sort == getRow && tbItem.rowChild < 2 && tbItem.high > 0) {
                        heiItem.val = tbItem.high;
                    }
                });
            });
            $(widthArr).each(function (w, widItem) {
                widths.push(widItem.val);
                widthPercent.push(widItem.percent);
            });
            $(heightArr).each(function (h, heiItem) {
                heights.push(heiItem.val);
            });
        }

        return {
            widths: widths,
            heights: heights,
            widthPercent: widthPercent,
        }
    }

    /**
     * 检测每一项权限等信息
     */
    let checkFormItem = (uuid, item, index) => {
        let isAuth = true,
            elementid = '',
            isRequired = false,
            selectType = 1,
            isDefault = false,
            textNumber = 10,
            isEdit = true;
        let data = {};
        $.each(approvalFormModels, function (i, itemData) {
            if (itemData.uuId == uuid) {
                data = itemData;
                isRequired = itemData.attribute == 1 ? true : false;
                elementid = itemData.id;
                selectType = itemData.isRadio == 1 ? 1 : 0;
                isDefault = itemData.isDefault == 1 ? true : false;
                textNumber = itemData.textNumber;
                // 是否可编辑
                isEdit = itemData.special == 1 ? false : true;
                if (itemData.edit != 0) {
                    isAuth = false;
                }
            }
        });
        return {
            data: data,
            isAuth: isAuth,
            elementid: elementid,
            isRequired,
            selectType,
            isDefault: isDefault,
            textNumber: textNumber || 10,
            isEdit: isEdit
        };
    }

    /**
     * 检测每一项权限等信息（单项传递法）
     */
    let checkFormItemSingle = (type, itemData) => {
        let isAuth = true,
            elementid = '',
            isRequired = false,
            selectType = 1,
            showName = true;
        isRequired = itemData.attribute == 1 ? true : false;
        elementid = itemData.id;
        selectType = itemData.isRadio == 1 ? 1 : 0;
        showName = itemData.showName == 0 ? false : true;
        let isDefault = itemData.isDefault == 1 ? true : false;
        // 是否可编辑
        let isEdit = itemData.special == 1 ? false : true;
        if (itemData.edit == 0) { //0 不可编辑 1可编辑
            isAuth = false;
        }
        return {
            isAuth: isAuth,
            elementid: elementid,
            isRequired,
            selectType,
            showName: showName,
            isDefault: isDefault,
            textNumber: itemData.textNumber || 10,
            isEdit: isEdit
        };
    }
    /**
     * 创建空白表格
     */
    let createTable = (item) => {
        // 赋初始值
        let rowNum = item.rowNum || 0;
        let colNum = item.colNum || 0;
        rowNumInit = rowNum
        // 合并单元格数组
        tableMergeArr = JSON.parse(item.tableArr) || [];
        // 高度数据
        heightDataArr = JSON.parse(item.heightArr) || [];
        // console.log(tableMergeArr)
        showTable(item);
        let tableRowCol = tableRowColSize(item);
        tableInit(tableMergeArr, tableRowCol.widths, tableRowCol.heights, tableRowCol.widthPercent, rowNum, colNum);
    }
    /**
     * 渲染表格内控件基本代码 （无配置信息）
     * 优化方法1：直接定位后台数据中那条数据，减少遍历次数
     */
    let showTable = (item) => {
        // 赋初始值
        let rowNum = parseInt(item.rowNum) || 0;
        let colNum = parseInt(item.colNum) || 0;
        resetRowArr = JSON.parse(item.duplicate) || []; // 表格重复行全局配置数据
        // 表格内嵌控件数组
        let tableElements = item.tableElements || [];
        let tableElementsSort = tableElements.sort(tdCompare('coord'));
        for (let r = 0; r < rowNum; r++) {
            let rowArr = [];
            for (let c = 0; c < colNum; c++) {
                // 确定对应表单数据的下标
                let getI = r * colNum + c;
                let tbItem = tableElementsSort[getI];
                let tdType = ''; //单元格嵌入控件类型
                let tdVisible = ''; //单元格嵌入控件类型
                if (tbItem.formElementModel) {
                    tdType = tbItem.formElementModel.type; //单元格嵌入控件类型
                    tdVisible = tbItem.formElementModel.visible; //单元格嵌入控件是否可见
                }
                // let tdHtm = getTableModel(tbItem.formElementModel || {});
                // if (tdType) {
                //     rowArr.push(tdHtm);
                // } else {
                //     rowArr.push('');
                // }
                rowArr.push('');
            }
            tableData.push(rowArr);
        }
        // formTableHot.loadData(tableData);
        let rowResetBtn = '';
        for (let r = 0; r < rowNum; r++) {
            let rowResetHtm = `<span class="tableRowResetBtn"><span class="tableRowResetTxt"></span></span>`
            let isDel = false;
            let isReset = false;
            let show = 'noshow';
            $(resetRowArr).each(function (retI, retItem) {
                if (retItem.startRow == r) {
                    isReset = true;
                    if (retItem.type == 'del') {
                        isDel = true;
                    }
                }
            });
            if (isReset) {
                if (isDel) {
                    rowResetHtm = `<span class="tableRowResetBtn"><span class="tableRowResetTxt" onclick="GoalgoExecute.delTableRow(${r},${colNum},this)">删除</span></span>`
                } else {
                    rowResetHtm = `<span class="tableRowResetBtn"><span class="tableRowResetTxt" onclick="GoalgoExecute.addTableRow(${r},${colNum},this)">添加</span></span>`
                }
            } else {
                rowResetHtm = `<span class="tableRowResetBtn"></span>`
            }

            rowResetBtn += rowResetHtm;
            $('.tableRowResetBox').html(rowResetBtn);
        }
        // resetRowBtn(rowNum)
    }

    /**
     * 表单控件处理
     */
    let formElementHandle = () => {
        // 清空公式信息
        formulaInfo = [];
        let isTable = false;
        // $('.datetimepicker').hide();
        $('.data-time-picker').datetimepicker('remove')
        $('.approvale-ul').html('');
        $('.approvale-ul').append('<div class="tablePlugTmpBox" hidden></div>');
        tableData = [];
        if (formTableHot) {
            formTableHot.clear();
            formTableHot.destroy();
            formTableHot = null;
        }
        // 剔除不符合的数据
        // let newForms=[];
        // $(approvalFormModels).each(function(n,newItem){
        //     if(newItem.type&&newItem.formElementModel){
        //         newForms.push(newItem);
        //     }
        // });
        let newForms = formDataReset(approvalFormModels);
        let sortForms = newForms.sort(compare('position'));

        $.each(sortForms, (index, item) => {
            let type = item.type || '';
            $('.approvale-ul').append(getFormModel(item || {}, type));
            if (type && type != 'table' && type.indexOf('table') == -1) { //非表格控件
                setFormData(item || {}, item.value || '', index, type);
            } else if (type && type == 'table') { //表格控件
                let tbdom = $($('.approvale-ul>.plugElementRow')[index]);
                tbdom.attr('data-elementid', item.id);
                tbdom.attr('data-uuid', item.uuId);
                tbdom.attr('data-pos', item.position || index);
                tablePlugInfo = item;
                isTable = true;
            }
        })
        // App.unblockUI(window);
        if (isTable) {
            createTable(tablePlugInfo);
        }
        // 日历插件点击空白隐藏
        datepickPlugHide()
    }

    let changeInviteStatus = (teamId, projectId, teamType) => {
        let inviteType = electron.remote.getGlobal("execute").inviteType
        let param = {
            projectId: projectId,
            belongType: teamType,
            belongId: teamId,
            userId: electron.remote.getGlobal("sharedObject").userId,
            status: inviteType == 1 ? 3 : 4
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: loginService + '/im-consumer/project/relation/updateIdentityStatus',
            data: param,
            success: (data) => {
                if (data.returnCode == 0) {
                    ipc.send('fresh_chat_list', [projectId])
                    cleanInfo()
                } else {
                    toastr["error"](data.returnMessage, "信息提示")
                }
            },
            error: (res) => {
                toastr["error"]("修改状态失败", "信息提示")
            }
        })
    }

    /**
     * 发送审批
     */
    let sendApproval = (resSend, data) => {
        App.blockUI(window);
        let newApprovalId = electron.remote.getGlobal("execute").newApprovalId
        let editInfo = electron.remote.getGlobal("execute").isEdit || '' //是否为从新发起界面点击
        if (newApprovalId !== '') {
            //发起审批
            let param
            let noticeType
            if (nodeUsers.length === 0) {
                toastr["error"]('请添加审批人', "信息提示")
                App.unblockUI(window);
                sendFailed()
                return false
            }
            if ($('.start-notify').children('div').hasClass('checked')) {
                noticeType = 0
            } else {
                noticeType = 1
            }
            param = {
                'id': newApprovalId,
                "approvalerNum": $('.spinner-input').val(),
                "approvers": nodeUsers,
                "noticeType": noticeType,
                "notices": copyUsers
            }
            $.ajax({
                type: "post",
                url: loginService + "/approval/approval/nextApprovalProcess",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("system", "oa");
                    App.blockUI(window);
                },
                dataType: "json",
                // async: false,
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (data) {
                    App.unblockUI(window);
                    if (data.returnCode === 0) {
                        electron.remote.getGlobal("execute").newApprovalId = ''
                        electron.remote.getGlobal("execute").formsData = ''
                        toastr["success"]('发起审批成功', "信息提示")
                        setTimeout(function () {
                            ipc.send('goalgo_execute_hide')
                        }, 500);
                        let isDetail = electron.remote.getGlobal("task").isDetail || ''
                        let fromMsg = electron.remote.getGlobal("execute").fromMsg || '';
                        let taskId = electron.remote.getGlobal("execute").taskId
                        if (isDetail || fromMsg.indexOf('process') != -1) { //详情或全过程管理
                            ipc.send('ref_process_task_detail')
                        }
                        if (fromMsg.indexOf('desk') != -1) { //工作台
                            if (fromMsg.indexOf('edit#desk') != -1) {
                                ipc.send('ref_edit_task_page', [taskId, fromMsg])
                            } else {
                                ipc.send('ref_task_desk');
                            }
                        }
                        // 任务管理列表
                        if (fromMsg == 'tableTable_send') {
                            taskId = electron.remote.getGlobal("execute").sendap_task_id
                        }
                        if (fromMsg.indexOf('taskTable') != -1 || fromMsg.indexOf('taskTable') != -1) {
                            ipc.send('ref_task_manage', [taskId, fromMsg, type]);
                        }
                        if (editInfo) { //从新发起刷新审批界面
                            ipc.send('ref_anew_Approval');
                        }
                        if (resSend == 1) {
                            reSendApproval()
                        }
                    } else {
                        toastr["error"](data.returnMessage, "信息提示")
                        sendFailed()
                    }
                    electron.remote.getGlobal("execute").fromMsg = '';
                },
                error: function () {
                    App.unblockUI(window);
                    toastr["error"]('发起审批失败，请重试', "信息提示")
                    sendFailed()
                },
                complete: function () {
                    App.unblockUI(window);
                }
            })
        } else {
            let formDatas = checkModelsInfo();
            let bool = formDatas.bool;
            let datas = formDatas.data;
            let newAddData = formDatas.newAddData || [];
            let tableAttachModel = {}
            // 是否添加了重复行
            let isAddRow = false;
            if (formTableHot) {
                let rowNum = formTableHot.countRows();
                if (rowNum != rowNumInit) {
                    isAddRow = true;
                }
                tableAttachModel = {
                    "heightArr": JSON.stringify(heightDataArr),
                    "rowNum": rowNum,
                    "tableArr": JSON.stringify(tableMergeArr),
                    "tableElements": newAddData,
                };
            }
            if (bool) {
                // 新权限申请不要以下
                // if (electron.remote.getGlobal("execute").authId !== '') {
                //     $.each(datas, (index, item) => {
                //         if (item.elementName == '授权时限' && item.elementValue == '永久') {
                //             datas.splice(6, 2)
                //             return false
                //         }
                //     })
                // }
                //发起审批
                let userId = electron.remote.getGlobal("sharedObject").userId
                let account = electron.remote.getGlobal("sharedObject").account
                let eventId = electron.remote.getGlobal("execute").eventId
                let teamId = electron.remote.getGlobal("execute").teamId
                let teamName = electron.remote.getGlobal("execute").teamName
                let teamType = electron.remote.getGlobal("execute").teamType
                let param
                let noticeType
                let taskInfo = electron.remote.getGlobal("execute").taskInfo || ''
                let demotioneingInfo = electron.remote.getGlobal("execute").demotioneingInfo || ''
                let demotioneAttachModel = electron.remote.getGlobal("execute").demotioneAttachModel || ''
                let projectInfo = newprojectInfo || ''
                if (taskInfo) {
                    info = $.parseJSON(taskInfo).info;
                } else if (projectInfo) { //沟通立项审批
                    info = newprojectInfo.info
                    userId = newprojectInfo.managerId
                    account = newprojectInfo.managerAccount
                } else if (demotioneingInfo) { //任务升降级
                    info = data.data.info;
                } else if (postAuthInfo) { //职务授权
                    info = postAuthInfo || ''
                }
                if ($(".approval-header-input").val() == "") {
                    $(".approval-header-input").addClass('approval-header-null')
                    App.unblockUI(window);
                    $(".approval-header-input").show();
                    toastr["error"]('审批表单名称不能为空', "信息提示")
                    return false
                }
                //根据对应的字段查询表单中对应的值，
                let titleStr = ''
                let titleInfo = $(".approval-header-title").text();
                let _prefix = titleInfo.match(/(\S*)【/)[1],
                    _suffix = titleInfo.match(/】(\S*)/)[1]
                if (titleDisposes) {
                    $.each(titleDisposes, function (i, item) {
                        if (item.contentType == 2) {
                            let _el = $(`.plugElementRow[data-uuid="${item.content}"]`)[0];
                            let _elType = $(_el).attr('data-id');
                            if (_elType == 'input' || _elType == 'time' || _elType == 'dateRange') {
                                titleStr += `{${$(_el).find('input').val()}}`
                            } else if (_elType == 'select') {
                                titleStr += `{${$(_el).find('select').val()}}`
                            } else if (_elType == 'radio' || _elType == 'checkbox') {
                                titleStr += `{${$($(_el).find('.checked')).siblings('span').text()}}`
                            } else if (_elType == 'peoSel' || _elType == 'deptSel' || _elType == 'roleSel') {
                                titleStr += `{${$(_el).find('span.members-in').text()}}`
                            }
                        } else {
                            if (item.content.length == 36) { //文字控件
                                titleStr += `{${$($(`.plugElementRow[data-uuid="${item.content}"]`)[0]).find('pre').text()}}`
                            } else {
                                titleStr += `${item.content}`
                            }
                        }
                    })
                }
                $(".approval-header-title").text(`${_prefix}【${titleStr}】${_suffix}`)
                titleInfo = titleInfo.trim();
                titleInfo = titleStr
                titleInfo = titleInfo.replace(/(\{|\})/g, '') //去除花括号;

                if (isBasicForm) {
                    titleInfo = electron.remote.getGlobal("execute").approvalType
                    if (titleInfo == '1') { //职务授权的审批类型特殊为1
                        let postName = electron.remote.getGlobal("company").postAuthTreeNode;
                        titleInfo = `【${postName}】职务授权`
                    } else if (titleInfo == '立项审批') {
                        let str = $('.approval-header-input').val();
                        titleInfo = `项目立项【${str}】`
                    } else if (titleInfo == 0) {
                        titleInfo = `个人权限申请`
                    }
                }
                if (approvalType == 1) {
                    param = {
                        "baseFormDataId": baseFromParam,
                        "title": titleInfo || '',
                        "approvalerNum": 0,
                        "approvers": [],
                        "noticeType": 0,
                        "notices": [],
                        "eventId": eventId,
                        "teamId": teamId,
                        "teamName": teamName,
                        "userId": userId,
                        "username": account,
                        "formContentModels": datas,
                        "infoContent": info,
                        "callBackUrl": callBackUrl,
                        'files': testFiles,
                        'custom': custom,
                        'openTime': openInTime,
                        'approvalSourceModel': {
                            'sourceName': electron.remote.getGlobal("execute").sendap_task_name || '',
                            'sourceType': 1,
                            'sourceId': electron.remote.getGlobal("execute").sendap_task_id || '',
                            'associationType': 1
                        }
                    }
                    if (isAddRow) {
                        param.tableAttachModel = tableAttachModel
                    }
                } else {
                    if (nodeUsers.length === 0) {
                        toastr["error"]('请添加审批人', "信息提示")
                        App.unblockUI(window);
                        sendFailed()
                        return false
                    }
                    if ($('.start-notify').children('div').hasClass('checked')) {
                        noticeType = 0
                    } else {
                        noticeType = 1
                    }
                    param = {
                        "baseFormDataId": baseFromParam,
                        "title": titleInfo || '',
                        "approvalerNum": $('.spinner-input').val(),
                        "approvers": nodeUsers,
                        "noticeType": noticeType,
                        "notices": copyUsers,
                        "eventId": eventId,
                        "teamId": teamId,
                        "teamName": teamName,
                        "userId": userId,
                        "username": account,
                        "formContentModels": datas,
                        "infoContent": info,
                        "callBackUrl": callBackUrl,
                        'files': testFiles,
                        'custom': custom,
                        'openTime': openInTime,
                        'approvalSourceModel': {
                            'sourceName': electron.remote.getGlobal("execute").sendap_task_name || '',
                            'sourceType': 1,
                            'sourceId': electron.remote.getGlobal("execute").sendap_task_id || '',
                            'associationType': 1
                        }
                    }
                    if (isAddRow) {
                        param.tableAttachModel = tableAttachModel
                    }
                }
                // 权限审批
                if (electron.remote.getGlobal("execute").authId !== '') {
                    let approvalTypeName = electron.remote.getGlobal("execute").approvalTypeName;
                    param.permissionModel = {
                        authType: approvalTypeName == 'my_auth' ? 0 : 1, //0 权限申请 1 职务授权
                        "infoId": electron.remote.getGlobal("execute").authId
                    };
                    // 权限模块
                    if ($('#approvaleUl').find('.authChangeRow').is(':visible')) {
                        param.permissionModel.functionTimeModel = Approval.startApprovalTimeModel().functionTimeModel;
                    }
                    // 数据权限
                    if ($('#approvaleUl').find('.rangeChangeRow').is(':visible')) {
                        param.permissionModel.dataTimeModel = Approval.startApprovalTimeModel().dataTimeModel;
                    }
                }
                formsData = datas
                electron.remote.getGlobal("execute").taskName = ''
                // if (nodeUsers.length === 0) {
                //     toastr["error"]('请添加审批人', "信息提示")
                //     App.unblockUI(window);
                //     sendFailed()
                //     return false
                // }
                $.ajax({
                    type: "post",
                    url: loginService + "/approval/approval/addApproval",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("system", "oa");
                        App.blockUI(window);
                    },
                    dataType: "json",
                    // async: false,
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (data) {
                        App.unblockUI(window);
                        if (data.returnCode != 0) {
                            toastr["error"](data.returnMessage, "信息提示")
                            sendFailed()
                            return
                        }
                        toastr["success"]('发起审批成功', "信息提示")

                        if (resSend == 1) {
                            reSendApproval(data.data)
                        }
                        if (editInfo) { //从新发起刷新审批界面
                            ipc.send('ref_anew_Approval');
                        }
                        //沟通邀请成功回调
                        if ((electron.remote.getGlobal("execute").chatInviteInfo || '') != '') {
                            //修改状态
                            let projectId = info.split(":::")[1]
                            let identiId = electron.remote.getGlobal("execute").identiId
                            changeInviteStatus(identiId, projectId, teamType)
                            ipc.send('goalgo_execute_hide')
                            return
                        }
                        if ((electron.remote.getGlobal("execute").projectInfo || '') != '') {
                            // 沟通创建项目信息（立项审批）
                            let _projectInfo = electron.remote.getGlobal("execute").projectInfo || ''
                            $.ajax({
                                type: "post",
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader("system", "oa");
                                },
                                url: loginService + "/im-consumer/project/creatApproval",
                                dataType: "json",
                                data: {
                                    id: $.parseJSON(_projectInfo).id
                                },
                                success: function (data) {
                                    let pId = $.parseJSON(_projectInfo).mucId
                                    ipc.send('project_invite_info', [pId])
                                    electron.remote.getGlobal("execute").projectInfo = ''
                                }
                            })
                        }
                        //会议发起成功回调
                        if ((electron.remote.getGlobal("execute").meetInfo || '') != '') {
                            ipc.send('close_send_meet')
                            cleanInfo()
                            ipc.send('goalgo_execute_hide')
                            return
                        }
                        let type = electron.remote.getGlobal("execute").approvalType + ''
                        // let isHome = electron.remote.getGlobal("execute").isHome
                        let isDetail = electron.remote.getGlobal("task").isDetail || ''
                        let taskId = electron.remote.getGlobal("execute").taskId
                        let fromMsg = electron.remote.getGlobal("execute").fromMsg || '';
                        // 操作类型
                        let optType = ''
                        if (isDetail || fromMsg.indexOf('process') != -1 || fromMsg.indexOf('edit') != -1) {
                            ipc.send('ref_process_task_detail')
                        }
                        if (fromMsg.indexOf('desk') != -1) { //工作台
                            if (fromMsg.indexOf('edit#desk') != -1) {
                                ipc.send('ref_edit_task_page', [taskId, fromMsg])
                            } else {
                                ipc.send('ref_task_desk', [taskId, fromMsg]);
                            }
                        }
                        // 任务管理列表
                        if (fromMsg == 'tableTable_send') {
                            taskId = electron.remote.getGlobal("execute").sendap_task_id
                        }
                        if (fromMsg.indexOf('taskTable') != -1 || fromMsg.indexOf('taskTable') != -1) {
                            ipc.send('ref_task_manage', [taskId, fromMsg, type]);
                        }
                        if (type.indexOf('任务移交') != -1) {
                            ipc.send('close_create_task_modal')
                        }
                        if (type.indexOf('制度') != -1) {
                            ipc.send('ref_team_rule')
                        }
                        if (attmFiles.length != 0) {
                            uploadFilesMult(data.data)
                        }
                        //申请权限
                        // if (electron.remote.getGlobal("execute").authId !== '') {
                        //     updateAuthInfo(data.data)
                        // } else {
                        //     // ipc.send('goalgo_execute_hide')
                        // }
                        cleanInfo()
                        electron.remote.getGlobal("execute").fromMsg = '';
                        electron.remote.getGlobal("execute").demotioneingInfo = ''
                        electron.remote.getGlobal("execute").demotioneAttachModel = ''

                        let datas = data.dataList || []
                        // approvalType 0 自定义 1工作流
                        if (approvalType == 1 && datas.length != 0) {
                            let _index = 0
                            $('#selectInPerson').modal('show')
                            setInPerson(datas[_index])
                            $('#selectInPerson .close,#selectInPerson .cancleBtn').off().on('click', (e) => {
                                e.stopPropagation()
                                // 取消按钮
                                if (datas.length == 1 || _index >= datas.length - 1) {
                                    $('#selectInPerson').modal('hide')
                                    ipc.send('goalgo_createTask_hide')
                                    ipc.send('goalgo_execute_hide')

                                } else {
                                    _index += 1
                                    setInPerson(datas[_index])
                                }
                            })
                            $('#selectInPerson .sureBtn').off().on('click', (e) => {
                                e.stopPropagation()
                                // 指定责任人
                                let _getCkd = $('#selectInPerson .modal-body .list_box ul li').find('.iradio_flat-blue').hasClass('checked');
                                let _taskKey = $('#selectInPerson .modal-body .list_box ul li').find('.iradio_flat-blue.checked input').attr('data-taskKey')
                                let _uid = $('#selectInPerson .modal-body .list_box ul li').find('.iradio_flat-blue.checked input').attr('data-uid')
                                let _uname =  $('#selectInPerson .modal-body .list_box ul li').find('.iradio_flat-blue.checked input').attr('data-uname')
                                defineUserApproval(data.data, _taskKey, _uid,_uname)
                                if (datas.length == 1 || _index >= datas.length - 1) {
                                    $('#selectInPerson').modal('hide')
                                    ipc.send('goalgo_createTask_hide')
                                    ipc.send('goalgo_execute_hide')

                                } else {
                                    _index += 1
                                    setInPerson(datas[_index])
                                }
                            })
                        } else {
                            setTimeout(function () {
                                ipc.send('goalgo_execute_hide')
                                // 沟通创建任务，审批发起后关闭弹窗
                                ipc.send('goalgo_createTask_hide')
                            }, 500);
                        }
                    },
                    error: function () {
                        App.unblockUI(window);
                        toastr["error"]('发起审批失败，请重试', "信息提示")
                        sendFailed()
                    },
                    complete: function () {
                        App.unblockUI(window);
                    }
                })
            }
        }
    }

    let setInPerson = (data) => {
        let _html = ''
        $.each(data.userModels || [], (i, item) => {
            _html += ` <li>
                            <input data-taskKey="${data.taskKey}" value="selectPer" type="radio" class="radio-selPer" name="setPerson" data-uid="${item.id}" data-uname="${item.username}" data-uaccount="${item.account}">
                            <span class="selName">${item.username}</span>
                        </li>`
        })
        $('#selectInPerson .modal-body .list_box ul').html(_html)
        $('[data-toggle="tooltip"]').tooltip();
        $('input[type="radio"]').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });
    }

    /**
     * 指定审批责任人 
     * approvalId	审批id
     * taskKey	节点key
     * userId	被指定人id
     * userName 被指定人用户名
     * operaterId	操作人id
     * operaterName 操作人用户名
     */
    let defineUserApproval = (approvalId, taskKey, uid,uname) => {
        let operaterId = electron.remote.getGlobal('sharedObject').userId
        let operaterName = electron.remote.getGlobal('sharedObject').userName
        let param = {
            approvalId: approvalId,
            taskKey: taskKey,
            userId: uid,
            userName:uname,
            operaterId: operaterId,
            operaterName:operaterName
        }
        $.ajax({
            type: "post",
            url: loginService + "/approval/defineUserApproval",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
                App.blockUI(window)
            },
            success: function (data) {
                if (data.returnCode === 0) {
                    toastr["success"]('添加成功', "信息提示")
                } else {
                    toastr["error"](data.returnMessage, "信息提示")
                }
            },
            complete: function () {
                App.unblockUI(window);
            },
            error: function (data) {
                App.unblockUI(window)
                toastr["error"](data.returnMessage, "信息提示")
            }
        })
    }

    let cleanInfo = () => {
        electron.remote.getGlobal("execute").taskId = ''
        electron.remote.getGlobal("execute").resourceInfo = null
        electron.remote.getGlobal("execute").fileInfo = null
        electron.remote.getGlobal("execute").resourceInfo = null
        electron.remote.getGlobal("execute").authId = ''
        electron.remote.getGlobal("execute").ruleId = ''
        electron.remote.getGlobal("execute").taskInfo = null
        electron.remote.getGlobal("execute").meetInfo = null
        electron.remote.getGlobal("execute").chatInviteInfo = ''
        electron.remote.getGlobal("execute").projectInfo = ''
    }


    /**
     * 任务审批发送失败处理
     * @param {*} taskId  任务ID
     * @param {*} approvalKey  审批类型
     * @param {*} info  附加信息
     */
    let sendFailed = () => {
        let taskId = electron.remote.getGlobal("execute").taskId || ''
        let approvalKey = electron.remote.getGlobal("execute").approvalType || ''
        if (taskId == '') {
            return
        }
        $.ajax({
            type: "post",
            url: loginService + "/task/approval/failed/callBack",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            dataType: "json",
            data: {
                'taskId': taskId,
                'approvalKey': approvalKey,
                'info': info
            }
        })
    }

    /**
     * 保存任务
     * @param {*} taskInfo
     */
    let saveTaskInfo = (taskInfo, type) => {
        let method = 'add'
        if (taskInfo.id != null) {
            method = 'update'
        }
        //先保存任务
        $.ajax({
            type: "post",
            url: loginService + "/task/" + method,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(taskInfo),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
                xhr.setRequestHeader("type", "0");
            },
            success: function (data) {
                if (data.returnCode == 0) {
                    let task = data.data || ''
                    taskInfo.id = task.id
                    newtaskInfo = JSON.stringify(taskInfo)
                    info = taskInfo.info + task.id
                    electron.remote.getGlobal("execute").taskId = task.id
                    electron.remote.getGlobal("execute").newApprovalId = ''
                    if (type) {
                        sendApproval()
                    } else {
                        let isDetail = electron.remote.getGlobal("task").isDetail || ''
                        let taskId = electron.remote.getGlobal("execute").taskId || ''
                        let fromMsg = electron.remote.getGlobal("execute").fromMsg || '';
                        if (isDetail || fromMsg.indexOf('process') != -1) {
                            ipc.send('ref_process_task_detail')
                        }
                        if (fromMsg.indexOf('desk') != -1) { //工作台
                            if (fromMsg.indexOf('edit#desk') != -1) { //编辑处发起审批
                                ipc.send('ref_edit_task_page', [taskId, fromMsg])
                            } else { //
                                ipc.send('ref_task_desk');
                            }
                        }
                        // 任务管理列表
                        if (fromMsg == 'taskTable_send') {
                            taskId = electron.remote.getGlobal("execute").sendap_task_id
                        }
                        if (fromMsg.indexOf('taskTable') != -1 || fromMsg.indexOf('taskTable') != -1) {
                            ipc.send('ref_task_manage', [taskId, fromMsg, type]);
                        }
                    }
                } else {
                    App.unblockUI(window);
                }
                electron.remote.getGlobal("execute").taskInfo = ''
            },
            error: function () {
                App.unblockUI(window);
                toastr["error"]('发起审批失败，请重试', "信息提示")
            }
        })
    }
    /**
     * 执行审批
     */
    let startApproval = () => {
        $('#startApproval').on('click', () => {
            App.blockUI(window);
            //任务数据
            let taskInfo = newtaskInfo || ''
            // 物资信息
            let resourceInfo = newresourceInfo || ''
            // 归档信息
            let fileInfo = electron.remote.getGlobal("execute").fileInfo || ''
            // 制度信息
            let ruleInfo = electron.remote.getGlobal("execute").ruleInfo || ''
            // 任务升降级审批
            let demotioneingInfo = electron.remote.getGlobal("execute").demotioneingInfo || ''
            let demotioneAttachModel = electron.remote.getGlobal("execute").demotioneAttachModel || ''
            // 是否是编辑表单,重新发起
            let editInfo = electron.remote.getGlobal("execute").isEdit || ''
            if (taskInfo != '' && taskInfo != null) { //任务移交和关联资源
                let taskJson = $.parseJSON(taskInfo);
                // saveTaskInfo($.parseJSON(taskInfo), true)
                editTaskDetail(taskJson.id, taskJson);
                sendApproval()

            } else if (resourceInfo != null && resourceInfo != '') {
                /**
                 * 归还请求发送
                 */
                $.ajax({
                    type: 'post',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("system", "oa")
                        xhr.setRequestHeader("type", "0")
                    },
                    url: loginService + '/task/returnTaskResource',
                    dataType: 'json',
                    contentType: "application/json",
                    data: resourceInfo,
                    success: function (data) {
                        if (data.returnCode == 0) {
                            electron.remote.getGlobal("execute").newApprovalId = ''
                            sendApproval()
                        } else {
                            App.unblockUI(window);
                        }
                    },
                    error: function () {
                        App.unblockUI(window);
                        toastr["error"]('发起审批失败，请重试', "信息提示")
                    }

                })
            } else if (fileInfo != null && fileInfo != '') { //归档
                $.ajax({
                    type: 'post',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("system", "oa")
                        xhr.setRequestHeader("type", "0")
                    },
                    url: loginService + '/task/taskOnFile',
                    dataType: 'json',
                    contentType: "application/json",
                    data: fileInfo,
                    success: function (data) {
                        electron.remote.getGlobal("execute").newApprovalId = ''
                        sendApproval()
                        if (data.returnCode == 0) {
                            // electron.remote.getGlobal("execute").newApprovalId = ''
                            // sendApproval()
                        } else {
                            App.unblockUI(window);
                        }
                    },
                    error: function () {
                        App.unblockUI(window);
                        toastr["error"]('发起审批失败，请重试', "信息提示")
                    }

                })
            } else if (ruleInfo != null && ruleInfo != '') {
                let method = 'add'
                if ($.parseJSON(ruleInfo).id != '' && $.parseJSON(ruleInfo).id != null) {
                    method = 'update'
                }
                $.ajax({
                    type: "post",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("system", "oa");
                        xhr.setRequestHeader("teamId", electron.remote.getGlobal('sharedObject').teamId);
                        xhr.setRequestHeader("type", electron.remote.getGlobal('sharedObject').teamType);
                    },
                    url: loginService + "/public/rule/" + method,
                    dataType: "json",
                    contentType: "application/json",
                    data: ruleInfo,
                    success: function (data) {
                        info += data.data.id
                        sendApproval()
                        electron.remote.getGlobal("execute").ruleInfo = ''
                    }
                })
            } else if (demotioneingInfo != null && demotioneingInfo != '') { //任务升降级审批
                // if(demotioneAttachModel.type == 0){
                //     sendApproval('',$.parseJSON(demotioneingInfo).info)
                // }else{
                $.ajax({
                    type: "post",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("system", "oa");
                    },
                    url: loginService + "/task/attach/gradeApprovalTask",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "attachModel": {
                            "star": demotioneAttachModel.star,
                            "type": demotioneAttachModel.type, //升降级类型：0个人 2企业 3部门
                            "typeId": demotioneAttachModel.typeId, //升降级类型id
                        },
                        'id': $.parseJSON(demotioneingInfo).id,
                        'operationType': $.parseJSON(demotioneingInfo).operationType, //操作类型 11升级 12降级
                        'info': $.parseJSON(demotioneingInfo).info, //审批附加信息
                    }),
                    success: function (data) {
                        sendApproval('', data)
                    }
                })
                // }
            } else if (editInfo) {
                sendApproval(1)
            } else {
                sendApproval()
            }
        })
    }

    /**
     * 重新发起审批
     * approvalid：审批id
     * formContentModels：表单信息
     */
    let reSendApproval = (newApprovalId) => {
        App.unblockUI(window);
        let getDatas = getFormContentModels()
        let datas = getDatas.datas
        let bool = getDatas.bool
        let param = {
            'approvalId': reSendApprovalId,
            'newApprovalId': newApprovalId,
            'formContentModels': datas
        }
        if (bool) {
            if (electron.remote.getGlobal("execute").authId !== '') {
                $.each(datas, (index, item) => {
                    if (item.elementName == '授权时限' && item.elementValue == '永久') {
                        datas.splice(6, 2)
                        return false
                    }
                })
            }

            formsData = datas
            $.ajax({
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(param),
                async: false,
                url: loginService + "/approval/approval/reSendApproval",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("system", "oa");
                },
                success: function (data) {
                    App.unblockUI(window);
                    if (data.returnCode === 0) {
                        ipc.send('ref_approvla_prompt')
                        if (getEditKey.length !== 0) {
                            // uploadFiles(data.data)
                        } else {
                            //申请权限
                            if (electron.remote.getGlobal("execute").authId !== '') {
                                updateAuthInfo(data.data)
                            } else {
                                // ipc.send('goalgo_execute_hide')
                            }
                            cleanInfo()
                        }
                        // ipc.send('goalgo_execute_hide')

                        // cleanInfo()

                    } else {
                        toastr["error"](data.returnMessage, "信息提示")
                        sendFailed()
                    }
                },
                error: function () {
                    App.unblockUI(window);
                    toastr["error"]('发起审批失败，请重试', "信息提示")
                    sendFailed()
                }
            })
        }
    }
    // 获取重新编辑的表单信息
    let getFormContentModels = () => {
        let bool = true
        let datas = []
        $('.approvale-ul>li,.approvale-ul>.plugElementRow').each((index, item) => {
            $('.hight').removeClass('hight');
            let type = $(item).attr('data-id');
            let elementName = ''
            let elementMark = ''
            let elementValue = ''
            let valueContent = ''
            let isAuth = $(item).attr('data-isauth');
            let isEdit = $(item).attr('data-isedit');
            let isDef = $(item).attr('data-isdef');
            let position = $(item).attr('data-pos');
            if ($(item).css('display') == 'none') {
                isAuth = 'false';
            }
            if ($(item).attr('data-pos') == 'null') {
                position = index;
            }
            if (type !== 'CuttingLine') {
                elementName = $(item).find('.plugTit').html()
                elementMark = $(item).find('span.hidden-condition').html()
            }
            if (isBasicForm) { //基础表单
                isAuth = 'true';
                isEdit = 'true';
                elementName = $(item).find('.textarea-title.plugLeftTit').html()
            }
            //插件属性
            let plug = {
                type: type,
                elementId: $(item).attr('data-elementid'),
                elementPosition: position,
                elementName: elementName,
                elementMark: elementMark || '',
                elementValue: '',
                valueContent: ''
            };
            //纯文本
            if (type == 'text') {
                plug.elementValue = ''
                plug.type = type
            };
            //下拉框
            if (type == 'select') {
                let index = $('option:selected', item).index()
                // let val = $(item).find('.plugSelect .sel-show-txt').attr('value');
                let elementValue = ''
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (index == 0) {
                        toastr["error"]('请完善下拉框 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                if (index == 0) {
                    elementValue = ''
                    valueContent = ''
                } else {
                    let obj = [{
                        id: $('option:selected', item).attr('data-opnid'),
                        val: $('option:selected', item).text()
                    }]
                    elementValue = JSON.stringify(obj);
                    valueContent = $('option:selected', item).text();
                }
            }
            //时间
            if (type == 'time') {
                let time = $(item).find('label').children('input').val()
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (time.length == 0) {
                        toastr["error"]('请完善时间 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                elementValue = time
                valueContent = time
            }
            //日期区间
            if (type == 'dateRange') {
                let startTime = $(item).find('label').children('.time-range-start').val();
                let endTime = $(item).find('label').children('.time-range-end').val();
                let time = startTime + ',' + endTime;
                if (isAuth == 'true') {
                    let checkDate = false;
                    if (!$(item).find('.required').is(':hidden')) { //必填
                        checkDate = true;
                    } else { //非必填的时候只要填写一个时间也需要验证
                        if (startTime != '' || endTime != '') {
                            checkDate = true;
                        }
                    }
                    if (checkDate) {
                        if (startTime == '') {
                            toastr["error"]('请选择开始时间 ', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        } else if (endTime == '') {
                            toastr["error"]('请选择结束时间 ', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        } else if (endTime < startTime) {
                            toastr["error"]('结束时间必须大于开始时间', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        }
                    }
                }
                elementValue = time
                valueContent = time
            }
            //单行输入框
            if (type == 'input') {
                let input = $(item).find('input').val()
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (input.length == 0) {
                        toastr["error"]('请完善单行输入', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                elementValue = input
                valueContent = input
            }
            //多行输入框
            if (type == 'textarea') {
                let textarea = $(item).find('textarea').val()
                let pre = $(item).find('.textarea-pre').html()
                if (isAuth == 'true' && isEdit == 'true' && !$(item).find('.required').is(':hidden')) {
                    if ($(item).attr('data-readonly') == 'false') {
                        if (textarea.length == 0) {
                            toastr["error"]('请完善多行输入', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            // sendFailed()
                            return false
                        }
                    }
                }
                if ($(item).attr('data-readonly') == 'true') {
                    elementValue = pre
                    valueContent = pre
                } else {
                    elementValue = textarea
                    valueContent = textarea
                }
            }
            //附件
            if (type == 'attachment') {
                // let fileList = $(item).find(".approval_file") || []
                let fileSize = 0
                let elementValArr = []
                let fileList = $(item).find('.file_parent') || []
                $.each(fileList, (i, fileDom) => {
                    if ($(fileDom).css('display') == 'none' || !$(fileDom).attr('data-filekey')) {
                        return;
                    }
                    let name = $(fileDom).attr('data-filename');
                    let fileKey = $(fileDom).attr('data-filekey');
                    let thisSize = parseInt($(fileDom).attr('data-filesize'));
                    let obj = {
                        "fileName": name,
                        "fileKey": fileKey,
                        "fileSize": thisSize,
                        "dir": 'approval'
                    }
                    elementValArr.push(obj)
                    valueContent += `${fileKey},`
                })
                App.unblockUI(window);
                let fileTemplate = $(item).attr('data-fileTemplate')
                if (fileTemplate != 1) { //附件模板不做必填提示
                    if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                        if (fileList.length == 0) {
                            toastr["error"]('请上传附件', "信息提示")
                            bool = false
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        }
                    }
                }

                if (fileList.length > 0) {
                    elementValue = JSON.stringify(elementValArr);
                }
            }
            //分割线
            if (type == 'CuttingLine') {
                plug.type = type
            }
            //单选框
            if (type == 'radio') {
                if (!isBasicForm) {
                    $(item).find('.radioBox').children('label').each((index, label) => {
                        if ($(label).children('div').hasClass('checked')) {
                            let obj = [{
                                id: $(label).children('div').find('input').attr('data-opnid'),
                                val: $(label).children('div').next().html()
                            }]
                            elementValue = JSON.stringify(obj);
                            valueContent = $(label).children('div').next().html()
                            App.unblockUI(window);
                            return false
                        }
                    })
                } else {
                    $(item).children('label').each((index, label) => {
                        if ($(item).css('display') != 'none' && $(label).children('div').hasClass('checked')) {
                            elementValue = $(label).children('div').next().html();
                            valueContent = $(label).children('div').next().html()
                            App.unblockUI(window);
                            return false
                        }
                    })
                }

                plug.type = type
            }
            //多选框
            if (type == 'checkbox') {
                let elementValueArr = [];
                let _len = $(item).find('.checkboxBox label div.checked').length
                let ckd = $(item).find('.checkboxBox label div.checked')
                $.each(ckd, (i, label) => {
                    let obj = {
                        id: $(label).find('input').attr('data-opnid'),
                        val: $.trim($(label).next().html())
                    }
                    elementValueArr.push(obj);
                    valueContent += `${$.trim($(label).next().html())}`
                    if (i < _len - 1 && _len > 1) {
                        valueContent += ','
                    }
                })
                // $(item).find('.checkboxBox').children('label').each((i, label) => {
                //     if ($(label).children('div').hasClass('checked')) {
                //         let obj = {
                //             id: $(label).children('div').find('input').attr('data-opnid'),
                //             val: $(label).children('div').next().html()
                //         }
                //         elementValueArr.push(obj);
                //         valueContent += `${$(label).children('div').next().html()}`
                //         if (i < $(item).find('.checkboxBox').children('label').length - 1) {
                //             valueContent += ','
                //         }
                //     }
                // })
                elementValue = JSON.stringify(elementValueArr);
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (elementValueArr.length == 0) {
                        toastr["error"]('请完善多选框 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
            }
            //人员选择
            if (type == 'peoSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善人员选择', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let obj = {
                        userId: $(dom).attr('data-id'),
                        userName: $(dom).attr('data-name'),
                        account: $(dom).attr('data-account'),
                    };
                    list.push(obj);
                    valueContent += `${$(dom).attr('data-name')}`
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }
            //部门选择
            if (type == 'deptSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && isDef == 'false' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善部门', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                if (isDef == 'true') {
                    if (domlist.html() == '') {
                        toastr["error"]('成员无主岗，无法发起审批', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let obj = {
                        deptId: $(dom).attr('data-id'),
                        deptName: $(dom).attr('data-name'),
                    };
                    list.push(obj);
                    valueContent += `${$(dom).attr('data-name')}`
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }
            //岗位选择
            if (type == 'roleSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && isDef == 'false' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善岗位', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                if (isDef == 'true') {
                    if (domlist.html() == '') {
                        toastr["error"]('成员无主岗，无法发起审批', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let role = ($(dom).text() + '').split('-')
                    let obj = {
                        deptId: $(dom).attr('data-deptid'),
                        deptName: $(dom).attr('data-deptname'),
                        roleId: $(dom).attr('data-id'),
                        roleName: $(dom).attr('data-rolename'),
                        // roleName: `${role.length > 1 ? role[1] : role[0]}`,
                    };
                    list.push(obj);
                    // valueContent += `${role.length > 1 ? role[1] : role[0]}`
                    valueContent += $(dom).attr('data-rolename')
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }
            plug.elementValue = elementValue
            plug.valueContent = valueContent
            if (type != 'table') {
                datas.push(plug)
            } else if (type == 'table') {
                plug.type = type
                datas.push(plug)
                let tabInfo = checkTableData($(item));
                if (tabInfo.bool) {
                    $(tabInfo.tableData).each(function (i, tbItem) {
                        datas.push(tbItem)
                    });
                } else {
                    bool = false
                    return;
                }
            }
        })
        return {
            datas,
            bool
        }
    }


    /**
     * 更新授权信息
     */
    let updateAuthInfo = (approvalId) => {
        let authorityId = electron.remote.getGlobal("execute").authId
        let approvalType = electron.remote.getGlobal("execute").approvalType
        let param = {
            approvalId: approvalId,
            authorityId: authorityId,
            type: approvalType,
            models: formsData
        }
        $.ajax({
            type: "post",
            url: loginService + "/team/permission/update",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            success: function (data) {
                if (data.returnCode === 0) {
                    App.unblockUI(window);
                    if (electron.remote.getGlobal("execute").approvalType == 0) {
                        ipc.send('goalgo_myauth_update')
                    } else if (electron.remote.getGlobal("execute").approvalType == 1) {
                        ipc.send('goalgo_role_auth_update')
                    } else if (electron.remote.getGlobal("execute").approvalType == 2) {
                        ipc.send('goalgo_company_auth_update')
                    }
                    electron.remote.getGlobal("execute").authId = ''
                    electron.remote.getGlobal("execute").approvalType = ''
                    // ipc.send('goalgo_execute_hide')
                } else {
                    App.unblockUI(window);
                    toastr["error"](data.returnMessage, "信息提示")
                }
            },
            error: function () {
                App.unblockUI(window);
                toastr["error"]('更新授权信息失败，请重试', "信息提示")
            }
        })
    }

    /**
     * 上传附件文件集
     */
    let uploadFiles = (approvalId) => {
        var formData = new FormData();
        let files = $('.form-file') || []
        $.each(files, (index, file) => {
            formData.append("file", $(file)[0].files[0]);
            formData.append("fileName", filesKey[index]);
            formData.append("dir", 'approval');
        })
        $.ajax({
            type: "post",
            url: fileService + "/oss/uploadFiles",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            data: formData,
            success: function (data) {
                if (data.returnCode === 0) {
                    filesKey = []
                    if (electron.remote.getGlobal("execute").authId !== '') {
                        updateAuthInfo(approvalId)
                    } else {
                        // ipc.send('goalgo_execute_hide')
                    }
                } else {
                    toastr["error"](data.returnMessage, "信息提示")
                }
            },
            error: function () {
                toastr["error"]('上传附件文件失败，请重试', "信息提示")
            }
        })
    }

    /**
     * 上传多个附件文件集
     */
    let uploadFilesMult = (approvalId) => {
        let defer = '';
        let formData = new FormData();
        let flag = false;
        let fileSize = 0
        // 方法2
        if (attmFiles.length == 0) { //没上传附件时直接返回
            flag = false;
        } else {
            flag = true
            $.each(attmFiles || [], (index, file) => {
                let fid = file.fileKey.split('.')[0]
                fileSize += file.fileSize
                formData.append("file", file.file);
                formData.append("fileName", fid);
                formData.append("dir", 'approval');
            })
        }
        if (fileSize > 1024 * 1024 * 100) {
            toastr["error"]('文件大小不能大于100M', "信息提示")
            flag = false
        }
        if (!flag) {
            // ipc.send('goalgo_execute_hide');
            return;
        }
        if (flag) {
            // defer = $.Deferred();
            $.ajax({
                type: "post",
                url: fileService + "/oss/uploadFiles",
                dataType: "json",
                // async: true,
                cache: false,
                processData: false,
                contentType: false,
                data: formData,
                beforeSend: function (xhr) {
                    App.blockUI(window)
                },
                success: function (data) {
                    // if (data.returnCode === 0) {
                    //     updateStatus = true
                    // } else {
                    //     updateStatus = false
                    //     toastr["error"](data.returnMessage, "信息提示")
                    // }
                    filesKey = []
                    if (electron.remote.getGlobal("execute").authId !== '') {
                        updateAuthInfo(approvalId)
                    } else {
                        // ipc.send('goalgo_execute_hide')
                    }
                },
                complete: function (xhr) {
                    App.unblockUI(window)
                    // $.Deferred()变成已执行完状态resolve后才继续do后面的操作
                    // defer.resolve(xhr);
                },
                error: function () {
                    // updateStatus = false
                    toastr["error"]('上传附件文件失败，请重试', "信息提示")
                },
            })
        }
        return defer;
    }

    //自定义审批
    let addNodeBtn = (showClass, nodeClass, method) => {
        $('.' + showClass).html('<div class="provide-node ' + nodeClass + '">' +
            '<button class="provide-person-btn active" onclick="GoalgoExecute.' + method + '(this)"></button>' + '<input type="hidden" id="addMemberList"><input type="hidden" id="hadMemberList"></div>')
    }

    /**
     * 审批模板控件
     * @param {*} modeltype 控件类型
     */
    let getFormModel = (data, modeltype, color, flag, uuid) => {
        let type = data.type;
        let htm = '';
        switch (type) {
            case 'text':
                htm = `<li class="param-ul-li-text plugElementRow" data-id="text" data-align="left">
                    <div class="textPlugRowCont"><pre class="plugTit textPlugTit">请输入文字</pre></div></li>`
                break;
            case 'select':
                htm = `<li class="plugElementRow plugSelectRow" data-id="select"  data-required="required" data-width="50%">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">下拉菜单</pre></div>
                    <div class="plugRowCont">
                    <select disabled class="select"><option selected class="placeholder">请选择</option><option data-index="1">选项1</option></select>
                    <!--<div class="mySelPlug plugSelect">
                        <span class="role-span"><span class="sel-show-txt" value="def">请选择下拉框</span><i class="sel-tri-icon"></i></span>
                        <div class="select-list hide">
                            <ul class="opt-ul">
                                <li value="def">请选择下拉框</li>
                            </ul>
                        </div>-->
                    </div>
                    <span type="text" class="hidden-condition" hidden></span></div>
                    <div class="clearfix"></div>
                    </li>`
                break;
            case 'time':
                htm = `<li class="plugElementRow" data-id="time" data-time="yyyy/mm/dd"  data-required="required" data-width="50%">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">时间</pre></div>
                <div class="plugRowCont"><label class="input-group date form_datetime data-time-picker" ><input tabindex='-1' disabled placeholder="点击选择时间" size="16" readonly="" class="form-control time-input" type="text">
                <span class="input-group-btn" style="width: 47px;"><button tabindex='-1' style="" class="btn default date-set" type="button"><i class="fa fa-calendar bigger-110"></i></button></span></label>
                <span type="text" class="hidden-condition" hidden></span></div></li>`
                break;
            case 'dateRange':
                htm = `<li class="plugElementRow" data-id="dateRange" data-time="yyyy/mm/dd"  data-required="required" data-width="100%" style="width:100%;">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">日期区间</pre></div>
                <div class="plugRowCont"><label class="input-group date form_daterange data-time-picker label_daterange_start" ><input tabindex='-1' disabled placeholder="请选择开始时间" size="16" readonly="" class="form-control time-input time-range-start" type="text">
                <span class="input-group-btn" style="width: 47px;"><button tabindex='-1' class="btn default date-set" type="button"><i class="fa fa-calendar bigger-110"></i></button></span></label>
                至 <label class="input-group date form_daterange data-time-picker label_daterange_end" ><input tabindex='-1' disabled placeholder="请选择结束时间" size="16" readonly="" class="form-control time-input time-range-end" type="text">
                <span class="input-group-btn" style="width: 47px;"><button tabindex='-1' class="btn default date-set" type="button"><i class="fa fa-calendar bigger-110"></i></button></span></label>
                <div class="time_range_amount">合计 <div class="time_range_day_box"><input tabindex='-1' disabled placeholder="" class="time_range_day" type="text" disabled> <span>天</span></div>
                <div class="time_range_hour_box"><input tabindex='-1' disabled placeholder="" class="time_range_hour" type="text"  disabled> <span>小时</span></div></div>
                <span type="text" class="hidden-condition" hidden></span></div></li>`
                break;
            case 'input':
                htm = `<li class="plugElementRow" data-id="input"  data-required="required">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">单行输入</pre></div>
                    <div class="plugRowCont"><input disabled maxlength="50" placeholder="请输入信息" type="text" class="input-plug"/><span type="text" class="hidden-condition" hidden></span></div>
                    </li>`
                break;
            case 'CuttingLine':
                htm = `<li class="plugElementRow param-ul-li-CuttingLine" data-id="CuttingLine"><div class="cutting-line"><div class="cutting-line-content"></div></div></li>`
                break;
            case 'attachment':
                htm = `<li data-id="attachment" style="padding-left:13px;" data-required="required" class="plugElementRow accessory">
                    <div class="plugRowLeft filePlugLeft"><span class="required">* </span><pre class="plugTit">附件</pre></div>
                    <div class="plugRowCont filePlugRowCont">
                        <img class="attachment-img" src="../../common/image/team/form/attachment.png">
                        <ul class="file-name"></ul><input style="display:none" name="file" class="form-file" type="file" data-min-file-count="1">
                    </div>
                    <span type="text" class="hidden-condition" hidden></span>
                    </li>`
                break;
            case 'textarea':
                htm = `<li class="plugElementRow textarea-li" style="line-height: 75px;" data-id="textarea"  data-required="required" data-readonly="false">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="textarea-title plugTit">多行输入</pre></div>
                    <div class="plugRowCont textareaPlugRowCont">
                    <textarea disabled data-height="56" oninput="FormTextArea.MaxMe(this)" style="overflow: auto;" maxlength="300" placeholder="请输入申请原因" type="text" class="textarea-plug"></textarea>
                    <span type="text" class="hidden-condition" hidden></span></div></li>`
                break;
            case 'radio':
                htm = `<li data-id="radio" data-required="required" class="plugElementRow radio-checkbox-padding noFlexPlugRow">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">单选</pre></div>
                    <div class="plugRowCont radioBox"></div><span type="text" class="hidden-condition" hidden></span>
                    </li>`
                break;
            case 'checkbox':
                htm = `<li data-id="checkbox" data-required="required" class="plugElementRow radio-checkbox-padding noFlexPlugRow">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">多选</pre></div>
                    <div class="plugRowCont checkboxBox"></div><span type="text" class="hidden-condition" hidden></span></li>`
                break;
            case 'peoSel':
                htm = `<li data-id="peoSel" data-width="100%" data-required="required" class="plugElementRow noFlexPlugRow peoSelPlugRow" style="padding-left:13px;width: 100%;">
                        <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">人员选择 </pre></div>
                        <div class="plugRowCont">
                            <span class="peoSelBtnBox addSelBtn"><input type="hidden" id="addMemberList"><input type="hidden" id="hadMemberList"></span>
                            <div class="peoSelList modelSelList"></div>
                        </div>
                        <span type="text" class="hidden-condition" hidden></span>
                        </li>`
                break;
            case 'deptSel':
                htm = `<li data-id="deptSel" data-width="50%" data-required="required" class="plugElementRow noFlexPlugRow peoSelPlugRow" style="padding-left:13px;width: 100%;">
                        <div class="plugRowLeft">
                        <span class="required">* </span><pre class="plugTit">部门选择 </pre></div>
                        <div class="plugRowCont ">
                            <span class="deptSelBtnBox addSelBtn"><input type="hidden" id="addMemberList"><input type="hidden" id="hadMemberList"></span>
                            <div class="deptSelList modelSelList"></div>
                        </div>
                        <span type="text" class="hidden-condition" hidden></span>
                        </li>`
                break;
            case 'roleSel':
                htm = `<li data-id="roleSel" data-width="100%" data-required="required" class="plugElementRow noFlexPlugRow peoSelPlugRow" style="padding-left:13px;width: 100%;">
                        <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">岗位选择 </pre></div>
                        <div class="plugRowCont ">
                            <span class="roleSelBtnBox addSelBtn"><input type="hidden" id="addMemberList"><input type="hidden" id="hadMemberList"></span>
                            <div class="roleSelList modelSelList"></div>
                        </div>
                        <span type="text" class="hidden-condition" hidden></span>
                        </li>`
                break;
            case 'table':
                htm = `<div data-id="table" class="tablePlugElementRow plugElementRow" data-uuid="${data.uuId}" data-bg="${color}">
                    <div class="formPlugTableBox">
                        <div class="tableRowResetBox"></div>
                        <div class="formScrollContainer"><div id="formPlugTable" class="formPlugTable" data-stopScroll="true"></div></div>
                    </div>
                    </div>`
                break;
            case 'numval':
                htm = `<li class="select-plug plugElementRow" data-id="numval">
                <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">数值</pre></div>
                    <div class="plugRowCont"><input title=" " disabled maxlength="50" placeholder="" type="text" class="input-plug numval_plug"/>
                    <span class="numval_unit_show"></span>
                </div>
                <span type="text" class="hidden-condition" hidden></span>
                </li>`
                break;
            case 'formula':
                htm = `<li class="select-plug plugElementRow" data-id="formula">
                <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">数值</pre></div>
                    <div class="plugRowCont"><input disabled maxlength="50" placeholder="" type="text" class="input-plug formula_plug"/>
                    <span class="numval_unit_show"></span>
                </div>
                <span type="text" class="hidden-condition" hidden></span>
                </li>`
                break;
            case 'formNumber':
                htm = `<li class="select-plug plugElementRow" data-id="formNumber"  data-required="required" data-width="100%">
                <div class="plugRowLeft"><pre class="plugTit">流水号</pre></div>
                <div class="plugRowCont inputPlugRowCont"><input disabled maxlength="50" placeholder="" type="text" class="input-plug"/><span type="text" class="hidden-condition" hidden></span></div>
                <div class="delete-plug"></div></li>`
                break;
            default:
                htm = '';
        }
        return htm;
    }

    /**
     * 审批模板表格内嵌控件
     * @param {*} modeltype 控件类型
     */
    let getTableModel = (data, modeltype) => {
        let type = data.type;
        let dataUuid = data.uuid;
        // if(data.visible==0){
        //     type=''
        // }
        let htm = '';
        switch (type) {
            case 'text':
                htm = `<li class="param-ul-li-text plugElementRow" data-id="text" data-align="left">
                    <div class="textPlugRowCont"><pre class="plugTit textPlugTit">请输入文字</pre></div></li>`
                break;
            case 'select':
                htm = `<li class="plugElementRow plugSelectRow" data-id="select"  data-required="required" data-width="50%">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">下拉菜单</pre></div>
                    <div class="plugRowCont">
                    <select disabled class="select"><option selected class="placeholder">请选择</option><option data-index="1">选项1</option></select>
                    <!--<div class="mySelPlug plugSelect">
                        <span class="role-span"><span class="sel-show-txt" value="def">请选择下拉框</span><i class="sel-tri-icon"></i></span>
                        <div class="select-list hide">
                            <ul class="opt-ul">
                                <li value="def">请选择下拉框</li>
                            </ul>
                        </div>-->
                    </div>
                    <span type="text" class="hidden-condition" hidden></span></div>
                    <div class="clearfix"></div>
                    </li>`
                break;
            case 'time':
                htm = `<li class="plugElementRow" data-id="time" data-time="yyyy/mm/dd"  data-required="required" data-width="50%">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">时间</pre></div>
                <div class="plugRowCont"><label class="input-group date form_datetime data-time-picker" ><input tabindex='-1' disabled placeholder="点击选择时间" size="16" readonly="" class="form-control time-input" type="text">
                <span class="input-group-btn" style="width: 47px;"><button tabindex='-1' style="" class="btn default date-set" type="button"><i class="fa fa-calendar bigger-110"></i></button></span></label>
                <span type="text" class="hidden-condition" hidden></span></div></li>`
                break;
            case 'dateRange':
                htm = `<li class="plugElementRow" data-id="dateRange" data-time="yyyy/mm/dd"  data-required="required" data-width="100%" style="width:100%;">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">日期区间</pre></div>
                <div class="plugRowCont"><label class="input-group date form_daterange data-time-picker label_daterange_start" ><input tabindex='-1' disabled placeholder="请选择开始时间" size="16" readonly="" class="form-control time-input time-range-start" type="text">
                <span class="input-group-btn" style="width: 47px;"><button tabindex='-1' class="btn default date-set" type="button"><i class="fa fa-calendar bigger-110"></i></button></span></label>
                至 <label class="input-group date form_daterange data-time-picker label_daterange_end" ><input tabindex='-1' disabled placeholder="请选择结束时间" size="16" readonly="" class="form-control time-input time-range-end" type="text">
                <span class="input-group-btn" style="width: 47px;"><button tabindex='-1' class="btn default date-set" type="button"><i class="fa fa-calendar bigger-110"></i></button></span></label>
                <div class="time_range_amount">合计 <div class="time_range_day_box"><input tabindex='-1' disabled placeholder="" class="time_range_day" type="text"  disabled> <span>天</span></div>
                <div class="time_range_hour_box"><input tabindex='-1' disabled placeholder="" class="time_range_hour" type="text"  disabled> <span>小时</span></div></div>
                <span type="text" class="hidden-condition" hidden></span></div></li>`
                break;
            case 'input':
                htm = `<li class="plugElementRow" data-id="input"  data-required="required">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">单行输入</pre></div>
                    <div class="plugRowCont inputPlugRowCont"><input disabled maxlength="50" placeholder="请输入信息" type="text" class="input-plug"/><span type="text" class="hidden-condition" hidden></span></div>
                    </li>`
                break;
            case 'CuttingLine':
                htm = `<li class="plugElementRow param-ul-li-CuttingLine" data-id="CuttingLine"><div class="cutting-line"><div class="cutting-line-content"></div></div></li>`
                break;
            case 'attachment':
                htm = `<li data-id="attachment" style="padding-left:13px;" data-required="required" class="plugElementRow accessory">
                    <div class="plugRowLeft filePlugLeft"><span class="required">* </span><pre class="plugTit">附件</pre><img class="attachment-img" src="../../common/image/team/form/attachment.png"></div>
                    <div class="plugRowCont filePlugRowCont">
                        <ul class="file-name"></ul><input style="display:none" name="file" class="form-file" type="file" data-min-file-count="1">
                    </div>
                    <span type="text" class="hidden-condition" hidden></span>
                    </li>`
                break;
            case 'textarea':
                htm = `<li class="plugElementRow textarea-li" data-id="textarea"  data-required="required" data-readonly="false">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="textarea-title plugTit">多行输入</pre></div>
                    <div class="plugRowCont textareaPlugRowCont">
                    <div class="disableCell">
                        <textarea disabled data-height="56" oninput="FormTextArea.MaxMe(this)" style="overflow: auto;" maxlength="300" placeholder="请输入申请原因" type="text" class="textarea-plug"></textarea>
                    </div>
                    <span type="text" class="hidden-condition" hidden></span></div></li>`
                break;
            case 'radio':
                htm = `<li data-id="radio" data-required="required" class="plugElementRow radio-checkbox-padding noFlexPlugRow">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">单选</pre></div>
                    <div class="plugRowCont radioBox"></div><span type="text" class="hidden-condition" hidden></span>
                    </li>`
                break;
            case 'checkbox':
                htm = `<li data-id="checkbox" data-required="required" class="plugElementRow radio-checkbox-padding noFlexPlugRow">
                    <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">多选</pre></div>
                    <div class="plugRowCont checkboxBox"></div><span type="text" class="hidden-condition" hidden></span></li>`
                break;
            case 'peoSel':
                htm = `<li data-id="peoSel" data-width="100%" data-required="required" class="plugElementRow noFlexPlugRow peoSelPlugRow" style="padding-left:13px;width: 100%;">
                        <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">人员选择 </pre></div>
                        <div class="plugRowCont">
                            <span class="peoSelBtnBox addSelBtn"><input type="hidden" id="addMemberList"><input type="hidden" id="hadMemberList"></span>
                            <div class="peoSelList modelSelList"></div>
                        </div>
                        <span type="text" class="hidden-condition" hidden></span>
                        </li>`
                break;
            case 'deptSel':
                htm = `<li data-id="deptSel" data-width="50%" data-required="required" class="plugElementRow noFlexPlugRow peoSelPlugRow" style="padding-left:13px;width: 100%;">
                        <div class="plugRowLeft">
                        <span class="required">* </span><pre class="plugTit">部门选择 </pre></div>
                        <div class="plugRowCont">
                            <span class="deptSelBtnBox addSelBtn"><input type="hidden" id="addMemberList"><input type="hidden" id="hadMemberList"></span>
                            <div class="deptSelList modelSelList"></div>
                        </div>
                        <span type="text" class="hidden-condition" hidden></span>
                        </li>`
                break;
            case 'roleSel':
                htm = `<li data-id="roleSel" data-width="100%" data-required="required" class="plugElementRow noFlexPlugRow peoSelPlugRow" style="padding-left:13px;width: 100%;">
                        <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">岗位选择 </pre></div>
                        <div class="plugRowCont ">
                            <span class="roleSelBtnBox addSelBtn"><input type="hidden" id="addMemberList"><input type="hidden" id="hadMemberList"></span>
                            <div class="roleSelList modelSelList"></div>
                        </div>
                        <span type="text" class="hidden-condition" hidden></span>
                        </li>`
                break;
            case 'numval':
                htm = `<li class="select-plug plugElementRow" data-id="numval">
                <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">数值</pre></div>
                    <div class="plugRowCont"><input title=" " disabled maxlength="50" placeholder="" type="text" class="input-plug numval_plug"/>
                    <span class="numval_unit_show"></span>
                </div><span type="text" class="hidden-condition" hidden></span>
                </li>`
                break;
            case 'formula':
                htm = `<li class="select-plug plugElementRow" data-id="formula">
                <div class="plugRowLeft"><span class="required">* </span><pre class="plugTit">数值</pre></div>
                    <div class="plugRowCont"><input disabled maxlength="50" placeholder="" type="text" class="input-plug formula_plug"/>
                    <span class="numval_unit_show"></span>
                </div><span type="text" class="hidden-condition" hidden></span></li>`
                break;
            case 'formNumber':
                htm = `<li class="select-plug plugElementRow" data-id="formNumber"  data-required="required" data-width="100%">
                <div class="plugRowLeft"><pre class="plugTit">流水号</pre></div>
                <div class="plugRowCont inputPlugRowCont"><input disabled maxlength="50" placeholder="" type="text" class="input-plug"/><span type="text" class="hidden-condition" hidden></span></div>
                <div class="delete-plug"></div></li>`
                break;
            default:
                htm = '';
        }
        return htm;
    }

    /**
     * 计算合计时间
     */
    let setTotalTime = (startTime, endTime, dateType) => {
        let day = 0,
            hour = 0;
        if (!endTime) {
            endTime = startTime
        }
        let difftime = MyCommon.diffTime(startTime, endTime);
        if (dateType == 1) { //显示小时
            day = difftime.day;
            hour = difftime.hour;
        } else {
            if (startTime == endTime) {
                day = 1;
            } else {
                day = difftime.day + 1;
            }
        }
        return {
            day: day,
            hour: hour
        };
    }
    /**
     * 表格内控件输入值缓存
     */
    let changeTableData = (pUuid, elementid, thisVal, formData, flag) => {
        let forms = electron.remote.getGlobal("execute").formsData; //发起下一轮进入
        let formsData = []
        if (forms == '' || $.isEmptyObject(forms)) { //正常发起审批按钮进入
            formsData = approvalFormModels;
        } else {
            formsData = forms;
        }
        if (formsData) {
            $.each(formsData, (index, item) => {
                if (item.uuId == pUuid) {
                    $.each(item.tableElements, (index, tbItem) => {
                        if (tbItem.formElementModel) {
                            if (flag) {
                                if (tbItem.formElementModel.uuId == elementid) { //确定坐标
                                    tbItem.formElementModel.value = thisVal;
                                }
                            } else {
                                if (tbItem.formElementModel.id == elementid) { //确定坐标
                                    tbItem.formElementModel.value = thisVal;
                                }
                            }
                        }
                    })
                }
            })
        }
        if (formTableHot) {
            formTableHot.deselectCell();
            tableContHei();
        }
    }

    

    /**
     * 表单模板控件中填充数据
     * data 单项配置数据
     * value 值
     * position 控件第几个位置
     * modeltype 类型 （可不使用）
     * flag 1发起下一轮跳转过来
     */
    let setFormData = (data, val, position, modeltype, flag, rowDom, bg, formData) => {
        let type = data.type || 'no';
        let value = data.value || '';
        let ptype = false;
        let setInfo = checkFormItemSingle(type, data);
        let isAuth = setInfo.isAuth;
        if (flag == 1) { //发起下一轮跳转过来
            isAuth = false;
        }
        let selectType = setInfo.selectType;
        let isDefault = setInfo.isDefault;
        let dom;
        let pUuid; //整行控件的uuid
        let tdCol; //表单列
        let pickerPosition = 'bottom-left';
        if (position != -1) {
            dom = $($('.approvale-ul>.plugElementRow')[position]);
            pUuid = dom.parents('.plugElementRow').attr('data-uuid');
        } else {
            dom = rowDom;
            ptype = 'table';
            pUuid = dom.parents('td').parents('.plugElementRow').attr('data-uuid');
            tdCol = dom.parent('td').attr('data-col');
        }
        if (dom.find('.delete-plug').length > 0) {
            dom.find('.delete-plug').remove();
        }
        // 不可见控件
        if (data.visible != 1) {
            dom.hide();
            // if (type != 'numval' && type != 'formula') {
            //     return;
            // }
        }
        // 给控件绑定id
        dom.attr('data-elementid', setInfo.elementid);
        dom.attr('data-uuid', data.uuId);
        // dom.attr('data-newadd', data.newadd);
        dom.attr('data-isauth', isAuth);
        dom.attr('data-isdef', isDefault);
        if (onlyPage.IsJsonString(data.name) && data.type == 'text') {
            let newName = JSON.parse(data.name)
            let nowHtml = newName[0].txt
            $.each(newName, (i, item) => {
                let reg = new RegExp(item.txt)
                let replaceTxt = nowHtml.match(reg) ? nowHtml.match(reg)[0] : nowHtml
                nowHtml = nowHtml.replace(reg, `<span style="color:${item.color};font-size:${item.size || 12}px;">${replaceTxt}</span>`)
            })
            dom.find('.plugTit').html(nowHtml || '');
        } else {
            dom.find('.plugTit').html(data.name || '');
        }
        dom.find('.hidden-condition').html(data.condition || '');
        dom.attr('data-pos', data.position || 0);
        // 是否必填 (无权限也隐藏必填标识)
        if (type == 'formula') {
            if (!setInfo.isRequired) {
                dom.find('.required').hide();
                if (ptype) { //表格输入框左侧始终预留出*位置
                    dom.find('.plugRowCont').css('padding-left', '10px')
                }
            } else {
                dom.find('.required').show();
                if (ptype) {
                    dom.find('.plugRowCont').css('padding-left', '0')
                }
            }
        } else {
            if (!setInfo.isRequired || !isAuth) {
                dom.find('.required').hide();
                if (ptype) {
                    dom.find('.plugRowCont').css('padding-left', '10px')
                }
            } else {
                dom.find('.required').show();
                if (ptype) {
                    dom.find('.plugRowCont').css('padding-left', '0')
                }
            }
        }
        // 是否显示名字
        if (setInfo.showName) {
            dom.find('pre').show();
        } else {
            dom.find('pre').hide();
        }
        if (ptype) {
            dom.css({
                'padding': '0 5px'
            })
            let leftWid = dom.find('.plugRowLeft').outerWidth() || 0;
            if (type == 'attachment') {
                leftWid = leftWid + 20;
            }
            // 表格内控件排版
            let diffPx = leftWid + 10 + 'px';
            dom.parent('td').css({
                'background-color': bg
            })
            dom.removeClass('noFlexPlugRow');
            dom.find('.plugRowCont').css({
                'width': `calc(100% - ${diffPx})`
            });
        }
        dom.find('.modelSelList').css({
            'width': `calc(100% - 80px)`
        });
        // 查询半行整行
        if (type != 'CuttingLine' && type != 'time' && type != 'dateRange') {
            let wid = "100%";
            if (data.length == 0) {
                $($('[name="plugWidth"]')[0]).iCheck('check');
                wid = "50%";
            } else {
                $($('[name="plugWidth"]')[1]).iCheck('check');
                wid = "100%";
            }
            $(dom).attr('data-width', wid)
            $(dom).css({
                'width': wid
            })
        }
        switch (type) {
            case 'text':
                let fontstyle = data.textProperty;
                let align = data.align || 0;
                // 文本样式
                if (fontstyle) {
                    if (fontstyle && fontstyle.indexOf('0') != -1) {
                        dom.find('pre').css({
                            'font-weight': 'bold'
                        });
                    }
                    if (fontstyle && fontstyle.indexOf('1') != -1) {
                        dom.find('pre').css({
                            'font-style': 'italic'
                        });
                    }
                    if (fontstyle && fontstyle.indexOf('2') != -1) {
                        dom.find('pre').css({
                            'text-decoration': 'underline'
                        });
                    }
                }
                // 文本位置
                if (align == 0) {
                    dom.css({
                        'text-align': 'left'
                    });
                } else if (align == 1) {
                    dom.css({
                        'text-align': 'center'
                    });
                } else if (align == 2) {
                    dom.css({
                        'text-align': 'right'
                    });
                }
                break;
            case 'select':
                let selItem = `<option class="placeholder" style="display:none;">${data.placeholder || ''}</option>`
                $(data.approvalFormElementContentModels).each(function (i, item) {
                    let selected = '';
                    if (value != '' && value != null) {
                        if (value.indexOf('{') != -1) {
                            let options = JSON.parse(value);
                            $(options).each(function (o, option) { //比对是否是选中值
                                if (item.elementId == option.id) {
                                    selected = 'selected'
                                    return;
                                }
                            });
                        } else {
                            if (value == item.content) {
                                selected = 'selected'
                            }
                        }
                    }
                    selItem += `<option data-opnid="${item.elementId}" data-index="${i}" ${selected}>${item.content || ''}</option>`

                })
                dom.find('select').html(selItem);
                dom.find('select .placeholder').attr('placeholder', data.placeholder);
                if (!isAuth) {
                    dom.find('select').attr('disabled', 'true').css({
                        'pointer-events': 'none'
                    });
                } else {
                    dom.find('select').removeAttr('disabled').css({
                        'pointer-events': 'all'
                    });
                }
                // 存取输入的值
                if (ptype && isAuth) {
                    dom.find('select').off().on('change', function (e) {
                        let thisVal = $(this).val();
                        changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                    })
                }
                // 自定义下拉框方法
                // dom.find('.mySelPlug .opt-ul').html(selItem);
                // dom.find('.mySelPlug .role-span .sel-show-txt').text(data.placeholder||'');
                // if (isAuth) {
                //     setPlugSelect(dom.find('.mySelPlug'));
                // }
                break;
            case 'time':
                dom.find('label').children('input').attr('placeholder', data.placeholder || '');

                if (data.selfMade == 1) { //自动获取时间(与权限无关)
                    let time = getNowDate
                    // let getNowDate = formatDateTime(new Date(), data.dateType);
                    if (data.dateType != 1) {
                        time = getNowDate.split(' ')[0]
                    }

                    dom.find('input').val(time).attr('disabled', 'true')

                    dom.find('.input-group-btn').hide()
                    return
                }

                if (!isAuth) {
                    dom.find('label').children('input').attr('disabled', 'true');
                    data.selfMade == 1 ? '' : dom.find('label').children('input').val(value)
                    dom.find('.date-set').addClass('disable');
                    dom.find('label').css({
                        'pointer-events': 'none'
                    })
                    return;
                }
                dom.find('input').removeAttr('disabled');
                dom.find('.date-set').removeClass('disable');
                // 无表格
                if (ptype && dom.parents('.ht_master').length == 0) {
                    return;
                }
                //改变时间类型
                let timePicker;
                if (ptype && tdCol == 0) {
                    pickerPosition = 'bottom-right';
                }
                let selectDom = null
                if (data.dateType == 1) {
                    timePicker = dom.find('label').datetimepicker({
                        pickerPosition: pickerPosition,
                        language: 'cn',
                        format: 'yyyy/mm/dd hh:ii',
                        autoclose: true, //自动关闭
                        minView: 1, //最精准的时间选择为日期0-分 1-时 2-日 3-月
                        weekStart: 1,
                    }).on('show', function () {
                        selectDom = $(this)
                    }).on('hide', function () {
                        selectDom = null
                    })
                } else {
                    timePicker = dom.find('label').datetimepicker({
                        pickerPosition: pickerPosition,
                        language: 'cn',
                        format: 'yyyy/mm/dd',
                        autoclose: true, //自动关闭
                        minView: 2, //最精准的时间选择为日期0-分 1-时 2-日 3-月
                        weekStart: 1,
                    }).on('show', function () {
                        selectDom = $(this)
                    }).on('hide', function () {
                        selectDom = null
                    })
                }

                if (data.selfMade != 1) {
                    dom.find('input').removeAttr('disabled')
                    dom.find('.input-group-btn').show()
                }
                dom.find('label').datetimepicker("update", value);
                // 存取输入的值
                if (ptype && isAuth) {
                    timePicker.on('changeDate', function (e) {
                        let thisVal = $(this).children('input').val();
                        changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                    });
                }
                // 日期控件跟着滚动条走
                $('.provide-body').scroll(function () {
                    if (selectDom != null) {
                        let top = selectDom.offset().top + 40
                        $('.datetimepicker').offset({
                            "top": top
                        })
                    }
                })
                break;
            case 'dateRange':
                if (data.placeholder && data.placeholder.indexOf(',') != -1) {
                    let startDate = data.placeholder.split(',')[0];
                    let endDate = data.placeholder.split(',')[1];
                    dom.find('label').children('.time-range-start').attr('placeholder', startDate || '');
                    dom.find('label').children('.time-range-end').attr('placeholder', startDate || '');
                }
                dom.css({
                    'width': '100%'
                })
                // let dateWid=dom.find('.plugRowCont').width()*0.5-100;
                // if(!ptype){
                //     dom.find('label').children('input').css({'width':dateWid});
                //     $(window).resize(function() {
                //         dom.find('label').children('input').css({'width':dom.find('.plugRowCont').width()*0.5-100 + 'px'})
                //     });
                // }
                let startTime = '';
                let endTime = '';
                if (value) {
                    startTime = value.split(',')[0];
                    endTime = value.split(',')[1];
                }
                // 合计时间
                if (data.totalTime == 1) {
                    dom.find('.time_range_amount').css({
                        'display': 'inline-block'
                    });
                    if (startTime && endTime) {
                        let totalTime = setTotalTime(startTime, endTime, data.dateType);
                        dom.find('.time_range_day').val(totalTime.day);
                        if (data.dateType == 1) {
                            dom.find('.time_range_hour').val(totalTime.hour);
                        }
                    } else {
                        dom.find('.time_range_day').val(0);
                        dom.find('.time_range_hour').val(0);
                    }
                } else {
                    dom.find('.time_range_amount').hide();
                }
                if (data.dateType == 1) {
                    dom.find('.time_range_hour_box').css({
                        'display': 'inline-block'
                    });
                } else {
                    dom.find('.time_range_hour_box').hide();
                }
                //绑定日期区域类型
                if (!isAuth) {
                    dom.find('input').attr('disabled', 'true');
                    dom.find('.label_daterange_start').children('input').val(startTime);
                    dom.find('.label_daterange_end').children('input').val(endTime);
                    dom.find('.date-set').addClass('disable');
                    dom.find('label').css({
                        'pointer-events': 'none'
                    })
                    return;
                }
                dom.find('.form_daterange input').removeAttr('disabled');
                dom.find('.time_range_day').attr('disabled', 'true');
                dom.find('.time_range_hour').attr('disabled', 'true');
                if (ptype && dom.parents('.ht_master').length == 0) {
                    return;
                }
                //改变时间类型
                let dateRangePicker;
                if (ptype && tdCol == 0) {
                    pickerPosition = 'bottom-right';
                }
                let startDom1 = null
                if (data.dateType == 1) {
                    dateRangePicker = dom.find('label').datetimepicker({
                        pickerPosition: pickerPosition,
                        language: 'cn',
                        format: 'yyyy/mm/dd hh:ii',
                        autoclose: true, //自动关闭
                        minView: 1, //最精准的时间选择为日期0-分 1-时 2-日 3-月
                        weekStart: 1
                    }).on('show', function () {
                        startDom1 = $(this)
                    }).on('hide', function () {
                        startDom1 = null
                    })
                } else {
                    dateRangePicker = dom.find('label').datetimepicker({
                        pickerPosition: pickerPosition,
                        language: 'cn',
                        format: 'yyyy/mm/dd',
                        autoclose: true, //自动关闭
                        minView: 2, //最精准的时间选择为日期0-分 1-时 2-日 3-月
                        weekStart: 1
                    }).on('show', function () {
                        startDom1 = $(this)
                    }).on('hide', function () {
                        startDom1 = null
                    })
                }
                dom.find('.label_daterange_start').datetimepicker("update", startTime);
                dom.find('.label_daterange_end').datetimepicker("update", endTime);
                dom.find('.date-set').removeClass('disable');
                // dom.find('.date-set').off('mousedown').on('mousedown', function (e) {
                //     $('.datetimepicker').hide();
                // });
                // dom.find('input').off('mousedown').on('mousedown', function (e) {
                //     $('.datetimepicker').hide();
                // });
                // dom.find('input').off('focus').on('focus', function (e) {
                //     $('.datetimepicker').hide();
                // });
                // dom.find('label').off('mousedown').on('mousedown', function (e) {
                //     $('.datetimepicker').hide();
                // });
                // 存取输入的值
                if (isAuth) {
                    dateRangePicker.on('changeDate', function (e) {
                        let startDate = $(this).parent().find('.label_daterange_start').children('input').val();
                        let endDate = $(this).parent().find('.label_daterange_end').children('input').val();
                        let thisVal = startDate + ',' + endDate;
                        if (startDate != '' && endDate != '') {
                            if (startDate > endDate) {
                                toastr["error"]('结束时间必须大于开始时间', "信息提示")
                                dom.find('.time_range_day').val(0);
                                dom.find('.time_range_hour').val(0);
                                return;
                            } else {
                                if (data.totalTime == 1) {
                                    let totalTime = setTotalTime(startDate, endDate, data.dateType);
                                    dom.find('.time_range_day').val(totalTime.day);
                                    if (data.dateType == 1) {
                                        dom.find('.time_range_hour').val(totalTime.hour);
                                    }
                                }
                            }
                        }
                        if (ptype) {
                            changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                        }
                    });
                }
                // 日期控件跟着滚动条走
                $('.provide-body').scroll(function () {
                    if (startDom1 != null) {
                        let top = startDom1.offset().top + 40
                        $('.datetimepicker').offset({
                            "top": top
                        })
                    }
                })
                break;
            case 'input':
                dom.find('input').attr('maxlength', setInfo.textNumber || 20);
                dom.find('input').val(value);
                dom.find('input').attr('placeholder', data.placeholder || '');
                if (!isAuth) {
                    dom.find('input').attr('disabled', 'true');
                } else {
                    dom.find('input').removeAttr('disabled');
                }
                // 存取输入的值
                if (ptype && isAuth) {
                    dom.find('input').off('keyup').on('keyup', function (e) {
                        e.stopPropagation()
                        let thisVal = $(this).val();
                        changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                    })
                }
                break;
            case 'CuttingLine':
                break;
            case 'attachment':
                dom.find('.attachment-img').attr('id', 'attachmentBtn_' + data.uuId);
                dom.find('.file-name').addClass('fileList' + data.uuId)
                dom.find(".form-file").remove()
                dom.find('.delete-file').remove();
                // dom.find('.file-name').css({'width':`calc(100% - 20px)`});
                dom.attr({
                    'data-fileTemplate': data.fileTemplate
                })
                if (!isAuth || data.fileTemplate == 1) {
                    dom.find('.attachment-img').hide();
                }
                // 如果是附件模板
                if (data.fileTemplate == 1) {
                    $('.fileList' + data.uuId).append(fileListHtml(data.approvalFormElementContentModels))
                } else {
                    fileManger('attachmentBtn_' + data.uuId, 'fileList' + data.uuId, ptype, pUuid, data.uuId, formData);
                }

                $('.attachment-img').on('mouseover', (e) => {
                    $(e.target).attr('src', '../../common/image/team/form/attachment-over.png')
                })
                $('.attachment-img').on('mouseout', (e) => {
                    $(e.target).attr('src', '../../common/image/team/form/attachment.png')
                })
                if (value != '' && value != null && JSON.stringify(value).indexOf('{') != -1) {
                    let fileList = JSON.parse(value);
                    let fileHtms = plugFileListHtml(fileList, data, isAuth);
                    dom.find('.file-name').html(fileHtms)
                    dom.find('.file_parent .del-fileimg-btn').off().on('click', function (event) {
                        event.stopPropagation()
                        let forms = electron.remote.getGlobal("execute").formsData.approvalData || [];
                        if (!forms || forms.length == 0) {
                            forms = approvalFormModels;
                        }
                        let newVal = CommonPlupload.deleteFileMuli(this, event, ptype, pUuid, data.uuId, forms, attmFiles)
                        $(".tooltip").hide();
                        // let thisVal = JSON.stringify(attmFiles);
                        changeTableData(pUuid, data.uuId, newVal, formData, 1);
                    });

                }
                break;
            case 'textarea':
                dom.attr('data-isedit', setInfo.isEdit);
                dom.find('textarea').attr('maxlength', setInfo.textNumber || 20);
                dom.find('textarea').val(value);
                dom.find('textarea').attr('placeholder', data.placeholder || '');
                // 是否有操作权限
                if (!isAuth) {
                    dom.find('textarea').attr('disabled', 'true');
                } else {
                    dom.find('textarea').removeAttr('disabled');
                }
                // 可否编辑
                if (setInfo.isEdit) {
                    dom.find('textarea').show();
                } else {
                    dom.find('textarea').hide();
                }
                // 表格中控件存取输入的值
                if (ptype && isAuth) {
                    dom.find('textarea').off('keyup').on('keyup', function (e) {
                        let thisVal = $(this).val();
                        changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                    })
                }
                break;
            case 'radio':
                let radioItem = '';
                let isExistVal = false;
                $(data.approvalFormElementContentModels).each(function (i, item) {
                    let checked = '';
                    let options = []
                    if (value != '' && value != null) { //下一轮审批带过来的值
                        if (value.indexOf('{') != -1) {
                            options = JSON.parse(value);
                        }
                        $(options).each(function (o, option) { //比对是否是选中值
                            if (item.elementId == option.id) {
                                checked = 'checked'
                                isExistVal = true;
                                return;
                            }
                        });
                    }
                    radioItem += `<label><input data-opnid="${item.elementId}" data-index="${i}" type="radio" class="radio-my radio-time edit-sex-man radio-item" name="plugRadio_${data.uuId}" ${checked}>
                            <span class="radio-span">${item.content}</span></label>`

                })
                dom.find('.radioBox').html(radioItem);
                dom.find('.radioBox').find('input').iCheck({
                    checkboxClass: 'icheckbox_flat-blue',
                    radioClass: 'iradio_flat-blue'
                });
                if (!isExistVal) {
                    // $(dom.find('.radioBox').children('label')[0]).find('.iradio_flat-blue').addClass('checked');
                    $(dom.find('.radioBox').children('label')[0]).find('input').iCheck('check');
                }
                if (!isAuth) {
                    dom.find('.radioBox input').iCheck('disable');
                } else {
                    dom.find('.radioBox input').removeAttr('disabled');
                }
                // 存取输入的值
                if (ptype && isAuth) {
                    setTimeout(function () {
                        let isFirst = true;
                        dom.find('.radioBox').find('input').on('ifClicked', function (event) {
                            let thisObj = [{
                                id: $(this).attr('data-opnid'),
                                val: $(this).parents('div.iradio_flat-blue').next().html()
                            }]
                            let thisVal = JSON.stringify(thisObj);
                            changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                        });
                    }, 100);
                }
                break;
            case 'checkbox':
                let checkboxItem = '';
                $(data.approvalFormElementContentModels).each(function (i, item) {
                    let checked = '';
                    if (value != '' && value != null) { //下一轮审批带值传过来
                        let options = JSON.parse(value);
                        $(options).each(function (o, option) { //比对是否是选中值
                            if (item.elementId == option.id) {
                                checked = 'checked'
                                return;
                            }
                        });
                    }
                    checkboxItem += `<label><input type="checkbox" data-opnid="${item.elementId}" data-index="${i}" class="radio-my radio-time edit-sex-man radio-item" name="plugCheckbox" ${checked}>
                                <span class="radio-span">${item.content}</span></label>`

                })
                dom.find('.checkboxBox').html(checkboxItem);
                dom.find('.checkboxBox').find('input').iCheck({
                    checkboxClass: 'icheckbox_flat-blue',
                    radioClass: 'iradio_flat-blue'
                });
                if (!isAuth) {
                    dom.find('.checkboxBox input').iCheck('disable');
                } else {
                    dom.find('.checkboxBox input').removeAttr('disabled');
                }
                // 存取输入的值
                if (ptype && isAuth) {
                    setTimeout(function () {
                        dom.find('.checkboxBox').find('input').on('ifChanged', function (event) {
                            let checkboxValueArr = [];
                            let that = $(this);
                            if (!$(this).parents('div.icheckbox_flat-blue').hasClass('checked')) {
                                let thisObj = {
                                    id: $(this).attr('data-opnid'),
                                    val: $(this).parents('div.icheckbox_flat-blue').next().html()
                                }
                                checkboxValueArr.push(thisObj);
                            }
                            dom.find('.checkboxBox input').each(function (i, inpDom) {
                                if (that.attr('data-opnid') != $(inpDom).attr('data-opnid') && $(inpDom).parents('div.icheckbox_flat-blue').hasClass('checked')) {
                                    let thisObj = {
                                        id: $(inpDom).attr('data-opnid'),
                                        val: $(inpDom).parents('div.icheckbox_flat-blue').next().html()
                                    }
                                    checkboxValueArr.push(thisObj);
                                }
                            });
                            let thisVal = JSON.stringify(checkboxValueArr);
                            // changeTableData(pUuid, setInfo.elementid, thisVal, formData);
                            changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                        });
                    }, 100);
                }
                break;

            case 'peoSel':
                dom.find('.modelSelList').html('');
                // if (!isAuth || isDefault) {
                if (!isAuth) {
                    dom.find('.addSelBtn').hide();
                } else {
                    dom.find('.addSelBtn').show();
                }
                if (isDefault) { //默认人员
                    let userId = '';
                    let userName = '';
                    if (flag != 1 && isAuth) { //flag!=1：非下一轮跳转来 有编辑权限默认填充
                        userId = electron.remote.getGlobal('sharedObject').userId;
                        userName = electron.remote.getGlobal('sharedObject').userName;
                    } else { //下一轮发起审批
                        userId = nextDefData.userId;
                        userName = nextDefData.userName;
                    }
                    let userNameNew = userName;
                    if (userName != undefined && userName.length > 4) {
                        userNameNew = userName.slice(0, 4);
                    } else if (userName == undefined) {
                        userNameNew = ''
                    }
                    if (isAuth) {
                        let defhtm = `<div class="members-box">
                            <span class="members-in nobg" data-id="${userId}" data-name="${userName}" data-account="" data-toggle="tooltip" title="${userName}">${userNameNew}</span></div>`
                        dom.find('.modelSelList').html(defhtm);
                    }

                    $('[data-toggle="tooltip"]').tooltip();
                } else {
                    if (value != '' && value != null) { //有值
                        let userHtm = '';
                        let userData = [];
                        if (value.indexOf('{') != -1) {
                            userData = JSON.parse(value) || [];
                        }
                        $(userData).each(function (i, item) {
                            let deluser = `<span data-id="${item.userId}" class="delete-item-btn" ></span>`;
                            if (!isAuth) {
                                deluser = ''
                            }
                            let userName = item.userName || '';
                            if (item.userName.length > 4) {
                                userName = item.userName.slice(0, 4);
                            }
                            userHtm += `<div class="members-box">
                                <span class="members-in" data-id="${item.userId}" data-name="${item.userName}" data-toggle="tooltip" title="${item.userName}">${userName}</span>
                                ${deluser}</div>`
                        });
                        dom.find('.modelSelList').html(userHtm);
                    }
                }
                dom.find('.addSelBtn').off().on('click', function () {
                    GoalgoExecute.selectMember($(this), selectType, ptype, pUuid, data.uuId, formData)
                });
                // dom.find('.addSelBtn').attr('onclick', `GoalgoExecute.selectMember(this,${selectType})`);
                dom.find('.delete-item-btn').off().on('click', function () {
                    GoalgoExecute.delMember(this, ptype, pUuid, data.uuId, 0, formData, 1)
                });
                if (ptype) { //表格中设置垂直居中
                    dom.find('.plugRowCont').addClass('flex_align_center');
                }
                break;
            case 'deptSel':
                dom.find('.modelSelList').html('');
                if (!isAuth) {
                    dom.find('.addSelBtn').hide();
                } else {
                    dom.find('.addSelBtn').show();
                }
                if (isDefault) { //默认部门
                    let deptName = '';
                    let deptId = '';
                    if (flag != 1 && isAuth) {
                        deptId = approvalFormDefInfo.departmentId || '';
                        deptName = approvalFormDefInfo.departName || '';
                    } else { //下一轮发起审批
                        deptId = nextDefData.deptId || '';
                        deptName = nextDefData.deptName || '';
                    }

                    let deptNameNew = deptName;
                    if (deptName.length > 8) {
                        deptNameNew = deptName.slice(0, 8);
                    }
                    let defhtm = `<div class="members-box">
                         <span class="members-in nobg" data-id="${deptId}" data-name="${deptName}" data-toggle="tooltip" title="${deptName}">${deptNameNew}</span></div>`
                    if (deptName != '' && deptName != null) { //非无主岗
                        dom.find('.modelSelList').html(defhtm);
                    }
                    $('[data-toggle="tooltip"]').tooltip();
                    // return;
                } else {
                    if (value != '' && value != null) { //有值
                        let deptHtm = '';
                        let deptData = []
                        if (value.indexOf('{') != -1) {
                            deptData = JSON.parse(value) || [];
                        }
                        $(deptData).each(function (i, item) {
                            let delDept = `<span data-id="${item.deptId}" class="delete-item-btn"></span>`;
                            if (!isAuth) {
                                delDept = ''
                            }
                            let deptName = item.deptName || '';
                            if (item.deptName.length > 8) {
                                deptName = item.deptName.slice(0, 8);
                            }
                            deptHtm += `<div class="members-box">
                                <span class="members-in" data-id="${item.deptId}" data-name="${item.deptName}" data-toggle="tooltip" title="${item.deptName}">${deptName}</span>
                                ${delDept}</div>`
                        });
                        dom.find('.modelSelList').html(deptHtm);
                    }
                }
                // dom.find('.addSelBtn').attr('onclick', `GoalgoExecute.selectDept(this,${selectType})`);
                dom.find('.addSelBtn').off().on('click', function () {
                    GoalgoExecute.selectDept($(this), selectType, ptype, pUuid, data.uuId, formData)
                });
                dom.find('.delete-item-btn').off().on('click', function () {
                    GoalgoExecute.delMember(this, ptype, pUuid, data.uuId, 1, formData, 1)
                });
                if (ptype) { //表格中设置垂直居中
                    dom.find('.plugRowCont').addClass('flex_align_center');
                }
                break;
            case 'roleSel':
                dom.find('.modelSelList').html('');
                if (!isAuth) {
                    dom.find('.addSelBtn').hide();
                } else {
                    dom.find('.addSelBtn').show();
                }
                if (isDefault && isAuth) { //默认岗位
                    let roleName = '';
                    let roleId = '';
                    let deptName = '';
                    let contRoleName = '';
                    if (flag != 1) { //正常发起审批中
                        roleId = approvalFormDefInfo.postId || '';
                        roleName = approvalFormDefInfo.postName || '';
                        contRoleName = approvalFormDefInfo.departName + '-' + approvalFormDefInfo.postName;
                        deptName = approvalFormDefInfo.departName || ''
                    } else { //下一轮发起审批
                        roleId = nextDefData.roleId || '';
                        roleName = nextDefData.roleName || '';
                        contRoleName = nextDefData.deptName + '-' + nextDefData.roleName;
                        deptName = nextDefData.deptName || ''
                    }
                    let roleNameShow = contRoleName
                    if (contRoleName.length > 10) {
                        roleNameShow = contRoleName.slice(0, 10);
                    }
                    let defhtm = `<div class="members-box">
                            <span class="members-in nobg" data-id="${roleId}" data-deptname="${deptName}" data-rolename="${roleName}" title="${contRoleName}" data-toggle="tooltip">${roleNameShow}</span></div>`
                    if (roleName != '' && roleName != null) { //无主岗
                        dom.find('.modelSelList').html(defhtm);
                    }
                    $('[data-toggle="tooltip"]').tooltip();
                    // return;
                } else {
                    if (value != '' && value != null) {
                        let roleHtm = '';
                        let roleData = []
                        if (value.indexOf('{') != -1) {
                            roleData = JSON.parse(value);
                        }

                        $(roleData).each(function (i, item) {
                            let delRole = `<span data-id="${item.roleId}" class="delete-item-btn"></span>`;
                            if (!isAuth || isDefault) {
                                delRole = ''
                            }
                            let contRoleName = item.deptName + '-' + item.roleName;
                            let roleNameShow = contRoleName
                            if (contRoleName.length > 10) {
                                roleNameShow = contRoleName.slice(0, 10);
                            }
                            roleHtm += `<div class="members-box">
                                <span class="members-in" data-id="${item.roleId}" data-deptid="${item.deptId}" data-deptname="${item.deptName}" data-rolename="${item.roleName}" data-toggle="tooltip" title="${contRoleName}">${roleNameShow}</span>
                                ${delRole}</div>`
                        });
                        dom.find('.modelSelList').html(roleHtm);
                    }
                }
                dom.find('.addSelBtn').off().on('click', function () {
                    GoalgoExecute.selectRole($(this), selectType, ptype, pUuid, data.uuId, formData)
                });
                dom.find('.delete-item-btn').off().on('click', function () {
                    GoalgoExecute.delMember(this, ptype, pUuid, data.uuId, 2, formData, 1)
                });
                if (ptype) { //表格中设置垂直居中
                    dom.find('.plugRowCont').addClass('flex_align_center');
                }
                break;
            case 'numval':
                let numValFix = data.decimals || 0;
                let numValFixVal = '';
                let numUnit = data.unit || ''
                if (value != '') {
                    // let newNum = MyCommon.thousands(value)
                    numValFixVal = parseFloat(value).toFixed(numValFix);
                }
                dom.find('.numval_plug').val(numValFixVal);
                if (numUnit === '') {
                    dom.find('.numval_unit_show').hide();
                } else {
                    dom.find('.numval_unit_show').show().html(numUnit);
                }
                if (!isAuth) {
                    dom.find('input').attr('disabled', 'true');
                } else {
                    dom.find('input').removeAttr('disabled');
                }
                // 输入框宽度
                let numUnitWid = dom.find('.numval_unit_show').width() + dom.find('.required').width() + 20;
                dom.find('.numval_plug').css({
                    'width': `calc(100% - ${numUnitWid}px)`
                });
                if (isAuth) {
                    let oldVal = ''
                    dom.find('.numval_plug').on('keydown', function (e) {
                        oldVal = $(this).val()
                    })
                    dom.find('.numval_plug').off('input').on('input', function (ele) {
                        MyCommon.clearNoNum($(this), numValFix);
                    })

                    let oldTxt = ''
                    dom.find('.numval_plug').off('keyup').on('keyup', function (e) {
                        e.stopPropagation()
                        let thisVal = $(this).val();
                        if (ptype) {
                            changeTableData(pUuid, data.uuId, thisVal, formData, 1);
                        }
                        if ($(this).val() == '' && oldVal == '') {
                            return;
                        }
                        // 查找所有公式
                        $(formulaInfo).each(function (f, fItem) {
                            // 变量是否是公式引用的
                            let isUser = false;
                            // 公式使用的变量是否有未填写的
                            let isNullVarNum = 0;
                            let formulaVal = 0;
                            let totalSum = 0;
                            let totalArr = [];
                            let productVal = 1
                            $('.tablePlugTmpBox').html(fItem.formulaHtml || '');
                            let sortVariable = []
                            if (fItem.variable) {
                                sortVariable = fItem.variable.sort(compare('sort'));
                            }
                            // 查找公式控件使用的数值控件并求总值
                            $(sortVariable).each(function (v, vItem) {
                                // 确认此数值控件有被公式控件引用
                                // if (vItem.id == dom.attr('data-uuid')) {
                                isUser = true;
                                // }
                                // .approvale-ul>
                                let thisValSour = parseFloat($(`.plugElementRow[data-uuid="${vItem.id}"]`).find('.numval_plug').val()) || parseFloat($(`.plugElementRow[data-uuid="${vItem.id}"]`).find('.formula_plug').attr('data-oldVal'));
                                let thisVal = parseFloat(thisValSour) || 0;
                                totalSum += thisVal;
                                productVal = parseFloat(productVal) * parseFloat(thisVal);
                                totalArr.push(thisVal)
                                if (fItem.formulaMode == 6) { //自定义公式
                                    if (thisVal < 0) { //防止出现负号
                                        thisVal = '(' + thisVal + ')'
                                    }
                                    $($('.tablePlugTmpBox .countValItem')[v]).html(thisVal);
                                }
                                // 有变量未填写
                                if (thisValSour !== 0 && !thisValSour) {
                                    isNullVarNum++;
                                }
                            })
                            // 此数值控件被此公式使用则将值填充到公式控件
                            if (isUser) {
                                // 有一个变量为空则不计算
                                if (isNullVarNum > 0) {
                                    $(`.plugElementRow[data-uuid="${fItem.formlaId}"]>.plugRowCont`).find('.formula_plug').val('')
                                    let ppUuid = $('.tablePlugElementRow').attr('data-uuid');
                                    if (fItem.plugType == 'table') {
                                        changeTableData(ppUuid, fItem.formlaId, '', formData, 1);
                                    }
                                    return;
                                }
                                // 0求和 1平均值 2最大值 3最小值 4乘积 5计数 6自定义
                                if (fItem.formulaMode == 0) {
                                    formulaVal = totalSum;
                                } else if (fItem.formulaMode == 1) {
                                    formulaVal = totalSum / fItem.variable.length;
                                } else if (fItem.formulaMode == 2) {
                                    formulaVal = Math.max.apply(null, totalArr);
                                } else if (fItem.formulaMode == 3) {
                                    formulaVal = Math.min.apply(null, totalArr);
                                } else if (fItem.formulaMode == 4) {
                                    formulaVal = productVal;
                                } else if (fItem.formulaMode == 5) {
                                    if (fItem.countChild) { //有内嵌公式
                                        formulaVal = 1;
                                    } else {
                                        formulaVal = fItem.variable.length;
                                    }
                                } else if (fItem.formulaMode == 6) {

                                    let resultTxt = $('.tablePlugTmpBox').text();

                                    formulaVal = eval(resultTxt)
                                    if (!formulaVal || formulaVal == Infinity) {
                                        formulaVal = 0;
                                    }
                                }
                                let isTrans = $(`.plugElementRow[data-uuid="${fItem.formlaId}"]`).attr('data-numberTransform')

                                GoalgoExecute.interNum(dom.find('.numval_plug'), isTrans)
                                if (isTrans == 1) {
                                    let fix = $(`.plugElementRow[data-uuid="${fItem.formlaId}"]`).attr('data-decimals')
                                    $(`.plugElementRow[data-uuid="${fItem.formlaId}"]>.plugRowCont`).find('.formula_plug').attr('data-oldVal', transRmb.newToFix(formulaVal, fix))
                                    formulaVal = transRmb.init(formulaVal, fix)
                                    oldTxt = formulaVal != undefined ? formulaVal : oldTxt
                                } else {
                                    let resultNum = parseFloat(formulaVal).toFixed(fItem.decimals);
                                    formulaVal = MyCommon.thousands(resultNum)
                                    oldTxt = formulaVal
                                    $(`.plugElementRow[data-uuid="${fItem.formlaId}"]>.plugRowCont`).find('.formula_plug').attr('data-oldVal', formulaVal)
                                }
                                $(`.plugElementRow[data-uuid="${fItem.formlaId}"]>.plugRowCont`).find('.formula_plug').val(oldTxt)
                                if (fItem.plugType == 'table') {
                                    let ppUuid = $('.tablePlugElementRow').attr('data-uuid');
                                    // 修改缓存数组中对应公式的数据
                                    changeTableData(ppUuid, fItem.formlaId, formulaVal, formData, 1);
                                }
                            }
                        });
                    })
                }
                break;
            case 'formula':
                let formulaFix = data.decimals || 0;
                let formulaFixVal = '';
                let formuUnit = data.unit || ''
                if (value) {
                    if (value.indexOf(',') > -1) {
                        // 去除逗号成纯数字才可使用parseFloat
                        value = value.replace(/,/g, '');
                    }
                    // 每三位加逗号
                    if (data.numberTransform != 1) { //是否自动转换（大小写金额）
                        let newNum = parseFloat(value).toFixed(formulaFix);
                        formulaFixVal = MyCommon.thousands(newNum);
                    } else {
                        formulaFixVal = value
                    }
                }
                dom.find('input').val(formulaFixVal);
                dom.attr({
                    'data-numberTransform': data.numberTransform,
                    'data-decimals': data.decimals
                })
                if (formuUnit === '') {
                    dom.find('.numval_unit_show').hide();
                } else {
                    dom.find('.numval_unit_show').show().html(formuUnit);
                }
                dom.find('input').attr('disabled', 'true');
                // 输入框宽度
                let formuUnitWid = dom.find('.numval_unit_show').width() + dom.find('.required').width() + 20;
                dom.find('.numval_plug').css({
                    'width': `calc(100% - ${formuUnitWid}px)`
                });
                let getFormula = [];
                if (data.designFormulas) {
                    getFormula = JSON.parse(data.designFormulas) || [];
                    getFormula.decimals = formulaFix;
                }
                let newFormulaStr = JSON.stringify(formulaInfo);
                if (newFormulaStr.indexOf(getFormula.formlaId) == -1) {
                    formulaInfo.push(getFormula);
                }
                break;
            case 'formNumber':
                dom.find('input').val(data.elementValue || []);

                break;
            default:
        }
        if (!ptype) {
            $('input').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });
        }
    }

    /**
     * 列表显示附件填充
     */
    let fileListHtml = (list) => {
        let fileLi = '<ul class="file_box_list">'
        $.each(list, (i, items) => {
            let item = JSON.parse(items.contentValue)[0]
            let ext = item.fileName.toLowerCase().split('.').splice(-1)[0]
            let fileName = item.fileName.split(".")[0]
            let fileKey = item.fileKey.split(".")[0]
            let dir = 'approval'
            if ($.inArray(ext, constants.image) != -1) {
                let imgUrl = CommonPlupload.getOnlineImg(item.fileKey, dir)
                // <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=approval', '${item.fileName}', ${item.fileSize}, '${ext}', event, 'execute')" class="download_fileimg_icon"></a>

                // <a href="${fileService}/oss/downloadFile?fileKey=${fileKey}&fileName=${fileName}&dir=${dir}" class="download_icon"></a>
                fileLi += `<li class="file_parent" data-filename="${fileName}.${ext}">
                    <img src='${imgUrl}' class="img_file img_around" data-key="${item.fileKey}" data-size="${item.fileSize}" onclick="CommonPlupload.previewImg(this,event, '${item.fileName}', ${item.fileSize},'true','.file_box_list')">
                    <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=approval', '${item.fileName}', ${item.fileSize}, '${ext}', event, 'execute')" class="download_fileimg_icon" class = "download_icon"> </a>
                </li>`
            } else {
                if ($.inArray(ext, constants.isShowIcon) != -1) {
                    ext = CommonPlupload.changeExt(ext)
                    fileLi += `<li title="${fileName}" data-toggle="tooltip" class="file_parent" data-filename="${fileName}.${ext}" onclick="filePreviewCommon.showFile('${item.dir}', ${item.fileSize}, '${item.fileName}', '${item.fileKey}', '${item.uploadDate}', '${item.uploadUser}', event)">
                        <img src="../../common/image/task/total-process-manage/${ext}.png">
                        <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=approval', '${item.fileName}', ${item.fileSize}, '${ext}', event, 'execute')" class="download_fileimg_icon" class = "download_icon"> </a>
                    </li>`
                } else {
                    fileLi += `<li title="${fileName}" data-toggle="tooltip" class="file_parent" data-filename="${fileName}.${ext}" onclick="filePreviewCommon.showFile('${item.dir}', ${item.fileSize}, '${item.fileName}', '${item.fileKey}', '${item.uploadDate}', '${item.uploadUser}', event)">
                        <img src="../../common/image/task/total-process-manage/normal.png">
                        <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=approval', '${item.fileName}', ${item.fileSize}, '${ext}', event, 'execute')" class="download_fileimg_icon" class = "download_icon"> </a>
                    </li>`
                }
            }
        })
        fileLi += '</ul>'
        return fileLi
    }


    /**
     * 格式化时间
     * @param date
     * @returns {string}
     */
    let formatDateTime = (date, type) => {
        date = new Date(Date.parse(date));
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        // if (type == 1) { //年/月/日 时/分
        return y + '/' + m + '/' + d + ' ' + h + ':' + minute
        // } else { //年/月/日
        //     return y + '/' + m + '/' + d

        // }
    }

    /**
     * 格式化时间
     * @param date
     * @returns {string}
     */
    let formatDateTimeNew = (date) => {
        date = new Date(parseInt(date));
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '/' + m + '/' + d + ' ' + h + ':' + minute;
    }

    /**
     * 对象型数组排序
     * @param {*} property
     * value1 - value2:正序,反之 倒序
     */
    let compare = (property) => {
        return function (a, b) {
            var value1 = parseInt(a[property]);
            var value2 = parseInt(b[property]);
            return value1 - value2;
        };
    }
    /**
     * 表格表单数组排序
     * @param {*} property
     * value1 - value2:正序,反之 倒序
     */
    let tdCompare = (property) => {
        return function (a, b) {
            let newVal1 = a[property].split(',').join('');
            let newVal2 = b[property].split(',').join('');
            var value1 = parseInt(newVal1);
            var value2 = parseInt(newVal2);
            return value1 - value2;
        };
    }
    /**
     * 筛选表单数据
     * @param {*}
     */
    let formDataReset = (forms) => {
        let newDataList = [];
        $(forms).each(function (n, newItem) {
            let type = newItem.type || ''
            if (type && newItem.isTableChild != 1) {
                newDataList.push(newItem);
            }
        });
        return newDataList;
    }

    // 日历插件点击空白隐藏
    let datepickPlugHide = () => {
        $('.data-time-picker,.data-time-picker .date-set').off('click').on('click', function (pe) {
            // 点击时间控件则隐藏除了自己之外的其他时间控件
            $('.data-time-picker').each(function (i, label) {
                if (!$(label).is(pe.target) && $(label).has(pe.target).length === 0) {
                    $(label).datetimepicker('hide');
                }
            });
            // 点击空白则隐藏所有时间控件
            $(document).on('click', function (e) {
                let _con = $('.data-time-picker,.data-time-picker .date-set'); // 设置目标区域
                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    $('.datetimepicker').hide();
                    $('.time-input').blur();
                    $(document).off('click')
                }
            });
        });
    }
    /**
     * 获取表单信息
     */
    let getFormInfo = () => {
        // 清空公式信息
        formulaInfo = [];
        let isTable = false;
        let defer = $.Deferred();
        // 清空附件缓存
        attmFiles = [];
        // $('.datetimepicker').hide();
        $('.data-time-picker').datetimepicker('remove')
        let forms = electron.remote.getGlobal("execute").formsData.approvalData || [];
        nextDefData = electron.remote.getGlobal("execute").formsData.defaultData || {};
        let eventType = electron.remote.getGlobal("execute").formsData.eventType || '';
        // 下一轮审批
        let nextApproval = false
        if (electron.remote.getGlobal("execute").newApprovalId !== '') {
            nextApproval = true
        }
        $('.approvale-ul').html('');
        $('.approvale-ul').append('<div class="tablePlugTmpBox" hidden></div>');
        tableData = [];
        if (formTableHot) {
            formTableHot.clear();
            formTableHot.destroy();
            formTableHot = null;
        }
        let sortForms = [];
        if (eventType == 'others') {
            // 剔除不符合的数据
            // let newForms = [];
            // $(forms).each(function (n, newItem) {
            //     if (newItem.type && newItem.formElementModel) {
            //         newForms.push(newItem);
            //     }
            // });
            let newForms = formDataReset(forms);
            sortForms = newForms.sort(compare('elementPosition'));
            $.each(sortForms, (index, pitem) => {
                if (pitem.formElementModel) { //新数据处理方法
                    let type = pitem.type || ''
                    $('.approvale-ul').append(getFormModel(pitem.formElementModel || {}, type));
                    if (type && type != 'table' && type.indexOf('table') == -1) {
                        setFormData(pitem.formElementModel || {}, pitem.formElementModel.value || '', index, type, 1);
                    } else if (type && type == 'table') {
                        let item = pitem.formElementModel || {};
                        let tbdom = $($('.approvale-ul>.plugElementRow')[index]);
                        tbdom.attr('data-elementid', item.id);
                        tbdom.attr('data-uuid', item.uuId);
                        tbdom.attr('data-pos', item.position || index);
                        tablePlugInfo = item;
                        isTable = true;
                    }
                }
            })
            if (isTable) {
                createTable(tablePlugInfo);
            }
            // 日历插件点击空白隐藏
            datepickPlugHide()
        } else {
            let data = '';
            sortForms = forms;
            let circleShow = true;
            // 权限申请
            if ((electron.remote.getGlobal("execute").authId || '') != "") {
                circleShow = false;
                let str = electron.remote.getGlobal("execute").approvalType
                let type = str;
                if (typeof (str) == 'string' && str.indexOf('职务授权') > -1) {
                    type = 1;
                }
                if (typeof (str) == 'string' && str.indexOf('个人权限申请') > -1) {
                    type = 0;
                }
                // 发起审批时知会单选按钮初始化
                $('.approval-took input').iCheck({
                    checkboxClass: 'icheckbox_flat-blue',
                    radioClass: 'iradio_flat-blue'
                });
                Approval.authMouldShow(type, nextApproval);
            }
            if (circleShow) {
                $.each(sortForms, (index, pitem) => { //老数据处理（基础表单展示）
                    let type = pitem.type
                    let elementName = pitem.elementName
                    let elementValue = pitem.elementValue;
                    //分割线
                    if (type == 'CuttingLine') {
                        data += '<div class="cutting-line"><div class="cutting-line-content"></div></div>'
                    } else {
                        if (type == 'attachment' && elementValue !== null && elementValue.length !== 0) {
                            let key = elementValue.split(':::')[0]
                            let name = elementValue.split(':::')[1]
                            let dir = elementValue.split(':::')[2]
                            let preview = ''
                            let download = '<a href="' + fileService + '/oss/downloadFile?fileKey=' + key + '&fileName=' + name + '&dir=' + dir + '"><div class="download-file"></div></a>'
                            let extStart = name.lastIndexOf(".");
                            let ext = name.substring(extStart, name.length).toUpperCase();
                            if (ext == ".BMP" || ext == ".PNG" || ext == ".GIF" || ext == ".JPG" || ext == ".JPEG") {
                                preview = `<div onclick="CommonPlupload.previewImg(this,event, '${name}', ${key})" class="preview-img-server"></div>`
                            }
                            //2018-03-22 添加if判断name是否存在 存在传值 不存在隐藏下载图标
                            if (name) {
                                data +=
                                    '<div class="row" style="margin: 0px;padding-top: 10px;">' +
                                    '<div class="col-md-12">' +
                                    '<span data-toggle="tooltip" title="' + elementName + '" class="data-name" >' + elementName + '</span>' +
                                    '<div class="provide-reason">' + name + '</div>' + preview + download + '</div></div>'
                            } else {
                                data +=
                                    '<div class="row" style="margin: 0px;padding-top: 10px;">' +
                                    '<div class="col-md-12">' +
                                    '<span data-toggle="tooltip" title="' + elementName + '" class="data-name" >' + elementName + '</span>' +
                                    '</div></div>'
                            }
                        } else {
                            data +=
                                '<div class="row" style="margin: 0px;padding-top: 10px;">' +
                                '<div class="col-md-12">' +
                                '<span data-toggle="tooltip" title="' + elementName + '" class="data-name" >' + elementName + '</span>' +
                                '<pre class="provide-reason">' + elementValue + '</pre></div></div>'
                        }
                    }
                })
                if (data != '') { //老数据处理方法
                    $('.approvale-ul').html(data);
                    $('#approvaleUl input,.approval-took input').iCheck({
                        checkboxClass: 'icheckbox_flat-blue',
                        radioClass: 'iradio_flat-blue'
                    });
                }
            }
            $('.myLoadingMask').css({
                'display': 'none'
            });
        }
        // App.unblockUI(window);
        //自定义流程
        $('.custom-work').show()
        $('.activiti-img').hide();
        //自定义审批，添加节点按钮
        addNodeBtn('node-user-show', 'node-user', 'addNode')
        addNodeBtn('send-user-show', 'copy-user', 'addNodeCopy')
        approvalType = 0

        $('.approval-header-wrap .approval-header-title').text(_approvalName)

        $(".form-file").each((index, item) => {
            //上传文件
            $(item).on("change", function () {
                $(item).prev().html($(item).val().split("\\").pop())
                $(item).prev().show()
            })
        })
        $('.approval-count').html('1')
        $("[data-toggle='tooltip']").tooltip();
        defer.resolve(1);
        return defer;
    }

    /**
     * 自定义下拉框事件设置
     * @param {} dom 绑定事����的父节点
     */
    let setPlugSelect = (dom) => {
        let optlist = dom.find('.select-list')
        //下拉框绑定事件
        dom.find('.role-span').off().on('click', () => {
            if (optlist.hasClass('hide')) {
                optlist.removeClass('hide');
            } else {
                optlist.addClass('hide');
            }
            //点击空白处关闭下拉
            $('body').click(function (e) {
                var _con = dom; // 设置目标区域
                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    optlist.addClass('hide');
                    $(document).off('click');
                }
            });
        })
        //下拉框选择绑定事件
        dom.find('.select-list li').off().on('click', function (e) {
            let _text = $(this).html();
            let _id = $(this).val();
            optlist.addClass('hide');
            $(this).parents('.mySelPlug').find('.sel-show-txt').text(_text).attr('value', _id);
        })
    }

    /**
     * 未进入审批,保存草稿
     */
    let updateRule = (ruleInfo) => {
        // $.ajax({
        //     type: "post",
        //     beforeSend: function (xhr) {
        //         xhr.setRequestHeader("system", "oa");
        //     },
        //     dataType: 'json',
        //     url: loginService + "/public/rule/update/flag",
        //     data: {
        //         'ruleId': id,
        //         'flag': 0
        //     },
        //     success: function (data) {
        //         if (data.returnCode == 0) {
        //             ipc.send('query_rule_list')
        //         }
        //     }
        // })
        ruleInfo.flag = 0
        ruleInfo.status = 0
        $.ajax({
            type: "post",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
                xhr.setRequestHeader("teamId", electron.remote.getGlobal('sharedObject').teamId);
                xhr.setRequestHeader("type", electron.remote.getGlobal('sharedObject').teamType);
            },
            url: loginService + "/public/rule/add",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(ruleInfo),
            success: function (data) {
                if (data.returnCode == 0) {
                    ipc.send('ref_team_rule')
                }
            }
        })
    }

    /**
     * 审批结束
     */
    let executeEnd = () => {
        let _userId = electron.remote.getGlobal("sharedObject").userId
        let _account = electron.remote.getGlobal("sharedObject").account
        $.ajax({
            type: "post",
            url: loginService + "/approval/approval/finishAuthApproval",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa")
                xhr.setRequestHeader("type", "0")
            },
            data: {
                userId: _userId,
                userAccount: _account,
                configId: electron.remote.getGlobal("execute").newApprovalId
            },
            success: function (data) {
                if (data.returnCode === 0) {
                    electron.remote.getGlobal("execute").newApprovalId = ''
                }
            }
        });
    }

    /**
     * 修改任务信息
     */
    let editTaskDetail = (taskId, taskJson) => {
        // 是否有企业
        let userId = electron.remote.getGlobal("sharedObject").userId;
        let userName = electron.remote.getGlobal("sharedObject").userName
        let htm = '';
        let param = {
            id: taskId,
            operateUser: userId,
            operateUserName: userName,
            approvalStatus: taskJson.approvalStatus,
            resource: taskJson.returnResource || []
            // operateDescription:''
        }
        $.ajax({
            type: "post",
            url: loginService + "/task/modify/id",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
            },
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            async: false,
            success: function (data) {
                if (data.returnCode === 0) {
                    let dataInfo = data.data || '';
                    info = info + dataInfo.id
                    // toastr["success"]('修改任务成功，请重试', "信息提示")
                } else {
                    // toastr["error"]('修改任务失败，请重试', "信息提示")
                }
            },
            error: function (data) {
                toastr["error"]('修改任务错误，请重试', "信息提示")
            }
        })
    }

    ipc.on('closed_goalgo_execute', () => {
        GoalgoExecute.closeProvide()
    })



    /**
     * 刷新审批上传附件展示
     */
    ipc.on('ref_approval_upload_file', (event, arg) => {
        let param = arg[3]
        let forms = electron.remote.getGlobal("execute").formsData.approvalData || [];
        if (!forms || forms.length == 0) {
            forms = approvalFormModels;
        }
        $.each(arg[0], (i, item) => {
            item.uploadDate = formatDateTime(new Date())
        })
        let html = CommonPlupload.approvalFileListHtml(arg[0], attmFiles, arg[3], forms, 'execute', '.filePlugRowCont')
        $('.' + arg[2]).prepend(html)

        // // 表格内附件
        if (param.type == 'table') {
            //     let row = parseInt($('#'+param.iconObj).parents('td').attr('data-row'));
            //     let col = parseInt($('#'+param.iconObj).parents('td').attr('data-col'));
            //     // formTableHot.setDataAtCell(row, col, $('#'+param.iconObj).parents('td').html(), "edit"); //设置cell的新内容
            tableContHei();
        }
    })







    /**
     *  创建附件
     */
    let fileManger = (iconObj, parentObj, type, pUuid, elementId, formData) => {
        let param = {
            'type': type,
            'pUuid': pUuid,
            'elementId': elementId,
            'iconObj': iconObj
        }

        //实例化对象
        let uploader = CommonPlupload.uploader(fileService + "/oss/uploadFiles", iconObj, parentObj)

        //初始化、绑定事件
        CommonPlupload.pluploadEvent(uploader, 'ref_approval_upload_file_list', 'approval', 0, parentObj, param, iconObj)
    }

    /**
     * 列表显示附件填充
     */
    let plugFileListHtml = (list, plugData, isAuth) => {
        let fileLi = '';
        $.each(list, (i, item) => {
            let name = item.fileName;
            let ext = item.fileKey.toLowerCase().split('.').splice(-1)[0];
            let keyId = item.fileKey.split(".")[0];
            let delBtn = `<span data-index="${i}"  class="del-fileimg-btn" data-keyid="${item.fileKey}"></span>`;
            if (!isAuth) {
                delBtn = '';
            }
            if ($.inArray(ext, constants.image) != -1) {
                let imgShow = '';
                let imgUrl = '';
                let file;
                if (item.new && item.file) {
                    $.each(attmFiles, function (i, tmpItem) {
                        let fkey = tmpItem.fileKey.split('.')[0]
                        if (fkey == item.uuid) {
                            file = tmpItem.file || ''
                            return false
                        }
                    })
                    if (file) {
                        imgUrl = window.URL.createObjectURL(file)
                    }
                    imgShow = `<img src='${imgUrl}' class="img_file img_around" data-key="${item.fileKey}" data-size="${item.fileSize}" onclick="CommonPlupload.previewImg(this,event, '${item.fileName}', ${item.fileSize},'true','.filePlugRowCont')">`
                } else {
                    imgUrl = CommonPlupload.getOnlineImg(item.fileKey, item.dir);
                    imgShow = `<img src='${imgUrl}' class="img_file data-key="${item.fileKey}" data-size="${item.fileSize}" onclick="CommonPlupload.previewImg(this,event, '${item.fileName}', ${item.fileSize},'true','.filePlugRowCont')">`
                }
                fileLi += `<div class="file_parent approvalFileBox" data-keyid="${keyId}" data-filekey="${item.fileKey}" data-filesize="${item.fileSize}" data-filename="${item.fileName}">
                ${imgShow}
                <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=approval', '${item.fileName}', ${item.fileSize}, '${ext}', event, 'execute')" class="download_fileimg_icon"></a>
                ${delBtn}
                <input name="file" id="${keyId}" class="approval_file" type="file" data-min-file-count="1" style="display:none;">
            </div>`
            } else {
                if ($.inArray(ext, constants.isShowIcon) != -1) {
                    ext = CommonPlupload.changeExt(ext)
                    fileLi += `<div class="file_parent approvalFileBox" title="${item.fileName}" data-toggle="tooltip" data-keyid="${keyId}" data-filekey="${item.fileKey}" data-filesize="${item.fileSize}" data-filename="${item.fileName}" onclick="filePreviewCommon.showFile('${item.dir}', ${item.fileSize}, '${item.fileName}', '${item.fileKey}', '${item.uploadDate}', '${item.uploadUser}', event)">
                    <img src="../../common/image/task/total-process-manage/${ext}.png">
                    <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=approval', '${item.fileName}', ${item.fileSize}, '${ext}', event , 'execute')" class="download_fileimg_icon">
                    </a>
                    ${delBtn}
                    <input name="file" id="${keyId}" class="approval_file" type="file" data-min-file-count="1" style="display:none;">
                </div>`
                } else {
                    fileLi += `<div class="file_parent approvalFileBox" title="${item.fileName}" data-toggle="tooltip" data-keyid="${keyId}" data-filekey="${item.fileKey}" data-filesize="${item.fileSize}" data-filename="${item.fileName}" onclick="filePreviewCommon.showFile('${item.dir}', ${item.fileSize}, '${item.fileName}', '${item.fileKey}', '${item.uploadDate}', '${item.uploadUser}', event)">
                    <img src="../../common/image/task/total-process-manage/normal.png">
                    <a onclick = "downLoadFile.init('${fileService}/oss/downloadFile?fileKey=${item.fileKey}&fileName=${item.fileName}&dir=approval', '${item.fileName}', ${item.fileSize}, '${ext}', event ,'execute')" class="download_fileimg_icon">
                    </a>
                    ${delBtn}
                    <input name="file" id="${keyId}" class="approval_file" type="file" data-min-file-count="1" style="display:none;">
                </div>`
                }
            }
        })
        return fileLi
    }


    // =====================表格=====================//
    /**
     * 表格初始化
     * flag 1发起下一轮进入
     */
    let colsPercent = [];
    let tableFirst = true;

    let tableInit = (tableMergeData, widths, heights, widthPercent, rowNum, colNum) => {
        colsPercent = widthPercent;
        tableRows = heights;
        // tableMergeData = tableMergeArr;
        let tableInitData = [];
        if (tableFirst) { //首次进入只创建空白表格提高加载速度
            tableInitData = Handsontable.helper.createEmptySpreadsheetData(rowNum, colNum)
        } else {
            tableInitData = tableData;
        }
        let hotElement = document.querySelector('#formPlugTable');
        let hotSettings = {
            data: tableData,
            // colWidths: widths,
            rowHeights: heights,
            // stretchH: 'all', //延伸列的宽度last:延伸最后一列,all:延伸所有列,none默认不延伸。
            autoWrapRow: false,
            rowHeaders: false,
            readOnly: true,
            fixedRowsTop: 1000, //固定多少行不滚动
            fixedColumnsLeft: 30,
            viewportRowRenderingOffset: 2000, //渲染行数不滚动
            viewportColumnRenderingOffset: 200, //渲染列数不滚动
            className: "formTableTd",
            currentRowClassName: 'currentRow', // 当前行的类名
            currentColClassName: 'currentCol', // 当前列的类名
            colWidths: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
            autoColumnSize: false, //自适应列大小
            autoRowSize: false, //自适应行大小
            canEdit: true, //是否可编辑（修改源码自加参数）
            stopScroll: true, //有滚动条的情况下，点击td禁止table自动滚动到顶部
            // 初始化后
            afterInit: function (a, b, c) {
                $('.tablePlugElementRow').css({
                    'padding-left': '5px'
                })
                tableFirst = false;
            },
            // 渲染表格后被调用
            afterRender: function (isForced, prop) {
                // if (!tableFirst) {
                setChildPlug(colNum);
                // }
                tableContHei();
                if (formTableHot) {
                    formTableHot.deselectCell();
                }
            },
            // 单元格重新渲染
            cells: function (row, col, prop) {
                this.renderer = tdValueRender;
            },
            // 合并
            mergeCells: tableMergeArr,
            // 行搞改变
            afterRowResize: function (row, size) {
                tableContHei();
            },
            // 列宽改变移动后
            afterColumnResize: function (row, size) {
                // console.log('col')
            },
            // 选中单元格后
            afterSelectionEnd: function (r1, c1, r2, c2, td, tt) {},
            // 1个或多个单元格的值被改变后调用
            afterChange: function (r1, c1, r2, c2, td, tt) {
                tableContHei()
            },
            // load方法加载数据之后 initialLoad是否初始化加载
            afterLoadData: function (initialLoad) {
                if (!initialLoad) { //通过loadData方法
                    tableFirst = false;
                }
            },
            // 修改参数设置后
            afterUpdateSettings: function (data) {
                // 合并后更新
                // if (JSON.stringify(data).indexOf('mergeCells') > -1) {
                // }
            },
        }
        formTableHot = new Handsontable(hotElement, hotSettings);
        // 空白表格加载完成后填充控件基本代码
        // setTimeout(function () {
        //     showTable(tablePlugInfo);
        //     $('.myLoadingMask').css({ 'display': 'none' });
        // }, 0);
        tableContHei()
        //单击事件的回调函数
        function cellMouseDown(event, coords, td) {
            event.stopPropagation();
            $('.datetimepicker').hide();
            let _con = $(td).find('.plugElementRow').find('label.data-time-picker'); // 设置目标区域
            // 点击表单单元格隐藏时间控件datapicker弹框
            if (!_con.is(event.target) && _con.has(event.target).length === 0) {
                $('.datetimepicker').hide();
                $('.time-input').blur();
                // $(document).off('click')
            }
        }
        // afterOnCellMouseUp
        Handsontable.hooks.add('afterOnCellMouseDown', cellMouseDown, formTableHot);
        // 事件
        $('.formPlugTable td').off('mousewheel').on('mousewheel', function (e) {
            e.stopPropagation()
        });
        $('.formPlugTable td').off('mouseover').on('mouseover', function (e) {
            e.stopPropagation()
        });
        $('.formPlugTable td').off('click').on('click', function (e) {
            e.stopPropagation()
        });
        $(window).resize(function () {
            tableContHei();
        });
    };
    /**
     * 渲染表格html
     * @param {*} instance
     * @param {*} td
     * @param {*} row
     * @param {*} col
     * @param {*} prop
     * @param {*} value
     * @param {*} cellProperties
     */
    function tdValueRender(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        let attr = instance.getCellMeta(row, col); //设置单元格属性
        $(td).html(value);
        $(td).attr('data-row', row).attr('data-col', col).attr('data-coord', `${row},${col}`);
    }

    /**
     * 表格内容改变后高度设置
     */
    let tableContHei = () => {
        let colWidths = [];
        let isPercent = true; //存储的是百分比
        $(colsPercent).each(function (i, percent) {
            let wid = parseInt((percent / 100 * ($('.approvale-ul').width() - 70)).toFixed(2));
            if (wid < 200) {
                wid = 200
            }
            colWidths.push(wid);
        });
        if (formTableHot) {
            formTableHot.deselectCell();
            $('.formPlugTable>.handsontable .wtHolder .wtHider table colgroup').each(function (i, cgDom) {
                $(cgDom).find('col').each(function (c, colDom) {
                    $(colDom).css({
                        'width': `${colWidths[c]}px`
                    });
                });
            });
        }
        let masterW = $('#formPlugTable').width();
        let masterH = $('.ht_master table').height();
        // 高度调整
        $('.formPlugTable').height(masterH + 20);
        $('.formPlugTable>.handsontable,.formPlugTable>.handsontable .wtHolder').height(masterH + 20);
        // 宽度调整
        $('.formPlugTable>.handsontable,.formPlugTable>.handsontable .wtHolder').width(masterW);

        // 添加删除行按钮高度调试
        $('.formPlugTable .ht_master .wtHolder .htCore tbody tr').each(function (i, dom) {
            let trH = $(dom).outerHeight();
            let tdNum = 0; //显示的td个数
            let colNums = 1;
            if (formTableHot) {
                colNums = formTableHot.countCols();
            }
            let tdArr = [];
            $(dom).find('td').each(function (td, tdDom) {
                if ($(tdDom).css('display') != 'none') {
                    // tdNum++;
                    let colspan = $(tdDom).attr('colspan');
                    let rowspan = $(tdDom).attr('rowspan');
                    let startcol = $(tdDom).attr('data-col');
                    let tdObj = {
                        height: $(tdDom).outerHeight(),
                        rowspan: rowspan,
                        colspan: colspan,
                        startcol: startcol
                    }
                    tdArr.push(tdObj);
                }
            });
            let tdSortArr = tdArr.sort(compare('height'), 0);
            // 逆序
            let tdInver = tdSortArr[tdSortArr.length - 1];
            if (tdArr.length > 0) {
                //===添加重复行按钮 以最大合并单元格为准
                let rowResetH = tdInver.height;
                if (tdInver.rowspan > 1) { //至少2行整行合并
                    // 已经隐藏的不再检测（通过多行合并检测过）
                    if ($($('.tableRowResetBtn')[i]).css('display') != 'none') {
                        // 添加重复行按钮
                        $($('.tableRowResetBtn')[i]).attr({
                            'data-rowspan': tdInver.rowspan,
                            'data-row': i,
                            'data-colspan': tdInver.colspan,
                            'data-col': tdInver.startcol
                        });
                        $($('.tableRowResetBtn')[i]).css({
                            'height': rowResetH + 'px',
                            'line-height': rowResetH + 'px'
                        });
                        // 首次检测多行合并的隐藏除第一个的其余按钮
                        for (let r = i + 1; r < i + parseInt(tdInver.rowspan); r++) {
                            $($('.tableRowResetBtn')[r]).hide();
                        }
                        // console.log(tdInver.rowspan)
                    }

                } else {
                    if ($($('.tableRowResetBtn')[i]).css('display') != 'none') {
                        $($('.tableRowResetBtn')[i]).show();
                        $($('.tableRowResetBtn')[i]).css({
                            'height': rowResetH + 'px',
                            'line-height': rowResetH + 'px'
                        });
                        $($('.tableRowResetBtn')[i]).attr({
                            'data-rowspan': 1,
                            'data-row': i,
                            'data-colspan': 1,
                        });
                    }
                }
            } else {
                $($('.tableRowResetBtn')[i]).hide();
            }
        });
        resetRowSet();
    }
    /**
     * 重复行操作按钮设置
     */
    let resetRowSet = () => {
        let rowNum = 0,
            colNum = 0;
        if (formTableHot) {
            rowNum = formTableHot.countRows();
            colNum = formTableHot.countCols();
        } else {
            return false;
        }
        let rowResetBtn = '';
        for (let r = 0; r < rowNum; r++) {
            let rowResetHtm = `<span class="tableRowResetBtn"><span class="tableRowResetTxt"></span></span>`
            // 是否是重复行
            let isReset = false;
            // 是否是新加行
            let isDel = false;
            // 行从哪一行复制而来，如果是整行合并则为区域最顶行
            let parentRow = ''
            $(resetRowArr).each(function (retI, retItem) {
                // 所查询行在重复行数组集合中
                if (retItem.startRow == r) {
                    isReset = true;
                    if (retItem.type == 'del') {
                        isDel = true;
                        parentRow = retItem.parentRow
                    }
                }
            });
            if (isReset) {
                if (isDel) { //删除按钮
                    rowResetHtm = `<span class="tableRowResetTxt resetRowDelBtnTxt" onclick="GoalgoExecute.delTableRow(${r},${colNum},this)" data-parentrow="${parentRow}">删除</span>`
                } else { //添加按钮
                    rowResetHtm = `<span class="tableRowResetTxt" onclick="GoalgoExecute.addTableRow(${r},${colNum},this)">添加</span>`
                }
            } else { //无按钮的行
                rowResetHtm = ``
            }
            $($('.tableRowResetBox .tableRowResetBtn')[r]).html(rowResetHtm);

        }
    }
    /***
     * 表格初始化完成后调整内嵌控件的配置数据
     */
    let setChildPlug = (colNum) => {
        // formulaInfo = [];
        let forms = electron.remote.getGlobal("execute").formsData; //发起下一轮进入
        //正常发起审批
        let firstApproval = (approvalFormModels, dataUuid, coord, tdDom, getI) => {
            // $.each(tablePlugInfo.tableElements, (j, tbItem) => {
            //     if (tbItem.coord == coord) { //确定坐标
            //         if (tbItem.formElementModel && $(tdDom).find('.plugElementRow').length > 0) {
            //             setFormData(tbItem.formElementModel || {}, tbItem.formElementModel.value || '', -1, false, 0, $(tdDom).find('.plugElementRow'), tbItem.color, approvalFormModels);
            //         }
            //     }
            // })
            // 优化
            let tableElements = tablePlugInfo.tableElements || [];
            let tableElementsSort = tableElements.sort(tdCompare('coord'));
            let tbItem = tableElementsSort[getI] || {};
            let row = coord.split(',')[0]
            let col = coord.split(',')[1]
            $(tdDom).attr('data-row', row)
            $(tdDom).attr('data-col', col)
            $(tdDom).attr('data-tdid', tbItem.id);
            if (tbItem.newadd) { //重复行添加标识
                $(tdDom).attr('data-newadd', true)
            }
            if (tbItem.formElementModel) {
                // if (tbItem.newadd) {//重复行添加
                let tdHtm = getTableModel(tbItem.formElementModel || {});
                $(tdDom).html(tdHtm);
                // }
                if (!tbItem.formElementModel.uuId) {
                    let elementUuid = Math.uuid();
                    tbItem.formElementModel.uuId = elementUuid;
                }
                setFormData(tbItem.formElementModel || {}, tbItem.formElementModel.value || '', -1, false, 0, $(tdDom).find('.plugElementRow'), tbItem.color, approvalFormModels);
            }
        }
        //再次发起审批
        let nextApproval = (forms, dataUuid, coord, tdDom, getI) => {
            // $.each(forms.approvalData || [], (index, pitem) => {
            //     let item = pitem.formElementModel || {};
            //     if (item.uuId == dataUuid) {
            //         setNextApproval(item.tableElements, coord, tdDom, forms.approvalData)
            //     }
            // })
            // 优化
            let tableElements = tablePlugInfo.tableElements || [];
            let tableElementsSort = tableElements.sort(tdCompare('coord'));
            let row = coord.split(',')[0]
            let col = coord.split(',')[1]
            $(tdDom).attr('data-row', row)
            $(tdDom).attr('data-col', col)
            let tbItem = tableElementsSort[getI] || {};
            if (tbItem.formElementModel && $(tdDom).find('.plugElementRow').length > 0) {
                setFormData(tbItem.formElementModel && tbItem.formElementModel || {}, tbItem.formElementModel.value || '', -1, false, 1, $(tdDom).find('.plugElementRow'), tbItem.color, forms.approvalData || []);
            }
        }
        let tdCode = (trDom, trI) => {
            $(trDom).find('td').each(function (tdI, tdDom) {
                let dataUuid = $(tdDom).parents('.plugElementRow').attr('data-uuid');
                let coord = trI + ',' + tdI;
                // 确定对应表单数据的下标
                let getI = trI * colNum + tdI;
                if (forms == '' || $.isEmptyObject(forms)) { //正常发起审批按钮进入
                    firstApproval(approvalFormModels, dataUuid, coord, tdDom, getI)
                } else { //发起下一轮进入
                    // App.blockUI(window)
                    nextApproval(forms, dataUuid, coord, tdDom, getI)
                }
            });
        }
        // $('#formPlugTable .ht_master table tbody>tr').each((trI, trDom) => {
        //     tdCode(trDom, trI)
        // })
        let tableElements = tablePlugInfo.tableElements || [];
        let tableElementsSort = tableElements.sort(tdCompare('coord'));
        if (forms == '' || $.isEmptyObject(forms)) { //正常发起审批按钮进入
            $(tableElementsSort || []).each(function (t, tbItem) {
                let tdDom = $(`.formPlugTable .ht_master table tbody>tr>td[data-coord="${tbItem.coord}"]`);
                let row = $(tdDom).attr('data-row');
                let col = $(tdDom).attr('data-col');
                $(tdDom).attr('data-tdid', tbItem.id);
                if (tbItem.newadd) { //重复行添加标识
                    $(tdDom).attr('data-newadd', true)
                }
                if (tbItem.formElementModel) {
                    // if (tbItem.newadd) {//重复行添加
                    let tdHtm = getTableModel(tbItem.formElementModel || {});
                    $(tdDom).html(tdHtm);
                    // }
                    if (!tbItem.formElementModel.uuId) {
                        let elementUuid = Math.uuid();
                        tbItem.formElementModel.uuId = elementUuid;
                    }
                    setFormData(tbItem.formElementModel || {}, tbItem.formElementModel.value || '', -1, false, 0, $(tdDom).find('.plugElementRow'), tbItem.color, approvalFormModels);
                }
            });
        } else { //发起下一轮进入
            $(tableElementsSort || []).each(function (t, tbItem) {
                let tdDom = $(`.formPlugTable .ht_master table tbody>tr>td[data-coord="${tbItem.coord}"]`);
                let row = $(tdDom).attr('data-row');
                let col = $(tdDom).attr('data-col');
                if (tbItem.formElementModel) {
                    let type = tbItem.formElementModel.type || ''
                    let tdHtm = getTableModel(tbItem.formElementModel || {});
                    $(tdDom).html(tdHtm);
                    setFormData(tbItem.formElementModel && tbItem.formElementModel || {}, tbItem.formElementModel.value || '', -1, false, 1, $(tdDom).find('.plugElementRow'), tbItem.color, forms.approvalData || []);
                }
            });
        }
        // setTimeout(function(){
        $('.myLoadingMask').css({
            'display': 'none'
        });
        // },100);
    }


    /**
     * 公式检查
     * dataUuid
     * flag 1:表格内公式
     */
    let checkFormulaSure = (dataUuid, flag) => {
        let bool = true;
        let modelsData = []
        let forms = electron.remote.getGlobal("execute").formsData; //发起下一轮进入
        if (forms == '' || $.isEmptyObject(forms)) { //正常发起审批按钮进入
            modelsData = forms.approvalData || []
        } else {
            modelsData = approvalFormModels || []
        }
        if (flag != 1) {
            $.each(modelsData, (index, item) => {
                if (item.type == 'formula' && dataUuid == item.uuId) {
                    if (item.designFormulas) {
                        let formulaObj = JSON.parse(item.designFormulas);
                        $(formulaObj.variable).each(function (v, vItem) {
                            let variUuid = vItem.id;
                            let variVal = $(`.plugElementRow[data-uuid="${variUuid}"]`).find('.numval_plug').val();
                            if (!variVal) {
                                $('.hight').removeClass('hight');
                                if (vItem.plugType == 'table') {
                                    $(`.formPlugTable td .plugElementRow[data-uuid="${variUuid}"]`).parent('td').addClass('hight');
                                } else {
                                    $(`.approvale-ul>.plugElementRow[data-uuid="${variUuid}"]`).addClass('hight');
                                }
                                bool = false
                                toastr["error"]('【公式】控件还没有填写数值', "信息提示")
                                return bool;
                            }
                        })
                    }
                }
            })
        } else {
            $.each(tablePlugInfo.tableElements, (index, tbItem) => {
                let getModel = tbItem.formElementModel || {}
                let getUuid = getModel.uuId;
                if (getModel.type == 'formula' && dataUuid == getUuid) {
                    let formulaObj = JSON.parse(getModel.designFormulas);
                    $(formulaObj.variable).each(function (v, vItem) {
                        let variUuid = vItem.id;
                        let variVal = $(`.plugElementRow[data-uuid="${variUuid}"]`).find('.numval_plug').val();
                        if (!variVal) {
                            $('.hight').removeClass('hight');
                            if (vItem.plugType == 'table') {
                                $(`.formPlugTable td .plugElementRow[data-uuid="${variUuid}"]`).parent('td').addClass('hight');
                            } else {
                                $(`.approvale-ul>.plugElementRow[data-uuid="${variUuid}"]`).addClass('hight');
                            }
                            toastr["error"]('【公式】控件还没有填写数值', "信息提示")
                            bool = false
                            return bool;
                        }
                    })
                }
            })
        }
        return bool;
    }

    /**
     * 检测表单模板填写信息
     */
    let checkModelsInfo = () => {
        let bool = true
        let datas = [];
        // 表格新加重复行数据
        let newAddData = [];
        //模块权限时限
        let functionTimeModel = { //模块权限时限
            "grantType": 0,
            "grantValue": 0
        };
        //数据权限时限
        let dataTimeModel = { //模块权限时限
            "grantType": 0,
            "grantValue": 0
        };
        $('.approvale-ul>li,.approvale-ul>.plugElementRow').each((index, item) => {
            // $('.hight').removeClass('hight');
            let type = $(item).attr('data-id');
            let elementName = ''
            let elementMark = ''
            let elementValue = ''
            let valueContent = ''
            let isAuth = $(item).attr('data-isauth');
            let isEdit = $(item).attr('data-isedit');
            let isDef = $(item).attr('data-isdef');
            let position = $(item).attr('data-pos');
            if ($(item).attr('data-pos') == 'null') {
                position = index;
            }
            if ($(item).css('display') == 'none') {
                isAuth = 'false';
            }
            if (type !== 'CuttingLine') {
                elementName = $(item).find('.plugTit').html()
                elementMark = $(item).find('span.hidden-condition').html()
            }
            if (isBasicForm) { //基础表单
                isAuth = 'true';
                isEdit = 'true';
                elementName = $(item).find('pre.plugLeftTit').html()
                position = index;
            }
            //插件属性
            let plug = {
                type: type,
                elementId: $(item).attr('data-elementid'),
                elementPosition: position,
                elementName: elementName,
                elementMark: elementMark || '',
                elementValue: '',
                valueContent: ''
            };
            //纯文本
            if (type == 'text') {
                plug.elementValue = ''
                plug.type = type
            };
            //下拉框
            if (type == 'select') {
                let index = $('option:selected', item).index()
                // let val = $(item).find('.plugSelect .sel-show-txt').attr('value');
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (index == 0) {
                        toastr["error"]('请完善下拉框 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                if (index == 0) {
                    elementValue = ''
                    valueContent = ''
                } else {
                    let obj = [{
                        id: $('option:selected', item).attr('data-opnid'),
                        val: $('option:selected', item).text()
                    }]
                    elementValue = JSON.stringify(obj);
                    valueContent = $('option:selected', item).text();
                }
            }
            //时间
            if (type == 'time') {
                let time = $(item).find('label').children('input').val()
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (time.length == 0) {
                        toastr["error"]('请完善时间 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                elementValue = time
                valueContent = time
            }
            //日期区间
            if (type == 'dateRange') {
                let startTime = $(item).find('label').children('.time-range-start').val();
                let endTime = $(item).find('label').children('.time-range-end').val();
                let time = startTime + ',' + endTime;
                if (isAuth == 'true') {
                    let checkDate = false;
                    if (!$(item).find('.required').is(':hidden')) { //必填
                        checkDate = true;
                    } else { //非必填的时候只要填写一个时间也需要验证
                        if (startTime != '' || endTime != '') {
                            checkDate = true;
                        }
                    }
                    if (checkDate) {
                        if (startTime == '') {
                            toastr["error"]('请选择开始时间 ', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        } else if (endTime == '') {
                            toastr["error"]('请选择结束时间 ', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        } else if (endTime < startTime) {
                            toastr["error"]('结束时间必须大于开始时间', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        }
                    }
                }
                elementValue = time
                valueContent = time
            }
            //单行输入框
            if (type == 'input' || type == 'auth_input' || type == 'dataRange_input') {
                let input = $(item).find('input').val() || ''
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (input.length == 0) {
                        toastr["error"]('请完善单行输入', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                elementValue = input
                valueContent = input
                // 权限模块授权时效值
                if ($(item).hasClass('authEffectValRow')) {
                    functionTimeModel.grantValue = elementValue;
                }
                // 数据范围授权时效值
                if ($(item).hasClass('dataRangeEffectValRow')) {
                    dataTimeModel.grantValue = elementValue;
                }
            }
            //多行输入框
            if (type == 'textarea') {
                let textarea = $(item).find('textarea').val()
                let pre = $(item).find('.textarea-pre').html()
                if (isAuth == 'true' && isEdit == 'true' && !$(item).find('.required').is(':hidden')) {
                    if ($(item).attr('data-readonly') == 'false') {
                        if (textarea.length == 0) {
                            toastr["error"]('请完善多行输入', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        }
                    }
                }
                if ($(item).attr('data-readonly') == 'true') {
                    elementValue = pre
                    valueContent = pre
                } else {
                    elementValue = textarea
                    valueContent = textarea
                }
            }
            //附件
            if (type == 'attachment') {
                // let fileList = $(item).find(".approval_file") || []
                let fileSize = 0
                let elementValArr = []
                let fileList = $(item).find('.file_parent') || []
                $.each(fileList, (i, fileDom) => {
                    if ($(fileDom).css('display') == 'none' || !$(fileDom).attr('data-filekey')) {
                        return;
                    }
                    let name = $(fileDom).attr('data-filename');
                    let fileKey = $(fileDom).attr('data-filekey');
                    let fileSize = parseInt($(fileDom).attr('data-filesize'));
                    let uploadDate = formatDateTimeNew($(fileDom).attr('data-time'))
                    let obj = {
                        "fileName": name,
                        "fileKey": fileKey,
                        "fileSize": fileSize,
                        "dir": 'approval',
                        "uploadUser": electron.remote.getGlobal("sharedObject").userName,
                        "uploadDate": uploadDate
                    }
                    elementValArr.push(obj)
                    valueContent += `${fileKey},`
                })
                App.unblockUI(window);
                let fileTemplate = $(item).attr('data-fileTemplate')
                if (fileTemplate != 1) { //附件模板不做必填提示
                    if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                        if (fileList.length == 0) {
                            toastr["error"]('请上传附件', "信息提示")
                            bool = false
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        }
                    }
                }

                if (fileList.length > 0) {
                    elementValue = JSON.stringify(elementValArr);
                }
            }
            //分割线
            if (type == 'CuttingLine') {
                plug.type = type
            }
            //单选框 auth_radio：授权失效radio
            if (type == 'radio' || type == 'auth_radio' || type == 'dataRange_radio') {
                if (!isBasicForm) {
                    $(item).find('.radioBox').children('label').each((index, label) => {
                        if ($(label).children('div').hasClass('checked')) {
                            let obj = [{
                                id: $(label).children('div').find('input').attr('data-opnid'),
                                val: $(label).children('div').next().html()
                            }]

                            elementValue = JSON.stringify(obj);
                            valueContent = $(label).children('div').next().html()
                            App.unblockUI(window);
                            return false
                        }
                    })
                } else {
                    $(item).children('label').each((index, label) => {
                        if ($(item).css('display') != 'none' && $(label).children('div').hasClass('checked')) {
                            elementValue = $(label).children('div').next().html();
                            valueContent = $(label).children('div').next().html()
                            App.unblockUI(window);
                            return false
                        }
                    })
                }
                // 权限模块权限时限
                if ($(item).hasClass('authLimitRow')) {
                    //授权时效类型 0：永久，1限时，2限次数
                    if (elementValue == '永久') {
                        functionTimeModel.grantType = 0;
                    }
                }
                if ($(item).hasClass('authEffectRow')) {
                    //授权时效类型 0：永久，1限时，2限次数
                    if (elementValue == '时间') {
                        functionTimeModel.grantType = 1;
                    } else {
                        functionTimeModel.grantType = 2;
                    }
                }
                // 数据范围权限时限
                if ($(item).hasClass('authLimitRow')) {
                    //授权时效类型 0：永久，1限时，2限次数
                    if (elementValue == '永久') {
                        dataTimeModel.grantType = 0;
                    } else {
                        dataTimeModel.grantType = 1;
                    }
                }
            }
            //多选框
            if (type == 'checkbox') {
                let elementValueArr = [];
                let _len = $(item).find('.checkboxBox label div.checked').length
                let ckd = $(item).find('.checkboxBox label div.checked')
                $.each(ckd, (i, label) => {
                    let obj = {
                        id: $(label).find('input').attr('data-opnid'),
                        val: $.trim($(label).next().html())
                    }
                    elementValueArr.push(obj);
                    valueContent += `${$.trim($(label).next().html())}`
                    if (i < _len - 1 && _len > 1) {
                        valueContent += ','
                    }
                })
                // $(item).find('.checkboxBox').children('label').each((i, label) => {
                //     if ($(label).children('div').hasClass('checked')) {
                //         let obj = {
                //             id: $(label).children('div').find('input').attr('data-opnid'),
                //             val: $(label).children('div').next().html()
                //         }
                //         elementValueArr.push(obj);
                //         valueContent += `${$(label).children('div').next().html()}`
                //         if (i < $(item).find('.checkboxBox').children('label').length - 1) {
                //             valueContent += ','
                //         }
                //     }
                // })
                elementValue = JSON.stringify(elementValueArr);
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (elementValue.length == 0 || elementValueArr.length == 0) {
                        toastr["error"]('请完善多选框 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
            }
            //人员选择
            if (type == 'peoSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善人员选择', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let obj = {
                        userId: $(dom).attr('data-id'),
                        userName: $(dom).attr('data-name'),
                        account: $(dom).attr('data-account'),
                    };
                    list.push(obj);
                    valueContent += `${$(dom).attr('data-name')}`
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }
            //部门选择
            if (type == 'deptSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    // if (isAuth == 'true' && isDef == 'false' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善部门', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                if (isDef == 'true') {
                    // 有编辑权限才校验必填等
                    if (domlist.html() == '' && isAuth == 'true') {
                        toastr["error"]('成员无主岗，无法发起审批', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let obj = {
                        deptId: $(dom).attr('data-id'),
                        deptName: $(dom).attr('data-name'),
                    };
                    list.push(obj);
                    valueContent += `${$(dom).attr('data-name')}`
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }
            //岗位选择
            if (type == 'roleSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    // if (isAuth == 'true' && isDef == 'false' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善岗位', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                if (isDef == 'true') {
                    if (domlist.html() == '' && isAuth == 'true') {
                        toastr["error"]('成员无主岗，无法发起审批', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let role = ($(dom).text() + '').split('-')
                    let obj = {
                        deptId: $(dom).attr('data-deptid'),
                        deptName: $(dom).attr('data-deptname'),
                        roleId: $(dom).attr('data-id'),
                        roleName: $(dom).attr('data-rolename'),
                        // roleName: `${role.length > 1 ? role[1] : role[0]}`,
                    };
                    list.push(obj);
                    valueContent += $(dom).attr('data-rolename')
                    // valueContent += `${role.length > 1 ? role[1] : role[0]}`
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }

            //数值
            if (type == 'numval') {
                let input = $(item).find('input').val() || ''
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (input.length == 0) {
                        toastr["error"]('请完善数值', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                elementValue = input
                valueContent = input
            }
            //公式
            if (type == 'formula') {
                let input = $(item).find('input').val() || ''
                let numVal = $(item).find('input').attr('data-oldVal') || ''
                if (input.indexOf(',') > -1) {
                    // 去除逗号成纯数字
                    input = input.replace(/,/g, '');
                }
                // 公式本身没有编辑权限，只做必填项判断
                if (!$(item).find('.required').is(':hidden')) {
                    if (input.length == 0) {
                        App.unblockUI(window);
                        bool = false
                        // let thisUuid = $(item).attr('data-uuid')
                        // let variBool = checkFormulaSure(thisUuid);
                        // if (!variBool) {
                        //     return false
                        // }
                        toastr["error"]('请完善公式', "信息提示")
                        $('.hight').removeClass('hight');
                        $(item).addClass('hight');
                        return false
                    }
                }
                elementValue = input
                valueContent = numVal
            }
            plug.elementValue = elementValue;
            plug.valueContent = valueContent;
            if (type != 'table') {
                datas.push(plug)
            } else if (type == 'table') {
                plug.type = type
                datas.push(plug)
                let tabInfo = checkTableData($(item));
                newAddData = tabInfo.newAddData || [];
                if (tabInfo.bool) {
                    $(tabInfo.tableData).each(function (i, tbItem) {
                        datas.push(tbItem)
                    });
                } else {
                    bool = false
                    return false;
                }
            }
            // 权限授权时限

            datas
        })
        return {
            bool: bool,
            data: datas,
            newAddData: newAddData,
            functionTimeModel: functionTimeModel,
            dataTimeModel: dataTimeModel,
        };
    }

    /**
     * 验证提交的table数据
     */
    let checkTableData = (tableDom) => {
        let tableData = [];
        let bool = true;
        let newAddData = [];
        // ht_master  ht_master
        tableDom.find('.formPlugTable .ht_master table tbody td').each((index, thisDom) => {
            let tdDom = $(thisDom)
            let item = $(tdDom).find('.plugElementRow')
            // let item=$(pitem).parent('td').attr('data-row')
            let type = $(item).attr('data-id');
            let elementName = ''
            let elementMark = ''
            let elementValue = ''
            let valueContent = ''
            let isAuth = $(item).attr('data-isauth');
            let isEdit = $(item).attr('data-isedit');
            let isDef = $(item).attr('data-isdef');
            let isnewAdd = $(tdDom).attr('data-newadd');
            let position = $(item).attr('data-pos');
            // 隐藏不可见的只传值不做检查
            if ($(item).is(':hidden')) {
                isAuth = 'false';
            }
            if ($(item).attr('data-pos') == 'null') {
                position = index;
            }
            let row = parseInt($(tdDom).attr('data-row'));
            let col = parseInt($(tdDom).attr('data-col'));
            //插件属性
            let newAddPlug = {
                "coord": row + ',' + col,
                elementValue: '',
                valueContent: ''
            };
            //空表格
            // if ($(item).length == 0) {
            //     if (!isnewAdd) {
            //         newAddPlug.id = $(item).attr('data-elementid');
            //     } else {
            //         newAddPlug.resourceId = $(item).attr('data-elementid');
            //     }
            //     newAddData.push(newAddPlug)
            // }
            if (type !== 'CuttingLine') {
                elementName = $(item).find('.plugTit').html()
                elementMark = $(item).find('span.hidden-condition').html()
            }
            //插件属性
            let plug = {
                type: type + '_table',
                elementId: $(item).attr('data-elementid'),
                elementPosition: position,
                elementName: elementName,
                elementMark: elementMark,
                elementValue: '',
                valueContent: ''
            };

            //纯文本
            if (type == 'text') {
                plug.elementValue = ''
            };
            //下拉框
            if (type == 'select') {
                let index = $('option:selected', item).index()
                // let val = $(item).find('.plugSelect .sel-show-txt').attr('value');
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (index == 0) {
                        toastr["error"]('请完善表格中下拉框 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                if (index == 0) {
                    elementValue = ''
                    valueContent = ''
                } else {
                    let obj = [{
                        id: $('option:selected', item).attr('data-opnid'),
                        val: $('option:selected', item).text()
                    }]
                    elementValue = JSON.stringify(obj);
                    valueContent = $('option:selected', item).text() || '';
                }
            }
            //时间
            if (type == 'time') {
                let time = $(item).find('label').children('input').val() || ''
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (time.length == 0) {
                        toastr["error"]('请完善表格中时间 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                elementValue = time;
                valueContent = time;
            }
            //日期区间
            if (type == 'dateRange') {
                let startTime = $(item).find('label').children('.time-range-start').val();
                let endTime = $(item).find('label').children('.time-range-end').val();
                let time = startTime + ',' + endTime;
                if (isAuth == 'true') {
                    let checkDate = false;
                    if (!$(item).find('.required').is(':hidden')) { //必填
                        checkDate = true;
                    } else { //非必填的时候只要填写一个时间也需要验证
                        if (startTime != '' || endTime != '') {
                            checkDate = true;
                        }
                    }
                    if (checkDate) {
                        if (startTime == '') {
                            toastr["error"]('请选择表格中开始时间 ', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            tdDom.addClass('hight');
                            return false
                        } else if (endTime == '') {
                            toastr["error"]('请选择表格中结束时间 ', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            tdDom.addClass('hight');
                            return false
                        } else if (endTime < startTime) {
                            toastr["error"]('结束时间必须大于开始时间', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            tdDom.addClass('hight');
                            return false
                        }
                    }
                }
                elementValue = time;
                valueContent = time;
            }
            //单行输入框
            if (type == 'input') {
                let input = $(item).find('input').val() || ''
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (input.length == 0) {
                        toastr["error"]('请完善表格中单行输入', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                elementValue = input;
                valueContent = input;
            }
            //多行输入框
            if (type == 'textarea') {
                let textarea = $(item).find('textarea').val()
                let pre = $(item).find('.textarea-pre').html()
                if (isAuth == 'true' && isEdit == 'true' && !$(item).find('.required').is(':hidden')) {
                    if ($(item).attr('data-readonly') == 'false') {
                        if (textarea.length == 0) {
                            toastr["error"]('请完善表格中多行输入', "信息提示")
                            bool = false
                            App.unblockUI(window);
                            $('.hight').removeClass('hight');
                            tdDom.addClass('hight');
                            return false
                        }
                    }
                }
                if ($(item).attr('data-readonly') == 'true') {
                    elementValue = pre;
                    valueContent = pre;
                } else {
                    elementValue = textarea;
                    valueContent = textarea;
                }
            }
            //附件
            if (type == 'attachment') {
                // let fileList = $(item).find(".approval_file") || []
                let fileSize = 0
                let elementValArr = []
                let fileList = $(item).find('.file_parent') || []
                $.each(fileList, (i, fileDom) => {
                    if ($(fileDom).css('display') == 'none' || !$(fileDom).attr('data-filekey')) {
                        return;
                    }
                    let name = $(fileDom).attr('data-filename');
                    let fileKey = $(fileDom).attr('data-filekey');
                    let thisSize = parseInt($(fileDom).attr('data-filesize'));
                    let obj = {
                        "fileName": name,
                        "fileKey": fileKey,
                        "fileSize": thisSize,
                        "dir": 'approval'
                    }
                    elementValArr.push(obj)
                    valueContent += `${fileKey},`
                })
                App.unblockUI(window);
                let fileTemplate = $(item).attr('data-fileTemplate')
                if (fileTemplate != 1) { //附件模板不做必填提示
                    if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                        if (fileList.length == 0) {
                            toastr["error"]('请上传附件', "信息提示")
                            bool = false
                            $('.hight').removeClass('hight');
                            $(item).addClass('hight');
                            return false
                        }
                    }
                }

                if (fileList.length > 0) {
                    elementValue = JSON.stringify(elementValArr);
                }
            }
            //分割线
            if (type == 'CuttingLine') {}
            //单选框
            if (type == 'radio') {
                $(item).find('.radioBox').children('label').each((index, label) => {
                    if ($(label).children('div').hasClass('checked')) {
                        let obj = [{
                            id: $(label).children('div').find('input').attr('data-opnid'),
                            val: $(label).children('div').next().html()
                        }]
                        elementValue = JSON.stringify(obj);
                        valueContent = $(label).children('div').next().html() || ''
                        App.unblockUI(window);
                        return false
                    }
                })
            }
            //多选框
            if (type == 'checkbox') {
                let elementValueArr = [];
                let _len = $(item).find('.checkboxBox label div.checked').length
                let ckd = $(item).find('.checkboxBox label div.checked')
                $.each(ckd, (i, label) => {
                    let obj = {
                        id: $(label).find('input').attr('data-opnid'),
                        val: $.trim($(label).next().html())
                    }
                    elementValueArr.push(obj);
                    valueContent += `${$.trim($(label).next().html())}`
                    if (i < _len - 1 && _len > 1) {
                        valueContent += ','
                    }
                })
                // $(item).find('.checkboxBox').children('label').each((i, label) => {
                //     if ($(label).children('div').hasClass('checked')) {
                //         let obj = {
                //             id: $(label).children('div').find('input').attr('data-opnid'),
                //             val: $(label).children('div').next().html()
                //         }
                //         elementValueArr.push(obj);
                //         valueContent += `${$(label).children('div').next().html()}`
                //         if (i < $(item).find('.checkboxBox').children('label').length - 1) {
                //             valueContent += ','
                //         }
                //     }
                // })
                elementValue = JSON.stringify(elementValueArr);
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (elementValueArr.length == 0) {
                        toastr["error"]('请完善表格中多选框 ', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
            }
            //人员选择
            if (type == 'peoSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善表格中人员', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let obj = {
                        userId: $(dom).attr('data-id'),
                        userName: $(dom).attr('data-name'),
                        account: $(dom).attr('data-account'),
                    };
                    list.push(obj);
                    valueContent += `${$(dom).attr('data-name')}`
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }
            //部门选择
            if (type == 'deptSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && isDef == 'false' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善表格中部门', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                if (isDef == 'true') {
                    if (domlist.html() == '') {
                        toastr["error"]('成员无主岗，无法发起审批', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let obj = {
                        deptId: $(dom).attr('data-id'),
                        deptName: $(dom).attr('data-name'),
                    };
                    list.push(obj);
                    valueContent += `${$(dom).attr('data-name')}`
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }
            //岗位选择
            if (type == 'roleSel') {
                let domlist = $(item).find('.modelSelList');
                if (isAuth == 'true' && isDef == 'false' && !$(item).find('.required').is(':hidden')) {
                    if (domlist.html() == '') {
                        toastr["error"]('请完善表格中岗位', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                if (isDef == 'true') {
                    if (domlist.html() == '') {
                        toastr["error"]('成员无主岗，无法发起审批', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                let list = [];
                $(item).find('.modelSelList .members-in').each(function (i, dom) {
                    let role = ($(dom).text() + '').split('-')
                    let obj = {
                        deptId: $(dom).attr('data-deptid'),
                        deptName: $(dom).attr('data-deptname'),
                        roleId: $(dom).attr('data-id'),
                        roleName: $(dom).attr('data-rolename'),
                        // roleName: `${role.length > 1 ? role[1] : role[0]}`,
                    };
                    list.push(obj);
                    // valueContent += `${role.length > 1 ? role[1] : role[0]}`
                    valueContent += $(dom).attr('data-rolename')
                    if (i < $(item).find('.modelSelList .members-in').length - 1) {
                        valueContent += ','
                    }
                });
                elementValue = JSON.stringify(list);
            }

            //数值
            if (type == 'numval') {
                let input = $(item).find('input').val() || ''
                if (isAuth == 'true' && !$(item).find('.required').is(':hidden')) {
                    if (input.length == 0) {
                        toastr["error"]('请完善表格中数值', "信息提示")
                        bool = false
                        App.unblockUI(window);
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                elementValue = input;
                valueContent = input;
            }
            //公式
            if (type == 'formula') {
                let input = $(item).find('input').val() || ''
                let numVal = $(item).find('input').attr('data-oldVal') || ''
                if (input.indexOf(',') > -1) {
                    // 去除逗号成纯数字
                    input = input.replace(/,/g, '');
                }
                if (!$(item).find('.required').is(':hidden')) {
                    if (input.length == 0) {
                        App.unblockUI(window);
                        bool = false
                        let thisUuid = $(item).attr('data-uuid')
                        // let variBool = checkFormulaSure(thisUuid, 1);
                        // if (!variBool) {
                        //     return false
                        // }
                        toastr["error"]('请完善表格中公式', "信息提示")
                        $('.hight').removeClass('hight');
                        tdDom.addClass('hight');
                        return false
                    }
                }
                elementValue = input;
                valueContent = numVal;
            }
            plug.elementValue = elementValue
            plug.valueContent = valueContent
            // 非重复行添加的数据
            if (!isnewAdd) {
                // 空表单不存取
                if ($(tdDom).find('.plugElementRow').length > 0) {
                    tableData.push(plug)
                }
                newAddPlug.id = $(tdDom).attr('data-tdid');
            } else {
                newAddPlug.resourceId = $(tdDom).attr('data-tdid');
                newAddPlug.elementValue = elementValue
                newAddPlug.valueContent = valueContent
                if (item.length > 0) {
                    newAddPlug.uuId = item.attr('data-uuid');
                    // 更新新增行的公式数据
                    if (type == 'formula') {
                        $(formulaInfo).each(function (f, fItem) {
                            if (fItem.formlaId == item.attr('data-uuid')) {
                                newAddPlug.designFormulas = JSON.stringify(fItem);
                                return;
                            }
                        });
                    }
                }
            }

            newAddData.push(newAddPlug)
        })
        return {
            bool: bool,
            tableData: tableData,
            newAddData: newAddData
        };
    }

    /**
     * 关闭审批时，清除任务移交数据
     * @param {*} info  任务数据
     */
    let cancleTrans = (info, type) => {
        $.ajax({
            type: "post",
            url: loginService + "/task/approval/cancelApproval",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("system", "oa");
                xhr.setRequestHeader("type", "0")
            },
            data: {
                taskId: info.id,
                approvalStatus: type == 'demotioneing' ? 0 : info.approvalStatus
            }
        })
    }
    /**
     * 发起审批修改标题
     */
    let loadTitleInfo = () => {
        // $(".approval-header-icon").hide();
        let tableName = electron.remote.getGlobal("execute").approvTableName
        let userName = electron.remote.getGlobal("sharedObject").userName
        //自定义审批表单配置回显
        let approvalTitle = '';
        if (titleDisposes) {
            $.each(titleDisposes, function (i, item) {
                if (item.contentType == 2) {
                    let itemRow = $(`.plugElementRow[data-uuid="${item.content}"]`);
                    let itemLabel = $(itemRow).find('pre').text();
                    approvalTitle += `{${itemLabel}}`
                } else {
                    if (item.content.length == 36) {
                        let itemRow = $(`.plugElementRow[data-uuid="${item.content}"]`);
                        let itemLabel = $(itemRow).find('pre').text();
                        approvalTitle += `{${itemLabel}}`
                    } else {
                        approvalTitle += `${item.content}`
                    }
                }
            })
            tableName = approvalTitle
        }
        $(".approval-header-title").empty().html(`${userName}【${tableName}】的审批`)
        $(".approval-header-input").attr('data-val', tableName)
        // tableName = tableName.length > 15 ? tableName.substring(0, 15) + '...' : tableName
        $(".approval-header-input").val(tableName)
        let prefix = '',
            suffix = ''
        $(".approval-header-icon").on('click', () => {
            let str = $(".approval-header-title").text();
            str = str.trim();
            prefix = str.match(/(\S*)【/)[1]
            suffix = str.match(/】(\S*)/)[1]
            let _w = $(".approval-header-title").width() + 25
            $(".approval-header-input").css("width", _w + 'px')
            $(".approval-header-input").show(100).val($(".approval-header-input").attr('data-val'));
            $(".approval-header-input").focus();
        })
        $(".approval-header-input").on('blur', function () {
            if ($(this).val() == '') {
                $(this).focus();
            }
            $(this).removeClass('approval-header-null')
            $(".approval-header-input").hide(100)
            let _val = $(this).val()
            $(".approval-header-input").attr('data-val', _val)
            // _val = _val.length > 15 ? _val.substring(0, 15) + '...' : _val
            $(".approval-header-title").text(`${prefix}【${_val}】${suffix}`)
        })
    }

    /**
     * 表格添加重复行按钮
     */
    let resetRowBtn = (rowNum) => {
        let row = rowNum;
        if (rowNum != undefined) {
            row = rowNum;
        } else {
            if (formTableHot) {
                row = formTableHot.countRows();
            }
        }
        let rowResetBtn = ''
        for (let r = 0; r < row; r++) {
            let rowResetHtm = `<span class="tableRowResetBtn"><span class="tableRowResetTxt">添加</span></span>`
            rowResetBtn += rowResetHtm;
        }
        $('.tableRowResetBox').html(rowResetBtn);
    }
   

    return {
        /**
         * 初始指令
         */
        init: () => {
            $(".approval-header-icon").hide();
            formulaInfo = [];
            $('.datetimepicker').remove();
            newtaskInfo = electron.remote.getGlobal("execute").taskInfo
            newresourceInfo = electron.remote.getGlobal("execute").resourceInfo
            let eventId = electron.remote.getGlobal("execute").eventId
            updateSidebar()
            showStartApproval()
            // queryCommunicatesApproval('dateTimeRangeInputApproval', 'task-approval-time-div')
            setTimeout(function () {
                getProcessDataOld(eventId)
                queryCustomForm()

                // $.when().done(function (ret) {
                // })
            }, 0);
            startApproval()
            document.onkeydown = function (e) { //对整个页面监听
                //判断如果用户按下了
                // if (e.ctrlKey && e.altKey && e.keyCode == 71) {
                //     ipc.send('execute_show_devtools')
                // }
                if (e.key == 'F12') {
                    ipc.send('execute_show_devtools')
                }
            }

            $('body').mousedown(
                (event) => {
                    var e = event || window.event;
                    let nType = e.which;
                    let yType = e.target.tagName.toLowerCase()
                    if (3 == nType && (yType == 'input' || yType == 'textarea') && e.target.className.indexOf('date-picker-range') == -1 && e.target.className.indexOf('date-picker') == -1) {
                        ipc.send('sigShowRightClickMenu');
                    }
                    e.stopPropagation();
                }
            );
        },

        /**
         * 删除文件
         */
        deleteFile: (obj) => {
            let flags = electron.remote.getGlobal("execute").isEdit
            if (flags) {
                let keys = $(obj).prev().prev().html('').attr('datakey')
                let uuid = keys.split(':::')[0].split('.')[0]
                $.each(getEditKey, (i, item) => {
                    if (uuid == item) {

                        getEditKey.splice(i, 1)
                    }
                })
                $(obj).prev().prev().attr('datakey', '')


            }
            $(obj).hide()
            $(obj).prev().prev().html('')
            $(obj).prev().hide()
            $(obj).next().val('')
        },
        /**
         * 预览后台图片
         */
        previewImageServer: (key, dir) => {
            let param = {
                fileName: key,
                dir: dir
            }
            $.ajax({
                type: "post",
                url: fileService + "/oss/get/url",
                dataType: "json",
                data: param,
                success: function (data) {
                    if (data.returnCode === 0) {
                        if (data.data.length != 0) {
                            $('.preview-image-panle').html('<img src="' + data.data + '" />');
                            let height = $('#preview-image').height();
                            $('.preview-image-panle').css('height', height - 50 + 'px');
                            $('.preview-image-panle').css('line-height', height - 50 + 'px');
                            $('#preview-image').show();

                            //Esc 关闭图片预览
                            $(window).keydown(function (event) {
                                if (event.keyCode == 27) {
                                    $('#preview-image').hide();
                                    $('.preview-image-panle').html('')
                                }
                            });
                        }
                    } else {
                        toastr["error"](data.returnMessage, "信息提示")
                    }
                },
                error: function () {
                    toastr["error"]('预览图片失败，请重试', "信息提示")
                }
            })
        },

        /**
         * 预览前端图片
         */
        previewImage: (obj, uuid) => {
            let file = '';
            $.each(attmFiles, function (i, item) {
                let fkey = item.fileKey.split('.')[0]
                if (fkey == uuid) {
                    file = item.file
                    return false
                }
            })
            // let file = $(obj).parent().find('input[name="file"]')[0].files[0];
            $('.preview-image-panle').html('<img src="' + window.URL.createObjectURL(file) + '" onmousewheel="GoalgoExecute.bigimg(this)"/>');
            let height = $('#preview-image').height();
            $('.preview-image-panle').css('height', height - 50 + 'px');
            $('.preview-image-panle').css('line-height', height - 50 + 'px');
            $('#preview-image').show();

            //Esc 关闭图片预览
            $(window).keydown(function (event) {
                if (event.keyCode == 27) {
                    $('#preview-image').hide();
                    $('.preview-image-panle').html('')
                }
            });
        },

        /**
         * 在线预览图片
         */
        onlinePreviewImage: (key, dir) => {
            let param = {
                fileName: key,
                dir: dir
            }
            $.ajax({
                type: "post",
                url: fileService + "/oss/get/url",
                dataType: "json",
                data: param,
                success: function (data) {
                    if (data.returnCode === 0) {
                        if (data.data.length != 0) {
                            $('.preview-image-panle').html('<img src="' + data.data + '"  onmousewheel="GoalgoExecute.bigimg(this)"/>');
                            let height = $('#preview-image').height();
                            $('.preview-image-panle').css('height', height - 50 + 'px');
                            $('.preview-image-panle').css('line-height', height - 50 + 'px');
                            $('#preview-image').show();

                            //Esc 关闭图片预览
                            $(window).keydown(function (event) {
                                if (event.keyCode == 27) {
                                    $('#preview-image').hide();
                                    $('.preview-image-panle').html('')
                                }
                            });
                        }
                    } else {
                        toastr["error"](data.returnMessage, "信息提示")
                    }
                },
                error: function () {
                    toastr["error"]('预览图片失败，请重试', "信息提示")
                }
            })
        },
        /**
         * 关闭图片
         */
        closePreview: () => {
            $('#preview-image').hide();
            $('.preview-image-panle').html('')
        },

        /**
         * 显示修改类型名称窗口
         */
        showEditFormName: (id, name) => {
            $('#editTypeId').val(id)
            $('#editTypeName').val(name)
            $('#editType').modal('show')
        },

        /**
         * 显示删除类型窗口
         */
        showDeleteForm: (id, name) => {
            $('#deleteTypeId').val(id)
            $('.delete-name').html('确定删除类型：' + name + '吗？')
            $('#deleteType').modal('show')
        },

        /**
         * 关闭审批执行窗口
         */
        closeProvide: () => {

            let newApprovalId = electron.remote.getGlobal("execute").newApprovalId
            if (newApprovalId != '') {
                executeEnd()
            }
            //制度发布审批，未完成存为草稿
            let ruleInfo = electron.remote.getGlobal("execute").ruleInfo
            ruleInfo = (ruleInfo != '' && null != ruleInfo) ? $.parseJSON(ruleInfo) : ''
            if (ruleInfo != '' && (ruleInfo.id == 0 || ruleInfo.id == '' || ruleInfo.id == null)) {
                updateRule(ruleInfo)
            }
            let taskInfo = newtaskInfo
            taskInfo = (taskInfo != '' && null != taskInfo) ? $.parseJSON(taskInfo) : ''
            if (taskInfo != '' && (taskInfo.approvalEventName).indexOf('任务移交') != -1) {
                ipc.send('unblock_ui_window')
                cancleTrans(taskInfo)
            } else if (taskInfo != '' && (taskInfo.approvalEventName).indexOf('企业级任务审批') != -1) {
                ipc.send('unblock_ui_window')
                cancleTrans(taskInfo)
            } else if (taskInfo != '' && (taskInfo.approvalEventName).indexOf('部门级任务审批') != -1) {
                ipc.send('unblock_ui_window')
                cancleTrans(taskInfo)
            }
            // else if(electron.remote.getGlobal("execute").demotioneingInfo != '' &&  electron.remote.getGlobal("execute").demotioneingInfo != null){
            //     if(JSON.parse(electron.remote.getGlobal("execute").demotioneingInfo).approvalEventName.indexOf('任务移交') != -1){
            //         ipc.send('unblock_ui_window')
            //         cancleTrans(JSON.parse(electron.remote.getGlobal("execute").demotioneingInfo),'demotioneing')
            //     }
            // } 
            toastr.clear();
            electron.remote.getGlobal("execute").resourceInfo = null
            electron.remote.getGlobal("execute").fileInfo = null
            electron.remote.getGlobal("execute").resourceInfo = null
            electron.remote.getGlobal("execute").authId = ''
            electron.remote.getGlobal("execute").ruleInfo = ''
            electron.remote.getGlobal("execute").taskInfo = null
            electron.remote.getGlobal("execute").meetInfo = null
            electron.remote.getGlobal("execute").chatInviteInfo = ''
            ipc.send('goalgo_execute_hide')
            CommonPlupload.uploadFail('ref_approval_upload_file_list')
        },
        /**
         * 最小化审批执行窗口
         */
        minProvide: () => {
            ipc.send('goalgo_execute_min')
        },
        /**
         * 最大化审批执行窗口
         */
        maxProvide: () => {
            ipc.send('goalgo_execute_max')
        },
        //添加审批节点
        addNode: (obj) => {
            let parentNode = $(obj).parent()
            let queryTeamUser
            let _typeAdd
            // let flags = electron.remote.getGlobal("execute").isType
            // if (flags == 'org') {
            queryTeamUser = '/organization/user/solr/findUserByEnterprise'
            // 岗位权限控制新接口 旧 '/team/enterpriseRoleInfo/findOrgEnterprise',
            let findRoleByTeam = '/team/permission/findEnterpriseTree';
            _typeAdd = 2
            // } else {
            //     queryTeamUser = '/team/enterpriseRoleInfo/findUserByEnterprise'
            //     findRoleByTeam = '/team/enterpriseRoleInfo/findEnterpriseTree'
            //     _typeAdd = 1
            // }

            let param = {
                teamId: electron.remote.getGlobal("execute").teamId,
                userId: electron.remote.getGlobal('sharedObject').userId,
                account: electron.remote.getGlobal('sharedObject').account,
                notAccount: electron.remote.getGlobal('sharedObject').account,
                hostUrl: loginService,
                contactsUrl: '/team/teamUserInfo/findContacts',
                saveContactsUrl: '/team/teamUserInfo/saveContacts',
                findRoleByTeam: findRoleByTeam,
                // findRoleByTeam: findRoleByTeam,
                queryTeamUser: queryTeamUser,
                checkType: 'checkbox',
                memberModal: 'show',
                nodeUsers: nodeUsers,
                parentName: parentNode,
                type: _typeAdd,
                queryAll: true, //查询所有数据（所有节点可选）
                dataAuth: true, //是否数据权限控制
                permissionType: 3, //数据权限控制类型:通讯录范围 3（开启数据权限控制生效）
            }
            $(obj).addMember(param)

            $(obj).next('#addMemberList').unbind('change').on('change', function (e) {
                nodeUsers = $(this).data('myUser')
                if (nodeUsers.length > 1) {
                    $('.approval-count-div').show()
                    $('.approval-count').html(nodeUsers.length)
                }
                let html = ''
                $.each(nodeUsers, (i, item) => {
                    let username = '';
                    if (item.username.length > 2) {
                        username = item.username.slice(-2);
                    } else {
                        username = item.username;
                    }
                    html += '<div class="provide-node-value">' +
                        '<div class="imgtest">' +
                        '<div class="figure-img" data-toggle="tooltip" data-placement="top"  title="' + item.username + '">' +
                        '<span>' + username + '</span>' +
                        '</div>' +
                        '<a class="del-img" onclick="GoalgoExecute.deleteNodeUser(' + item.userId + ',this)"><img src="../../common/image/img/close-tilte.png" /></a>' +
                        '</div>' +
                        '<div>' +
                        '<span>' + item.username + '</span>' +
                        '</div></div>'
                })
                $(".node-user-show .provide-node-value").remove()
                $(this).parent().before(html)
                $('[data-toggle="tooltip"]').tooltip();
            })
        },
        //添加抄送人
        addNodeCopy: (obj) => {
            let parentNode = $(obj).parent()
            let queryTeamUser
            let _typeAdd
            // let flags = electron.remote.getGlobal("execute").isType
            // if (flags == 'org') {
            queryTeamUser = '/organization/user/solr/findUserByEnterprise'
            // 岗位权限控制新接口 旧 '/team/enterpriseRoleInfo/findOrgEnterprise',
            let findRoleByTeam = '/team/permission/findEnterpriseTree';
            _typeAdd = 2
            // } else {
            //     queryTeamUser = '/team/enterpriseRoleInfo/findUserByEnterprise'
            //     findRoleByTeam = '/team/enterpriseRoleInfo/findEnterpriseTree'
            //     _typeAdd = 1
            // }
            let param = {
                teamId: electron.remote.getGlobal("execute").teamId,
                userId: electron.remote.getGlobal('sharedObject').userId,
                account: electron.remote.getGlobal('sharedObject').account,
                notAccount: electron.remote.getGlobal('sharedObject').account,
                hostUrl: loginService,
                contactsUrl: '/team/teamUserInfo/findContacts',
                saveContactsUrl: '/team/teamUserInfo/saveContacts',
                findRoleByTeam: findRoleByTeam,
                // findRoleByTeam: findRoleByTeam,
                queryTeamUser: queryTeamUser,
                checkType: 'checkbox',
                memberModal: 'show',
                nodeUsers: copyUsers,
                parentName: parentNode,
                type: _typeAdd,
                queryAll: true, //查询所有数据（所有节点可选）
                dataAuth: true, //是否数据权限控制
                permissionType: 3, //数据权限控制类型:通讯录范围 3（开启数据权限控制生效）
            }
            $(obj).addMember(param)

            $(obj).next('#addMemberList').unbind('change').on('change', function (e) {
                copyUsers = $(this).data('myUser')
                let html = ''
                $.each(copyUsers, (i, item) => {
                    let username = '';
                    if (item.username.length > 2) {
                        username = item.username.slice(-2);
                    } else {
                        username = item.username;
                    }
                    html += '<div class="provide-node-value">' +
                        '<div class="imgtest">' +
                        '<div class="figure-img" data-toggle="tooltip" data-placement="top"  title="' + item.username + '">' +
                        '<span>' + username + '</span>' +
                        '</div>' +
                        '<a class="del-img" onclick="GoalgoExecute.deleteCopyUser(' + item.userId + ',this)"><img src="../../common/image/img/close-tilte.png" /></a>' +
                        '</div>' +
                        '<div>' +
                        '<span>' + item.username + '</span>' +
                        '</div></div>'
                })
                $(".send-user-show .provide-node-value").remove()
                $(this).parent().before(html)
                $('[data-toggle="tooltip"]').tooltip();
            })
        },
        //删除审批人
        deleteNodeUser: (id, obj) => {
            let parent = $(obj).parent().parent()
            $(parent).remove()
            $.each(nodeUsers, function (i, item) {
                if (id == item.userId) {
                    nodeUsers.splice(i, 1)
                    if (nodeUsers.length < 2) {
                        $('.approval-count-div').hide()
                        $('.approval-count').html('1')
                        $('.spinner-input').val('1')
                    } else {
                        $('.approval-count').html(nodeUsers.length)
                        $('.spinner-input').val(nodeUsers.length)
                    }
                    return false
                }
            })
            $('.node-user>button').removeAttr('disabled')
            $('.node-user>button').addClass('active')
        },
        //删除抄送人
        deleteCopyUser: (id, obj) => {
            let parent = $(obj).parent().parent()
            $(parent).remove()
            $.each(copyUsers, function (i, item) {
                if (id == item.userId) {
                    copyUsers.splice(i, 1)
                    return false
                }
            })
            $('.copy-user>button').removeAttr('disabled')
            $('.copy-user>button').addClass('active')
        },
        //保存审批
        saveProvide: () => {
            addProvide()
        },
        /**
         * 删除人员 部门 岗位
         */
        delMember: (obj, ptype, pUuid, elementid, delType, formData, flag) => {
            let findDom = $(obj).parents('.peoSelPlugRow').find('.modelSelList');
            $(obj).parents('.members-box').remove();
            if (ptype == 'table') { //表格
                let thisVal = [];
                findDom.find('.members-in').each(function (e) {
                    let newobj = {};
                    if (delType == 0) { //人员
                        newobj = {
                            userId: $(this).attr('data-id'),
                            userName: $(this).text(),
                            account: $(this).attr('data-account'),
                        };
                    } else if (delType == 1) { //部门
                        newobj = {
                            deptId: $(this).attr('data-id'),
                            deptName: $(this).text(),
                        };
                    } else if (delType == 2) { //岗位
                        newobj = {
                            roleId: $(this).attr('data-id'),
                            roleName: $(this).text(),
                        };
                    }
                    thisVal.push(newobj);
                });
                formTableHot.deselectCell();
                // 修改缓存数据
                changeTableData(pUuid, elementid, JSON.stringify(thisVal), formData, 1);
            }
        },
        /**
         * 人员选择
         * selectType 1单选 0多选
         */
        selectMember: (obj, selectType, ptype, pUuid, elementid, formData) => {
            let selectedSta = $(obj).parents('.peoSelPlugRow').find('.members-box');
            let checkType = selectType == 1 ? 'checkbox' : 'radio';
            let queryAll = false;
            // let findRoleByTeam = '/team/enterpriseRoleInfo/findEnterpriseTree';
            if (selectType == 1) { //多选可级联选择
                queryAll = true;
                // findRoleByTeam = '/team/enterpriseRoleInfo/findOrgEnterprise';
            }
            let list = []
            $.each(selectedSta, (i, item) => {
                let user = {
                    userId: $(item).children('.members-in').attr('data-id'),
                    username: $(item).children('.members-in').text(),
                    userAccount: $(item).children('.members-in').attr('data-account')
                }
                list.push(user)
            })
            // 岗位权限-通讯录权限控制新接口
            let findRoleByTeam = '/team/permission/findEnterpriseTree';
            let parentNode = $(obj)
            let param = {
                teamId: electron.remote.getGlobal("execute").teamId,
                userId: electron.remote.getGlobal('sharedObject').userId,
                account: electron.remote.getGlobal('sharedObject').account,
                includeNowAccount: true,
                type: 2,
                hostUrl: loginService,
                contactsUrl: '/team/teamUserInfo/findContacts',
                saveContactsUrl: '/team/teamUserInfo/saveContacts',
                // findRoleByTeam: '/team/enterpriseRoleInfo/findEnterpriseTree',
                findRoleByTeam: findRoleByTeam,
                queryTeamUser: '/organization/user/solr/findUserByEnterprise',
                checkType: checkType,
                memberModal: 'show',
                nodeUsers: list,
                parentName: parentNode,
                queryAll: queryAll, //查询所有数据（所有节点可选）
                dataAuth: true, //是否开启数据权限控制
                permissionType: 3, //数据权限类型（开启数据权限控制才生效）
            }
            $(obj).addMember(param)

            $(obj).find("#addMemberList").off().on('change', function () {
                $('#syx_add_member').modal('hide');
                let changeUser = $(this).data('myUser')
                let htm = '';
                let newUser = [];
                let newTmpList = [];
                if (changeUser.length != 0) {
                    $.each(changeUser, (j, item) => {
                        let userModel = {}
                        userModel.userId = '' + item.userId
                        userModel.username = item.username
                        userModel.account = item.userAccount
                        newUser.push(userModel)
                        // 修改缓存数据
                        let newobj = {
                            userId: '' + item.userId,
                            userName: item.username,
                            account: item.userAccount,
                        };
                        newTmpList.push(newobj);
                    })
                }
                $.each(newUser, (i, userNow) => {
                    htm += `<div class="members-box">
                    <span class="members-in" data-id="${userNow.userId}" data-name="${userNow.username}" data-account="${userNow.account}" data-toggle="tooltip" title="${userNow.username}">${userNow.username}</span>
                    <span data-id="${userNow.userId}" class="delete-item-btn" ></span></div>`
                })

                $(obj).parents('.peoSelPlugRow').find('.modelSelList').html(htm);

                $("[data-toggle='tooltip']").tooltip()
                $(obj).parents('.peoSelPlugRow').find('.modelSelList').find('.delete-item-btn').off().on('click', function () {
                    GoalgoExecute.delMember(this, ptype, pUuid, elementid, 0, formData)
                });
                if (ptype == 'table') { //表格
                    changeTableData(pUuid, elementid, JSON.stringify(newTmpList), formData, 1);
                    formTableHot.deselectCell();
                }
            })
        },
        /**
         * 部门选择
         * selectType 1单选 0多选
         */
        selectDept: (obj, selectType, ptype, pUuid, elementid, formData) => {
            let selectedSta = $(obj).parents('.peoSelPlugRow').find('.members-box');
            let checkType = selectType == 1 ? 'radio' : 'checkbox';
            let list = []
            $.each(selectedSta, (i, item) => {
                let user = {
                    userId: $(item).children('.members-in').attr('data-id'),
                    username: $(item).children('.members-in').text(),
                }
                list.push(user)
            })
            // let findRoleByTeam = '/team/enterpriseRoleInfo/findEnterpriseTree';
            // 岗位权限-通讯录权限控制新接口
            let findRoleByTeam = '/team/permission/findEnterpriseTree';
            let parentNode = $(obj)
            let param = {
                teamId: electron.remote.getGlobal("execute").teamId,
                userId: electron.remote.getGlobal('sharedObject').userId,
                account: electron.remote.getGlobal('sharedObject').account,
                includeNowAccount: true,
                type: 2,
                hostUrl: loginService,
                contactsUrl: '/team/teamUserInfo/findContacts',
                saveContactsUrl: '/team/teamUserInfo/saveContacts',
                findRoleByTeam: findRoleByTeam,
                // findRoleByTeam: '/team/enterpriseUserAuth/findDeptByParent',
                queryTeamUser: '/organization/user/solr/findUserByEnterprise',
                checkType: 'checkbox',
                memberModal: 'show',
                nodeUsers: list,
                parentName: parentNode,
                findType: 3, //查询企业下部门
                showTitle: '常用部门',
                titleName: '所属部门',
                dataAuth: true, //是否开启数据权限控制
                permissionType: 3, //数据权限类型（开启数据权限控制才生效）
                // queryAll: queryAll, //级联查询所有数据（所有节点可选）
            }
            $(obj).addMember(param)

            $(obj).find("#addMemberList").off().on('change', function () {
                $('#syx_add_member').modal('hide');
                let changeUser = $(this).data('myUser')
                let htm = '';
                let newUser = [];
                let newTmpList = [];
                if (changeUser.length != 0) {
                    $.each(changeUser, (j, item) => {
                        let userModel = {}
                        userModel.deptId = '' + item.userId
                        userModel.deptName = item.username
                        userModel.account = item.userAccount
                        newUser.push(userModel)
                        // 修改缓存数据
                        let newobj = {
                            deptId: '' + item.userId,
                            deptName: item.username,
                        };
                        newTmpList.push(newobj);
                    })
                }
                $.each(newUser, (i, userNow) => {
                    htm += `<div class="members-box">
                    <span class="members-in" data-id="${userNow.deptId}" data-name="${userNow.deptName}" data-toggle="tooltip" title="${userNow.deptName}">${userNow.deptName}</span>
                    <span data-id="${userNow.deptId}" class="delete-item-btn"></span></div>`
                })
                $(obj).parents('.peoSelPlugRow').find('.modelSelList').html(htm);
                $("[data-toggle='tooltip']").tooltip()
                $(obj).parents('.peoSelPlugRow').find('.modelSelList').find('.delete-item-btn').off().on('click', function () {
                    GoalgoExecute.delMember(this, ptype, pUuid, elementid, 1, formData)
                });
                if (ptype == 'table') { //表格
                    changeTableData(pUuid, elementid, JSON.stringify(newTmpList), formData, 1);
                    formTableHot.deselectCell();
                }
            })
        },
        /**
         * 岗位选择
         * selectType 0单选 1多选
         */
        selectRole: (obj, selectType, ptype, pUuid, elementid, formData) => {
            let selectedSta = $(obj).parents('.peoSelPlugRow').find('.members-box');
            let deptSelDom = $('.deptSelList').find('.members-box');
            let checkType = selectType == 1 ? 'radio' : 'checkbox';
            let list = [];
            let deptList = [];
            // 已选岗位
            $.each(selectedSta, (i, item) => {
                let role = $(item).children('.members-in').text().split('-')
                let data = {
                    deptId: $(item).children('.members-in').attr('data-deptid'),
                    deptName: $(item).children('.members-in').attr('data-deptname'),
                    userId: $(item).children('.members-in').attr('data-id'),
                    username: `${role.length > 1 ? role[1] : role[0]}`,
                    // selectJobId: $(item).find('span').text() == '主' ? $(item).attr('id') : ''
                }
                list.push(data)
            })
            // 已选部门 （用于筛选已选部门下岗位）
            $.each(deptSelDom, (i, item) => {
                let dept = {
                    selDeptId: $(item).children('.members-in').attr('data-id'),
                    name: $(item).children('.members-in').text(),
                    type: 3
                }
                deptList.push(dept)
            })
            // 旧接口
            //let findRoleByTeam = '/team/enterpriseRoleInfo/findEnterpriseTree';
            // 岗位权限-通讯录权限控制新接口
            let findRoleByTeam = '/team/permission/findEnterpriseTree';
            let parentNode = $(obj)
            let param = {
                teamId: electron.remote.getGlobal("execute").teamId,
                userId: electron.remote.getGlobal('sharedObject').userId,
                account: electron.remote.getGlobal('sharedObject').account,
                includeNowAccount: true,
                type: 2,
                hostUrl: loginService,
                contactsUrl: '/team/teamUserInfo/findContacts',
                saveContactsUrl: '/team/teamUserInfo/saveContacts',
                findRoleByTeam: findRoleByTeam,
                queryTeamUser: '/organization/user/solr/findUserByEnterprise',
                checkType: 'checkbox',
                memberModal: 'show',
                nodeUsers: list,
                parentName: parentNode,
                findType: 31, //查询企业下岗位
                // selectDepart: deptList,
                showTitle: '常用岗位',
                titleName: '所属岗位',
                roleAll: 'all',
                dataAuth: true, //是否开启数据权限控制
                permissionType: 3, //数据权限类型（开启数据权限控制才生效）
            }
            $(obj).addMember(param)

            $(obj).find("#addMemberList").off().on('change', function () {
                $('#syx_add_member').modal('hide');
                let changeUser = $(this).data('myUser')
                let htm = '';
                let newUser = [];
                let newTmpList = [];
                if (changeUser.length != 0) {
                    $.each(changeUser, (j, item) => {
                        let dataModel = {}
                        dataModel.id = '' + item.userId
                        dataModel.name = item.username
                        dataModel.deptId = '' + item.deptId
                        dataModel.deptName = item.deptName
                        newUser.push(dataModel)
                        // 修改缓存数据
                        let newobj = {
                            deptId: '' + item.deptId,
                            deptName: item.deptName,
                            roleId: '' + item.userId,
                            roleName: item.username,
                        };
                        newTmpList.push(newobj);
                    })
                }
                $.each(newUser, (i, newData) => {
                    let newName = `${newData.deptName}-${newData.name}`;
                    if (newData.deptName == '' || newData.deptName == null) {
                        newName = `${newData.name}`;
                    }
                    let showName = GoalgoExecute.cutName(newName, 10) || '';
                    htm += `<div class="members-box">
                    <span class="members-in" data-id="${newData.id}" data-rolename="${newData.name}" data-deptid="${newData.deptId}" data-deptname="${newData.deptName}" data-toggle="tooltip" title="${newName}">${showName}</span>
                    <span data-id="${newData.id}" class="delete-item-btn" ></span></div>`
                })
                $(obj).parents('.peoSelPlugRow').find('.modelSelList').html(htm);
                $("[data-toggle='tooltip']").tooltip()
                $(obj).parents('.peoSelPlugRow').find('.modelSelList').find('.delete-item-btn').off().on('click', function () {
                    GoalgoExecute.delMember(this, ptype, pUuid, elementid, 2, formData)
                });
                if (ptype == 'table') { //表格
                    changeTableData(pUuid, elementid, JSON.stringify(newTmpList), formData, 1);
                    formTableHot.deselectCell();
                }
            })
        },
        /**
         * 名字截取
         */
        cutName: (name, len) => {
            let newName = name;
            if (name.length > len) {
                newName = name.slice(0, len);
            }
            return newName;
        },
        /**变更审批查看任务详情原计划时间 */
        findOldTaskTime: (id, userId, type) => {
            let oldTime = {}
            let relationUsers = []
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("system", "oa");
                    xhr.setRequestHeader("type", "0");
                    //  xhr.setRequestHeader("teamId", belongId);
                },
                url: loginService + '/task/query/id',
                data: {
                    "userId": userId,
                    "id": id
                },
                success: function (data) {
                    if (data.returnCode == 0) {
                        oldTime.startTime = data.data.startTime
                        oldTime.endTime = data.data.endTime
                        relationUsers = data.data.relationUsers
                    }
                },
                error: function () {
                    toastr["error"]('查询任务变更原时间失败！', "信息提示");
                }
            })
            if (type == 'relationUsers') {
                return relationUsers
            } else {
                return oldTime
            }
        },
        /**
         * 图片预览放大缩小
         */
        bigimg: (obj) => {
            //alert(parseInt(obj.style.zoom,10));
            var zoom = parseInt(obj.style.zoom, 10) || 100;
            zoom += event.wheelDelta / 12;
            if (zoom > 0)
                obj.style.zoom = zoom + '%';
            return false;
        },
        /**
         * 添加表格行
         * row 当前添加行的位置
         * col 表格列数
         * obj 按钮
         */
        addTableRow: (optRow, col, obj) => {
            let rowspan = parseInt($(obj).parents('.tableRowResetBtn').attr('data-rowspan')) || 1;
            let addRow = 0;
            let row = optRow
            // 查找同属一个父区域复制的行按钮
            if ($(`.resetRowDelBtnTxt[data-parentrow="${optRow}"]`).length > 0) {
                let lastAreaStart = parseInt($(`.resetRowDelBtnTxt[data-parentrow="${optRow}"]:last`).parent().attr('data-row'));
                if (rowspan && rowspan > 1) {
                    addRow = lastAreaStart + rowspan;
                } else {
                    addRow = lastAreaStart + 1;
                }
                row = lastAreaStart
            } else {
                if (rowspan && rowspan > 1) {
                    addRow = rowspan + optRow;
                } else {
                    addRow = optRow + 1;
                }
            }
            formTableHot.alter('insert_row', addRow, rowspan);
            // 自定义加载层显示
            $('.myLoadingMask').css({
                'display': 'block'
            });
            // 表格异步问题，延迟执行才有loading效果
            setTimeout(function () {
                GoalgoExecute.addTableRowFn(optRow, col, obj, row, addRow, rowspan);
            }, 1);
        },
        /**
         * 添加表格行执行
         * row 当前添加行的位置
         * col 表格列数
         * obj 按钮
         */
        addTableRowFn: (optRow, col, obj, row, addRow, rowspan) => {
            // console.log(approvalFormElementModels);
            // 1.1 修改合并数组行数（在新加行下的都加1）          
            let newMergeArr = [];
            //记录唯一标识数据
            let onlyArr = []
            let valueArr = []
            //是否是复制的唯一底表
            let copyData = false
            //表单唯一控件的值          
            let value = "";
            if (isClickOnly) {
                onlyPage.showDetailAndEdit(onlyEle, onlyId)
            }
            $.each(uuid, (i, t) => {
                for (let j in t) {
                    if (t[j] != undefined) {
                        onlyPage.tableDataInput(`.plugElementRow[data-uuid=${j}]`, t, j)
                    }
                }
            })
            $(tableMergeArr).each(function (t, mergeItem) {
                if (mergeItem.row >= row && mergeItem.row < addRow) {
                    let newMerge = {
                        row: mergeItem.row + rowspan,
                        col: mergeItem.col,
                        rowspan: mergeItem.rowspan,
                        colspan: mergeItem.colspan
                    }
                    newMergeArr.push(newMerge);
                }
                // 新加行之下的行重新设置行数
                if (mergeItem.row >= addRow) {
                    let newVal = mergeItem.row + rowspan
                    tableMergeArr[t].row = newVal;
                }
            });
            // 1.2 添加新重复行的合并信息
            $(newMergeArr).each(function (t, mergeItem) {
                tableMergeArr.push(mergeItem);
            });
            // 2.1 修改对应重复行数据
            $(resetRowArr).each(function (ret, retItem) {
                // 新加行之下的行重新设置行数
                let thisRow = parseInt(retItem.startRow)
                if (thisRow >= addRow) {
                    let newVal = thisRow + rowspan
                    resetRowArr[ret].startRow = newVal;
                }
            });
            // 2.2 添加对应重复行数据
            let rowObj = {
                startRow: addRow,
                rowspan: rowspan,
                type: 'del',
                parentRow: optRow
            }
            resetRowArr.push(rowObj);
            // 3 修改表格内嵌控件数据
            let tableElements = tablePlugInfo.tableElements || [];
            // let tableElementsSort = tableElements.sort(tdCompare('coord'));
            let newTdArr = [];

            $(tableElements).each(function (t, item) {
                let getrow = parseInt(item.coord.split(',')[0]);
                let getcol = parseInt(item.coord.split(',')[1]);
                let newcoord = (getrow + rowspan) + ',' + getcol;
                if (getrow >= row && getrow < rowspan + row) { //需要复制的数据部分
                    let getModel = item.formElementModel || {}
                    // 浅拷贝数据
                    let copyModel = JSON.parse(JSON.stringify(getModel));
                    let elementUuid = Math.uuid();
                    // 表格中是否有唯一控件
                    $.each(newArry, (index, item) => {
                        if (copyModel.uuId == item) {
                            value = $(`.plugElementRow[data-uuid=${copyModel.uuId}] .plugRowCont`).find("input,textarea,.members-in").attr("data-name");
                            valueArr.push(value)
                            copyData = true
                        }
                    })
                    // elementUuid为复制的id               
                    copyModel.uuId = elementUuid;
                    if (copyData) {
                        $.each(valueArr, (i, t) => {
                            copyObj[copyModel.uuId] = t
                        })
                        onlyArr.push(copyModel.uuId);
                        copyData = false;
                    }

                    if (copyModel.type != 'formula') { //是否是数值
                        copyModel.value = '';
                    }
                    if (copyModel.type == "attachment" && copyModel.fileTemplate == 1) { //附件模板重复行不复制控件也不复制上传的附件
                        copyModel = null;
                    }
                    let tdObj = {
                        colChild: item.colChild,
                        color: item.color,
                        coord: newcoord,
                        formElementModel: copyModel,
                        high: item.high,
                        id: item.id || '',
                        rowChild: item.rowChild,
                        wide: item.wide,
                        newadd: true
                    }
                    newTdArr.push(tdObj);
                    //新增重复行时，新增公式中相关连
                    if (getModel.type == 'numval' || getModel.type == 'formula') {
                        $.each(formulaInfo, (k, val) => {
                            $.each(val.variable, (m, vItem) => {
                                if (vItem.id == getModel.uuId && val.coord.split(",")[0] != vItem.coord.split(",")[0]) {
                                    let newAdd = Object.assign({}, vItem);
                                    newAdd.id = copyModel.uuId
                                    newAdd.coord = newcoord
                                    newAdd.sort = val.variable.length
                                    val.variable.push(newAdd)
                                    return false;
                                }
                            })
                        })
                    }
                }
                // 新加行之下的行重新设置行数
                if (getrow >= rowspan + row) {
                    tableElements[t].coord = newcoord;
                }
                // 修改公式控件中数值的coord
                let formulaModel = item.formElementModel || {}
                if (formulaModel.type == 'formula') {
                    let designFormulas = [];
                    if (formulaModel.designFormulas) {
                        designFormulas = JSON.parse(formulaModel.designFormulas) || []
                    }
                    $(designFormulas).each(function (f, fItem) {
                        let sortVariable = fItem.variable.sort(compare('sort'));
                        let newVariable = []
                        $(sortVariable).each(function (v, vItem) {
                            if (vItem.plugType == 'table') {
                                let varirow = parseInt(vItem.coord.split(',')[0]);
                                let varicol = parseInt(vItem.coord.split(',')[1]);
                                let newRow = varirow + rowspan;
                                let newVariCoord = newRow + ',' + varicol;
                                // 
                                if (varirow >= rowspan + row) {
                                    vItem.coord = newVariCoord;
                                }
                            }
                        })
                    })
                    formulaModel.designFormulas = JSON.stringify(designFormulas)
                }
            });
            let newTdSortArr = newTdArr.sort(tdCompare('coord'));
            //记录重复控件的uuid和tdid
            let repeatIdArr = []
            $(newTdSortArr).each(function (t, item) {
                let getModel = item.formElementModel || {}
                //如果是公式控件和数值控件，则暂存重复数据
                if (getModel.type == 'formula' || getModel.type == 'numval') {
                    repeatIdArr.push({
                        tdId: item.id,
                        uuid: getModel.uuId
                    })
                }
                // 如果是公式控件，修改其使用的数值控件中的id为新生成的id
                if (getModel.type == 'formula') {
                    let designFormulas = [];
                    if (getModel.designFormulas) {
                        designFormulas = JSON.parse(getModel.designFormulas) || []
                        designFormulas.formlaId = getModel.uuId;
                        designFormulas.coord = item.coord || '';
                        designFormulas.decimals = getModel.decimals || '';
                    }
                    $(designFormulas).each(function (f, fItem) {
                        let sortVariable = fItem.variable.sort(compare('sort'));
                        $(sortVariable).each(function (v, vItem) {
                            if (vItem.plugType == 'table') {
                                let varirow = parseInt(vItem.coord.split(',')[0]);
                                let varicol = parseInt(vItem.coord.split(',')[1]);
                                let newRow = varirow + rowspan;
                                let newVariCoord = newRow + ',' + varicol;
                                // 公式的数值控件跟公式控件同一复制区域
                                if (varirow >= row && varirow < rowspan + row) {
                                    vItem.coord = newVariCoord;
                                    // 确定数值控件在新加行数组中的下标，修改数值控件id为查到的uuId，对应完成
                                    let getI = (varirow - row) * col + varicol
                                    vItem.id = newTdSortArr[getI].formElementModel.uuId;
                                }
                                if ($(`.plugElementRow[data-uuid="${vItem.id}"]`).length == 0) {
                                    getModel.value = ''
                                }
                            }
                        })
                    })
                    getModel.designFormulas = JSON.stringify(designFormulas)
                    item.formElementModel.designFormulas = getModel.designFormulas
                    formulaInfo.unshift(designFormulas);
                }
                tableElements.push(item);
            });
            tablePlugInfo.tableElements = tableElements;
            // 4 行高
            let newAddHei = [];
            $(heightDataArr).each(function (t, hItem) {
                if (t >= row && t < addRow) {
                    newAddHei.push(hItem);
                }
            });
            // 新行高插入原数组
            for (let add = 0; add < newAddHei.length; add++) {
                let pos = row + add;
                heightDataArr.splice(pos, 0, newAddHei[add]);
            }
            resetRowBtn();
            formTableHot.updateSettings({
                mergeCells: tableMergeArr
            });
            if (OnlyElementUuid) {
                onlyPage.onlyUnClick()
                onlyPage.appendOnly(OnlyElementUuid)
            }
            if (isClickOnly) {
                onlyPage.showDetailAndEdit(onlyEle, onlyId)
            }
            newArry = onlyArr
            uuid.push(copyObj);
            $.each(uuid, (i, t) => {
                for (let j in t) {
                    if (t[j] != undefined) {
                        onlyPage.tableDataInput(`.plugElementRow[data-uuid=${j}]`, t, j)
                    }
                }
            })
        },
        /**
         * 删除表格行
         * row 当前添加行的位置
         * col 表格列数
         * obj 按钮
         */
        delTableRow: (row, col, obj) => {
            // formulaInfo = [];
            let rowspan = parseInt($(obj).parents('.tableRowResetBtn').attr('data-rowspan')) || 1;
            if (rowspan && rowspan > 1) {
                formTableHot.alter('remove_row', row, rowspan); // 移除索引为row的行
            } else {
                formTableHot.alter('remove_row', row); // 移除索引为row的行
                rowspan = 1;
            }
            $('.myLoadingMask').css({
                'display': 'block'
            });
            setTimeout(function () {
                GoalgoExecute.delTableRowFn(row, col, obj, rowspan);
            }, 1);
            if ($('.tableRowResetBox .resetRowDelBtnTxt').length < 2) {
                uuid = [];
                newArry = orginArr;
            }
        },
        /**
         * 删除表格行执行
         * row 当前添加行的位置
         * col 表格列数
         * obj 按钮
         */
        delTableRowFn: (row, col, obj, rowspan) => {
            if (isClickOnly) {
                onlyPage.showDetailAndEdit(onlyEle, onlyId)
            }

            $.each(uuid, (i, t) => {
                for (let j in t) {
                    if (t[j] != undefined) {
                        onlyPage.tableDataInput(`.plugElementRow[data-uuid=${j}]`, t, j)
                    }

                }
            })
            // 1.1 修改合并数组行数（在删除行下的都减）
            for (let t = 0; t < tableMergeArr.length; t++) {
                let mergeItem = tableMergeArr[t];
                if (mergeItem.row >= row && mergeItem.row < row + rowspan) {
                    tableMergeArr.splice(t, 1);
                    t--;
                }
            }
            $(tableMergeArr).each(function (t, mergeItem) {
                //1.2 修改合并数组行数（在删除行下的都减rowspan）
                if (mergeItem.row >= row + rowspan) {
                    let newVal = mergeItem.row - rowspan;
                    tableMergeArr[t].row = newVal;
                }
            });
            // console.log(tableMergeArr)
            // 2.1 移除对应重复行数据
            $(resetRowArr).each(function (ret, retItem) {
                if (retItem.startRow == row && retItem.rowspan == rowspan && retItem.type == 'del') {
                    resetRowArr.splice(ret, 1);
                    return false;
                }
            });
            $(resetRowArr).each(function (ret, retItem) {
                //2.2 删除行之下的行重新设置行数
                let thisRow = parseInt(retItem.startRow)
                if (thisRow >= row + rowspan) {
                    let newVal = thisRow - rowspan
                    resetRowArr[ret].startRow = newVal;
                }
            });
            // 3.1 移除表格内控件对应重复行数据
            let tableElements = tablePlugInfo.tableElements || [];
            for (let t = 0; t < tableElements.length; t++) {
                let item = tableElements[t];
                let getrow = parseInt(item.coord.split(',')[0]);
                if (getrow >= row && getrow < row + rowspan) {
                    // 删除公式数据
                    let getModel = tableElements[t].formElementModel || {}
                    if (getModel.type == 'formula') {
                        let getFormula = JSON.parse(getModel.designFormulas);
                        for (let f = 0; f < formulaInfo.length; f++) {
                            // 移除对应公式
                            if (formulaInfo[f].formlaId == getFormula.formlaId) {
                                formulaInfo.splice(f, 1);
                                f--;
                            }
                        }
                    }
                    //删除重复行时去除公式中相关连得条件，并触发重新赋值
                    if (getModel.type == 'numval' || getModel.type == 'formula') {
                        $.each(formulaInfo, (k, val) => {
                            $.each(val.variable, (m, vItem) => {
                                if (vItem.id == getModel.uuId && val.coord.split(",")[0] != vItem.coord.split(",")[0]) {
                                    val.variable.splice(m, 1)
                                    return false
                                }
                            })
                        })
                    }
                    tableElements.splice(t, 1);
                    t--;
                }
            }
            $(tableElements).each(function (t, item) {
                //3.2 删除行之下的行重新设置行数
                let getrow = parseInt(item.coord.split(',')[0]);
                let getcol = parseInt(item.coord.split(',')[1]);
                let newcoord = (getrow - rowspan) + ',' + getcol;
                if (getrow >= row + rowspan) {
                    tableElements[t].coord = newcoord;
                }
                // 修改公式控件中数值的coord
                let formulaModel = item.formElementModel || {}
                if (formulaModel.type == 'formula') {
                    let designFormulas = [];
                    if (formulaModel.designFormulas) {
                        designFormulas = JSON.parse(formulaModel.designFormulas) || []
                    }
                    $(designFormulas).each(function (f, fItem) {
                        let sortVariable = fItem.variable.sort(compare('sort'));
                        $(sortVariable).each(function (v, vItem) {
                            if (vItem.plugType == 'table') {
                                let varirow = parseInt(vItem.coord.split(',')[0]);
                                let varicol = parseInt(vItem.coord.split(',')[1]);
                                let newRow = varirow - rowspan;
                                let newVariCoord = newRow + ',' + varicol;
                                // 
                                if (varirow >= rowspan + row) {
                                    vItem.coord = newVariCoord;
                                }
                            }
                        })
                    })
                    formulaModel.designFormulas = JSON.stringify(designFormulas)
                }
            });
            // 4 删除行高
            heightDataArr.splice(row, rowspan);
            resetRowBtn();
            // console.log(tableElements)
            formTableHot.updateSettings({
                mergeCells: tableMergeArr
            });
            if (OnlyElementUuid) {
                onlyPage.onlyUnClick()
                onlyPage.appendOnly(OnlyElementUuid)
            }
            console.log(isClickOnly,onlyEle,onlyId,baseFromParam)
            if (isClickOnly) {
                onlyPage.showDetailAndEdit(onlyEle, onlyId)
            }
            $.each(uuid, (i, t) => {
                for (let j in t) {
                    if (t[j] != undefined) {
                        onlyPage.tableDataInput(`.plugElementRow[data-uuid=${j}]`, t, j)
                    }

                }
            })
        },
        // 自动生成时间
        formatDateTimeAuto: (data, type) => {
            formatDateTime(data, type)
        },
        /***
         * 打印审批详情
         * @param dataDom 数据容器
         * @param ifrName 隐藏iframe
         * @param areaDom
         */
        printFn: (dataDom, ifrName, areaDom) => {
            $(dataDom).find("input").each(function (i, item) {
                let _val = $(item).val()
                $(item).attr('value', _val)
            })
            $(dataDom).find("textarea ").each(function (i, item) {
                let _val = $(item).val()
                $(item).html(_val)
            })
            $(dataDom).find("select").each(function (i, item) {
                let _idx = $(item).find("option:selected").attr('data-index')
                $(item).find('option[data-index="' + _idx + '"]').attr('selected', true)
            })
            window.frames[ifrName].postMessage($(dataDom).prop("outerHTML"), '*');
            // data-ptdom 将样式依赖的父节点传递过去
            $('#' + ifrName).contents().find(".saveDataAreaDom").text(areaDom);
            $('#' + ifrName).contents().find(".saveStyPtDom").text('#executePrint');
            setTimeout(() => {
                let printbtn = $('#' + ifrName).contents().find(".print-btn"); //ifame子页面打印按钮
                printbtn.click() //触发子页打印事件
            }, 10);
        },
        // 限制整数位最多12位
        interNum: (obj, isTrans) => {
            if (isTrans == 1) {
                let _val = $(obj).val()
                let _floatNum = ''
                if (_val.indexOf('.') != -1) {
                    _floatNum = _val.split('.')[1]
                    _val = _val.split('.')[0]
                }
                let reg = /[0-9]{13}/
                var re = new RegExp(reg);
                if (re.test(_val)) {
                    toastr["error"]('金额已超出最大转换值', "信息提示")
                    if (_floatNum != '') {
                        _floatNum = '.' + _floatNum
                    }
                    _val = _val.substring(0, 12) + _floatNum
                    $(obj).val(_val)
                }
            }
        },
       
        setPostAuthInfo: (setInfo) => {
            postAuthInfo = setInfo;
            info = setInfo
        },
        setCallBackUrl: (info) => {
            callBackUrl = info;
        },
        formulaCount: () => {
            let oldTxt = ''
            // 查找所有公式
            $(formulaInfo).each(function (f, fItem) {
                // 变量是否是公式引用的
                let isUser = false;
                // 公式使用的变量是否有未填写的
                let isNullVarNum = 0;
                let formulaVal = 0;
                let totalSum = 0;
                let totalArr = [];
                let productVal = 1
                $('.tablePlugTmpBox').html(fItem.formulaHtml || '');
                let sortVariable = []
                if (fItem.variable) {
                    sortVariable = fItem.variable.sort(compare('sort'));
                }
                let variableN = 0
                // 查找公式控件使用的数值控件并求总值
                $(sortVariable).each(function (v, vItem) {
                    // 判断关联底表变量是否是公式变量
                    $.each(newArry, (u, uuid) => {
                        if (uuid == vItem.id) {
                            variableN++
                            return false;
                        }
                    })
                })
                if (variableN == sortVariable.length) {
                    $(sortVariable).each(function (v, vItem) {
                        // 确认此数值控件有被公式控件引用
                        // if (vItem.id == dom.attr('data-uuid')) {
                        isUser = true;
                        // }
                        // .approvale-ul>
                        let thisValSour = parseFloat($(`.plugElementRow[data-uuid="${vItem.id}"]`).find('.numval_plug').val()) || parseFloat($(`.plugElementRow[data-uuid="${vItem.id}"]`).find('.formula_plug').attr('data-oldVal'));
                        let thisVal = parseFloat(thisValSour) || 0;
                        totalSum += thisVal;
                        productVal = parseFloat(productVal) * parseFloat(thisVal);
                        totalArr.push(thisVal)
                        if (fItem.formulaMode == 6) { //自定义公式
                            if (thisVal < 0) { //防止出现负号
                                thisVal = '(' + thisVal + ')'
                            }
                            $($('.tablePlugTmpBox .countValItem')[v]).html(thisVal);
                        }
                        // 有变量未填写
                        if (thisValSour !== 0 && !thisValSour) {
                            isNullVarNum++;
                        }
                    })

                }
                // 此数值控件被此公式使用则将值填充到公式控件
                if (isUser) {
                    // 0求和 1平均值 2最大值 3最小值 4乘积 5计数 6自定义
                    if (fItem.formulaMode == 0) {
                        formulaVal = totalSum;
                    } else if (fItem.formulaMode == 1) {
                        formulaVal = totalSum / fItem.variable.length;
                    } else if (fItem.formulaMode == 2) {
                        formulaVal = Math.max.apply(null, totalArr);
                    } else if (fItem.formulaMode == 3) {
                        formulaVal = Math.min.apply(null, totalArr);
                    } else if (fItem.formulaMode == 4) {
                        formulaVal = productVal;
                    } else if (fItem.formulaMode == 5) {
                        if (fItem.countChild) { //有内嵌公式
                            formulaVal = 1;
                        } else {
                            formulaVal = fItem.variable.length;
                        }
                    } else if (fItem.formulaMode == 6) {

                        let resultTxt = $('.tablePlugTmpBox').text();

                        formulaVal = eval(resultTxt)
                        if (!formulaVal || formulaVal == Infinity) {
                            formulaVal = 0;
                        }
                    }
                    let dom = $(`.plugElementRow[data-uuid="${fItem.formlaId}"]`)
                    let isTrans = dom.attr('data-numberTransform')

                    GoalgoExecute.interNum(dom.find('.numval_plug'), isTrans)
                    if (isTrans == 1) {
                        let fix = dom.attr('data-decimals')
                        $(`.plugElementRow[data-uuid="${fItem.formlaId}"]>.plugRowCont`).find('.formula_plug').attr('data-oldVal', transRmb.newToFix(formulaVal, fix))
                        formulaVal = transRmb.init(formulaVal, fix)
                        oldTxt = formulaVal != undefined ? formulaVal : oldTxt
                    } else {
                        let resultNum = parseFloat(formulaVal).toFixed(fItem.decimals);
                        formulaVal = MyCommon.thousands(resultNum)
                        oldTxt = formulaVal
                        $(`.plugElementRow[data-uuid="${fItem.formlaId}"]>.plugRowCont`).find('.formula_plug').attr('data-oldVal', formulaVal)
                    }
                    $(`.plugElementRow[data-uuid="${fItem.formlaId}"]>.plugRowCont`).find('.formula_plug').val(oldTxt)
                }
            });
        },
       
    }
}()