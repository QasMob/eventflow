import type {Retention} from '@/types/types';



export default function RetentionList({data}: {data:  Retention[]}){

    return (
        <>
        {data.map((el, i) => {
            return (
                <div key={i}>
                    <h1>{el.totalUsers}</h1>
                    <p>{el.day1Returned}</p>
                    <p>{el.day7Returned}</p>
                    <p>{el.day30Returned}</p>
                </div>
            )
        })}
        </>
    )

}
