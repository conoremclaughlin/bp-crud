from documents import User, Bill
from flask.ext.mongorest.resources import Resource

class UserResource(Resource):
    document = User

class BillResource(Resource):
    document = Bill

class AbbreviatedBillResource(Resource):
    document = Bill
    related_resources = {
        'ower': UserResource,
        'payer': UserResource
    }