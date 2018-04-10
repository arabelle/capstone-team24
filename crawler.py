import newspaper
import db
import datetime
from newspaper import news_pool

news_websites = ['https://www.ctvnews.ca/']

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
        for article in paper.articles:
            insert_db(article)

def insert_db(article):
    if article.title is None:
        return
    title = article.title.replace('"', r'\"')
    link = article.url
    date = article.publish_date.strftime("%Y-%m-%d") if article.publish_date is not "" else datetime.datetime.now().strftime("%Y-%m-%d")
    imgLink = article.top_image if article.top_image is not None else ""
    summary = article.text
    print("Date: " + date)
    print("Url: " + article.url)
    print("Title: " + title)
    db.insertCrawlerEventIntoTable(date, title, summary, link, imgLink)

def get_summary(text):
    summary = ""
    # Get first 4 sentences
    for sentence in text.split('.')[:5]:
        summary += sentence + " "
    return text.replace("'", r"\'").replace('"', r'\"')

def run_crawler():
    papers = download_articles(news_websites)
    get_relevant_articles(papers)
    print("Done running crawler.")
