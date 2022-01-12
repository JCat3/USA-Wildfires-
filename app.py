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

    return homepage
  
#animated line graph display page 

@app.route("/lineGraph")
def lineGraphRoute():  
    linePage = render_template("lineGraph.html")

    return linePage


#animated line graph api endpoint

@app.route("/lineGraph_data")
def lineDataRoute():    

    session = Session(engine)
    results = session.query(table.disc_pre_year, func.sum(table.fire_size).label("sum_fire_size"), func.avg(table.prec_pre_7).label("sum_precipitation")).group_by(table.disc_pre_year).\
        order_by(table.disc_pre_year).all()
    session.close

    line_data = []
    
    for date, sum_fire_size, sum_precipitation in results:
        dict = {}
        dict["Date"] = date
        dict["Fire_Size"] = sum_fire_size
        dict["Precipitation"] = sum_precipitation
        line_data.append(dict)
    

    return jsonify(line_data)


#choropleth map api endpoint

@app.route("/pie_data")
def pieDataRoute():
        
    #pie Chart

    session = Session(engine)
    results = session.query(func.count(table.stat_cause_descr), table.stat_cause_descr, table.state).group_by(table.state, table.stat_cause_descr).all()
    session.close
    
    pie_data = []
    
    for cause_count, stat_cause_descr, state in results:
        dict = {}
        dict["Cause"] = stat_cause_descr
        dict["State"] = state
        dict["Count"] = cause_count
        pie_data.append(dict)
    
    pie_data = jsonify(pie_data)

    return pie_data


#choropleth map api endpoint

@app.route("/choropleth_data")
def choroplethDataRoute():

    session = Session(engine)
    results = session.query(func.sum(table.fire_size), table.state, func.count(table.state)).group_by(table.state).all()
    session.close

    map_data = []
    
    for fire_size, state, fire_count in results:
        dict = {}
        dict["FireSize"] = fire_size
        dict["State"] = state
        dict["FireCount"] = fire_count
        map_data.append(dict)
    
    map_data = jsonify(map_data)

    return map_data

@app.route("/geojson/<filename>")
def GeoJsonRoute(filename):    

    filepath = f"static/data/{filename}"

    try: 
        with open(filepath) as f:    
            geojson_data = json.load(f)
    except:
        geojson_data = {'Error': f'{filename} not found on server!'}

    return jsonify(geojson_data)    

if __name__ == '__main__':
    app.run(debug=True)
