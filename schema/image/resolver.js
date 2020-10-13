import {
    join,
    parse
} from 'path';

import {
    mkdirSync,
    existsSync,
    createReadStream,
    createWriteStream
} from 'fs';

import {
    BASE_URL
} from '../../config';

import {
    ApolloError, gql
} from 'apollo-server-express';
const storeUpload = ({ stream, filename }) => {
    new Promise((resolve, reject) =>
        stream
            .pipe(createWriteStream(join(__dirname, `../../uploads/`, filename)))
            .on("finish", () => resolve())
            .on("error", reject)
    );
};

const resolvers = {
    Query: {
        // hello: () => "I am Image Upload Resolver.",
        uploads: () => "hello i am image!",
    },
    Mutation: {
        singleUpload: async (parent, args) => {
            const {stream, filename} = await args.file;

            await storeUpload({stream, filename});
            return args.file.then(file => {
                console.log(file);
                return file;
            });
        },



        imageUploader: async (_, {
            file
        }) => {
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
                    __dirname, `../../uploads/${name}-${Date.now()}${ext}`
                );

                serverFile = serverFile.replace(' ', '_');

                let writeStream = await createWriteStream(serverFile);

                await stream.pipe(writeStream);

                serverFile = `${BASE_URL}${serverFile.split('uploads')[1]}`;

                return serverFile;
            } catch (err) {
                throw new ApolloError(err.message);
            }
        }
    },

}

module.exports = resolvers;