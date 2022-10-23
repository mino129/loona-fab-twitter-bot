import fs from "fs"
import fetch from 'node-fetch';

class FabHelpers{

    storageUpdater(storagePath, state){
        fs.writeFile(storagePath, JSON.stringify(state, null, 2), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }

    imageDownloader(url, filename, folder){
        fetch(url)
        .then(function(res){
            let writeStream = fs.createWriteStream(`./assets/${folder}/${filename}`, {flags: 'w'});
            res.body.pipe(writeStream);
        })
    }

}

export default FabHelpers;