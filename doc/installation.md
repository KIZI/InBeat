# InBeat - Installation
This web page covers the following installation options:
 - [development installation in a virtual machine](#local-and-development-installation-recommended)
 - [automated installation on production server](#production-installation)
 - [manual installation on production server](#manual-installation)
 - [cloud deployment (Amazon EC2)](#deployment-on-amazon-ec2)

## Local and development installation (Recommended)

We provide a set of installation scripts to build a complete image with InBeat services. The following tutorial provides local installation for testing and development purposes. 

### Prerequisites

- [VirtualBox](https://www.virtualbox.org/)
  * tested with virtual box 4.3.2.8
- [Vagrant](https://www.vagrantup.com/)
  * tested with vagrant  1.7.2
  * Plugins
    * vagrant plugin install vagrant-vbguest
    * vagrant plugin install vagrant-omnibus

### Vagrant

```bash
# install virtualbox and vagrant 
# if this does not proceed correctly, install latest version from virtualbox.org and vagrantup.com
sudo apt-get install virtualbox vagrant
# create local copy of inbeat git repository
git clone https://github.com/KIZI/InBeat.git
cd InBeat
# install plugins
vagrant plugin install vagrant-vbguest
vagrant plugin install vagrant-omnibus
# start virtual server and install all dependencies
vagrant up
# login to vagrant virtual server - optional
# vagrant ssh
```

## Production installation

For production installation the same set of scripts can be used for [Chef](https://www.chef.io/) (./cookbooks folder).

* Tested with Ubuntu 14.04.2 (64bit)
	* curl + git-core package installed
* Copy InBeat to /var/www/ on your server (or edit solo.rb and node.json file)
* Use Chef cookbooks to install all services and dependencies

```bash
# install Chef
sudo curl -L https://www.opscode.com/chef/install.sh | sudo bash

# install InBeat
sudo mkdir /var/www/
cd /var/www/
sudo git clone https://github.com/KIZI/InBeat.git
cd InBeat
sudo chef-solo -c ./solo.rb
```


## Manual installation

### Prerequisites

- [MongoDB](https://www.mongodb.org/)
- [Node.js](https://nodejs.org/) + npm
- [R](http://cran.r-project.org/)
- R packages - arules, pmml, XML
  * install.packages(c("arules","pmml","XML"),dependencies=TRUE, repos="http://cran.rstudio.com")
- Optional
  * proxy - [NGINX](http://nginx.org/), ...
  * monitoring service - [PM2](https://github.com/Unitech/pm2), ...
  * Java 8 (only for arules/CBA preference learning)
    * install.packages(c("rCBA"),dependencies=TRUE, repos="http://cran.rstudio.com")

### Installation

You can use InBeat services as a set of independent modules. Each module provides REST API as a self-reliant http service running on a specific port. All settings can be changed either in the global config file (./inbeat/config.js) or in a specific config file for each module (./inbeat/{module}/config.js).

Go to the 'inbeat' directory and run installation of nodejs dependencies:

```bash
# change dir
cd ./inbeat
# install nodejs dependencies
./install.sh
# start services
./start.sh
```

### Deployment on Amazon EC2 
InBeat can be in a few steps run on a cloud Linux instance.

- Install Ubuntu 14.04 cloud image. It is one of the template images in EC2, or download  from https://cloud-images.ubuntu.com/trusty/current/.
- Install git using ``sudo apt-get install git``
- Install InBeat using the process described in the [automated installation on production server](#production-installation)
- Make sure to enable HTTP port 80 for inbound traffic in the security group configuration within the Amazon EC2 dashboard.

Tested with image ami-5189a661.
