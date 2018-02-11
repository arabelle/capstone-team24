import os
from urllib import parse
import psycopg2

parse.uses_netloc.append("postgres")
url = parse.urlparse(os.environ["DATABASE_URL"])
#WILL CHANGE THIS TABLE LATER TO THE ONE WE ARE ACTUALLY USING
table = "test_news_table"
user_table = "user_table"
event_table = "events_table"

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

def insertEventIntoTable(date, title, summary, link, imgLink):
    cur = conn.cursor()
    command = "INSERT INTO {} VALUES (%s, %s, %s, %s, %s);".format(table)
    cur.execute(command, (date, title, summary, link, imgLink))
    #This makes sure the changes get placed
    conn.commit()
    cur.close()
    return True

def insertEventIntoTableFromClient(date, text, link, time, tags):
    cur = conn.cursor()
    command = "INSERT INTO {} VALUES (%s, %s, %s, %s, %s) RETURNING id;".format(event_table)
    try:
        cur.execute(command, (date, text, link, time, tags))
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

def getAllEventsForClient():
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM {};".format(event_table))
        events = cur.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        events = None
    cur.close()
    return events

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
        cur.execute(command, (name, pwd, phone, notify, user, admin))
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close()
        return False # TODO possibly
    cur.close()
    return True


