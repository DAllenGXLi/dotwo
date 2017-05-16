# -*- coding: utf-8 -*-
from handler import Handler

han = Handler()
han.initDB("localhost", "root", "317416", "dotwo")
han.connectDB()
han.analyzeAll()