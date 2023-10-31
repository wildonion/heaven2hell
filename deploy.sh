#!/bin/bash
cd node
sudo npm i @nfteyez/sol-rayz
sudo npm i @solana/wallet-adapter-wallets
sudo npm install express body-parser pg
sudo npm i @metaplex-foundation/mpl-token-metadata
sudo npm i @project-serum/anchor
sudo pm2 delete heaven2hell-node
sudo pm2 start --name heaven2hell-node server.js
docker stop heaven2hell
docker rm heaven2hell
docker build -t heaven2hell . && docker run -d --link postgres --network gem --name heaven2hell -p 6547:6547 heaven2hell
