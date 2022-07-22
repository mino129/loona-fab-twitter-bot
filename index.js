import 'dotenv/config'
import fs from "fs"
import fetch from 'node-fetch';
import path from "path";
import TwitterActions from './twitterActions.js';
import cron from "node-cron";

cron.schedule('*/8 * * * * *', async () => {
    const loonaInfoRequest = await fetch(
        "https://vip-fab-api.myfab.tv/fapi/2/groups/1",
        {
            headers:{
                "os": "android",
                "User-Agent": "fab|android|playstore|1.2.1|12|SM-G780F|samsung|en|US",
                "accesstoken": process.env.ACCESSTOKEN,
                "userid": process.env.USERID,
                "accept-encoding": "gzip",
            },
            method: "GET",
        }
    );
    const loonaInfoResponse = await loonaInfoRequest.json();
    const loonaInfo = loonaInfoResponse.group.artistUsers;
    
    let fabState = JSON.parse(fs.readFileSync('fabState.json'));
    let fabStateRebuild = {"artists":[]};
    let updatedUserIDs = [];
    let rewriteFileStatus = false;
    let twtActions = new TwitterActions;
    
    
    fabState.artists.forEach(function (member, index) {
        let responseMemberData = loonaInfo[index];
        let liveProfileImgFn = responseMemberData.profileImage.split("/").pop();
        let stateProfileImgFn = member.profileImgURL.split("/").pop();
        fabStateRebuild.artists.push({
            "userID": member.userID,
            "enName": member.enName,
            "emoji": member.emoji,
            "profileImgURL" : member.profileImgURL
        });
    
        if(liveProfileImgFn != stateProfileImgFn){
            let writeStream;
            fetch(responseMemberData.profileImage)
            .then(function(res){
                writeStream = fs.createWriteStream('./profile_pics/' + liveProfileImgFn, {flags: 'w'});
                res.body.pipe(writeStream);
            })
            fabStateRebuild.artists[index].profileImgURL = responseMemberData.profileImage;
            updatedUserIDs.push(member.userID);
            rewriteFileStatus = true;
            setTimeout(async () => {
                await twtActions.profileUpdate(
                    liveProfileImgFn, 
                    member.emoji,
                    member.enName
                );
            }, 5000);
        }
    });
    
    if(rewriteFileStatus == true){
        fs.writeFile('fabState.json', JSON.stringify(fabStateRebuild, null, 2), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }
    console.log("update ran");
});

