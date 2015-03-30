#!/bin/bash
echo "Starting InBeat"
echo "----------------------------->"

( cd ./inbeat-frontend && npm start ) &
( cd ./inbeat-gain && npm start ) &
( cd ./inbeat-pl && npm start ) &
( cd ./inbeat-rs && npm start ) &

wait