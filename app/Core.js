'use client';
import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import ListItemButton from '@mui/material/ListItemButton';
import contract_abi from '../contracts/VRFv2ABI.json';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CallTwitterAPI from './callTwitterAPI';

export default function Mainstuff() {
    //CRYPTO STUFF START ******************************************************
    const ethers = require('ethers')
    const API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY;
    const provider = new ethers.providers.InfuraProvider(
        "sepolia",
        API_KEY
    );
    const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const abi = contract_abi;
    const VRFcontract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi, signer);
    const handleSubmitInfura = async () => {
        const estimatedGasLimit = await VRFcontract.estimateGas.requestRandomWords();
        const approveTxUnsigned = await VRFcontract.populateTransaction.requestRandomWords();
        approveTxUnsigned.chainId = 11155111; // chainId 1 for Ethereum mainnet
        approveTxUnsigned.gasLimit = estimatedGasLimit * 2
        approveTxUnsigned.gasPrice = await provider.getGasPrice();
        approveTxUnsigned.nonce = await provider.getTransactionCount(walletAddress);

        const approveTxSigned = await signer.signTransaction(approveTxUnsigned);
        const submittedTx = await provider.sendTransaction(approveTxSigned);
        const approveReceipt = await submittedTx.wait();
        if (approveReceipt.status === 0)
            throw new Error("Approve transaction failed");

        //note: this way of retreiving the randomWord may not function as intended if multiple users are using the service at the same time
        //i.e someone requests a random number, but gets someone else's due to that someone else requesting 10 sec before.
        VRFcontract.on("RequestFulfilled", (requestId, randomWords, payment, event) => {
            let info = {
                requestId: requestId,
                randomWords: randomWords,
                payment: ethers.utils.formatUnits(payment, 18),
                data: event,
            }
            console.log(contestantList.length, info.randomWords[0])
            //we have the number, and we can get the length of the contestants list
            // do  modulo to get winner as an index of the contestant list
            //get the username from the list at that index, display in winner
            var winnerIndex = info.randomWords[0].mod(contestantList.length)
            console.log("winner index:" + winnerIndex)
            setWinnerString('Winner: ' + contestantList[winnerIndex])
            console.log("See transaction call at: https://sepolia.etherscan.io/address/0xA90Dc27Ffa6D665641eA63109397cEc63F9768c7")
        })
    }

    //CRYPTO STUFF END ******************************************************
    const [userName, setUserName] = useState("");
    const [tweetID, setTweetID] = useState("");
    const printURL = (url) => {
        // Extract the username
        const usernameRegex = /twitter\.com\/([^/]+)\//;
        const usernameMatch = url.match(usernameRegex);
        const username = usernameMatch ? usernameMatch[1] : null;
        // Extract the tweet ID
        const tweetIdRegex = /\/status\/(\d+)/;
        const tweetIdMatch = url.match(tweetIdRegex);
        const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;
        // Output the extracted username and tweet ID
        console.log('Username:', username);
        setUserName(username)
        console.log('Tweet ID:', tweetId);
        setTweetID(tweetId)
    }
    const [data, setData] = useState(null);
    const [checkboxes, setCheckboxes] = useState({
        checkboxLiked: false,
        checkboxRetweeted: false,
        checkboxFollowing: false,
    });
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxes((prevCheckboxes) => ({
            ...prevCheckboxes,
            [name]: checked,
        }));
    };
    const [ContestantArrays, setContestantArrays] = useState(null);//0 = liked, 1 = retweeted, 2 = following
    useEffect(() => {
        // console.log(checkboxes);
        // console.log(ContestantArrays)
        FilterContestants();
    }, [checkboxes, ContestantArrays]);

    const FilterContestants = () => {
        //get the array from ContestantArrays that fits all the checked boxes
        if (ContestantArrays == null) {
            console.log("null ContestantArrays", ContestantArrays)
            return
        }
        //is all of them combined initially
        var filteredArr = Array.from(new Set([].concat(...ContestantArrays)))
        filteredArr.sort()
        if (checkboxes.checkboxLiked) {
            filteredArr = filteredArr.filter((value) => ContestantArrays[0].includes(value))
        }
        if (checkboxes.checkboxRetweeted) {
            filteredArr = filteredArr.filter((value) => ContestantArrays[1].includes(value))
        }
        if (checkboxes.checkboxFollowing) {
            filteredArr = filteredArr.filter((value) => ContestantArrays[2].includes(value))
        }

        console.log(filteredArr)
        setContestantList(filteredArr)
    }

    //runs once at start
    useEffect(() => {
        if (data == null) {
            return;
        }
        console.log(data)
        // Split the input string into individual array strings
        const arrayStrings = data.split('\n');
        // Process each array string
        const arrays = arrayStrings.map((arrayString) => {
            // Remove the square brackets and extra spaces from each array string
            const cleanArrayString = arrayString.replace(/[\[\]\s']/g, '');
            // Split the cleaned array string into individual elements
            const elements = cleanArrayString.split(',');

            return elements;
        });
        // Assign each array to a separate variable
        setContestantArrays(arrays);
        // Output the arrays
        console.log(ContestantArrays);
    }, [data]);

    const [contestantList, setContestantList] = useState([]);
    const [winnerString, setWinnerString] = useState(" ");
    const chooseWinner = () => {
        //when contract for chainlink random number verifier caller done, we connect it and update the winner here
        handleSubmitInfura();
    }
    function renderRow(props) {
        const { index, style } = props;

        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={`${contestantList[index]}`} />
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <div>
            <TextField id="outlined-basic" label="url here" variant="outlined" onChange={event => printURL(event.target.value)} />
            <h1>Options</h1>
            <FormGroup id='FormGroup'>
                <div>
                    <FormControlLabel id='FormGroupLabel' control={<Checkbox checked={checkboxes.checkboxLiked} onChange={handleCheckboxChange} name="checkboxLiked" />} label="Liked" />
                    <FormControlLabel id='FormGroupLabel' control={<Checkbox checked={checkboxes.checkboxRetweeted} onChange={handleCheckboxChange} name="checkboxRetweeted" />} label="Retweeted" />
                    <FormControlLabel id='FormGroupLabel' control={<Checkbox checked={checkboxes.checkboxFollowing} onChange={handleCheckboxChange} name="checkboxFollowing" />} label="Following" />
                </div>
            </FormGroup>
            <CallTwitterAPI setData={setData} userName={userName} tweetID={tweetID} />
            <h1>Contestants</h1>
            <div>
                <div id='ContestantList'>
                    <FixedSizeList
                        height={400}
                        width={360}
                        itemSize={46}
                        itemCount={contestantList.length}
                        overscanCount={5}
                    >

                        {renderRow}
                    </FixedSizeList>
                </div>
            </div>
            <Button variant="outlined" onClick={chooseWinner}>Pick Winner</Button>
            <TextField id='Winner-field' variant='outlined' value={winnerString}></TextField>


        </div>
    );
}