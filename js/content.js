// 收到消息
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var msg = sender.tab ?"here is content, receive msg from a bg script:" + sender.tab.url :"from the bg extension";

        if (request.msg == "fillReceiveList"){
            if(request.status==1){
                var a_Arr = request.content;
                var resultSelMembers = $("#resultSelMembers");

                var str = '';
                resultSelMembers.html(str);
                for(var i in a_Arr)
                    str += '<li>' + a_Arr[i] + '</li>';
                resultSelMembers.html(str);

                var data = {status:1, msg:'fillReceiveList_success', content:'操作成功'};
                //console.log(data);
                sendResponse(data);
            }
        }else if(request.msg == 'picUser'){
            var users = new Array();
            var  arr = $("#resultSelMembers").children('li');
            if(arr.length==0){
                alert('请在企业QQ中选择（添加）用户');
                return;
            }else{
                for(var i=0; i<arr.length;i++) {
                    var a_html = $(arr[i]).html();
                    var a = $(a_html);
                    var qq = a.attr('data');
                    var icon = a.attr('data-icon');  // 通过这个识别性别
                    var sex = icon == 'Tc' ?  0 : 1;    // Tc 标识男  Tw 标识女
                    var name = a.attr('name');
                    var lkuohao = name.indexOf('(');
                    var rkuohao = name.indexOf(')');
                    var pinyin = name.slice(0,lkuohao);
                    var name = name.slice(lkuohao+1,rkuohao);
                    users.push({name:name,pinyin:pinyin,sex:sex,qq:qq,a_html:a_html});
                }
                var data = {status:1, msg:'addUser_over', content:users};
                //console.log(users);
                sendResponse(data);

            }

        }else if(request.msg == 'addUser_over'){
            console.log(request);
            alert(request.content);
        }
    });

var button = $("#mybutton");
if(button.hasOwnProperty('addEventListener')){
    button.addEventListener("click", function()  {
        var data = {status:1,msg: "hello",content:''};
        // 发送消息
        chrome.runtime.sendMessage(data, function(response) {
            console.log(response.content);
            alert('fg 发送消息后：'+response.content);
        });
    }, false);
}