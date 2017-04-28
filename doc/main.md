# InBeat - documentation 

## Installation

 - [development installation in a virtual machine](./installation.md#local-and-development-installation-recommended)
 - [automated installation on production server](./installation.md#production-installation)
 - [manual installation on production server](./installation.md#manual-installation)
 - [cloud deployment (Amazon EC2)](./installation.md#deployment-on-amazon-ec2)

## Tutorials

* [Basic tutorial](./tutorial-newsrec.md) Shows how to use InBeat as a recommender system on a website using association rules.
* [Advanced: sensor support and ontologies](./tutorial-smarttv.md) This tutorial is accompanied by a [demo](http://inbeat.eu/demo/base/) using a SmartTV emulated by YouTube player.
* [Integrating InBeat with other recommender frameworks](./tutorial-external.md) Shows how to use InBeat in conjunction with other recommender algorithms, such as various collaborative  filtering, implemented in other recommender toolboxes  [MyMediaLite](http://www.mymedialite.net/).

## Web UI
* [Admin console](./admin-ui.md) Documentataion of the Web-based user interface.

## REST APIs

- [GAIN REST API](../inbeat/inbeat-frontend/public/gain/docs/api.txt) ([on-line](http://inbeat.eu/gain/docs/rest))
- [PL REST API](../inbeat/inbeat-frontend/public/pl/docs/api.txt) ([on-line](http://inbeat.eu/pl/docs/rest))
- [RS REST API](../inbeat/inbeat-frontend/public/rs/docs/api.txt) ([on-line](http://inbeat.eu/rs/docs/rest))

## Extensions

Currently supported main custom extensions (additional are coming soon!):

- [Custom interceptors](./extensions.md#custom-interceptors)
- [Custom PL miners](./extensions.md#custom-miners)

## Settings

All parameters can be set by editing the configuration file: config.js (/inbeat/config.js). The recommended option is to edit only the global configuration file.  There is a set of specific configuration files for each InBeat module, too (/inbeat/{module}/config.js). Those files inherit from the global configuration and can overwrite specific properties if needed. 
