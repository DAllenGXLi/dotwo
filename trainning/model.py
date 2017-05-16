# -*- coding: utf-8 -*-
# 创建于 2017/4/12 dou
# 修改于 2017/4/12 dou
#

import MySQLdb
import sys

class Model:
    def __init__(self, host, username, password, dbname):
        self.host = host
        self.userName = username
        self.password = password
        self.dbName = dbname
        self.db = None
        self.cursor = None
        self.currentId = None

    def connect(self):
        self.db = MySQLdb.connect(self.host, self.userName, self.password, self.dbName, charset='utf8')
        self.cursor = self.db.cursor()

    def disconnect(self):
        self.db.close()

    # 获取一条记录， 同时将attitude暂时设置为0，为了预防重复修改
    def getAComment(self):
        self.cursor.execute("select id, content, news_id from comments where attitude is null limit 1")
        try:
            data = self.cursor.fetchone()
            self.currentId = data[0]
            self.currentNewsId = data[2]
        except:
            print "no comment!"
            raise
        self.cursor.execute("update comments set attitude=0 where id=" + data[0])
        # self.db.rollback()
        self.db.commit()
        return data

    def checkWord(self, word):
        query = "select * from extra_words where word='" + word + "'"
        if 0 == self.cursor.execute(query):
            return True
        else: return False

    def getAttitude(self, word):
        query = "select happy, angry, fear, sad, sum from words_frequency where word='" + word + "'"
        if 0 == self.cursor.execute(query):
            return None
        data = self.cursor.fetchone()
        return data

    def defAComment(self, type):
        # query = "update comments set attitude=" + str(type) + " where id=" + str(self.currentId)
        query = "delete from comments where id='" + str(self.currentId) + "'"
        # 用于统计学习次数
        # self.handleStatistics(type)
        # print script
        self.cursor.execute(query)
        self.db.commit()

    def defACommentWithWords(self, type):
        query = "update comments set attitude=" + str(type) + " where id='" + str(self.currentId) + "'"
        # 用于统计学习次数
        self.handleStatistics(type)
        # print script
        self.cursor.execute(query)
        self.db.commit()

    # 词频记录
    def handleWord(self, word, type):
        typename = self.getTypeName(type)
        query = "update words_frequency set " + typename + "=" + typename + "+1, sum=sum+1 where word='" + word + "'"
        # print query
        if self.cursor.execute(query) == 1:
            self.db.commit()
            return

        insertQuery = "insert into words_frequency set word='" + word + "'"
        # print insertScript
        self.cursor.execute(insertQuery)
        self.cursor.execute(query)
        self.db.commit()

    def handleStatistics(self, type):
        typename = self.getTypeName(type)
        query = "update statistics set count=count+1 where id='" + typename + "'"
        self.cursor.execute(query)
        self.db.commit()

    # 将统计结果添加到newslist表情感数量里面
    def addToNewsListCount(self, type):
        if type < 0 or type > 3:
            return False
        typeName = self.getTypeName(type)
        query = "update newslist set " + typeName + "=" + typeName + "+1 where id='" + self.currentNewsId + "'"
        self.cursor.execute(query)
        self.db.commit()

    def getTypeName(self, type):
        typename = None
        if type == 0:
            typename = "happy"
        elif type == 1:
            typename = "angry"
        elif type == 2:
            typename = "fear"
        elif type == 3:
            typename = "sad"
        else:
            typename = "none"
        return typename


