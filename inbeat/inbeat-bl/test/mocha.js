/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

process.env.NODE_ENV = 'test';
var config = require(process.cwd() + '/config').mongo;
var mongoose = require('mongoose');
mongoose.connect(config.url);