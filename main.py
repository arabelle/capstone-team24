import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import db
import crawler
import json

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "client"),
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "autoreload": True
}

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        print("Clicked run crawler")
        crawler.run_crawler()

    def on_close(self):
        print("WebSocket closed")

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        eventsdata = json.dumps(db.getAllItems(self))
        self.render("index.html", events=eventsdata)

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r'/websocket', WebSocketHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
