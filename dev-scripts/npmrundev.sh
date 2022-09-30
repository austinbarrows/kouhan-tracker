#!/bin/bash
cd ../
npm run dev

# Script basis source: https://stackoverflow.com/a/28722706
trap_ctrlC() {
    exit 1
}

trap trap_ctrlC SIGINT SIGTERM

while true; do
    npm run dev
done