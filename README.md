## Outbreak Time Series Project
This project is about infectious disease outbreaks, specifically their time series data. This is an attempt to come up with a Web-native data standard for such data. 

The project also involves producing open source Web software for interacting with the data standard, including visualizers such as the Omolumeter; a live demo using 2014 Ebola data is at [omolumeter.com](http://omolumeter.com).

This project defines [the Outbreak Time Series Specification](#outbreak_time_series_spec) (the Spec). The Spec describes an abstract data model for epidemiological outbreaks time series data. The abstract data model can be represented in Web-native data formats as CSV, JSON, and XML.

Oversimplifying, the fundamental messages encoded by the spec are of the form: **For disease D, during time interval I (moment-1 to moment-2), at location L, for population P: recorded were X new cases, Y new deaths, etc.**

Or in more informal terminology, an Outbreak Time Series is an infectious disease's microblog: "Today I killed 100 in Nottatown; I also caused 1500 cases. Over in Whereastan, I killed..."

The Outbreak Time Series Spec defines the data structure, and the `Omolumeter` software visualizes Spec data in a interactive manner. `Omolumeter` is built only on standard Web client technologies such as HTML, JavaScript, CSS, and SVG. It can be hosted on static content Web servers.

### More info
For project status, see [the wiki](https://github.com/JohnTigue/outbreak_time_series/wiki#status).

The best place to go for more information is the [outbreak_time_series project's wiki](https://github.com/JohnTigue/outbreak_time_series/wiki).

If you want to jump in and get involved:  
- [The To Do List](https://github.com/JohnTigue/outbreak_time_series/wiki/To-Do-List) provides an overview of where things are at  
- [The Issue Tracker](https://github.com/JohnTigue/outbreak_time_series/issues) is where to find the nitty-gritty

Blog posts about the project can be found at:  
http://tigue.com/

