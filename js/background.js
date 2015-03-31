// 配置 都需要绑定 host
var HOST = 'http://local.admin.train.hr.37wan.com'; //本地
//var HOST = 'http://test_hr.admin.37.com';   //测试机
//var HOST = 'http://admin.train.hr.37wan.com'; //生产机
window.config = {
    URI:{
        SELECT_COURSE_PATH: HOST + '/api/train/all_train_ing_course.php',
        SELECT_COURSE_MEMBER_PATH: HOST +  '/api/train/participants_of_course.php',
        SELECT_USER_WITHOUT_QQ_PATH: HOST +  '/api/train/getUser.php',
        UPDATE_BDCT_MEMBER_PATH: HOST +  '/api/train/updateUserForBDCT.php',
        TEMPLATE_BDCT_EXCEL_PATH: HOST  + '/template/xls/qq_user.xls'
    }
};

// 发消息
var sendMsg = function(data, callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
            if(typeof callback == 'function') callback(response);
        });
    });
}

var req = {
    getCourse:function(setCourseList){
        $.getJSON(config.URI.SELECT_COURSE_PATH)
            .success(function(resp){
                var unend_course = resp.unend_course;
                setCourseList(unend_course);
            })
            .error(function() {  console.log("net_error"); })
            .complete(function() { });
    },

    fillReceiveList:function(course_id,showTip){

        $.getJSON(config.URI.SELECT_COURSE_MEMBER_PATH + "?course_id="+course_id)
            .success(function(resp) {
                var users = resp.content;
                var users_without_qq = new Array();
                var lis = new Array();
                for(var i in users){
                    if(users[i]['BDCT_AHTML'])
                        lis.push(users[i]['BDCT_AHTML']);
                    else
                        users_without_qq.push(users[i]['EMAIL']+"("+ users[i]['USER_NAME'] +")");
                }

                if(users_without_qq.length>0){
                    showTip('操作失败，请检查未匹配的名单: <br>',users_without_qq);
                    var data = { status:0, msg: "fillReceiveList_failed", content:'操作失败，请检查未匹配的名单' }; //
                }
                else{
                    showTip('操作成功');
                    var data = { status:1, msg: "fillReceiveList", content:lis };
                }

                sendMsg(data,function(response){ });
            })
            .error(function() {
                var data = { status:0, msg: "fillReceiveList_failed", content:'net_error：'+config.URI.SELECT_COURSE_MEMBER_PATH + "?course_id="+course_id };
                sendMsg(data,function(response){ });
            })
            .complete(function() { });
    },

    pickUser:function(){
        var data = {status:1, msg: "picUser", content:''};
        sendMsg(data,function(response){
            user.add(response.content, sendMsg);
        });
    }
}

var user = {

    add:function(content,callback){
        $.post(config.URI.UPDATE_BDCT_MEMBER_PATH,{type:'arr',content:content},'json')
            .success(function(resp) {
                resp = JSON.parse(resp);
                var data = {status:1, msg: "addUser_over", content:resp.msg };
                if(typeof callback == 'function') callback(data);
            })
            .error(function() {
                var data = {status:0, msg: "addUser_over", content:'failed for net_error'};
                if(typeof callback == 'function') callback(data);
            })
            .complete(function() {

            });
    },

    addByExcel:function(content, ext, callback){
        $.post(config.URI.UPDATE_BDCT_MEMBER_PATH,{type:'excel_base64',content: content},'json')
            .success(function(resp) {
                //resp = JSON.parse(resp);
                if(typeof callback == 'function') callback(resp);
            })
            .error(function() {
                if(typeof callback == 'function') callback('failed for net_error');
            })
            .complete(function() {

            });
    },

    getUserWithoutQQ:function(callback){
        $.getJSON(config.URI.SELECT_USER_WITHOUT_QQ_PATH)
            .success(function(resp) {
                if(typeof callback == 'function') callback(resp);
            })
            .error(function() {
                var data = {status:0, msg: "访问失败", content:'net_error'};
                if(typeof callback == 'function') callback(data);
            })
            .complete(function() {

            });
    }

}
