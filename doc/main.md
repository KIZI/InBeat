# InBeat - documentation 

## Installation

 - [development installation in a virtual machine](#local-and-development-installation-recommended)
 - [automated installation on production server](#production-installation)
 - [manual installation on production server](#manual-installation)
 - [cloud deployment (Amazon EC2)](#deployment-on-amazon-ec2)

## Tutorials

* [Basic tutorial](./tutorial-newsrec.md) Shows how to use InBeat as a recommender system on a website using association rules.
* [Advanced: sensor support and ontologies](./tutorial-smarttv.md) This tutorial is accompanied by a [demo](http://inbeat.eu/demo/base/) using a SmartTV emulated by YouTube player.
* [Integrating InBeat with other recommender frameworks](./tutorial-external.md) Shows how to use InBeat in conjunction with other recommender algorithms, such as various collaborative  filtering, implemented in other recommender toolboxes  [MyMediaLite](http://www.mymedialite.net/).

## Settings

All parameters can be set by edditing the configuration file: config.js (/inbeat/config.js). The recommended option is to edit only the global configuration file.  There is a set of specific configuration files for each InBeat module, too (/inbeat/{module}/config.js). Those files inherit from the global configuration and can overwite specific properties if needed. 
