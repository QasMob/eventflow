'use client';

import { ApolloProvider } from "@apollo/client/react";
import client from '@/lib/apollo-client';
import { PropsWithChildren } from "react";


export default function Providers({children}: PropsWithChildren){
   return (
     <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
   )
}
