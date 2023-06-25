# Codenames

## [Play](https://codenames-1jf1.onrender.com/)
---
This is a an online multiplayer implementation of the popular board game _Codenames_.

>_**Codenames**_ is a game played by 4 or more players in which players are split into two teams, red and blue, and guess words based on clues from their teammates. One player from each team becomes the spymaster, while the others play as field operatives.The end goal is to place all of the team’s agent tiles. 

The project consists of a React app and NodeJS/Express backend deployed as a webservice on the _Render_ cloud platform. The Node server acts as a host for multiple simultaneous games through interaction with its REST API.

## Features

 - Create a unique room for you and your friends
 - Play the board game idk

## Local development
The frontend and backend are split into two _npm_ repositories and must be installed individually. To install and run this project locally, enter the following command in the root directory:

```
npm install --prefix ./backend ./backend &
npm install --prefix ./frontend ./frontend
```
Alternatively the project can be installed and packaged by running the build shell script:
```
./build_repos.sh
```
To start the test servers, run the dev script:
```
./start_dev.sh
```
By default the backend runs on port 8080. If modifying this, make sure to also update the proxy entry in `/frontend/package.json`.