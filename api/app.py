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

app.config.update(
    TESTING = True,
    MONGODB_SETTINGS = {
        'HOST': 'localhost',
        'PORT': 27017,
        'DB': 'mongorest_example_app',
        'TZ_AWARE': True,
    },
)

db = MongoEngine(app)
api = MongoRest(app)


'''
Schemas
    
User
    
    objectId
    username
    email
    firstName
    lastName

Transaction
    
    objectId
    amount
    payer
    ower
    message
'''

class User(db.Document):
    email = db.EmailField(unique=True, required=True)
    firstName = db.StringField(max_length=50)
    lastName = db.StringField(max_length=50)
    username = db.StringField(max_length=50)

class UserResource(Resource):
    document = User

class Transaction(db.Document):
    amount = db.FloatField(required=True)
    payer = db.ReferenceField(User, required=True)
    ower = db.ReferenceField(User, required=True)
    message = db.StringField(max_length=255)

@api.register(name='users', url='/api/users/')
class UserView(ResourceView):
    resource = UserResource
    methods = [Create, Update, Fetch, List, Delete]

class TransactionResource(Resource):
    document = Transaction
    filters = {
        'email': [ops.Exact, ops.Startswith, ops.In],
    }

@api.register(name='transactions', url='/api/transactions/')
class TransactionView(ResourceView):
    resource = TransactionResource
    methods = [Create, Update, Fetch, List, Delete]

@app.route('/')
def index():
    '''
    with app.test_request_context():
    '''
    return redirect(url_for('static', filename='index.html'))

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
