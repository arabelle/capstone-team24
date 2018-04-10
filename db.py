import os
from urllib import parse
import psycopg2

parse.uses_netloc.append("postgres")
url = parse.urlparse(os.environ["DATABASE_URL"])

news_table = "test_news_table"
table = "new_events_table"
user_table = "user_table"

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

def getAllNewsEvents():
    cur = conn.cursor()
    cur.execute("SELECT * FROM {} ORDER BY date DESC".format(news_table))
    events = cur.fetchmany(30)
    cur.close()
    return events

def getAllClientEvents():
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM {};".format(table))
        events = cur.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        events = None
    cur.close()
    return events

def getEventsWithDate(itemDate):
    cur = conn.cursor()
    command = "SELECT * FROM {} WHERE date = %s".format(table)
    try:
        cur.execute(command, (itemDate,))
        rows = cur.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        rows = None
    cur.close()
    return rows

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

def insertCrawlerEventIntoTable(date, title, summary, link, imgLink):
    cur = conn.cursor()
    command = "INSERT INTO {} VALUES (%s, %s, %s, %s, %s);".format(table)
    cur.execute(command, (date, title, summary, link, imgLink))
    #This makes sure the changes get placed
    conn.commit()
    cur.close()
    return True

def insertEventIntoTable(date, text, link, time, filt):
    cur = conn.cursor()
    command = "INSERT INTO {} VALUES (DEFAULT, %s, %s, %s, %s, %s) RETURNING id;".format(table)
    try:
        cur.execute(command, (date, text, link, time, filt))
        conn.commit()
        eventid = cur.fetchone()[0]
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close()
        return None
    cur.close()
    return eventid

def insertUserIntoTable(name, username, password, phone, notify=1, admin="false"):
    cur = conn.cursor()
    try:
        command = "INSERT INTO {} VALUES (DEFAULT, %s, %s, %s, %s, %s, %s);".format(user_table)
        cur.execute(command, (name, username, password, phone, notify, admin))
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close()
        return False
    cur.close()
    return True

def checkUserValid(username, password):
    cur = conn.cursor()
    command = "SELECT * FROM {} WHERE username = %s;".format(user_table)
    try:
        cur.execute(command, (username,))
        userid, name, username, pwd, phone, notify, admin = cur.fetchone()
        if pwd == password:
            cur.close()
            return (userid, name, pwd, phone, notify, admin)
    except (Exception, psycopg2.DatabaseError) as error:
        cur.close()
        return None

def deleteUser(userid):
    cur = conn.cursor()
    command = "DELETE FROM {} WHERE id = %s;".format(user_table)
    try:
        cur.execute(command, (userid,))
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close() 
        return False
    cur.close()
    return True

def getAllPhoneNumbers():
    cur = conn.cursor()
    command = "SELECT phonenumber FROM {} WHERE notify = 1;".format(user_table)
    try:
        cur.execute(command);
        phones = cur.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close() 
        return None
    cur.close()
    return phones

def getAllUsers():
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM {};".format(user_table))
        users = cur.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        users = None
    cur.close()
    return users

def getUser(userid):
    cur = conn.cursor()
    command = "SELECT * FROM {} WHERE id = %s;".format(user_table)
    try:
        cur.execute(command, (userid))
        user = cur.fetchone()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close() 
        return None
    cur.close()
    return user

def updateUser(name, user, pwd, phone, notify, admin):
    cur = conn.cursor()
    command = "UPDATE {} SET (name, pwd, phonenumber, notify, admin) = (%s, %s, %s, %s, %s) WHERE username = %s".format(user_table)
    try:
        cur.execute(command, (name, pwd, phone, notify, admin, user))
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close()
        return False # TODO possibly
    cur.close()
    return True

def updateEvent(self, query, event_id):
    #TODO
    cur = conn.cursor()
    command = "UPDATE {} SET () = () WHERE id = %s".format(table)
    cur.execute()
    # cur.execute(command, (date, text, link, time, filter))
    conn.commit()
    cur.close()
    return "done"

def filterEvents(self, filter):
    cur = conn.cursor()
    itemDate = str(filter)
    if not checkForQuotes(filter):
        filter = "'" + filter + "'"     
    cur.execute("SELECT * FROM " + table + " WHERE filter = " + filter)
    sendy = str(cur.fetchall())
    cur.close()
    return sendy

def deleteEvent(eventid):
    cur = conn.cursor()
    command = "DELETE FROM {} WHERE id = %s".format(table)
    try:
        cur.execute(command, (eventid,))
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close()
        return False
    cur.close()
    return True