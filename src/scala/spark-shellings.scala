/** This file is simply a collection of code saved off from spark-shell sessions, while I was munging CSV data sources.
  * Some of it could become the basis for various data importers.
  */

/** The following block of code analyzes the scheme of the data from HDX's ebola dashboard.
  * 
  * For more discussion of the output, see:
  *   https://github.com/JohnTigue/EbolaMapper/wiki/JSON-Ebola2014-Data-Found-on-the-Web
  * 
  * Here is the curl command to fetch the data via a POST; save it to hdx_ebola_dashboard_data.json:
  * curl 'https://data.hdx.rwlabs.org/api/3/action/datastore_search_sql' --data $'%7B%22sql%22%3A%22SELECT%20%5C%22Indicator%5C%22%2C%20%5C%22Date%5C%22%2C%20%5C%22Country%5C%22%2C%20value%20FROM%20%5C%22f48a3cf9-110e-4892-bedf-d4c1d725a7d1%5C%22%20WHERE%20%5C%22Indicator%5C%22%3D\'Cumulative%20number%20of%20confirmed%2C%20probable%20and%20suspected%20Ebola%20deaths\'%20OR%20%5C%22Indicator%5C%22%3D\'Cumulative%20number%20of%20confirmed%2C%20probable%20and%20suspected%20Ebola%20cases\'%20ORDER%20BY%20%5C%22Date%5C%22%22%7D' 
  */
val aSqlContext = new org.apache.spark.sql.SQLContext( sc )
val hdxData = aSqlContext.jsonFile( "hdx_ebola_dashboard_data.json" )
hdxData.printSchema
