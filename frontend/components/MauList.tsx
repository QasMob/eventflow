import type {Mau} from '@/types/types';



export default function MauList({data}: {data:  Mau[]}){

    return (
        <>
        {data.map((el, i) => {
            return (
                <div key={i}>
                    <h1>{el.month}</h1>
                    <p>{el.count}</p>
                </div>
            )
        })}
        </>
    )

}
