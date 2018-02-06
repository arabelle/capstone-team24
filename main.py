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
        eventsdata = json.dumps(db.getAllItems(self))
        self.render("index.html", events=eventsdata)

class CrawlerHandler(tornado.web.RequestHandler):
    def post(self):
        print("web crawler request!")
        #crawler.run_crawler()

class AdminHandler(tornado.web.RequestHandler):
    def post(self):
        print("admin request!")

class PiHandler(tornado.web.RequestHandler):
    def post(self):
        print("Pi request!")

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/crawler", CrawlerHandler),
        (r"/admin", AdminHandler),
        (r"/pi", PiHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
