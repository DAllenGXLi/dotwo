var http = require('http');
var cheerio = require('cheerio');
var mysql = require('mysql');
var request = require('request');
var iconv = require("iconv-lite");

var databaseInfo = {
    host: 'localhost',
    port: 3306,
    database: 'dotwo',
    user: 'dou',
    password: '317416',
    multipleStatements: true,
};
connection = mysql.createConnection(databaseInfo);

connection.connect(function (err, result) {
    if (err) {
        throw err;
    } else {
        console.log("数据库连接成功");
    }
});

// 抓取图片url与summay
connection.query('select id, url from newslist where deep_grap=0', function (err, result) {
    if (err) {
        console.log(err);
    } else {
        for (var i = 0; i < result.length; i++) {
            request({url:result[i].url,
                    encoding: null  // 关键代码
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = iconv.decode(body, 'gb2312')
                    $ = cheerio.load(body, {decodeEntities: false});
                    var $list = $('.post_body .f_center img');
                    var src = [];
                    var count = 0;
                    $list.each(function (index, element) {
                        // 最多只拿10张照片
                        if (count++ < 10) {
                            src.push($(this).attr('src'));
                        }
                    });
                    var summary = $('meta[name=description]').attr('content');
                    console.log('summary: ' + summary);
                    var newId =  response.request.uri.path.match(/[^\/]+\.html/)[0];
                    newId = newId.slice(0, newId.length-5);
                    console.log("newId;" + newId + "imgsUrl: " + src);
                    connection.query("update newslist set imgs_url = '" + JSON.stringify(src) + "'  where id = '" + newId + "'");
                    connection.query("update newslist set summary='" + summary + "' where id = '" + newId + "'");
                    connection.query("update newslist set deep_grap=1 where id = '" + newId + "'");
                }
            });
        }
    }
});

// connection.end(function (err) {
//     if (err) {
//         throw err;
//     } else {
//         console.log('数据库关闭成功');
//     }
// });

