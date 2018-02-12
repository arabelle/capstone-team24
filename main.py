# -*- coding: utf-8 -*-
import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.httputil
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

def convert_list_to_dict(listed):
    key_array = ["id", "date", "text", "link", "time", "tags"]
    result = [{f: listed[i][e] for e, f in enumerate(key_array)} for i in range(len(listed))]
    return result

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
        print(text.auth_token)

@jwtauth
class CrawlerHandler(tornado.web.RequestHandler):
    def post(self):
        print("web crawler request!")
        #crawler.run_crawler()

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
        pi.post_pi()
        # For all users with notifications on, send text
        phones = db.getAllPhoneNumbers()
        if (phones is not None):
            for phone in phones:
                text.send_text(phone[0])
        self.finish({})

@jwtauth
class EventsHandler(tornado.web.RequestHandler):
    def post(self):
        req = json.loads(self.request.body.decode("utf-8"))
        text = req["text"]
        link = req["link"]
        time = req["time"]
        date = req["date"]
        tags = req["tags"]
        eventid = db.insertIntoTable(date, text, link, time, tags)
        if eventid is not None:
            print("Events added succeeded")
            req["id"] = eventid
            self.write(req)
        else:
            print("Events added failed")
            self.set_status(401)
        self.finish()

    def get(self):
        events = db.getAllClientEvents()
        if events is not None:
            events = convert_list_to_dict(events)
            self.write(json.dumps(events))
        else:
            self.set_status(401)
        self.finish()

class AdminHandler(tornado.web.RequestHandler):
    # SUPPORTED_METHODS = ("CONNECT", "GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    def get(self):
        eventsdata = json.dumps(db.getAllItems(self))
        self.write(eventsdata)
        print("admin request!")

    def post(self):
        data = json.loads(str(self.request.body, 'utf-8'))
        print(data)
        date = data["date"]
        eventsdata = json.dumps(db.getItemsWithDate(self, date))
        self.write(eventsdata)    


class AdminAddHandler(tornado.web.RequestHandler):
    def post(self):
        data = json.loads(self.request.body.decode("utf-8"))
        print(data)
        date = data["date"]
        text = data["text"]
        link = data["link"]
        time = data["time"]
        filter = data["filter"]
        result = db.insertIntoTable(self, date, text, link, time, filter)
        self.write(json.dumps(result))


    def update(self):
        data = json.loads(self.request.body.decode("utf-8"))
        print(data)
        colsQuery = ''
        badSuffix = ", "

        id = data["id"]

        if data["date"] is not None:
            date = data["date"]
            colsQuery += "date = '" + str(data["date"]) + "', " 
        if data["text"] is not None:    
            text = data["text"]
            colsQuery += "text = '" + str(data["text"]) + "', "
        if data["link"] is not None:  
            link = data["link"]
            colsQuery += "link = '" + str(data["link"]) + "', "
        if data["time"] is not None:    
            time = data["time"]
            colsQuery += "time = '" + str(data["time"]) + "', "
        if data["filter"] is not None:        
            filter = data["filter"]
            colsQuery += "filter = '" + str(data["filter"])+ "'"

        if colsQuery.endswith(badSuffix):
            colsQuery[:-2]

        print(colsQuery)
        print(id)
        result = db.updateEvent(self, colsQuery, id)
        self.write(json.dumps(result))

    def delete(self):
        data = json.loads(self.request.body.decode("utf-8"))
        eventid = data["id"]
        result = db.deleteEvent(eventid)
        if result is True:
            print("Delete event succeeded")
            req["id"] = eventid
            self.write(req)
        else:
            print("Delete event failed")
            self.set_status(401)
        self.finish()

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/crawler", CrawlerHandler),
        (r"/loginapi", LoginHandler),
        (r"/registerapi", RegisterHandler),
        (r"/bell", BellHandler),
        (r"/users", UsersHandler),
        (r"/users/([^/]+)", UserQueryHandler),
        (r"/eventsapi", EventsHandler),
        (r"/admin", AdminHandler),
        (r"/admin/add", AdminAddHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
