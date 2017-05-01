var HOST = 'http://192.168.10.111:3001';

var displayNewsList = function (count, offset) {
    // var ajax = getAjaxObject();
    $.get(HOST + "/api/get_news_list?count=" + count + "&begin=" + offset, function(d, status){
        if (status == 'success') {
            var data = JSON.parse(d);
            for (var i=0; i<data.length; i++) {
                var newsHtml = getANewsHtml(data[i]);
                $('#accordion').append(newsHtml);
            }
        }
    });
};

var getANewsHtml = function (data) {
    var summary = (data.summary ? data.summary : '');
    var imgs = JSON.parse(data.imgs_url);
    var imgs_html = '';
    if (imgs) {
        for (var i = 0; i < imgs.length && i < 3; i++) {
            imgs_html += '<img class="news_img" src="' + imgs[i] + '" alt="">';
        }
    }
    console.log(imgs_html);
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
                <a class="collapsed" id="' + data.id + '" role="button" data-toggle="collapse"\
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
                <div id="collapse_' + data.id + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_' + data.id + '">\
                    <div class="panel-body sub_panel">\
                    <div class="panel panel-primary">\
                    <div class="panel-heading">社会效应</div>\
                    <div class="panel-body no_space">\
                    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->\
                <div id="echarts_main" style="height:300px;"></div>\
            </div>\
            </div>\
            </div>\
            </div>\
            </div>\
            ';
    return html;
};

var drawEmotionDistribution = function (id) {
    // 路径配置
    require.config({
        paths: {
            echarts: '../static/echarts'
        }
    });
    // 使用
    require(
        [
            'echarts',
            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('echarts_main'));

            var option = {
                tooltip: {
                    show: true
                },
                legend: {
                    data: ['情感分布']
                },
                xAxis: [
                    {
                        type: 'category',
                    },
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        "name": "情感分布",
                        "type": "bar",
                        "data": [229, 1203, 3091, 872]
                    }
                ]
            };
            myChart.setOption(option);
        }
    );
}


// 为echarts对象加载数据 
// $('#collapseOneTrigger').click(function () {
//     setTimeout(drawEmotionDistribution, 100);
// });

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