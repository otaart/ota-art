// Copyright & intellectual property page, from the prototype (22 Nov 2026).
// The governing-law clause is still awaiting legal review.
import type { Locale } from '@/lib/i18n-config';

export interface LegalSection { heading?: string; text: string }

export const LEGAL: Record<Locale, LegalSection[]> = {
  en: [
    { text: 'All artworks, images, texts and other materials on this site are the exclusive property of Ota Votoček. All rights reserved.' },
    { heading: 'Ownership', text: 'Copyright in every painting reproduced here, and in every photograph of those paintings, belongs solely to the artist. Nothing on this site transfers any right of ownership, licence or use.' },
    { heading: 'Permitted use', text: 'You may view this site and its contents for personal, non-commercial purposes only. No image, text or other material may be copied, reproduced, downloaded, republished or adapted without prior written permission.' },
    { heading: 'Prohibited use', text: 'This includes reproduction in print or digital media, use in advertising or promotional material, resale, and use as training data for machine learning or artificial intelligence systems.' },
    { heading: 'Sale of works', text: 'Acquisition of a painting transfers ownership of the physical object only. Copyright and all reproduction rights remain with the artist unless assigned separately in writing.' },
    { heading: 'Trade marks', text: 'The name Ota Votoček, the Ota wordmark and the domain ota.art are used as marks of the artist and may not be used without permission.' },
    { heading: 'Third-party material', text: 'All photographs on this site are by and © Salome. They may not be reproduced, distributed or used without the photographer’s permission.' },
    { heading: 'Permissions and takedown', text: 'Requests for permission to reproduce any work, and notices of suspected infringement, should be addressed to nini@ota.art.' },
    { heading: 'Governing law', text: 'These terms are governed by the laws of the Czech Republic, and any dispute shall be subject to the exclusive jurisdiction of its courts.' },
  ],
  cs: [
    { text: 'Všechna umělecká díla, obrázky, texty a další materiály na tomto webu jsou výhradním vlastnictvím Oty Votočka. Všechna práva vyhrazena.' },
    { heading: 'Vlastnictví', text: 'Autorská práva ke každému zde reprodukovanému obrazu a ke každé fotografii těchto obrazů náleží výhradně autorovi. Nic na tomto webu nepřevádí žádné vlastnické právo, licenci ani právo užití.' },
    { heading: 'Povolené užití', text: 'Tento web a jeho obsah si můžete prohlížet pouze pro osobní, nekomerční účely. Žádný obrázek, text ani jiný materiál nesmí být bez předchozího písemného svolení kopírován, rozmnožován, stahován, znovu zveřejňován ani upravován.' },
    { heading: 'Zakázané užití', text: 'To zahrnuje rozmnožování v tištěných či digitálních médiích, užití v reklamě či propagačních materiálech, další prodej a užití jako trénovacích dat pro strojové učení nebo systémy umělé inteligence.' },
    { heading: 'Prodej děl', text: 'Koupí obrazu přechází pouze vlastnictví fyzického díla. Autorská práva a veškerá práva k rozmnožování zůstávají autorovi, pokud nejsou písemně převedena samostatnou smlouvou.' },
    { heading: 'Ochranné známky', text: 'Jméno Ota Votoček, slovní značka Ota a doména ota.art slouží jako označení autora a bez svolení je nelze užívat.' },
    { heading: 'Materiály třetích stran', text: 'Autorkou všech fotografií na tomto webu je Salome, © Salome. Bez svolení fotografky je nelze rozmnožovat, šířit ani jinak užívat.' },
    { heading: 'Svolení a odstranění obsahu', text: 'Žádosti o svolení k rozmnožování jakéhokoli díla a oznámení o podezření na porušení práv zasílejte na nini@ota.art.' },
    { heading: 'Rozhodné právo', text: 'Tyto podmínky se řídí právním řádem České republiky a k řešení případných sporů jsou výlučně příslušné její soudy.' },
  ],
};
