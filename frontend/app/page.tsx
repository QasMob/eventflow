import TopEventsList from "@/components/TopEventsList";
import DauList from '@/components/DauList';
import MauList from '@/components/MauList';
import FunnelList from '@/components/FunnelList';
import RetentionList from '@/components/RetentionList'

async function getTopEvents(projectId: string){

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const res = await fetch('https://localhost/graphql', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      query: `query {topEvents(projectId: "${projectId}") {eventName count}}`
    })
  })

  const json = await res.json();


  return json.data.topEvents


}


async function getDau(projectId: string){

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



  const res = await fetch('https://localhost/graphql', {
    method: 'POST',
    headers: {'Content-Type':'application/json' },
     body: JSON.stringify({
      query: `query {dau(projectId: "${projectId}") {date count}}`
    })
  })

  const json = await res.json();

  return json.data.dau

}





async function getMau(projectId: string){

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



  const res = await fetch('https://localhost/graphql', {
    method: 'POST',
    headers: {'Content-Type':'application/json' },
     body: JSON.stringify({
      query: `query {mau(projectId: "${projectId}") {month count}}`
    })
  })

  const json = await res.json();

  return json.data.mau

}



async function getFunnel(projectId: string, steps: string){

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const res = await fetch('https://localhost/graphql', {
    method: 'POST',
    headers: {'Content-Type':'application/json' },
     body: JSON.stringify({
      query: `query {funnel(projectId: "${projectId}", steps: "${steps}") {step users}}`
    })
  })

  const json = await res.json();

  return json.data.funnel

}



async function getRetention(projectId: string){

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const res = await fetch('https://localhost/graphql', {
    method: 'POST',
    headers: {'Content-Type':'application/json' },
     body: JSON.stringify({
      query: `query {retention(projectId: "${projectId}") {totalUsers day1Returned day7Returned day30Returned}}`
    })
  })

  const json = await res.json();

  return json.data.retention

}






export default async function Page() {
    const topEvents = await getTopEvents('6a27b99583294ee13a24ed10');
    const dau = await getDau('6a27b99583294ee13a24ed10');
    const mau = await getMau('6a27b99583294ee13a24ed10');
    const funnel = await getFunnel('6a27b99583294ee13a24ed10', 'event');
    const retention = await getRetention('6a27b99583294ee13a24ed10');

    return (
      <>

  <TopEventsList data={topEvents}/>
  <DauList data={dau}/>
  <MauList data={mau}/>
  <FunnelList data={funnel}/>
  <RetentionList data={retention}/>
  </>
    )


}
