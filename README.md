Tools+Libraries used: React/Nextjs , materialui, express/nodejs, twinner,ethersjs

To run this project:

cd into the twinner folder in terminal
open in vscode: ```code .```
create a file called .env and add the following lines:
```
NEXT_PUBLIC_ETHEREUM_NETWORK = "sepolia"
NEXT_PUBLIC_INFURA_API_KEY = ""
NEXT_PUBLIC_SIGNER_PRIVATE_KEY = ""
NEXT_PUBLIC_CONTRACT_ADDRESS = ""
NEXT_PUBLIC_WALLET_ADDRESS = ""
```
fill in the above with your keys,
you may have to create an infura account, and a new metamask wallet, and get test eth/link from : https://faucets.chain.link/sepolia

run in terminal to get all dependencies: ```npm install```
start the website: ```npm run dev```

cd into the TwitterAPI folder in another terminal (leave the previous one open)
run to get all dependencies: ```npm install```
create a file (in the same TwitterAPI folder) called config.py and add the following lines:
```
BEARER_TOKEN = ""
```
fill in the above with your keys

start the server: ```node server.js```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Notes: the TwitterAPI server only gets the first 5000 followers,likers,retweeters, you can change this amount manually in search.py
If you are getting errors on 'choose winner', ensure the contract has enough link to call the chainlink VRF

Ignore the below
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
