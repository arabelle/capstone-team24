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

def insertEventIntoTable(date, title, summary, link, imgLink):
    cur = conn.cursor()
    command = "INSERT INTO {} VALUES (%s, %s, %s, %s, %s);".format(table)
    cur.execute(command, (date, title, summary, link, imgLink))
    #This makes sure the changes get placed
    conn.commit()
    cur.close()
    return True

def insertUserIntoTable(name, username, password, phone):
    cur = conn.cursor()
    try:
        command = "INSERT INTO {} VALUES (DEFAULT, %s, %s, %s, %s);".format(user_table)
        cur.execute(command, (name, username, password, phone))
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
        userid, name, username, pwd, phone = cur.fetchone()
        if pwd == password:
            cur.close()
            return (userid, name, phone)
    except (Exception, psycopg2.DatabaseError) as error:
        cur.close()
        return (None, None, None)

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
    command = "SELECT phonenumber FROM {};".format(user_table)
    try:
        cur.execute(command)
        phones = cur.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close() 
        return None
    cur.close()
    return phones

def getAllUsers():
    cur = conn.cursor()
    cur.execute("SELECT id, name, username, phonenumber FROM {};".format(user_table))
    users = cur.fetchall()
    cur.close()
    return users

def getUser(userid):
    cur = conn.cursor()
    command = "SELECT id, name, username, phonenumber FROM {} WHERE id = %s;".format(user_table)
    try:
        cur.execute(command, (userid))
        user = cur.fetchone()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.close() 
        return None
    cur.close()
    return user

