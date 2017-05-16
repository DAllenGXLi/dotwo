/**
 * Created by dou on 2017/3/15.
 */

var http = require('http');
var iconv = require("iconv-lite");
var cheerio = require('cheerio');
var EventEmitter = require('events').EventEmitter;
var model = require('./model.js');

var databaseInfo = {
    host: 'localhost',
    port: 3306,
    database: 'dotwo',
    user: 'dou',
    password: '317416',
    multipleStatements: true,
};
var mover = model.newMover(databaseInfo);

var grab = {

    // 此函数产生一个spider
    newSpider: function () {
        // 继承事件机制
        var spider = new EventEmitter();

        spider.init = function (callback) {
            spider.undisposedNews = {};
            spider.loopTime = 0;
            mover.connection.connect(function (err, result) {
              if (err) {
                  throw err;
              } else {
                  console.log("数据库连接成功");
              }
            });
            if (callback) {
                callback();
            }
            return spider;
        };

        // spider.preproceed = function (callback) {
        //     callback();
        //     return spider;
        // }

        // 循环爬取，每次循环会自动调用spider.begin
        // 回掉函数需要返回spider.begin所需要的info信息
        spider.loop = function (callback) {
            if (callback) {
                // loop为spider.loop的异步回调函数
                loop = function (undisposedNews, loopTime) {
                    info = callback(undisposedNews, loopTime);
                    spider.emit('start_begin', info);
                }
                // 调用spider.begin
                spider.on('start_begin', spider.begin);
                spider.on('start_loop', loop)
                return spider;
            }
            spider.emit("start_loop", spider.undisposedNews, ++spider.loopTime);
        };

        // 此接口获取爬取得网址等初始信息
        // 传入参数为类数据
        spider.begin = function (info) {
            // 提取info内容
            try {
                spider.url = info.url;
                spider.coding = info.coding ? info.coding : "";
                spider.type = info.type ? info.type : "";
                spider.data = [];
            } catch (err) {
                console.log(err);
                return spider;
            }

            // 爬取页面源代码
            http.get(spider.url, function (res) {
                spider.html = '';
                res.on('data', function (data) {
                    if (spider.coding) {
                        spider.html += iconv.decode(data, spider.coding);
                    } else {
                        spider.html += data;
                    }
                });
                res.on('end', function () {
                    // cheerio加载源代码
                    spider.$ = cheerio.load(spider.html);
                    spider.emit('data', spider.$, spider.html);
                });
            });
            return spider;
        };

        // 此接口提供选择器(css选择器语法标准)
        // 传入参数为标准json格式
        // 此接口待完善
        // spider.find = function (selector) {
        //     try {
        //         var content = JSON.parse(selector);
        //     } catch (err) {
        //         console.log(err);
        //         return spider;
        //     }
        //     return spider;
        // };

        // 数据处理过程
        // 传入回调函数
        spider.proceed = function (process) {
            spider.on('data', process);
            return spider;
        };

        // 添加数据
        spider.addData = function (data) {
            spider.data.push(data);
        };

        // 处理完一条新闻后，set ishandle字段为1
        spider.handleNewsDone = function () {
            if (!spider.undisposedNews.id) {
                console.log("当前爬取评论的新闻不存在");
                return ;
            }
            // console.log("新闻爬取完毕，id: "+spider.undisposedNews.id);
            // mover.connection.query("update newslist set ishandle = 1 where id = '" + spider.undisposedNews.id + "'");
        };

        // 发生数据已经准备好的信号
        spider.done = function () {
            spider.emit('done');
        };

        spider.end = function (callback) {
            //这里应该处理一些结束信息
            spider.on('done', function () {
                callback(spider.type, spider.data);
                mover.connection.end(function (err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('数据库关闭成功');
                    }
                });
            });
            return spider;
        };

        // 封装数据库插入操作
        spider.insert = function (type, data) {
            mover.insert(type, data);
        };

        // 删除comment所有数据
        spider.clearComments = function () {
            mover.clearComments();
        }

        // 获取一条新闻信息
        spider.getOneUndisposedNews = function () {
            mover.connection.query('select * from newslist where ishandle = 0 limit 1', function (err, result) {
                if (err) {
                    onsole.log(222);
                    console.log(err);
                    mover.connection.destroy();
                    process.exit(1);
                } else if(!result){
                    console.log("无未爬取新闻列表");
                    mover.connection.destroy();
                    process.exit(1);
                } else {
                    spider.undisposedNews = result[0];
                    spider.loopTime = 0;
                    // 第二个参数为找到的一个待爬评论网站信息
                    // 第三个参数为起始loopTime
                    spider.emit('start_loop', spider.undisposedNews, spider.loopTime);
                    // set ishandle = 1
                    mover.connection.query("update newslist set ishandle = 1 where id = '" + spider.undisposedNews.id + "'");
                }
            });
            return spider;
        };

        // newSpider返回
        return spider;
    }
};




module.exports = grab;



