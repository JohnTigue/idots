# Geolibrarian
This directory contains multiple JavaScript files which
are all related to providing librarian services for geographic
information.

Currently these are interacted with programmically, although
command line tools could easily be derived.

## CachingGeocoder
CachingGeocoder geo-codes location names: it maps
from names to coordinates, returning Promises.

As the name implies it also maintains a cache of said Promises. Further,
there is a mechanism for pre-fetching individual mappings, so
that the cache can be pre-populated without network traffic, say,
during app initiation i.e. the cache can be primed.
 
Note, using [Google's terminology](https://developers.google.com/maps/documentation/geocoding/):
- "geocoding" is mapping from names to coordinates
- "reserve geocoding" is mapping location to name

[OSM uses the same terminology](http://wiki.openstreetmap.org/wiki/Nominatim).

At this time, CachingGeocoder does not do reverse geocoding.

CachingGeocoder is solely an in-memory thing.
Issues of where (or even, if) persistence happens is a different issue.

## CacheAssistant  
This project does have such a cache persistance concerned thing:
CacheAssistent (in CacheAssistent.js). CacheAssistant can initialize a
CachingGeocoder with pre-fetched data read from a local file (or other
data source) as well as serialize the cache at any moment.

CachingGeocoder is Observable. A CacheAssistant can observe a
CachingGeocoder to get notified of when new info is in the
cache. Deciding what to do with those notifications it not
CachingGeocoders concern. A CacheAssistant might, say, wish to save
to storage upon each new entry in a CachingGeocoder.




