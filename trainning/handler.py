# -*- coding: utf-8 -*-
# 创建于 2017/4/13 dou
# 修改于 2017/4/13 dou
#

import jieba
import time
from model import Model

class Handler:
    def __init__(self):
        self.model = None
        self.words = []
        pass

    def initDB(self, hostname, username, password, dbname):
        self.model = Model(hostname, username, password, dbname)

    def connectDB(self):
        self.model.connect()

    def disconnectDB(self):
        self.model.disconnect()

    # 此函数获取一条评论并分词
    def getAComment(self):
        self.words = []
        try:
            data = self.model.getAComment()
        except:
            raise
        seg_list = jieba.cut(data[1])
        for word in seg_list:
            if self.checkWord(word):
                self.words.append(word)
        return data[1]

    # 检查该词是否在不在通用符号集内
    def checkWord(self, word):
        return self.model.checkWord(word)

    # 定义该评论的态度,快乐0 愤怒1 恐惧2 悲哀3, 并且把结果添加到词频统计中
    def defACommentWithWords(self, type):
        self.model.defACommentWithWords(type)
        if type < 10:
            self.handleWords(type)

    # 定义该评论的态度,快乐0 愤怒1 恐惧2 悲哀3, 不把结果添加到词频统计中
    def defACommen(self, type):
        self.model.defAComment(type)

    # 进行词频记录
    def handleWords(self, type):
        for word in self.words:
            print u"正在添加 '" + word + u"' 的词频统计"
            self.model.handleWord(word, type)

    # 计算最高概率
    def analyzeAttitude(self):
        happyRate = 1.0
        sadRate = 1.0
        angryRate = 1.0
        fearRate = 1.0
        print "---------------------------------"

        for word in self.words:
            # (happy, angry, fear, sad, sum)
            data = self.model.getAttitude(word)
            print data, word
            if data != None:
                happyRate = happyRate * data[0] / data[4]
                angryRate = angryRate * data[1] / data[4]
                fearRate = fearRate * data[2] / data[4]
                sadRate = sadRate * data[3] / data[4]

        print "happy: " + str(happyRate)
        print "angry: " + str(angryRate)
        print "fear:  " + str(fearRate)
        print "sad:   " + str(sadRate)
        if happyRate > sadRate and happyRate > angryRate and happyRate > fearRate:
            return 0
        elif angryRate > happyRate and angryRate > sadRate and angryRate > fearRate:
            return 1
        elif fearRate > happyRate and fearRate > sadRate and fearRate > angryRate:
            return 2
        elif sadRate > happyRate and sadRate > angryRate and sadRate > fearRate:
            return 3
        else:
            return 16

    # 分析所有评论情感，并且添加到newslist统计中
    def analyzeAll(self):
        while True:
            try:
                self.getAComment()
            except:
                break
            try:
                res = self.analyzeAttitude()
            except:
                continue
            self.defACommen(res)
            self.model.addToNewsListCount(res)



# han = Handler()
# han.initDB("localhost", "root", "317416", "dotwo")
# han.connectDB()
# han.analyzeAll()

# # 获取一条评论
# data = han.getAComment()
# # 定义一条评论态度， 并且做词频记录
# han.defAComment(1)
# han.disconnectDB()


