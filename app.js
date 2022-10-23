import 'dotenv/config'
import fs from "fs"
import fetch from 'node-fetch';
import FabHelpers from "./src/helpers/helpers.js";
import Updaters from "./src/updaters/updaters.js";
import cron from "node-cron";
cron.schedule('*/10 * * * * *', async () => {
    
    const Helpers = new FabHelpers;
    const update = new Updaters;

    const loonaInfoRequest = await fetch(
        "https://vip-fab-api.myfab.tv/fapi/2/groups/1",
        {
            headers:{
                "os": "android",
                "User-Agent": "fab|android|playstore|1.3.2|12|SM-G780F|samsung|en|US",
                "accesstoken": process.env.ACCESSTOKEN,
                "userid": process.env.USERID,
                "accept-encoding": "gzip",
            },
            method: "GET",
        }
    );


    const loonaInfoResponse = await loonaInfoRequest.json();
    const loonaInfo = loonaInfoResponse.group.artistUsers;

    //move this to helpers to remove fs import from main file
    let fabState = JSON.parse(fs.readFileSync('./assets/storage/fabState.json'));
    
    let updatedPFP = update.profilePictureUpdater(loonaInfo, fabState);

    if(updatedPFP.rewriteStatus == true){
        Helpers.storageUpdater('./assets/storage/fabState.json', updatedPFP.stateRebuilt);
    }

});

