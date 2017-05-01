# -*- coding: utf-8 -*-
# 创建于 2017/4/12 dou
# 修改于 2017/4/12 dou
#
# 该gui用于监督学习
# 功能包括分词词频统计
# 触发概率统计

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc
import wx.richtext
from handler import Handler


###########################################################################
## Class MyFrame
###########################################################################

class MyFrame(wx.Frame):
    def __init__(self, parent):
        self.han = Handler()
        self.han.initDB("localhost", "dou", "317416", "dotwo")
        self.han.connectDB()
        data = self.han.getAComment()

        wx.Frame.__init__(self, parent, id=wx.ID_ANY, title=wx.EmptyString, pos=wx.DefaultPosition,
                          size=wx.Size(561, 393), style=wx.DEFAULT_FRAME_STYLE | wx.TAB_TRAVERSAL)

        self.SetSizeHintsSz(wx.DefaultSize, wx.DefaultSize)
        self.SetForegroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_BTNTEXT))
        self.SetBackgroundColour(wx.Colour(128, 128, 128))

        commentText = wx.BoxSizer(wx.VERTICAL)

        self.comment = wx.richtext.RichTextCtrl(self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.DefaultSize,
                                                0 | wx.VSCROLL | wx.HSCROLL | wx.NO_BORDER | wx.WANTS_CHARS)
        self.comment.SetFont(wx.Font(12, 75, 90, 90, False, "黑体"))
        self.comment.SetForegroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_BTNTEXT))
        self.comment.SetBackgroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_SCROLLBAR))
        self.comment.SetMinSize(wx.Size(-1, 280))

        self.comment.Clear()
        self.comment.WriteText(data)

        commentText.Add(self.comment, 1, wx.EXPAND | wx.ALL, 5)

        buttonSizer = wx.BoxSizer(wx.HORIZONTAL)

        self.negative_button = wx.Button(self, wx.ID_ANY, u"negative", wx.DefaultPosition, wx.Size(128, 64), 0)
        buttonSizer.Add(self.negative_button, 0, wx.ALL, 5)

        self.moderate_button = wx.Button(self, wx.ID_ANY, u"moderate", wx.DefaultPosition, wx.Size(128, 64), 0)
        buttonSizer.Add(self.moderate_button, 0, wx.ALL, 5)

        self.positve_button = wx.Button(self, wx.ID_ANY, u"positive", wx.DefaultPosition, wx.Size(128, 64), 0)
        buttonSizer.Add(self.positve_button, 0, wx.ALL, 5)

        self.done_button = wx.Button(self, wx.ID_ANY, u"done", wx.Point(300, -1), wx.Size(128, 64), 0)
        buttonSizer.Add(self.done_button, 0, wx.ALL, 5)

        commentText.Add(buttonSizer, 1, wx.EXPAND, 5)

        self.SetSizer(commentText)
        self.Layout()

        self.Centre(wx.BOTH)

        # Connect Events
        self.negative_button.Bind(wx.EVT_BUTTON, self.clickNegative)
        self.moderate_button.Bind(wx.EVT_BUTTON, self.clickModerate)
        self.positve_button.Bind(wx.EVT_BUTTON, self.clickPositive)
        self.done_button.Bind(wx.EVT_BUTTON, self.clickDone)

    def nextComment(self):
        data = self.han.getAComment()
        self.comment.Clear()
        self.comment.WriteText(data)


    def __del__(self):
        pass

    # Virtual event handlers, overide them in your derived class
    def clickNegative(self, event):
        self.han.defAComment(2)
        self.nextComment()

    def clickModerate(self, event):
        self.han.defAComment(0)
        self.nextComment()

    def clickPositive(self, event):
        self.han.defAComment(1)
        self.nextComment()

    def clickDone(self, event):
        self.han.disconnectDB()
        self.Close()


app = wx.App()
MyFrame(None).Show()
app.MainLoop()