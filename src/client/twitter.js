import { TwitterApi } from 'twitter-api-v2';
import { formatInTimeZone } from 'date-fns-tz/esm';
import log from "node-file-logger";
import 'dotenv/config';

class TwitterActions{
    
    constructor() {
        this.twitterClient = new TwitterApi({
            appKey: process.env.tw_APIKEY,
            appSecret: process.env.tw_APIKEYSECRET,
            accessToken: process.env.tw_ACESSTOKEN,
            accessSecret: process.env.tw_ACESSTOKENSECRET,
        });
        this.rwClient = this.twitterClient.readWrite;
    }

    async twitterUpdate(mediaFileName, folderName, emoji, memberName, fullURL){
        const date = new Date();
        let seoulTime = formatInTimeZone(date, 'Asia/Seoul', 'HH:mm');
        let seoulDate = formatInTimeZone(date, 'Asia/Seoul', 'dMMyyyy');
        let typeUpdate = (folderName == "profile_pics") ? "Profile Picture" : "Banner";
        try{
            let mediaId = await this.rwClient.v1.uploadMedia(`./assets/${folderName}/${mediaFileName}`);
            let { data: createdTweet } = await this.rwClient.v2.tweet(
                `${emoji} ${typeUpdate} Update: ~ ${seoulTime} KST ${seoulDate}`,
                {
                    media: { media_ids: [mediaId] }
                }
            );
            log.Info(`Member: ${memberName}. Tweet ${createdTweet.id}: ${createdTweet.text}. Time of post ${new Date()}`);
        }catch{
            log.Error(`Error updating ${memberName} ${typeUpdate} to twitter. Time of post ${new Date()}. Full URL: ${fullURL}`);
        }
    }
}

export default TwitterActions;