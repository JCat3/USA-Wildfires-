#import functions from flask
from flask import Flask
from flask import render_template
from flask import jsonify
from flask import send_from directory

#import functions from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

#import json
import json

#define database connection
username = 'postgres'
password = 'bootcamp'
database_name = 'wildfire_db'
connection_string = f'postgresql://{username}:{password}@localhost:5432{database_name}'

#connect to database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect = True)

#choose our table
table = base.classes.wildfire_info

#instantiate flask
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/")
def IndexRoute():
    homepage = render_template("index.html")
    return homepage