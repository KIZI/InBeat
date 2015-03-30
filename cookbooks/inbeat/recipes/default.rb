# InBeat - chef recipe
# @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)

log "Installation started ..."

# update
log "Update from repos"
bash "apt-get update" do
  user "root"
  code <<-EOH
	apt-get update
  EOH
end

# # core
package "zip"
package "git-core"

# nodejs
bash "nodejs" do
	cwd "/tmp/"
	user "root"
	code <<-EOH
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	apt-get install -y nodejs npm
  ln -s /usr/bin/nodejs /usr/bin/node
	EOH
  not_if { File.exist?("/usr/bin/node") }
end
# package "nodejs"
# package "npm"

# pm2
bash "pm2" do
	cwd "#{node['inbeat']['root']}"
	code <<-EOH
	npm install pm2@latest -g --unsafe-perm
	EOH
end

# mongodb
bash "mongo install" do
  user "root"
  cwd "/tmp"
  code <<-EOH
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 2>/dev/null
  echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
  apt-get update
  apt-get install -y mongodb-org
  EOH
  not_if { File.exist?("/etc/mongod.conf") }
end

# nginx
package "nginx"
template "/etc/nginx/sites-available/nginx" do
  source "nginx.erb"
  owner "root"
  group "root"
end
link "/etc/nginx/sites-enabled/nginx" do
  to "/etc/nginx/sites-available/nginx"
  owner "root"
  group "root"
end
link "/etc/nginx/sites-enabled/default" do
  action :delete
  only_if "test -L /etc/nginx/sites-enabled/default"
end
service "nginx" do
  action :restart
end

# R + arules
package "libxml2"
package "libxml2-dev"
package "r-base"
package "r-base-dev"
package "r-cran-xml"
package "libcurl4-gnutls-dev"

template "/tmp/install.R" do
  source "install.erb"
  owner "vagrant"
  group "vagrant"
end

bash "r-packages" do
	cwd "/tmp/"
	user "root"
	code <<-EOH
	Rscript install.R
	EOH
end

# inbeat modules
bash "InBeat nodejs modules" do
  user "root"
  cwd "#{node['inbeat']['root']}"
  code <<-EOH
  ./install.sh
  EOH
end

bash "InBeat start PM2" do
  user "root"
  cwd "#{node['inbeat']['root']}"
  code <<-EOH
  sudo NODE_ENV=development pm2 start processes.json
  EOH
end

log "Installation completed ..."