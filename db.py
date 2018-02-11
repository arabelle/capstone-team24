import os
from urllib import parse
import psycopg2

parse.uses_netloc.append("postgres")
url = parse.urlparse(os.environ["DATABASE_URL"])
#WILL CHANGE THIS TABLE LATER TO THE ONE WE ARE ACTUALLY USING
table = "new_events_table"

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

def getAllItems(self):
    cur = conn.cursor();
    cur.execute("SELECT * FROM " + table + " ORDER BY date DESC")
    rows = cur.fetchall();
    sendy = [dict((cur.description[i][0], value)
            for i, value in enumerate(row)) for row in rows]
    # sendy = cur.fetchall()
    cur.close()
    # print(sendy)
    return sendy

def getItemsWithDate(self, itemDate):
    print(itemDate)
    cur = conn.cursor()
    if not checkForQuotes(itemDate):
        itemDate = "'" + itemDate + "'"
    cur.execute("SELECT * FROM " +table+ " WHERE date = "+itemDate+";")
    # below wont work; figure out later
    # command = "SELECT * FROM test_events_table WHERE date = (%s);"
    # cur.execute(command, itemDate)
    rows = cur.fetchall()
    sendy = [dict((cur.description[i][0], value) 
             for i, value in enumerate(row)) for row in rows]
    cur.close()
    return sendy

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

def insertIntoTable(self, date, text, link, time, filter):
    cur = conn.cursor()
    command = "INSERT INTO " + table + "(date, text, link, time, filter) VALUES (%s, %s, %s, %s, %s);".format(table)
    cur.execute(command, (date, text, link, time, filter))
    #This makes sure the changes get placed
    conn.commit()
    cur.close()
    return "done"

def updateEvent(self, query, id):
    cur = conn.cursor()

    # args = [date, text, link, time, filter]
    # newArgs = sanitizeInputs(args)
    # cur.execute("UPDATE " + table + "VALUE (" 
    #     + newArgs[0] + ", " + newArgs[1]+ ", " + newArgs[2] +
    #      ", " + newArgs[3] + ", " + newArgs[4] + ");")
    # command = "UPDATE {} VALUES (%s, %s, %s, %s, %s);".format(table)
    cur.execute("UPDATE " + table + " SET " + query + " WHERE id = " + id + ";")
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

# haven't tested
def deleteEvent(self, id):
    cur = conn.cursor()
    command = "DELETE FROM {} WHERE part_id = %s".format(table)
    cur.execute(command, id)
    conn.commit()    
    cur.close()
    return 'done'
