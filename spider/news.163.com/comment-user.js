/**
 * Created by dou on 2017/3/17.
 */

// 还需要完善loop，end，done，不能检验loop终止，不能自动设置爬取过新闻ishandle为1
var grab = require('./../grab.js');
spider = grab.newSpider();

spider
    .init(function () {
        spider.clearComments();
    })
    .getOneUndisposedNews()
    .loop(function (undisposedNews, loopTime) {
        return {
            coding: '',
            url: "http://comment.news.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/"
                 + undisposedNews.id + "/comments/newList?offset=" + loopTime*30 + "&limit=30",
            type: 'comments',
        }
    })
    .proceed(function ($, html) {
        var data = JSON.parse(html);
        // 如果已经没有更多数据，则结束loop
        if (!data.comments) {
            spider.done();
            return;
        }
        var commentIds = Object.keys(data.comments);
        var users = [];
        var comments = [];
        for (var i = 0; i < commentIds.length; i++) {
            var info = data.comments[commentIds[i]];
            var comment = {
                id: info.commentId + '',
                user_id: info.user.userId + '',
                news_id: spider.undisposedNews.id,
                date: info.createTime.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)[0],
                time: info.createTime.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)[0],
                content: info.content,
                vote: info.vote ? info.vote : 0,
                against: info.against ? info.against : 0,
            };
            var user = {
                id: info.user.userId + '',
                nickname: info.user.nickname ? info.user.nickname + '' : '',
                location: info.user.location ? info.user.location + '' : '',
                portrait_url: info.user.avatar ? info.user.avatar + '' : '',
            }
            comments.push(comment);
            users.push(user);

        }
        spider.insert('comments', comments);
        spider.insert('users', users);
        spider.loop();
    })
    .end(function () {
        spider.handleNewsDone();
    })
