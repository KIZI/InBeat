# InBeat - documentation 

## Installation

* [Local and development installation (Virtual Box + Vagrant)](./installation.md#local-and-development-installation-recommended)
* [Production installation (Chef)](./installation.md#production-installation)
* [Manual installation](./installation.md#manual-installation)

## Tutorials

* [Smart TV Use Case](./tutorial-smarttv.md)
* [News Recommender Use Case](./tutorial-newsrec.md)
* [External RS](./tutorial-external.md)

## Settings

All parameters can be set by edditing the configuration file: config.js (/inbeat/config.js). The recommended option is to edit only the global configuration file.  There is a set of specific configuration files for each InBeat module too (/inbeat/{module}/config.js). Those files inherit from global one and can overwite specific propertes if needed. 
