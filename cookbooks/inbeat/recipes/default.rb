# InBeat - chef recipe
# @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)

log "Installation started ..."

# add java repository
bash "add repository" do
  user "root"
  code <<-EOH     
  add-apt-repository -y ppa:openjdk-r/ppa
  EOH
end

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
package "openjdk-8-jdk"

# nodejs
bash "nodejs" do
	cwd "/tmp/"
	user "root"
	code <<-EOH
  curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
  apt-get install -y nodejs
  apt-get install -y npm || true
  ln -sf /usr/bin/nodejs /usr/bin/node
	EOH
  not_if { File.exist?("/usr/bin/node") }
end

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
bash "r repos" do
  user "root"
  cwd "/tmp/"
  code <<-EOH
  codename=$(lsb_release -c -s)
  echo "deb http://cran.fhcrc.org/bin/linux/ubuntu $codename/" | sudo tee -a /etc/apt/sources.list > /dev/null
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9
  add-apt-repository ppa:marutter/rdev
  apt-get update
  EOH
end

package "libxml2"
package "libxml2-dev"
package "r-base"
package "r-base-dev"
package "r-cran-xml"
package "libcurl4-gnutls-dev"
package "libssl-dev"

template "/tmp/install.R" do
  source "install.erb"
end

bash "r-packages" do
	cwd "/tmp/"
	user "root"
	code <<-EOH
  ln -sfn /usr/lib/jvm/java-8-openjdk-amd64/ /usr/lib/jvm/default-java
  R CMD javareconf
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

# inbeat service
bash "InBeat start PM2" do
  user "root"
  cwd "#{node['inbeat']['root']}"
  code <<-EOH
  sudo NODE_ENV=development pm2 start processes.json
  sudo NODE_ENV=development pm2 save
  sudo NODE_ENV=development pm2 startup
  EOH
end

log "Installation completed ..."