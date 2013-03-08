import os
import datetime

from flask import Flask, url_for, redirect
from flask.ext.mongoengine import MongoEngine
from flask.ext.mongorest import MongoRest
from flask.ext.mongorest.views import ResourceView
from flask.ext.mongorest.resources import Resource
from flask.ext.mongorest import operators as ops
from flask.ext.mongorest.methods import *
from flask.ext.mongorest.authentication import AuthenticationBase

app = Flask(__name__, static_url_path='', static_folder='client/app')

# mongodb://<user>:<password>@dharma.mongohq.com:10004/bp-crud

app.config.update(
    MONGODB_SETTINGS = {
        'username': 'her-api-2',
        'password': '0AZIOU0',
        'HOST': 'dharma.mongohq.com',
        'PORT': 10004,
        'DB': 'bp-crud',
        'TZ_AWARE': True,
    },
)

db = MongoEngine(app)
api = MongoRest(app)

'''
User
    
    objectId
    username
    email
    firstName
    lastName
'''

class User(db.Document):
    email = db.EmailField(unique=True, required=True)
    firstName = db.StringField(max_length=50)
    lastName = db.StringField(max_length=50)
    username = db.StringField(max_length=50)

class UserResource(Resource):
    document = User

@api.register(name='users', url='/api/users/')
class UserView(ResourceView):
    resource = UserResource
    methods = [Create, Update, Fetch, List, Delete]

'''
Transaction
    
    objectId
    amount
    payer
    ower
    message
'''

class Transaction(db.Document):
    amount = db.FloatField(required=True)
    payer = db.ReferenceField(User, required=True)
    ower = db.ReferenceField(User, required=True)
    message = db.StringField(max_length=255)

class TransactionResource(Resource):
    document = Transaction

@api.register(name='transactions', url='/api/transactions/')
class TransactionView(ResourceView):
    resource = TransactionResource
    methods = [Create, Update, Fetch, List, Delete]

''' Routes '''

@app.route('/')
def index():
    '''
    with app.test_request_context():
    '''
    return redirect(url_for('static', filename='index.html'))

''' RUN '''

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
