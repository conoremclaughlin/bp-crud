from resources import UserResource, AbbreviatedBillResource
from flask.ext.mongorest.methods import *
from flask.ext.mongorest.views import ResourceView

class UserView(ResourceView):
    resource = UserResource
    methods = [Create, Update, Fetch, List, Delete]

class AbbreviatedBillView(ResourceView):
    resource = AbbreviatedBillResource
    methods = [Create, Update, Fetch, List, Delete]
    
    def __init__(self):
        self.resource.select_related = True