# -*- mode: ruby -*-
# vi: set ft=ruby :
#
# InBeat - vagrant + virtualbox + ubuntu + chef
# @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
#

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "chef/ubuntu-14.04"

  config.vm.hostname = "inbeat"

  # frontend
  config.vm.network :forwarded_port, guest: 80, host: 8880
  config.vm.network :forwarded_port, guest: 443, host: 8443

  config.vm.synced_folder "inbeat", "/var/www/inbeat"

  config.omnibus.chef_version = :latest

  # vagrant plugin install vagrant-vbguest
  # vagrant plugin install vagrant-omnibus

  config.vm.provision :chef_solo do |chef|
    chef.custom_config_path = "Vagrantfile.chef"
    chef.cookbooks_path = "cookbooks"

    chef.add_recipe "inbeat::default"

    chef.json = {
      "inbeat" => {
        "root" => "/var/www/inbeat"
      }
    }

  end

end
