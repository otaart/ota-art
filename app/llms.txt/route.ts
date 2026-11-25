// llms.txt: a plain summary of the site for AI assistants (https://llmstxt.org)
import { getWorks, captionText } from '@/lib/content';
import { getDict } from '@/content/dictionaries';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const d = getDict('en');
  const works = getWorks('en');
  const body = `# ota.art

> Official site of the painter Ota Votoček. ${d.meta.homeDescription.replace(/^Original paintings by Ota Votoček: /, 'Original paintings: ')}

${d.author.lead} ${d.author.p1} ${d.author.p2}

All works are original paintings. Prices are given on request only. Private viewings of the wider collection (hundreds of original works) are arranged by appointment through the artist's representative, Nini Shengelia (nini@ota.art).

## Pages

- [Works](${SITE_URL}/en/works): all ${works.length} paintings shown on the site
- [Author](${SITE_URL}/en/author): about Ota Votoček
- [Contact](${SITE_URL}/en/contact): exhibitions, private viewings, correspondence
- [Private viewing request](${SITE_URL}/en/inquire)
- [Copyright & intellectual property](${SITE_URL}/en/legal)
- Czech version: ${SITE_URL}/cs

## Works

${works.map((w) => `- [${w.title}](${SITE_URL}/en/works/${w.slug}): ${captionText(w)}${w.note ? `. ${w.note}` : ''}`).join('\n')}
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
