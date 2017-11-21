import newspaper
import db
from newspaper import news_pool

def download_articles(news_websites):
    papers = []
    for site in news_websites:
        papers.append(newspaper.build(site))
    news_pool.set(papers, threads_per_source=2)
    news_pool.join()
    for paper in papers:
        print("{}: {} articles".format(paper.brand, len(paper.articles)))
    return papers

def get_relevant_articles(papers):
    for paper in papers:
        for article in articles:
            pass

def insert_db(article):
    date = article.publish_date if article.publish_date is not None else ""
    imgLink = article.top_image if article.top_image is not None else ""
    link = article.url
    title = article.title
    summary = get_summary(article.text)
    db.insertIntoTable(date, title, summary, link, imgLink)

def get_summary(text):
    summary = ""
    # Get first 4 sentences
    for sentence in text.split('.')[:5]:
        summary += sentence + " "
    return summary

#news_websites = ['http://www.nytimes.com', 'http://www.huffingtonpost.ca/','http://www.cnn.com/world']
#nyt_paper = newspaper.build('http://www.nytimes.com')
#huff_paper = newspaper.build('http://www.huffingtonpost.ca/')
google_paper = newspaper.build("http://vancouversun.com/")

print("SOURCE: {}".format(google_paper.brand))
print("Google News: {} articles\n".format(len(google_paper.articles)))

article = google_paper.articles[0]
article.download()
insert_db(article)
"""print("Url: " + article.url)
article.parse()
print("Title: " + article.title)
print(article.text)
print(article.publish_date)
print(article.top_image)
article.nlp()
print(article.keywords)"""
