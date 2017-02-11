#!/bin/bash

# @author: Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
# Start all InBeat modules

echo "Starting InBeat"
echo "----------------------------->"

( cd ./inbeat-frontend && npm start ) &
( cd ./inbeat-gain && npm start ) &
( cd ./inbeat-pl && npm start ) &
( cd ./inbeat-rs && npm start ) &

wait