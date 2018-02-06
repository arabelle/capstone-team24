import os
from urllib import parse
import psycopg2

parse.uses_netloc.append("postgres")
url = parse.urlparse(os.environ["DATABASE_URL"])
#WILL CHANGE THIS TABLE LATER TO THE ONE WE ARE ACTUALLY USING
table = "test_news_table"
user_table = "user_table"

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

def getAllEvents(self):
    cur = conn.cursor()
    cur.execute("SELECT * FROM " + table + " ORDER BY date DESC")
    events = cur.fetchall()
    cur.close()
    return events

def getEventsWithDate(self, itemDate):
    cur = conn.cursor()
    itemDate = str(itemDate)
    if not checkForQuotes(itemDate):
        itemDate = "'" + itemDate + "'"
    cur.execute("SELECT * FROM " + table + " WHERE date = " + itemDate)
    eventsDate = str(cur.fetchall())
    cur.close()
    return eventsDate

def checkForQuotes(inputStr):
    if (inputStr.startswith("'") or inputStr.startswith('"')
        and inputStr.endswith("'") or inputStr.endswith('"')):
        return True
    else:
        return False

#Just making sure everything has quotes
def sanitizeInputs(args):
    argList = []
    for arg in args:
        arg = str(arg)
        if checkForQuotes(arg):
            argList.append(arg)
        else:
            argList.append("'" + arg + "'")
    return argList

def insertIntoTable(date, title, summary, link, imgLink):
    cur = conn.cursor()
    command = "INSERT INTO {} VALUES (%s, %s, %s, %s, %s);".format(table)
    cur.execute(command, (date, title, summary, link, imgLink))
    #This makes sure the changes get placed
    conn.commit()
    cur.close()
    return True

def insertIntoUserTable(fname, lname, username, password):
    cur = conn.cursor()
    try:
        command = "INSERT INTO {} VALUES (%s, %s, %s, %s);".format(user_table)
        cur.execute(command, (fname, lname, username, password))
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close()
        return False
    cur.close()
    return True

def checkUserValid(username, password):
    cur = conn.cursor()
    command = "SELECT pwd FROM {} WHERE username = '{}';".format(user_table, username)
    cur.execute(command)
    pwd = cur.fetchone()
    if pwd == password:
        return True
    return False

