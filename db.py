import os
from urllib import parse
import psycopg2

parse.uses_netloc.append("postgres")
url = parse.urlparse(os.environ["DATABASE_URL"])
#WILL CHANGE THIS TABLE LATER TO THE ONE WE ARE ACTUALLY USING
table = "test_news_table"

conn = psycopg2.connect(
	database=url.path[1:],
	user=url.username,
	password=url.password,
	host=url.hostname,
	port=url.port
)

def getAllItems(self):
	cur = conn.cursor();
	cur.execute("SELECT * FROM " + table)
	sendy = str(cur.fetchall())
	cur.close()
	return sendy

def getItemsWithDate(self, itemDate):
	cur = conn.cursor()
	itemDate = str(itemDate)
	if not checkForQuotes(itemDate):
		itemDate = "'" + itemDate + "'"		
	cur.execute("SELECT * FROM " + table + " WHERE date = " + itemDate)
	sendy = str(cur.fetchall())
	cur.close()
	return sendy

def checkForQuotes(inputStr):
	if inputStr.startswith("'") or inputStr.startswith('"') and inputStr.endswith("'") or inputStr.endswith('"'):
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

def insertIntoTable(self, date, title, summary, link, imgLink):
	cur = conn.cursor()
	args = [date, title, summary, link, imgLink]
	newArgs = sanitizeInputs(args)
	cur.execute("INSERT INTO " + table + " VALUES (" + newArgs[0] + ", " + newArgs[1]+ ", " + newArgs[2] + ", " + newArgs[3] + ", " + newArgs[4] + ");")
	#This makes sure the changes get placed
	conn.commit()
	cur.close()
	