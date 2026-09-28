export type TopEvent = {
    eventName: string,
    count: number
}

export type Dau = {
    date: string,
    count: number
}

export type Mau = {
    month: string,
    count: number
}


export type Funnel = {
    step: string,
    users: number
}

export type Retention = {
    totalUsers: number,
    day1Returned: number,
    day7Returned: number,
    day30Returned: number
}
