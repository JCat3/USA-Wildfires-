# USA-Wildfires-
Web Visualizations

Please clone this repository to your desktop and then do the following:

1. Open pgAdmin and create a database named `wildfire_db`.
1. Open a query editor in pgAdmin.
1. Paste the first query from the file named `wildfires2.sql` in the query editor and run it to create a table called `wildfire_info`.
1. Paste and run the second query from `wildfires2.sql` to verify that the table was created correctly.
1. Open a GitBash (Windows) or Terminal (Mac) at the repository folder.
1. Type ``source activate PythonData38`` and then hit `ENTER`.
1. Type `jupyter notebook` and hit `ENTER`.
1. Open and run the file named `jupyter_notebook` to load data into the `wildfire_info` table.
1. Navigate to the folder that contains ``app.py`` and launch another GitBash (Windows) or Terminal (Mac). 
1. Type ``python app.py`` and then hit `ENTER`.
1. Observe that the Flask server starts and tells you which port it's running on. Don't close this window.
1. With the Flask server running, enter this address in your Chrome browser: http://127.0.0.1:5000/. You'll see that it loads the index page.
1. Click drop down menu and select a state.
1. Observe both graphs update with data for the selected state.
1. Click the link that says "Acres Burned vs Rainfall". You'll notice that Chrome loads a new page containing an animated line graph.
