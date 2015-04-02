## EbolaMapper
The EbolaMapper project is primarily concerned with web technology for spatiotemporal visualizations of epidemiological outbreaks, including ebola. The project is developing web page components and hybrid mobile apps, as well as various secondary tools such as data aggregators, validators, converters, and the like. 

This project also defines [the Outbreak Time Series Specification](#outbreak_time_series_spec). The Spec describes a way to markup outbreak time series interchangeably in CSV, JSON, and XML. The Spec describes a data model for epidemiological outbreaks: essentially a sequence of geo-maps, each map a slice-of-time snapshot of new case data.

Oversimplifying, the fundamental messages encoded by The Spec are of the form: **For disease D, during time interval Moment1-to-Moment2, at location L: recorded were X new cases, Y new deaths, etc.**

The Outbreak Time Series Spec defines the data structure and EbolaMapper can visualize the data in a highly interactive manner leveraging only web standard technologies including SVG, JavaScript, CSS, and HTML. Taken together the code and the data spec can be deployed atop existing Internet infrastructure to create a global outbreak monitoring network. The first iteration is intentionally simple yet very useful; it demonstrates how such things can be easily done and will hopefully be built upon in the future in various infectious disease outbreak responses -- seemingly [things are going to be interesting for the foreseeable future.](http://bigstory.ap.org/article/db7d627eb16841f7b78909b035e96e6f/experts-it-was-busy-black-eye-year-disease-control)

### Status
The schedule is to have EbolaMapper minimally viable by 2014-01-09. See, [the wiki](https://github.com/JohnTigue/EbolaMapper/wiki#status) for more details.

### Description
Jokingly, EbolaMapper can be described as **modern open-source anti-virus software**. That phrase can be broken out as follows.

**Modern**: this means highly interactive web browser based visualizations leveraging SVG, via D3.js. EbolaMapper's dependencies works with any browser newer than IE8 (which is already fading fast in late 2014, at less than 10% of global usages, and Microsoft will stop supporting it in 2016). EbolaMapper also uses AnjularJS 1.3.x, another project which recognizes that IE8 is not worth the limitations it imposes on any forward looking effort. So, this is designed to be useful for the foreseeable future.

**Open-source**: The code is Apache 2.0 licensed (that is, do with it freely as you wish, commercially or otherwise). Data for the 2014 Ebola Outbreak in West Africa is also made available, as free open data ([PDDL licensed](http://opendatacommons.org/licenses/pddl/)). We have curated data and provide it via a RESTful web service API based on the [Outbreak Time Series Specification](https://github.com/JohnTigue/EbolaMapper/wiki/Outbreak-Time-Series-Specification-Overview).

**Anti-virus software**: Ebola is a virus and this software project is anti-ebola (and pro-geeky humor).

### Uses
EbolaMapper enables historical outbreak data visualization. The "historical" distinction is made here to imply that, so far, EbolaMapper is a reporting tool and not a forecasting tool. It enables interactive [explorable explanations](http://worrydream.com/ExplorableExplanations/) of an outbreak. The term "situational awareness" might be appropriate. Conceivably, EbolaMapper could be used to "play" the output of a simulated or modeled outbreak. Currently though the main, first goal is to provide tools for reporter and the public to use to quickly comprehend the existing situation, rather than providing explorable explanations of forecasts and models, tools which are also dearly needed but that are not currently within the scope of this project, currently.

EbolaMapper is white label-able, or OEM-able, that is the components can be embedded with a web page (iframe or otherwise) and can be easily styled via CSS to match the rest of a web site's look.

EbolaMapper is licensed under [the Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html) so deploys do not require any attribution. We are, though, interested in showing off quality work in a gallery of deploys. So, drop us a line if you have a link you would like us to add to the list.

Fork (or simply download) this repository if you want to [deploy EbolaMapper](https://github.com/JohnTigue/EbolaMapper/wiki/Deployment-HOWTO). 
- Styling (CSS, etc.) is highly configurable and [well documented](https://github.com/JohnTigue/EbolaMapper/wiki/White-Label). 
- Any data source using the [Outbreak Time Series Specification] (https://github.com/JohnTigue/EbolaMapper/wiki/Outbreak-Time-Series-Specification-Overview) can be specified as an URL parameter, or specified within the code.

[The default settings are sane](http://en.wikipedia.org/wiki/Convention_over_configuration) such that you can just grab a copy, throw the files up on a web server, and quickly be up and running.

## Outbreak Time Series Specification <a name='outbreak_time_series_spec'></a>
This project defines the [Outbreak Time Series Specification](https://github.com/JohnTigue/EbolaMapper/wiki/Outbreak-Time-Series-Specification-Overview). The data model described in the Specification is very specific and simple: the Spec quantifies only population level information for plotting epidemic curves. The Spec is not intended to address things like line listing nor contact tracing; doing so would involve a much greater level of 
complexity, technically and politically.

The Spec is designed to quantify population level information for epidemic curves time series. 
The Spec is not intended to address things like line listing nor contact tracing.
The Spec is really not designed for health care settings with individual patients identified; 
addressing individuals would involve a much greater level of complexity, technically and politically, than what The Spec models.

The Spec can optionally break down case data into sub-populations at a give location.
Arguably, taken to the logical extreme, a population could be of size one, with one population for each person...
But really The Spec is designed for population level data not individual level data. 

The Spec allows for locations to be named states, counties, cities, etc.
Alternatively, locations can also be identified by (long, lat) coordinates, to arbitrary precision.

## Privacy concerns
[Personally Identifiable Information (PII)](http://en.wikipedia.org/wiki/Personally_identifiable_information) concerns are always real but are orthoganal to The Spec. PII could become a concern if the coordinates are very precise or if populations are extremely small. So, if privacy is a concern then simply do not publish high-resolution data on populations and locations. For example, only publish location resolution down to ADM2 subdivision names.

### More info
The best place to go for more information is the [EbolaMapper project's wiki](https://github.com/JohnTigue/EbolaMapper/wiki).

If you want to jump in and get involved:  
- [The To Do List](https://github.com/JohnTigue/EbolaMapper/wiki/To-Do-List) provides an overview of where things are at  
- [The Issue Tracker](https://github.com/JohnTigue/EbolaMapper/issues) is where to find the nitty-gritty

Blog posts about EbolaMapper can be found at:  
http://tigue.com/

