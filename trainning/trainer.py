# -*- coding: utf-8 -*-
from handler import Handler

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc
import wx.richtext


###########################################################################
## Class MyFrame
###########################################################################

class MyFrame(wx.Frame):
    def __init__(self, parent):
        self.han = Handler()
        self.han.initDB("localhost", "dou", "317416", "dotwo")
        self.han.connectDB()
        data = self.han.getAComment()
        self.forecaseCheck = False
        self.selfLearn = False

        wx.Frame.__init__(self, parent, id=wx.ID_ANY, title=wx.EmptyString, pos=wx.DefaultPosition,
                          size=wx.Size(526, 382), style=wx.DEFAULT_FRAME_STYLE | wx.TAB_TRAVERSAL)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)

        bSizer1 = wx.BoxSizer(wx.VERTICAL)

        self.commentText = wx.richtext.RichTextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                    wx.Size(-1, 240),
                                                    0 | wx.VSCROLL | wx.HSCROLL | wx.NO_BORDER | wx.WANTS_CHARS)
        self.commentText.SetFont(wx.Font(12, 75, 90, 90, False, "黑体"))
        self.commentText.SetForegroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_BTNTEXT))
        self.commentText.SetBackgroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_SCROLLBAR))

        # -----------------加载数据-------------------
        self.commentText.Clear()
        self.commentText.WriteText(data)
        # -----------------加载数据-------------------

        bSizer1.Add(self.commentText, 1, wx.EXPAND | wx.ALL, 5)

        bSizer31 = wx.BoxSizer(wx.HORIZONTAL)

        self.checkBox = wx.CheckBox(self, wx.ID_ANY, u"同步预测", wx.DefaultPosition, wx.DefaultSize, 0)
        self.checkBox.SetFont(wx.Font(11, 75, 90, 90, False, "黑体"))

        bSizer31.Add(self.checkBox, 0, wx.ALL, 5)

        self.forecast_text = wx.TextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer31.Add(self.forecast_text, 0, wx.ALL, 5)


        self.selfLearn_button = wx.Button(self, wx.ID_ANY, u"开启无监督学习", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer31.Add(self.selfLearn_button, 0, wx.ALL, 5)

        bSizer1.Add(bSizer31, 1, wx.EXPAND, 5)

        bSizer3 = wx.BoxSizer(wx.HORIZONTAL)

        self.happy_button = wx.Button(self, wx.ID_ANY, u"快乐", wx.DefaultPosition, wx.DefaultSize, 0)
        self.happy_button.SetFont(wx.Font(11, 75, 90, 90, False, "黑体"))

        bSizer3.Add(self.happy_button, 0, wx.ALL, 5)

        self.angry_button = wx.Button(self, wx.ID_ANY, u"愤怒", wx.DefaultPosition, wx.DefaultSize, 0)
        self.angry_button.SetFont(wx.Font(11, 75, 90, 90, False, "黑体"))

        bSizer3.Add(self.angry_button, 0, wx.ALL, 5)

        self.fear_button = wx.Button(self, wx.ID_ANY, u"恐惧", wx.DefaultPosition, wx.DefaultSize, 0)
        self.fear_button.SetFont(wx.Font(11, 75, 90, 90, False, "黑体"))

        bSizer3.Add(self.fear_button, 0, wx.ALL, 5)

        self.sad_button = wx.Button(self, wx.ID_ANY, u"悲哀", wx.DefaultPosition, wx.DefaultSize, 0)
        self.sad_button.SetFont(wx.Font(11, 75, 90, 90, False, "黑体"))

        bSizer3.Add(self.sad_button, 0, wx.ALL, 5)

        self.jump_button = wx.Button(self, wx.ID_ANY, u"忽略", wx.DefaultPosition, wx.DefaultSize, 0)
        self.jump_button.SetFont(wx.Font(11, 75, 90, 90, False, "黑体"))

        bSizer3.Add(self.jump_button, 0, wx.ALL, 5)

        bSizer1.Add(bSizer3, 1, wx.EXPAND, 5)

        self.SetSizer(bSizer1)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.checkBox.Bind(wx.EVT_CHECKBOX, self.onForecastCheck)
        self.selfLearn_button.Bind(wx.EVT_BUTTON, self.onClickSelfLearn)
        self.happy_button.Bind(wx.EVT_BUTTON, self.onClickHappy)
        self.angry_button.Bind(wx.EVT_BUTTON, self.onClickAngry)
        self.fear_button.Bind(wx.EVT_BUTTON, self.onClickFear)
        self.sad_button.Bind(wx.EVT_BUTTON, self.onClickSad)
        self.jump_button.Bind(wx.EVT_BUTTON, self.onClickJump)

    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def onForecastCheck(self, event):
        self.forecaseCheck = event.GetEventObject().GetValue()

    def onClickSelfLearn(self, event):
        while True:
            data = self.han.getAComment()
            self.commentText.Clear()
            self.commentText.WriteText(data)
            if self.forecaseCheck:
                res = self.han.analyzeAttitude()
                attitude = u""
                if res == 0:
                    attitude = u"开心"
                elif res == 1:
                    attitude = u"愤怒"
                elif res == 2:
                    attitude = u"恐惧"
                elif res == 3:
                    attitude = u"悲哀"
                else:
                    attitude = u"无"

                print data, " ---- ", attitude
                self.forecast_text.Clear()
                self.forecast_text.WriteText(attitude)
                self.han.defAComment(res)


    def onClickHappy(self, event):
        self.han.defAComment(0)
        self.nextComment()

    def onClickAngry(self, event):
        self.han.defAComment(1)
        self.nextComment()

    def onClickFear(self, event):
        self.han.defAComment(2)
        self.nextComment()

    def onClickSad(self, event):
        self.han.defAComment(3)
        self.nextComment()

    def onClickJump(self, event):
        self.han.defAComment(16)
        self.nextComment()

    def nextComment(self):
        data = self.han.getAComment()
        self.commentText.Clear()
        self.commentText.WriteText(data)
        if self.forecaseCheck:
            res = self.han.analyzeAttitude()
            attitude = u""
            if res == 0:
                attitude = u"开心"
            elif res == 1:
                attitude = u"愤怒"
            elif res == 2:
                attitude = u"恐惧"
            elif res == 3:
                attitude = u"悲哀"
            else:
                attitude = u"无"
            self.forecast_text.Clear()
            self.forecast_text.WriteText(attitude)



app = wx.App()
MyFrame(None).Show()
app.MainLoop()