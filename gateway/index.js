import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import typeDefs from './schema/typeDefs.js'
import resolvers from './schema/resolvers.js'


const server = new ApolloServer({
    // schema
    typeDefs,
    // resolver functions
    resolvers
})
async function serverStart(){


    const {url} = await startStandaloneServer(server, {listen: {port: 4000}});
    console.log(`Gateway running at ${url}`);


}

serverStart();
