import TwitterActions from "../client/twitter.js";
import FabHelpers from "../helpers/helpers.js";
import log from "node-file-logger";

class Updaters{

    constructor(){
        this.twtActions = new TwitterActions;
        this.helpers = new FabHelpers;
    }

    profilePictureUpdater(loonaInfo, storateState){
        const self = this;
        let fabStateRebuild = {"artists":[]};
        let rewriteFileStatus = false;

        // current json data
        storateState.artists.forEach(function (member, index) {
            let responseMemberData = loonaInfo[index];
            
            //PFP filenames for state & live
            let liveProfileImgFn = responseMemberData.profileImage.split("/").pop();
            let stateProfileImgFn = member.profileImgURL.split("/").pop();

            //Banner filenames for state & live

            let liveBannerImgFn = responseMemberData.artist.bannerImage.split("/").pop();
            let stateBannerImgFn = member.profileImgURL.split("/").pop();

            //rebuild state for json file
            fabStateRebuild.artists.push({
                "userID": member.userID,
                "enName": member.enName,
                "emoji": member.emoji,
                "profileImgURL" : member.profileImgURL,
                "bannerImgURL" : member.bannerImgURL,
            });
            
            //profile pic updater
            if(liveProfileImgFn != stateProfileImgFn){
                //replace with method
                self.helpers.imageDownloader(responseMemberData.profileImage, liveProfileImgFn, "profile_pics");
                fabStateRebuild.artists[index].profileImgURL = responseMemberData.profileImage;
                rewriteFileStatus = true;

                //push new profile pic to twitter with interval
                setTimeout(async () => {
                    await self.twtActions.twitterUpdate(
                        liveProfileImgFn,
                        "profile_pics",
                        member.emoji,
                        member.enName,
                        responseMemberData.profileImage
                    );
                }, 2500);
            }

            //banner pic updater
            if(liveBannerImgFn != stateBannerImgFn){
                self.helpers.imageDownloader(responseMemberData.artist.bannerImage, liveBannerImgFn, "banner_pics");
                fabStateRebuild.artists[index].bannerImgURL = responseMemberData.artist.bannerImage;
                rewriteFileStatus = true;

                //push new banner to twitter with interval
                setTimeout(async () => {
                    await self.twtActions.twitterUpdate(
                        liveBannerImgFn,
                        "banner_pics",
                        member.emoji,
                        member.enName,
                        responseMemberData.artist.bannerImage
                    );
                }, 2500);
            }


        });

        return {
            "rewriteStatus": rewriteFileStatus, 
            "stateRebuilt": fabStateRebuild
        };

    }

}

export default Updaters;