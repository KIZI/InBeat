#!/bin/sh
# @author: Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
# npm install all modules
( cd ./inbeat-bl && npm install --production )
( cd ./inbeat-frontend && npm link ../inbeat-bl && npm install --production )
( cd ./inbeat-gain && npm link ../inbeat-bl && npm install --production )
( cd ./inbeat-pl && npm link ../inbeat-bl && npm install --production )
( cd ./inbeat-rs && npm link ../inbeat-bl && npm install --production )