/**
 * Created by dou on 2017/3/17.
 */


var mysql = require('mysql');

var model = {
    newMover: function (info) {
        var mover = {};
        mover.connection = mysql.createConnection(info);
        mover.info = info;

        mover.insert = function (type, data) {
            // 逐条插入数据
            for (var i = 0; i < data.length; i++) {
                mover.connection.query("insert into " + type + " set ?", data[i], function (err, result) {
                    if (err) {
                        console.log(type, "数据插入失败");
                    } else {
                        console.log(type, "数据插入成功");
                    }
                });
            }
        }

        mover.clearComments = function () {
            console.log("正在清除旧comments...");
            mover.connection.query('DELETE FROM comments', function (err, result) {
                if (err) throw err;
                console.log('deleted ' + result.affectedRows + ' rows');
            })
            console.log("旧comment清除完毕!");
        }

        mover.getOneUndisposedNews = function () {

        };

        mover.search = function (type, query) {

        };

        return mover;
    }

};

module.exports = model;
