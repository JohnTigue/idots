http://keepachangelog.com/
### Added
### Changed
### Removed
### Fixed

# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.4.5] - 2016-05-07
### Changed
- Epicurves:
  - removed 4th chart line b/c uninteresting and slowing things down
  - removed legend and it's filtering capability
### Fixed
- Time series table UI:
  - deaths and cases bars are now both using the same scaling factor max value (max of cases xor deaths).
  - bars no longer getting too wide for screen and messing up row alignment of #s and flag
  - cleaner alignment and padding
  - within a period, locations sorted by cumulative death. Before there was no sorting, random changes from day to day.

## [0.4.4] - 2016-05-05
### Changed
- Epicurves: general formatting of chart

## [0.4.3] - 2016-05-05
### Added
- Epicurves: Date formatting on ticks shortened to: MMM 'YY
### Fixed
- Time Series Table View: dates were not sorted chronologically. Now earliest dates first in list, and then chronological.
- Epicurves: chart now takes up all screen real estate allocated to it.
### Changed
- Epicurves: less ticks on axis

## [0.4.2] - 2016-05-04
### Added
- Epicurves: Date formatted ticks for charts
### Fixed
- Epicurves: Too many ticks on x axis

## [0.4.1] - 2016-05-03
### Changed
- Epicurves: styling of chart lines	

## [0.4.0] - 2016-05-03
### Added
- Epicurves: first release
### Changed
- Time series table: styling
	
## [0.3.2] - 2016-04-28
### Added
- Time series table and raw data table: Date formatting
### Fixed
- Time Series Table View: height pushed to full screen. Was only taking up partial height of remaining flex room

## [0.3.1] - 2016-04-28
### Fixed
### Testing
- Time Series Table View height problems in FF and Safari, after some user nav
### Changed
- Color scheme experiments

## [0.3.0] - 2016-04-24
### Added
- OTSS Object Model build from raw CSV rows
- Time Series Table View Component

## [0.2.x] - 2016-04
0.2.x ended around 0.2.4 with various trivial fixes along the way.
### Added
- The 0.2.x sequence was mainly about loading CSV files and dumping raw table data to a paginated table view Angular Component.
- SideNav menu, hides behind hamburger stack on narrow screens

## [0.1.0] - 2016-04
0.1.x was just getting a minimal modern Angular
app set-up: Angular 1.5 Components with a Material Design skin.
