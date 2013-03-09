import os
import datetime

from flask import Flask, url_for, redirect
from flask.ext.mongoengine import MongoEngine
from flask.ext.mongorest import MongoRest
from flask.ext.mongorest.methods import *
from flask.ext.mongorest.views import ResourceView
from flask.ext.mongorest.authentication import AuthenticationBase
from resources import UserResource, BillResource, AbbreviatedBillResource

app = Flask(__name__, static_url_path='', static_folder='client/app')

# mongodb://<user>:<password>@dharma.mongohq.com:10004/bp-crud

app.config.update(
    TESTING = True,
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

@api.register(name='users', url='/api/users/')
class UserView(ResourceView):
    resource = UserResource
    methods = [Create, Update, Fetch, List, Delete]

@api.register(name='bills', url='/api/bills/')
class BillView(ResourceView):
    resource = BillResource
    methods = [Create, Update, Fetch, List, Delete]

@api.register(name='abbreviatedBills', url='/api/list/bills')
class AbbreviatedBillView(ResourceView):
    resource = AbbreviatedBillResource
    methods = [Fetch, List]
    
    def __init__(self):
        self.resource.select_related = True

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
