from mongoengine import *

'''
    User
    
    objectId
    username
    email
    firstName
    lastName
'''

class User(Document):
    email = EmailField(unique=True, required=True)
    firstName = StringField(max_length=50)
    lastName = StringField(max_length=50)
    username = StringField(max_length=50)

'''
    Bill
    
    objectId
    amount
    payer
    ower
    message
'''

class Bill(Document):
    amount = FloatField(required=True)
    payer = ReferenceField(User, required=True)
    ower = ReferenceField(User, required=True)
    message = StringField(max_length=255)
