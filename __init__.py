import pymongo
#from flask_pymongo import PyMongo
from company_info import get_profiles_info

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)


# if database project_2_db exists, nothing will be done
# if not exist, get_profiles_info() will retrieve from quandl - zack company profiles API

dblist = client.list_database_names()
if "project_2_DB" in dblist:
    print("The database exists.")
else:
    db = client.project_2_db
    profiles = get_profiles_info()
    for profile in profiles:
        print(profile)
    db.profiles.insert_many([profiles])
    
    
#from flask import Flask, render_template, redirect
#from flask_pymongo import PyMongo
#import scrape_mars

# Create an instance of Flask
#app = Flask(__name__,
#            static_url_path='',
#           static_folder='static')


# Use PyMongo to establish Mongo connection
#mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_mission_app")


# Route to render index.html template using data from Mongo
#@app.route("/")
#def home():

    # Find one record of data from the mongo database
#    mars_data = mongo.db.mars_data.find_one()

    # Return template and data
#    return render_template("index.html", mars_data=mars_data)
