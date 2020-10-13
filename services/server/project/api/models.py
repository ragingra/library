# services/server/project/api/models.py

from project import db

from datetime import datetime


class Library(db.Model):
    __tablename__ = 'sparklyurl_links'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    repository = db.Column(db.String(50))
    download_count = db.Column(db.Integer)
    issue_count = db.Column(db.Integer)
    author = db.Column(db.String(50))
    user_rating = db.Column(db.Integer, default=0)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name, repository, download_count, issue_count, author, user_rating):
        self.name = name
        self.repository = repository
        self.download_count = download_count
        self.issue_count = issue_count
        self.author = author
        self.user_rating = user_rating

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'repository': self.repository,
            'download_count': self.download_count,
            'issue_count': self.issue_count,
            'author': self.author,
            'user_rating': self.user_rating,
            'date_added': self.date_added.strftime("%m/%d/%Y, %H:%M:%S")
        }
