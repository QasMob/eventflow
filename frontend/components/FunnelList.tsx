import type {Funnel} from '@/types/types';



export default function FunnelList({data}: {data:  Funnel[]}){

    return (
        <>
        {data.map((el, i) => {
            return (
                <div key={i}>
                    <h1>{el.step}</h1>
                    <p>{el.users}</p>
                </div>
            )
        })}
        </>
    )

}
