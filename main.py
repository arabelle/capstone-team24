import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "client"),
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "autoreload": True
}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
        
def main():     
    application = tornado.web.Application([
        (r"/", MainHandler) 
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port) 
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
    
