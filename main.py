# -*- coding: utf-8 -*-
import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import db
#import crawler
import json
import pi
import text
import jwt
from auth import jwtauth
import datetime 

SECRET = 'my_secret_key'

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "client"),
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "autoreload": True,
}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        eventsdata = json.dumps(db.getAllEvents(self))
        self.render("index.html", events=eventsdata)

class CrawlerHandler(tornado.web.RequestHandler):
    def post(self):
        print("web crawler request!")
        #crawler.run_crawler()

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
        req = json.loads(self.request.body)
        user = req["username"]
        pwd = req["password"]
        fname, lname, phone, userid = db.checkUserValid(user, pwd)
        if (fname and lname and phone and userid):
            print("Login succeeded")
            login_res["id"] = userid
            login_res["username"] = user
            login_res["firstName"] = fname
            login_res["lastName"] = lname
            login_res["token"] = self.get_auth_token(userid).decode('utf-8')
        else:
            print("Login failed")
            self.set_status(401)
        self.write(login_res)
        self.finish()

@jwtauth
class UserHandler(tornado.web.RequestHandler):
    def post(self):
        pass

    def put(self, userid):
        pass

    def delete(self, userid):
        if not db.deleteUser(userid):
            self.set_status(401)
        self.finish()

    def get(self, userid=None):
        response = {}
        if userid is None:
            users = db.getAllUsers()
            if (users is not None):
                response["users"] = users
            else:
                self.set_status(401)
        else:
            user = db.getUser(userid)
            if (user is not None):
                response["user"] = user
            else:
                self.set_status(401)
        self.finish(response)

class RegisterHandler(tornado.web.RequestHandler):
    def post(self):
        reg_res = {}
        req = json.loads(self.request.body)
        fname = req["firstName"]
        lname = req["lastName"]
        user = req["username"]
        pwd = req["password"]
        phone = req["phone"]
        if (db.insertUserIntoTable(fname, lname, user, pwd, phone)):
            print("Registration succeeded")
        else:
            print("Registration failed")
            self.set_status(401)
        self.finish(reg_res)

@jwtauth
class BellHandler(tornado.web.RequestHandler):
    def get(self):
        pi.post_pi()
        # For all users with notifications on, send text
        phones = db.getAllPhoneNumbers()
        for phone in phones:
            text.send_text(phone)

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/crawler", CrawlerHandler),
        (r"/loginapi", LoginHandler),
        (r"/registerapi", RegisterHandler),
        (r"/bell", BellHandler),
        (r"/users", UserHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
