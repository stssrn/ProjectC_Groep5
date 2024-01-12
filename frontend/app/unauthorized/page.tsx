import Link from 'next/link';

const Page = () => (
  <div>
    <h1>Niet geautoriseerde toegang</h1>
    <p>Je hebt geen toestemming om deze pagina te bekijken.</p>
    <Link href="/dashboard">Ga terug naar Dashboard</Link>
  </div>
);

export default Page;
