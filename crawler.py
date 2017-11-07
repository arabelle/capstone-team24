import newspaper

ctv_paper = newspaper.build('http://www.ctvnews.ca/')
print(ctv_paper.size())

for category in ctv_paper.category_urls():
    print(category)

article = ctv_paper.articles[0]
print article.url
article.download()
article.parse()
print(article.title)
print(article.text)
