import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import db
import crawler
import json

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "client"),
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "autoreload": True
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
    def post(self):
        req = json.loads(self.request.body)
        user = req["username"]
        pwd = req["password"]
        print("Your username is %s and password is %s" % (user, pwd))
        if (db.checkUserValid(user, pwd)):
            print("Login succeeded")
            self.write("true")
        else:
            print("Login failed")
            self.write("false")

class RegisterHandler(tornado.web.RequestHandler):
    def post(self):
        print("Register request!")
        req = json.loads(self.request.body)
        fname = req["firstName"]
        lname = req["lastName"]
        user = req["username"]
        pwd = req["password"]
        if (db.insertIntoUserTable(fname, lname, user, pwd)):
            print("Registration succeeded")
            self.write("true")
        else:
            print("Registration failed")
            self.write("false")

class PiHandler(tornado.web.RequestHandler):
    def post(self):
        print("Pi request!")

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/crawler", CrawlerHandler),
        (r"/loginapi", LoginHandler),
        (r"/registerapi", RegisterHandler),
        (r"/pi", PiHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
