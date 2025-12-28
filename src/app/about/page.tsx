async function getData() {;
    const res = await fetch('https://api.github.com/repos/leekHotline/chat-app')
    return res.json();

}


export default async function AboutPage() {
    const data = await getData();
    return <div>{data.description},{data.size},{data.topics}</div>
}