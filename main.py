# -*- coding: utf-8 -*-
import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.httputil
import db
import crawler
import json
import pi
import text
import jwt
import time
import threading
from auth import jwtauth
import datetime 

SECRET = 'my_secret_key'

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "client"),
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "autoreload": True,
}

def convert_list_to_dict(listed):
    key_array = ["id", "date", "text", "link", "time", "tags"]
    result = [{f: listed[i][e] for e, f in enumerate(key_array)} for i in range(len(listed))]
    return result

def ring_bell():
    pi.post_pi()
    # For all users with notifications on, send text
    phones = db.getAllPhoneNumbers()
    if (phones is not None):
        for phone in phones:
            text.send_text(phone[0])

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

@jwtauth
class CrawlerHandler(tornado.web.RequestHandler):
    def post(self):
        print("web crawler request!")
        crawler.run_crawler()

    def get(self):
        req = json.dumps(db.getAllNewsEvents())
        if (req is not None):
            self.write(req)
        else:
            self.set_status(401)
        self.finish()

class LoginHandler(tornado.web.RequestHandler):
    def get_auth_token(self, userid):
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': userid
        }
        return jwt.encode(
            payload,
            SECRET,
            algorithm='HS256'
        )

    def post(self):
        login_res = {}
        req = json.loads(self.request.body.decode("utf-8"))
        user = req["username"]
        pwd = req["password"]
        validTuple = db.checkUserValid(user, pwd)
        if validTuple is not None:
            userid, name, pwd, phone, notify, admin = validTuple
            login_res["id"] = userid
            login_res["username"] = user
            login_res["name"] = name
            login_res["phone"] = phone
            login_res["password"] = pwd
            login_res["notify"] = 'true' if notify else 'false'
            login_res["token"] = self.get_auth_token(userid).decode('utf-8')
            login_res["admin"] = admin
            print("Login succeeded")
        else:
            print("Login failed")
            self.set_status(401)
        self.write(login_res)
        self.finish()

@jwtauth
class UsersHandler(tornado.web.RequestHandler):
    def get(self):
        users = db.getAllUsers()
        if (users is not None):
            self.write(json.dumps(users))
        else:
            self.set_status(401)
        self.finish()

@jwtauth
class UserQueryHandler(tornado.web.RequestHandler):
    def put(self, userid):
        req = json.loads(self.request.body.decode("utf-8"))
        name = req["name"]
        user = req["username"]
        pwd = req["password"]
        phone = req["phone"]
        notify = req["notify"]
        admin = req["admin"]
        notifyBool = 1 if notify == "true" else 0
        if (db.updateUser(name, user, pwd, phone, notifyBool, admin)):
            print("Successfully updated user settings")
            self.write(req)
        else:
            print("Failed to update user settings")
            self.set_status(401)
        self.finish()

    def delete(self, userid):
        if not db.deleteUser(userid):
            self.set_status(401)
        self.finish()

    def get(self, userid):
        user = db.getUser(userid)
        if (user is not None):
            self.write(json.dumps(user))
        else:
            self.set_status(401)
        self.finish()

class RegisterHandler(tornado.web.RequestHandler):
    def post(self):
        reg_res = {}
        req = json.loads(self.request.body.decode("utf-8"))
        name = req["name"]
        user = req["username"]
        pwd = req["password"]
        phone = req["phone"]
        if (db.insertUserIntoTable(name, user, pwd, phone)):
            print("Registration succeeded")
        else:
            print("Registration failed")
            self.set_status(401)
        self.finish(reg_res)

@jwtauth
class BellHandler(tornado.web.RequestHandler):
    def get(self):
        ring_bell()
        self.finish({})

class EventsHandler(tornado.web.RequestHandler):
    #DATE FORMAT YYYY-MM-DD
    #TIME FORMAT hh:mm
    def post(self):
        req = json.loads(self.request.body.decode("utf-8"))
        text = req["text"]
        link = req["link"]
        rtime = req["time"]
        date = req["date"]
        tags = req["tags"]
        eventid = db.insertEventIntoTable(date, text, link, rtime, tags)
        if eventid is not None:
            print("Events added succeeded")
            req["id"] = eventid
            print("Scheduled for " + date + " " + rtime)
            dt = datetime.datetime.strptime(date + " " + rtime, "%Y-%m-%d %H:%M")
            t = threading.Timer(dt.timestamp()-time.time(), ring_bell)
            t.start()
            self.write(req)
        else:
            print("Events added failed")
            self.set_status(401)
        self.finish()

    def get(self):
        current_date = datetime.date.today().strftime('%Y-%m-%d')
        events = db.getEventsWithDate(current_date)
        if events is not None:
            events = convert_list_to_dict(events)
            self.write(json.dumps(events))
        else:
            self.set_status(401)
        self.finish()

    def delete(self):
        req = json.loads(self.request.body.decode("utf-8"))
        eventid = req["eventid"]
        res = db.deleteEvent(eventid)
        if (res):
            print("Delete event succeeded")
        else:
            print("Delete event failed")
            self.set_status(401)
        self.finish({})


def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/crawler", CrawlerHandler),
        (r"/loginapi", LoginHandler),
        (r"/registerapi", RegisterHandler),
        (r"/bell", BellHandler),
        (r"/users", UsersHandler),
        (r"/users/([^/]+)", UserQueryHandler),
        (r"/eventsapi", EventsHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
