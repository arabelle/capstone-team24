import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.httputil
import db
# import crawler
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
    # SUPPORTED_METHODS = ("CONNECT", "GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    def connect(self):
        print("Connected to admin")

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Content-Type", "application/json")

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
        
    def options(self):
        self.set_status(204)
        self.finish() 

class AdminAddHandler(tornado.web.RequestHandler):
    def connect(self):
        print("Connected to admin")   

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Content-Type", "application/json")  

    def post(self):
        data = json.loads(str(self.request.body, 'utf-8'))
        print(data)
        date = data["date"]
        text = data["text"]
        link = data["link"]
        time = data["time"]
        filter = data["filter"]
        result = db.insertIntoTable(self, date, text, link, time, filter)
        self.write(json.dumps(result))

    def options(self):
        self.set_status(204)
        self.finish()

class AdminUpdateHandler(tornado.web.RequestHandler):
    def connect(self):
        print("Connected to admin")

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Content-Type", "application/json")

    def post(self):
        data = json.loads(str(self.request.body, 'utf-8'))
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

    def options(self):
        self.set_status(204)
        self.finish()

class AdminDeleteHandler(tornado.web.RequestHandler):
    def connect(self):
        print("Connected to admin")

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Content-Type", "application/json")

    def post(self):
        data = json.loads(str(self.request.body, 'utf-8'))
        id = data["id"]
        result = db.deleteEvent(self, id)
        self.write(result)

    def options(self):
        self.set_status(204)
        self.finish()

class PiHandler(tornado.web.RequestHandler):
    def post(self):
        print("Pi request!")

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/crawler", CrawlerHandler),
        (r"/admin", AdminHandler),
        (r"/admin/add", AdminAddHandler),
        (r"/admin/update", AdminUpdateHandler),
        (r"/admine/delete", AdminDeleteHandler),
        (r"/pi", PiHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
