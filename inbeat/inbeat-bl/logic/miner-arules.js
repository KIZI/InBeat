var MinerArules = function() {

    // modules
    var readline = require('readline');
    var stream = require('stream');
    var async = require('async');
    var fs = require('fs');
    var _ = require('underscore');

    var temp = require('temp');
    temp.track();

    var UserInterest = require('./user-interest');
    var PLData = require('./../model/pl-data');

    // perform mining task
    var _task = function(name,task,callback){
        var sys = require('sys')
        var exec = require('child_process').exec;
        PLData.findById(name,function(err,data){
            if(err || !data || !data.content){
                callback(err,null);
                return;
            }
            temp.mkdir("miner-arules",function(err, dirPath) {
                UserInterest.formatExportOutput(JSON.parse(data.content), 'text/csv', {}, function(err, out) {
                    fs.writeFileSync(dirPath+"/"+name+".csv", out);
                    exec('Rscript "' + __dirname + '/../lib/arules.R" ' + dirPath+"/"+name+".csv " + dirPath+"/"+name+"_rules.csv "+task.support+" "+task.confidence, function (error, stdout, stderr) {
                        if(error) {
                            callback(null, {error: error, stdout: stdout, stderr: stderr});
                        } else {
//                            _csvToJson(dirPath+"/"+name+"_rules.csv",callback);
                            callback(null, fs.readFileSync(dirPath+"/"+name+"_rules.csv"));
                        }
                    });
                });
            });
        });
    };

    var _csvToJson = function(path,callback){
        var instream = fs.createReadStream(path);
        var outstream = new stream;
        outstream.readable = true;
        outstream.writable = true;
        var rl = readline.createInterface({
            input: instream,
            output: outstream,
            terminal: false
        });
        var rules = [];
        rl.on('line', function(line) {
            var parts = line.split(';');
            if(parts.length==3 && parts[0]!=='rules') {
                var rule = {antecedent: {}, consequent: {}};
                rule.support = parseFloat(parts[1]);
                rule.confidence = parseFloat(parts[2]);
                rule.text = parts[0].replace('"',"");
                var parsedRule = rule.text.replace(/[ {}]/gi,"").split("=>");
                async.each(parsedRule[0].split(","),function(item,cb){
                    var p = item.split("=");
                    rule.antecedent[p[0]] = p[1];
                    cb();
                });
                async.each(parsedRule[1].split(","),function(item,cb){
                    var p = item.split("=");
                    rule.consequent[p[0]] = p[1];
                    cb();
                });
                rules.push(rule);
            }
        });
        rl.on('close',function(){
            callback(null,rules);
        });
    };

    return {
        task: _task,
        mine: _task
    };

}();
module.exports = MinerArules;