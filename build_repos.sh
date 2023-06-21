#!/bin/bash

echo "Build script"

npm install --prefix ./backend ./backend &
npm install --prefix ./frontend ./frontend && npm run build --prefix ./frontend ./frontend
npm start --prefix ./backend