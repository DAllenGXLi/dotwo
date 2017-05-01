/**
 * Created by dou on 2017/3/17.
 */


var mysql = require('mysql');

var model = {
    newMover: function (info) {
        var mover = {};
        var connection = mysql.createConnection(info);
        mover.info = info;

        // 接口
        mover.getNewslist = function (res, count, begin) {
            connection.query('select * from newslist limit ' + begin + ', ' + count, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(JSON.stringify(result));
                    res.end();
                }
            });
        };

        mover.getEmotionCounts = function (res, newsId) {

        }

        return mover;
    }

};

module.exports = model;
