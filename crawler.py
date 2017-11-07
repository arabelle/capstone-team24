import newspaper

cnn_paper = newspaper.build('http://cnn.com')

for article in cnn_paper.articles:
    print(article.url)

for category in cnn_paper.category_urls():
    print(category)

ctv_paper = newspaper.build('http://www.ctvnews.ca/')

for category in ctv_paper.category_urls():
    print(category)

article = ctv_paper.articles[0]
