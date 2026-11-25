import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="nf">
      <h1>This page does not exist. · Tato stránka neexistuje.</h1>
      <Link href="/en/works">Works · Díla</Link>
    </section>
  );
}
