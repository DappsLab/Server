import {join, parse} from 'path';
import {createWriteStream} from 'fs';

import {BASE_URL} from '../../config';

import {ApolloError, AuthenticationError} from 'apollo-server-express';

const resolvers = {
    Mutation:{
        dAppUploader: async (_, {file},{user}) => {
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                const {
                    filename,
                    createReadStream
                } = await file;

                let stream = createReadStream();

                let {
                    ext,
                    name
                } = parse(filename);

                name = name.replace(/([^a-z0-9 ]+)/gi, '-').replace(' ', '_');

                let serverFile = join(
                    __dirname, `../../dapps/${name}-${Date.now()}${ext}`
                );

                serverFile = serverFile.replace(' ', '_');

                let writeStream = await createWriteStream(serverFile);

                await stream.pipe(writeStream);

                let correctedPath=""
                if(!(serverFile.split('dapps')[1][0]==='/')){
                    let wrongPath=serverFile.split('dapps')[1];
                    correctedPath = wrongPath.replace("\\","/")
                    serverFile = `${BASE_URL}${correctedPath}`;

                }else{
                    serverFile = `${BASE_URL}${serverFile.split('dapps')[1]}`;
                }

                return serverFile;
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500);
            }
        }
    },

}

module.exports = resolvers;
