import { TwitterApi } from 'twitter-api-v2';
import { formatInTimeZone } from 'date-fns-tz/esm';
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

    async profileUpdate(mediaFileName, emoji, memberName){
        const date = new Date();
        let seoulTime = formatInTimeZone(date, 'Asia/Seoul', 'HH:mm');
        let seoulDate = formatInTimeZone(date, 'Asia/Seoul', 'dMMyyyy');
        let mediaId = await this.rwClient.v1.uploadMedia("./profile_pics/" + mediaFileName);
        let { data: createdTweet } = await this.rwClient.v2.tweet(
            `${emoji} Profile Picture Update: ~ ${seoulTime} KST ${seoulDate}`,
            {
                media: { media_ids: [mediaId] }
            }
        );
        console.log("Member: ", memberName);
        console.log('Tweet', createdTweet.id, ':', createdTweet.text);
    }
}

export default TwitterActions;

