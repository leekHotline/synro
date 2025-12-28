import Counter from "@/components/tests/Counter"

async function getData() {;
    const res = await fetch('https://api.github.com/repos/leekHotline/chat-app')
    return res.json();

}


export default async function AboutPage() {
    const data = await getData();
    return (
        <div>
            <h1>About Page</h1>
            <Counter />
            <p>{data.description}</p>
            <p>Size: {data.size} KB</p>
            <p>Topics: {data.topics.join(', ')}</p>

        </div>
    )

}