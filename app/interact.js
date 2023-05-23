'use client';
import React, { useState } from 'react';

function App() {
    const ethers = require('ethers')
    const API_KEY = process.env.INFURA_API_KEY;
    const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
    const provider_Metamask = new ethers.providers.Web3Provider(window.ethereum);
    const infuraProvider = new ethers.providers.InfuraProvider(
        "sepolia",
        API_KEY
    );

    // Use the useState hook function to add state variables to a functional component.
    const [txSentInfura, setTxSentInfura] = useState(null);

    const handleSubmitInfura = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const address = data.get('address');
        const amount = data.get('amount');
        const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);
        sendTransaction(address, amount, signer);
    }

    // Send the transaction using either the Web3Provider or InfuraProvider
    const sendTransaction = async (address, amount, signer = null) => {
        const tx = await signer.sendTransaction({
            to: address,
            value: ethers.utils.parseEther(amount)
        });
        console.log("tx", tx);
        setTxSentInfura('Transaction initiated! Tx hash: ' + tx.hash);
    }
}
export default App;