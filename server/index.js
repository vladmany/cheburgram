import 'dotenv/config'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import { init } from "./models/index.js";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import {GraphQLError} from "graphql/error/index.js";
import {initSocket} from "./socket.js";

const app = express();
const httpServer = http.createServer(app);

initSocket(httpServer);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
    cors(),
    bodyParser.json(),
    clerkMiddleware(),
);

app.use('/graphql', expressMiddleware(server, {
    context: async ({req, res}) => {
        const { userId } = getAuth(req);
        if (!userId) {
            throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                }
            });
        }

        return { userId };
    }
}));

await new Promise((resolve) => httpServer.listen({ port: 4000 }, async () => {
    init();

    console.log(`🚀 Server ready at http://localhost:4000`);
}));
