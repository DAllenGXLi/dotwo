var HOST = 'http://192.168.10.111:3001';

/************************************************************************************/
// description: 调用此接口可直接在列表添加新闻内容，初始页面的时候会调用一次
// count为请求数量， offset为请求起点（偏置值）
// 该接口会通过ajax得到数据，并调用getANewsHtml以动态生成所需要添加的html代码
/************************************************************************************/
var displayNewsList = function (count, offset) {
    // var ajax = getAjaxObject();
    $.get(HOST + "/api/get_news_list?count=" + count + "&begin=" + offset, function(d, status){
        if (status == 'success') {
            var data = JSON.parse(d);
            for (var i=0; i<data.length; i++) {
                var newsHtml = getANewsHtml(data[i]);
                $('#accordion').append(newsHtml);
                // 设置监听
                $('#collapsed_' + data[i].id).click(function () {
                    var id = $(this).attr('id').substring(10);
                    if ($('#echarts_emotion_' + id).attr('loaded') == "true") {
                        return;
                    }
                    var happy = Number($('#echarts_emotion_' + id).attr('happy'));
                    var sad = Number($('#echarts_emotion_' + id).attr('sad'));
                    var angry = Number($('#echarts_emotion_' + id).attr('angry'));
                    var fear = Number($('#echarts_emotion_' + id).attr('fear'));
                    drawEmotionDistribution(id, happy, sad, angry, fear);
                    $('#echarts_emotion_' + id).attr('loaded', "true");
                });
            }
        }
    });
};

/************************************************************************************/
// description: 生成html代码
// data为得到的新闻json数据
/************************************************************************************/
var getANewsHtml = function (data) {
    var summary = (data.summary ? data.summary : '');
    var imgs = JSON.parse(data.imgs_url);
    var imgs_html = '';
    if (imgs) {
        for (var i = 0; i < imgs.length && i < 3; i++) {
            imgs_html += '<img class="news_img" src="' + imgs[i] + '" alt="">';
        }
    }

    var html = '<div class="panel panel-default">\
                <div class="panel-heading" role="tab" id="heading_' + data.id + '">\
                    <h4 class="panel-title">\
                    <div class="media">\
                    <div class="media-body">\
                    <div class="origin">\
                    <img class="origin_img" src="../static/images/wangyi.jpeg">\
                    <a class="remark" href="' + data.url + '">来源: ' + data.origin + '</a>\
                </div>\
                <!-- 触发详情页 -->\
                <a class="collapsed" id="collapsed_' + data.id + '" role="button" data-toggle="collapse"\
                    data-parent="#accordion" href="#collapse_' + data.id + '" aria-controls="collapse_' + data.id + '"\
                    aria-expanded="false">\
                        <h5 class="media-heading">\
                    ' + data.title + '\
                </h5>\
                <p class="remark no_space">\
                    <span style="float: left;" class="date">日期: ' + data.date + '</span>\
                    </p>\
                    <p class="news_summary">' + summary + '</p>\
                    ' + imgs_html + '\
                </div>\
                    </a>\
                    <!-- end of 出发详情页 -->\
                </div>\
                </h4>\
                </div>\
                <!-- 下拉详情页 -->\
                <div id="collapse_' + data.id + '" news_id = "' + data.id + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_' + data.id + '">\
                     <ul class="nav nav-tabs collapse_nav" role="tablist">\
                <li role="presentation" class="active"><a href="#emotion" aria-controls="emotion" role="tab" data-toggle="tab">情感分布</a></li>\
                <li role="presentation"><a href="#emotion-locaton" aria-controls="emotion-locaton" role="tab" data-toggle="tab">情感-地域</a></li>\
                <li role="presentation"><a href="#localtion" aria-controls="localtion" role="tab" data-toggle="tab">地域分布</a></li>\
                </ul>\
                <!-- Tab panes -->\
                 <div class="tab-content">\
                    <div role="tabpanel" class="tab-pane active" id="emotion">\
                        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->\
                        <div loaded="false" id="echarts_emotion_' + data.id + '" happy="'+data.happy+'" sad="'+data.sad+'" angry="'+data.angry+'" fear="'+data.fear+'"></div>\
                    </div>\
                    <div role="tabpanel" class="tab-pane" id="emotion-locaton">\
                        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->\
                        <div id="echarts_2_"' + data.id + '></div>\
                    </div>\
                    <div role="tabpanel" class="tab-pane" id="localtion">\
                        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->\
                        <div id="echarts_3_"' + data.id + '></div>\
                    </div>\
            <!-- end of Tab panes -->\
            </div>\
               <!-- end of 下拉详情页 -->\
            </div>\
            </div>\
            </div>\
            ';
    return html;
};

/************************************************************************************/
// description: 调用此接口以绘制情感分布图
/************************************************************************************/
var drawEmotionDistribution = function (id, happy, sad, angry, fear) {
    $('#echarts_emotion_' + id).attr("style", "height:300px; width:" + document.body.clientWidth/1.05 + "px");
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echarts_emotion_' + id));
    // myChart.showLoading();
    // myChart.hideLoading();
    option = {
        title : {
            text: '情感分布',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['喜悦','悲伤','恐惧','愤怒']
        },
        series : [
            {
                name: '评论数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:happy, name:'喜悦'},
                    {value:sad, name:'悲伤'},
                    {value:fear, name:'恐惧'},
                    {value:angry, name:'愤怒'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
};

/************************************************************************************/
// description: 绘制地域分布图
/************************************************************************************/
var drawEmotionLocation = function (id) {
    $('#echarts_emotion_' + id).attr("style", "height:300px; width:" + document.body.clientWidth/1.1 + "px");
    var myChart = echarts.init(document.getElementById('echarts_emotion_' + id));
    var option = {};
    myChart.setOption(option);
};




/************************************************************************************/
// description: 入口
/************************************************************************************/
var offset = 0;
var loadCount = 10;
displayNewsList(loadCount, offset);
offset += loadCount;
// 底部加载代码
var stop=true;
$(window).scroll(function(){
    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if($(document).height() <= totalheight){
        if(stop==true){
            stop=false;
            displayNewsList(loadCount, offset);
            offset += loadCount;
            stop = true;
        }
    }
});