express = require "express"
fs = require "fs"
marked = require "marked"
url = require "url"
pathmodule = require "path"
config = require "./config"


app = express()

breadcrumbs = (path) ->
	parts = path.split "/"
	p = "/"
	output = []
	for part, i in parts when part isnt ""
		p += part
		p += "/" if i < parts.length-1
		output.push
			link: p
			title: part
	output

parseMeta = (data) ->
	regex = /\$([a-zA-Z0-9]+)\s*:\s*([^\n]*)/g
	attr = {}
	while ((result = regex.exec data) isnt null)
	  attr[result[1]] = result[2];
	  i = result[0].length + result.index
	{
		text: data.substring i+1
		meta: attr
	}

app.use express.static __dirname + '/public'
app.set 'views', __dirname + '/public/views'
app.set 'view engine', 'jade'

app.get "/*", (req, res) ->
	path = pathmodule.normalize __dirname+'/public'+(url.parse req.url).pathname
	path += "index" if (path.charAt path.length-1) is '/'
	path += ".md"
	fs.readFile path, 'utf8', (err, data) ->
		if not err
			meta = parseMeta data
			if meta.meta.redirect
				res.redirect meta.meta.redirect
				return
			res.render "layout",
				title: if meta.meta.title then meta.meta.title else "Title"
				content: if not meta.meta.markdown then marked meta.text else meta.text
				breadcrumbs: breadcrumbs (url.parse req.url).pathname
			return
		else
			config.Logger.warn err
			res.sendStatus 400
			return
	return

app.listen config["inbeat-frontend"]["port"]
console.log "InBeat: Frontend listening on: "+config["inbeat-frontend"]["port"]

process.on "SIGINT", () ->
	console.log "\nshutting down from  SIGINT (Crtl-C)"
	process.exit()
	return