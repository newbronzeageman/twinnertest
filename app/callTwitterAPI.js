'use client';
import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";

export default function callTwitterAPI(props) {
    //TWITTER API STUFF START **************************************
    const userName = props.userName;
    const tweetID = props.tweetID;
    const endpointURL = `http://localhost:8000/name?userName=${userName}&tweetID=${tweetID}`;

    const [buttonPress, setButtonPress] = useState(false)
    useEffect(() => {
        if (buttonPress) {
            setButtonPress(false);
            console.log("fetching " + endpointURL)
            //at most 5 times every 15 min... (wow thats lame!)
            fetch(endpointURL).then((res) => res.text()).then((data) => {
                props.setData(data);
                //console.log(data)
            });
            //COMMENT OUT BELOW AND UNCOMMENT OUT ABOVE TO USE TWITTER API
            //props.setData("['newbronzeageman', 'CryptoSleuthxyz'] \n ['newbronzeageman', 'CryptoSleuthxyz'] \n ['newbronzeageman', 'Madelineppi', 'HYassermyz', 'grisiman', 'eirchuang1994', 'jhartel23', 'danbayk', 'arnold10112', 'Robert88566211', '0xDEGENKONG', 'ElCaco00001', 's3kee']\n")
        }
    }, [buttonPress]);

    //TWITTER API STUFF END ****************************************
    const getContestants = () => {
        setButtonPress(true);
    }

    return (
        <Button variant="outlined" onClick={getContestants}>Get Contestants</Button>
    );
}
