#import functions from flask
from flask import Flask
from flask import render_template
from flask import jsonify
from flask import send_from_directory

#import functions from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func 

#import json
import json

#define database connection
username = 'postgres'
password = 'bootcamp'
database_name = 'wildfire_db'
connection_string = f'postgresql://{username}:{password}@localhost:5432/{database_name}'

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
    
#choropleth map

    session = Session(engine)
    results = session.query(table.fire_size, table.state).all()
    session.close

    choropleth_data = []
    
    for fire_size, state in results:
        dict = {}
        dict["fire size"] = fire_size
        dict["State"] = state
        choropleth_data.append(dict)

    #pie Chart

    session = Session(engine)
    results = session.query(func.count(table.stat_cause_descr), table.stat_cause_descr, table.state).group_by(table.state, table.stat_cause_descr).all()
    session.close
    
    pie_data = []
    
    for cause_count, stat_cause_descr, state in results:
        dict = {}
        dict["Cause"] = stat_cause_descr
        dict["state"] = state
        dict["Count"] = cause_count
        pie_data.append(dict)
    
    map_data = jsonify(choropleth_data)
    pie_data = jsonify(pie_data)

    return homepage
  
@app.route("/lineGraph")
def DataRoute():

#animated line graph
    

    session = Session(engine)
    results = session.query(table.fire_size, table.latitude).all()
    session.close

    line_data = []
    
    for fire_size, latitude in results:
        dict = {}
        dict["fire_size"] = fire_size
        dict["latitude"] = latitude
        line_data.append(dict)
    

    return jsonify(line_data)

    


if __name__ == '__main__':
    app.run(debug=True)
