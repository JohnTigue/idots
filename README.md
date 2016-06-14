## Outbreak Time Series Project
This project is about infectious disease outbreaks, specifically their time series data. This is an attempt to come up with a Web-native data standard for such data. 

The project also involves producing open source Web software for interacting with the data standard, including visualizers such as the Omolumeter; a live demo using 2014 Ebola data is at [omolumeter.com](http://omolumeter.com).

This project defines [the Outbreak Time Series Specification](#outbreak_time_series_spec). The Spec describes a way to markup outbreak time series interchangeably in CSV, JSON, and XML. The Spec describes a data model for epidemiological outbreaks: essentially a sequence of geo-maps, each map a slice-of-time snapshot of new case data. The spec has the capacity to define arbitrary affected sub-populations (e.g. first responders, children, etc.). Oversimplifying, the fundamental messages encoded by the spec are of the form: **For disease D, during time interval I (moment-1 to moment-2), at location L, for population P: recorded were X new cases, Y new deaths, etc.**

In more informal terminology, an Outbreak Time Series is an infectious disease's microblog: "Today I killed 100 in Nottatown; I also caused 1500 cases. Over in Whereastan, I killed..."

The Outbreak Time Series Spec defines the data structure, and the `Omolumeter` software can visualize the data in a highly interactive manner leveraging only web standard technologies including SVG, JavaScript, CSS, and HTML. 

### Status
This project is a side project, as such there is no scheduled attached. See, [the wiki](https://github.com/JohnTigue/outbreak_time_series/wiki#status) for more details.

### Uses
outbreak_time_series enables historical outbreak data visualization. The "historical" distinction is made here to imply that, so far, outbreak_time_series is a reporting tool and not a forecasting tool. It enables interactive [explorable explanations](http://worrydream.com/ExplorableExplanations/) of an outbreak. The term "situational awareness" might be appropriate. Conceivably, outbreak_time_series could be used to "play" the output of a simulated or modeled outbreak. Currently though the main, first goal is to provide tools for reporter and the public to use to quickly comprehend the existing situation, rather than providing explorable explanations of forecasts and models, tools which are also dearly needed but that are not currently within the scope of this project, currently.

outbreak_time_series is white label-able, or OEM-able, that is the components can be embedded with a web page (iframe or otherwise) and can be easily styled via CSS to match the rest of a web site's look.

outbreak_time_series is licensed under [the Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html) so deploys do not require any attribution. We are, though, interested in showing off quality work in a gallery of deploys. So, drop us a line if you have a link you would like us to add to the list.

Fork (or simply download) this repository if you want to [deploy outbreak_time_series](https://github.com/JohnTigue/outbreak_time_series/wiki/Deployment-HOWTO). 
- Styling (CSS, etc.) is highly configurable and [well documented](https://github.com/JohnTigue/outbreak_time_series/wiki/White-Label). 
- Any data source using the [Outbreak Time Series Specification] (https://github.com/JohnTigue/outbreak_time_series/wiki/Outbreak-Time-Series-Specification-Overview) can be specified as an URL parameter, or specified within the code.

[The default settings are sane](http://en.wikipedia.org/wiki/Convention_over_configuration) such that you can just grab a copy, throw the files up on a web server, and quickly be up and running.

## Outbreak Time Series Specification <a name='outbreak_time_series_spec'></a>
This project defines the [Outbreak Time Series Specification](https://github.com/JohnTigue/outbreak_time_series/wiki/Outbreak-Time-Series-Specification-Overview). The data model described in the specification is very specific and simple: the spec quantifies only population level information for plotting epidemic curves. The spec is not intended to address things like line listing nor contact tracing; doing so would involve a much greater level of 
complexity, technically and politically.

The spec is designed to quantify population level information for epidemic curves time series. 
The spec is not intended to address things like line listing nor contact tracing.
The spec is really not designed for health care settings with individual patients identified; 
addressing individuals would involve a much greater level of complexity, technically and politically, than what The spec models.

The spec can optionally break down case data into sub-populations at a give location.
Arguably, taken to the logical extreme, a population could be of size one, with one population for each person...
But really The spec is designed for population level data not individual level data. 

The spec allows for locations to be named states, counties, cities, etc.
Alternatively, locations can also be identified by (long, lat) coordinates, to arbitrary precision.

## Privacy concerns
[Personally Identifiable Information (PII)](http://en.wikipedia.org/wiki/Personally_identifiable_information) concerns are always real but are orthoganal to The spec. PII could become a concern if the coordinates are very precise or if populations are extremely small. So, if privacy is a concern then simply do not publish high-resolution data on populations and locations. For example, only publish location resolution down to ADM2 subdivision names.

### More info
The best place to go for more information is the [outbreak_time_series project's wiki](https://github.com/JohnTigue/outbreak_time_series/wiki).

If you want to jump in and get involved:  
- [The To Do List](https://github.com/JohnTigue/outbreak_time_series/wiki/To-Do-List) provides an overview of where things are at  
- [The Issue Tracker](https://github.com/JohnTigue/outbreak_time_series/issues) is where to find the nitty-gritty

Blog posts about outbreak_time_series can be found at:  
http://tigue.com/

