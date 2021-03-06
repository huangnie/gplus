var bg = chrome.extension.getBackgroundPage();
var req = bg.req;
var user = bg.user;
var config = bg.config;
var host = bg.HOST;
var course_id = 0;
function init(){

    $('#course_list_show').click(function(){
        $('#user_without_qq_list_show').removeClass('active');
        $('#user_without_qq_list_show').addClass('unactive');
        $('#import_qq_user_show').removeClass('active');
        $('#import_qq_user_show').addClass('unactive');
        $(this).removeClass('unactive');
        $(this).addClass('active');

        $('#user').hide();
        $('#import_qq_user').hide();
        $('#course').show();
    });

    $('#user_without_qq_list_show').click(function(){
        $('#course_list_show').removeClass('active');
        $('#course_list_show').addClass('unactive');
        $('#import_qq_user_show').removeClass('active');
        $('#import_qq_user_show').addClass('unactive');
        $(this).removeClass('unactive');
        $(this).addClass('active');
        $('#course').hide();
        $('#import_qq_user').hide();
        $('#user_list').html('正在加载 ...');
        $('#user').show();
        user.getUserWithoutQQ(function(result){
            if(result.status == 1) {
                var str = '';
                var users  = result.content;
                for(var i in users){
                    str += users[i]['EMAIL'] + "("+ users[i]['USER_NAME'] + ")";
                }
                $('#user_list').html(str);
            }else{
                $('#user_list').html('暂无，可能是培训&考试系统不是最新！');
            }
        });
    });


    $('#import_qq_user_show').click(function(){

        $('#course_list_show').removeClass('active');
        $('#course_list_show').addClass('unactive');
        $('#user_without_qq_list_show').removeClass('active');
        $('#user_without_qq_list_show').addClass('unactive');

        $(this).removeClass('unactive');
        $(this).addClass('active');

        $('#user').hide();
        $('#course').hide();
        $('#import_qq_user').show();
    });


    $("#pick_user").click(function(){
        req.pickUser();
    });

    $("#fill_receive_list_btn").click(function(){
        if(typeof course_id == 'undefined')
            $("#tip").html("请选择课程");
        else
            req.fillReceiveList(course_id,function(tip,member){
                tip += typeof member == typeof ['1'] && member.length>0 ? member.join(';') : '';
                $("#tip").html( tip );
            });  //
    });

    $('#qq_user_template').click(function(){

        var form=$("<form>");                                   //定义一个form表单
        form.attr("style","display:none");
        form.attr("target","");
        form.attr("method","post");
        form.attr("action",config.URI.TEMPLATE_BDCT_EXCEL_PATH);
        $("#container_for_form").html(form);             //将表单放置在web中
        form.submit();//表单提交
    });

    $('#import_submit').click(function(){

        var files = $('input[name="excel_file"]').prop('files');//获取到文件列表

        if(files.length == 0){
            alert('请选择文件');
            return;
        }else{
            var file = files[0];

            var arr = file.name.split('.');
            var ext = arr[arr.length-1];
            if(ext != 'xls' && ext !=='xlsx'){
                alert('请选择Excel文件');
                return;
            }

            var reader = new FileReader();//新建一个FileReader
            //reader.readAsArrayBuffer( files[0]);//读取文件
            reader.readAsDataURL( files[0] );
            //reader.readAsText( files[0], "UTF-8");//读取文件
            //reader.readAsBinaryString( files[0]);//读取文件
            reader.onload = function(evt){ //读取完文件之后会回来这里
                var fileString = evt.target.result;
                //var fileString = reader.result;
                user.addByExcel(fileString, ext, function(msg){
                    $('#tip').html(msg);
                })
            }
        }
        return;
    });

    req.getCourse(
        function(unend_course){
            if(unend_course.length==0){
                return ;
            }
            var select = 'checked="checked"'; //默认第一个被选中
            var course_table = "<table>";
            course_table += "<tr><td> &nbsp;</td><td> 课 程</td><td>学 分</td><td>讲 师</td><td>地 点</td><td>开始时间</td><td>结束时间</td></tr>";
            for (var index in unend_course){
                var course = unend_course[index];
                if(!!select)
                    course_id = course['ID'];

                course_table += '<tr><td><input  type="radio" name="course_select"  '+select+'" class="course_select" id="'+ course['ID']+'"></td>';
                course_table += '<td>'+course['NAME']+'</td><td>'+course['CREDIT']+'</td><td>'+course['COACH']+'</td>';
                course_table += '<td>'+course['ADRR']+'</td><td>'+course['START_DATE']+'</td><td>'+course['END_DATE']+'</td></tr>';
                select = ''; //默认第一个被选中
            }
            course_table += '</table>';
            $("#course_list").html(course_table);
            $("#fill_receive_list_btn").removeClass('hide');
            $('.course_select').click(function(){
                $("#tip").html("");
                course_id =  $(this).attr('id')
            });

        }
    );
}

window.onload = init;



