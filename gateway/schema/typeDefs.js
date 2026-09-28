// defining types/queries
import {gql} from 'graphql-tag'

const typeDefs = gql`
type TopEvent {
    eventName: String
    count: Int
}

type DAU {
    _id: String
    date: String
    count: Int
}

type MAU {
    _id: String
    month: String
    count: Int
}

type FunnelStep {
    step: String
    users: Int
}

type Retention {
    totalUsers: Int
    day1Returned: Int
    day7Returned: Int
    day30Returned: Int
}

type Query {
    topEvents(projectId: String!): [TopEvent]
    dau(projectId: String!): [DAU]
    mau(projectId: String!): [MAU]
    funnel(projectId: String!, steps: String!): [FunnelStep]
    retention(projectId: String!): [Retention]
    }
`

export default typeDefs
