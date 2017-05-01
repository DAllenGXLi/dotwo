/**
 * Created by dou on 2017/3/16.
 */

var grab = require('./../grab.js');
var model = require('./../model.js');

spider = grab.newSpider();

spider
    .init()
    .begin({
        coding: 'gbk',
        url: "http://news.163.com/special/0001386F/rank_whole.html",
        type: 'newslist',
    })
    .proceed(function ($, html) {
        var $list = $('.area-half.right td');
        $list.each(function (index, element) {
            // 找到链接元素
            var $link = $(this).find('a');
            if (!$link.length) {
                return;
            }
            var href = $link.attr('href');
            var title = $link.text();
            // 获取新闻id
            var newId =  href.match(/[^\/]+\.html/)[0];
            newId = newId.slice(0, newId.length-5);
            // 如果不是常规文本新闻，抛弃数据
            if (newId[0] != 'C') {
                return;
            }
            // 获取格式化时间
            var date = new Date();
            var formateDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +date.getDate();
            // 格式化数据
            prey = {
                id: newId,
                title: title,
                url: href,
                date: formateDate,
                origin: "网易新闻",
            }
            // 添加到spider.data
            spider.addData(prey);
        });
        spider.done();
    })
    .end(function (type, data) {
        // data必须为数组
        spider.insert(type, data);
    });