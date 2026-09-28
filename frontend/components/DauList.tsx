import type {Dau} from '@/types/types';



export default function DauList({data}: {data:  Dau[]}){

    return (
        <>
        {data.map((el, i) => {
            return (
                <div key={i}>
                    <h1>{el.date}</h1>
                    <p>{el.count}</p>
                </div>
            )
        })}
        </>
    )

}
