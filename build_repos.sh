#!/bin/bash

echo "Build script"

# npm install --prefix ./backend ./backend && npm run tsc --prefix ./backend &
# npm install --prefix ./frontend ./frontend && npm run build --prefix ./frontend ./frontend
# npm start --prefix ./backend

echo "Installing backend..."
npm install --prefix ./backend ./backend

echo "Compiling backend..."
npm run tsc --prefix ./backend

echo "Installing frontend..."
npm install --prefix ./frontend ./frontend

echo "Building frontend..."
npm run build --prefix ./frontend ./frontend