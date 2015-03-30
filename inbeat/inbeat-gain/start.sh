#!/bin/bash
# echo "InBeat GAIN"
# echo "----------------------------->"

# echo "InBeat GAIN: starting listener server"
node ./listener/server.js &

# echo "InBeat GAIN: starting api server"
node ./api/server.js &

wait