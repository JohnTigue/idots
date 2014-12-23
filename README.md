## EbolaMapper
The EbolaMapper project is primarily concerned with Web technology for visualizing epidemiological outbreaks, including ebola. The project is developing Web page components and hybrid mobile apps, as well as various secondary tools such as data validators, converters, and the like. 

This project also defines the [Outbreak Time Series Specification](https://github.com/JohnTigue/EbolaMapper/wiki/Outbreak-Time-Series-Specification-Overview). The data model described in the Specification is very specific and simple: **the Spec quantifies only population level information for plotting epidemic curves. [Personally Identifiable Information (PII)](http://en.wikipedia.org/wiki/Personally_identifiable_information) is explicitly out of scope.** The Spec is not intended to address things like line listing nor contact tracing; doing so would involve a much greater level of complexity, technically and politically.

The Outbreak Time Series Spec defines the data structure and EbolaMapper can then visualize the data using highly interactive Web standard technologies including SVG, JavaScript, CSS, and HTML. Taken together the code and the data spec can be deployed atop existing Internet infrastructure to create a global outbreak monitoring network. The first iteration is intentionally simple yet very useful; it demonstrates how such things can be easily done and will hopefully be built upon in the future in various infectious disease outbreak responses -- seemingly [things are going to be interesting for the foreseeable future.](http://bigstory.ap.org/article/db7d627eb16841f7b78909b035e96e6f/experts-it-was-busy-black-eye-year-disease-control)

### Status
The schedule is to have EbolaMapper minimally viable by 2014-01-09. See, [the wiki](https://github.com/JohnTigue/EbolaMapper/wiki#status) for more details.

### Description
Jokingly, EbolaMapper can be described as **modern open-source anti-virus software**. That phrase can be broken out as follows.

**Modern**: this means highly interactive Web browser based visualizations leveraging SVG, via D3.js. EbolaMapper's dependencies works with any browser newer than IE8 (which is already fading fast in late 2014, at less than 10% of global usages, and Microsoft will stop supporting it in 2016). EbolaMapper also uses AnjularJS 1.3.x, another project which recognizes that IE8 is not worth the limitations it imposes on any forward looking effort. So, this is designed to be useful for the foreseeable future.

**Open-source**: The code is Apache 2.0 licensed (that is, do with it freely as you wish, commercially or otherwise). Data for the 2014 Ebola Outbreak in West Africa is also made available, as free open data ([PDDL licensed](http://opendatacommons.org/licenses/pddl/)). We have curated data and provide it via a RESTful Web service API based on the [Outbreak Time Series Specification](https://github.com/JohnTigue/EbolaMapper/wiki/Outbreak-Time-Series-Specification-Overview).

**Anti-virus software**: Ebola is a virus and this software project is anti-ebola (and pro-geeky humor).

### Uses
EbolaMapper is white label-able, or OEM-able, that is the components can be embedded with a Web page (iframe or otherwise) and can be easily styled via CSS to match the rest of a Web site's look.

EbolaMapper is licensed under [the Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html) so deploys do not require any attribution. We are, though, interested in showing off quality work in a gallery of deploys. So, drop us a line if you have a link you would like us to add to the list.

Fork (or simply download) this repository if you want to [deploy EbolaMapper](https://github.com/JohnTigue/EbolaMapper/wiki/Deployment-HOWTO). 
- Styling (CSS, etc.) is highly configurable and [well documented](https://github.com/JohnTigue/EbolaMapper/wiki/White-Label). 
- Any data source using the [Outbreak Time Series Specification] (https://github.com/JohnTigue/EbolaMapper/wiki/Outbreak-Time-Series-Specification-Overview) can be specified as an URL parameter, or specified within the code.

[The default settings are sane](http://en.wikipedia.org/wiki/Convention_over_configuration) such that you can just grab a copy, throw the files up on a Web server, and quickly be up and running.

### More info
The best place to go for more information is the [EbolaMapper project's wiki](https://github.com/JohnTigue/EbolaMapper/wiki).

If you want to jump in and get involved:  
- [The To Do List](https://github.com/JohnTigue/EbolaMapper/wiki/To-Do-List) provides an overview of where things are at  
- [The Issue Tracker](https://github.com/JohnTigue/EbolaMapper/issues) is where to find the nitty-gritty

Blog posts about EbolaMapper can be found at:  
http://tigue.com/

