## outbreak_time_series
The live demo is at [omolumeter.com](http://omolumeter.com), using the data from the 2014 Ebola outbreak in West Africa.

The `outbreak_time_series` project defines a web-friendly data standard for outbreak time series. Additionally the project is developing open source web technology for visualizing the spatiotemporal progress of epidemiological outbreaks. Primarily that means web page components and hybrid mobile apps, but there is also a need for various secondary tools such as data aggregators, validators, converters, and the like. 

The goal is to make widely available open source equivalents along the lines of the follow examples. Note: the examples by Simon Johnson are already [open source](https://github.com/SimonbJohnson/Ebola-Timeline-Map/blob/master/LICENSE) and can be modified to read data compliant with the Outbreak Time Series spec, which is defined as part of this project. **None of the following are based on software from this repository:**  

<a href='https://github.com/JohnTigue/outbreak_time_series/wiki/Gallery-of-Ebola-Visualizations-Found-Across-the-Web'>![](https://raw.githubusercontent.com/JohnTigue/ebola-viz-twumbshots/gh-pages/not-golden-ratio/nine-up-vizes.png)</a>

This project defines [the Outbreak Time Series Specification](#outbreak_time_series_spec). The Spec describes a way to markup outbreak time series interchangeably in CSV, JSON, and XML. The Spec describes a data model for epidemiological outbreaks: essentially a sequence of geo-maps, each map a slice-of-time snapshot of new case data. The spec has the capacity to define arbitrary affected sub-populations (e.g. first responders, children, etc.). Oversimplifying, the fundamental messages encoded by the spec are of the form: **For disease D, during time interval I (moment-1 to moment-2), at location L, for population P: recorded were X new cases, Y new deaths, etc.**

The Outbreak Time Series Spec defines the data structure and the `Omolumeter` software can visualize the data in a highly interactive manner leveraging only web standard technologies including SVG, JavaScript, CSS, and HTML. Taken together the code and the data spec can be deployed atop existing Internet infrastructure to create a global outbreak monitoring network. The first iteration is intentionally simple yet useful; it demonstrates how such things can be easily done and will hopefully be built upon in the future in various infectious disease outbreak responses -- seemingly [things are going to be interesting for the foreseeable future.](http://bigstory.ap.org/article/db7d627eb16841f7b78909b035e96e6f/experts-it-was-busy-black-eye-year-disease-control)

(Note: this project was originally called EbolaMapper. Eventually the scope grew to encompass tracking any infectious disease outbreaks. There is nothing Ebola specific about the project. Therefore the name was changed to `outbreak_time_series`.)

### Status
This project is a side project, as such there is no scheduled attached. See, [the wiki](https://github.com/JohnTigue/outbreak_time_series/wiki#status) for more details.

### Description
With tongue in cheek, `outbreak_time_series` can be described as **modern open-source anti-virus software**. That phrase can be broken out as follows.

**Modern**: this means highly interactive web browser based visualizations leveraging SVG, via D3.js. outbreak_time_series's dependencies works with any browser newer than IE8 (which is already fading fast in late 2014, at less than 10% of global usages, and Microsoft will stop supporting it in 2016). outbreak_time_series also uses AnjularJS 1.3.x, another project which recognizes that IE8 is not worth the limitations it imposes on any forward looking effort. So, this is designed to be useful for the foreseeable future.

**Open-source**: The code is Apache 2.0 licensed (that is, do with it freely as you wish, commercially or otherwise). Data for the 2014 Ebola Outbreak in West Africa is also made available, as free open data ([PDDL licensed](http://opendatacommons.org/licenses/pddl/)). We have curated data and provide it via a RESTful web service API based on the [Outbreak Time Series Specification](https://github.com/JohnTigue/outbreak_time_series/wiki/Outbreak-Time-Series-Specification-Overview).

**Anti-virus software**: Ebola is a virus and this software project is anti-ebola (and pro-geeky humor).

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

