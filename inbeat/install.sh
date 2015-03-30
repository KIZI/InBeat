# npm install
( cd /var/www/inbeat/inbeat-bl && npm install --production )
( cd /var/www/inbeat/inbeat-frontend && npm link ../inbeat-bl && npm install --production )
( cd /var/www/inbeat/inbeat-gain && npm link ../inbeat-bl && npm install --production )
( cd /var/www/inbeat/inbeat-pl && npm link ../inbeat-bl && npm install --production )
( cd /var/www/inbeat/inbeat-rs && npm link ../inbeat-bl && npm install --production )