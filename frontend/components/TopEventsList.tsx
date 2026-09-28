import type {TopEvent} from '@/types/types';



export default function TopEventsList({data}: {data:  TopEvent[]}){

    return (
        <>
        {data.map((el, i) => {
            return (
                <div key={i}>
                    <h1>{el.eventName}</h1>
                    <p>{el.count}</p>
                </div>
            )
        })}
        </>
    )

}
