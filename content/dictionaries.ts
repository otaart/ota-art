// Interface texts in every live language. Czech wording is the 22 Nov 2026 draft, still to be edited.
// Paragraph-length texts (author, contact, legal) will move to the admin panel with the works.

import type { Locale } from '@/lib/i18n-config';

const en = {
  meta: {
    siteName: 'ota.art',
    homeTitle: 'Ota Votoček · The experience of Seeing',
    homeDescription: 'Original paintings by Ota Votoček: textured oil and acrylic works, shown in landscapes photographed by Salome. Private viewings by appointment.',
    worksTitle: 'Works',
    worksDescription: 'Nineteen original paintings by Ota Votoček: oil and acrylic on canvas, plywood and paper. Prices on request; private viewings by appointment.',
    authorTitle: 'Ota Votoček, the author',
    contactTitle: 'Contact',
    contactDescription: 'Exhibition updates, private viewings of the collection and correspondence with the artist’s representative.',
    inquireTitle: 'Private viewing request',
    inquireDescription: 'Request a private viewing of Ota Votoček’s collection. All enquiries are handled personally and with discretion.',
    legalTitle: 'Copyright & intellectual property',
    workDescription: (title: string, caption: string) => `${title}, ${caption}. Original painting by Ota Votoček. Price on request.`,
  },
  nav: { main: 'Main', works: 'Works', author: 'Author', contact: 'Contact' },
  chrome: {
    openMenu: 'Open menu', closeMenu: 'Close menu', language: 'Language', sound: 'Ambient sound',
    translationToCome: 'Translation to come', photoCredit: 'Photography © Salome', dark: 'Dark', light: 'Light',
    inquire: 'Inquire', skip: 'Skip to content',
  },
  landing: {
    tagline: 'The experience of Seeing', prevScene: 'Previous scene', nextScene: 'Next scene', scene: (i: number) => `Scene ${i}`,
    open: (title: string) => `Open ${title}`, inLandscape: (title: string) => `${title} in a landscape`,
  },
  works: {
    heading: 'Works', open: 'Open', prev: 'Previous work', next: 'Next work',
    tick: (title: string, i: number, n: number) => `${title}, ${i} of ${n}`, openWork: (title: string) => `Open ${title}`,
  },
  detail: {
    label: 'Detailed view', close: 'Close', zoom: 'ZOOM', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
    detailOfArtwork: 'Detail of the artwork', detailOf: (t: string) => `Detail of ${t}`,
    descriptionToCome: 'Description to come.', inquire: 'Inquire', priceOnRequest: 'Price on request',
    toAbout: 'About the work →', toSetting: 'In its setting →', toPainting: 'Back to the painting →',
    backTo: (p: string) => `Back to: ${p}`, thePainting: 'The painting', aboutTheWork: 'About the work',
    viewFull: 'View the full painting',
  },
  caption: {
    inches: 'inches', framedSize: 'framed size', solidOak: 'with a solid oak frame',
    medium: {
      'oil-canvas': 'Oil on canvas', 'acrylic-canvas': 'Acrylic on canvas', 'oil-plywood': 'Oil on plywood',
      'oil-paper': 'Oil on paper', 'oil-acrylic-canvas': 'Oil and acrylic on canvas',
    },
    decimal: '.',
  },
  author: {
    name: 'Ota Votoček', lead: 'The author',
    p1: 'brings inspiration into its purest visual form. Each work carries its own meaning and presence, with the ability to transform a space and awaken something within the person who encounters it.',
    p2: 'Ota works intuitively, writing down the information that comes to him during the creative process. Each painting is accompanied by a text that speaks to its subject and reveals its deeper meaning.',
    quote: '‘Look into the art and see the beauty within yourself.’',
    quoteLines: ['‘Look into the', 'art and see the', 'beauty within', 'yourself.’'],
    attribution: 'The author',
  },
  contact: {
    exhibitions: 'Exhibitions', exhibitionsTitle: 'Visit the artwork at upcoming exhibitions.',
    exhibitionsText: 'Leave your email to receive exhibition updates and occasional inspiration, ideas, and news shared by the author.',
    stripAlt: 'Detail of a painting by Ota Votoček',
    privateViewing: 'Private viewing', privateViewingTitle: 'Private viewing of the artist’s collection.',
    pv1: 'For those with a particular interest in the artist’s work, a private collection of hundreds of original works can be viewed by appointment, with the possibility of meeting the artist or a representative.',
    pv2: 'Private viewings are intended for those wishing to explore the collection in greater depth, including works available for acquisition.',
    pv3: 'Please fill in the form below to enquire about a private viewing.',
    inquire: 'Inquire →', correspondence: 'Correspondence',
    corrText: 'For any other questions or enquiries, please feel free to contact us directly by email:',
    representative: 'Nini Shengelia · Artist Representative', copyright: '© Ota Votoček · Copyright',
  },
  subscribe: {
    email: 'Email address', send: 'Send', sendCaps: 'SEND', invalid: 'Please enter a valid email address.',
    privacy: 'We respect your privacy. Unsubscribe at any time.', thanks: 'Thank you. You will hear from the studio.',
    checkInbox: 'Thank you. Please confirm your address from the email we have just sent.',
    unavailable: 'Sign-up is not available at the moment. Please write to nini@ota.art.',
    dialog: 'Subscribe to exhibition updates', noted: 'Noted',
  },
  inquire: {
    label: 'Inquire', title: 'Private viewing request', name: 'Name', email: 'Email', phone: 'Phone', location: 'Your location',
    whatBrings: 'What brings you to the collection?',
    reasons: [
      'I am interested in acquiring an original work', 'I am an art collector or represent a collector',
      'I would like to meet the artist personally', 'I represent a company, organization or institution',
      'I am a member of the media / press',
    ],
    viewingFor: 'The viewing is for:', forOptions: ['Myself', 'A company / organization', 'A private collector I represent'],
    other: 'Other', specify: 'Please specify',
    interest: 'Please tell us a little about your interest in viewing the collection. What brings you to the paintings in person?',
    when: 'Preferred date / period for the viewing', submit: 'Request private viewing',
    note: 'All enquiries are handled personally and with discretion.',
    regarding: (t: string) => `Regarding: ${t}`,
    sending: 'Sending…', sent: 'Thank you. Your request has reached the studio; Nini will reply personally.',
    error: 'Please complete the fields marked with *.', failed: 'Your request could not be sent. Please write to nini@ota.art.',
    consent: 'Your details are used only to answer this request.',
  },
  legal: { appendix: 'Appendix', title: 'Copyright & intellectual property' },
  notFound: { title: 'This page does not exist.', back: 'Back to the works' },
};

export type Dict = typeof en;

const cs: Dict = {
  meta: {
    siteName: 'ota.art',
    homeTitle: 'Ota Votoček · Zážitek vidění',
    homeDescription: 'Originální obrazy Oty Votočka: strukturovaná díla olejem a akrylem v krajinách, které nafotila Salome. Soukromé prohlídky po domluvě.',
    worksTitle: 'Díla',
    worksDescription: 'Devatenáct originálních obrazů Oty Votočka: olej a akryl na plátně, překližce a papíře. Cena na dotaz; soukromé prohlídky po domluvě.',
    authorTitle: 'Ota Votoček, autor',
    contactTitle: 'Kontakt',
    contactDescription: 'Novinky o výstavách, soukromé prohlídky sbírky a korespondence se zástupkyní autora.',
    inquireTitle: 'Žádost o soukromou prohlídku',
    inquireDescription: 'Požádejte o soukromou prohlídku sbírky Oty Votočka. Všechny dotazy vyřizujeme osobně a diskrétně.',
    legalTitle: 'Autorská práva a duševní vlastnictví',
    workDescription: (title: string, caption: string) => `${title}, ${caption}. Originální obraz Oty Votočka. Cena na dotaz.`,
  },
  nav: { main: 'Hlavní', works: 'Díla', author: 'Autor', contact: 'Kontakt' },
  chrome: {
    openMenu: 'Otevřít menu', closeMenu: 'Zavřít menu', language: 'Jazyk', sound: 'Zvuk prostředí',
    translationToCome: 'Překlad připravujeme', photoCredit: 'Fotografie © Salome', dark: 'Tmavý', light: 'Světlý',
    inquire: 'Mám zájem', skip: 'Přejít na obsah',
  },
  landing: {
    tagline: 'Zážitek vidění', prevScene: 'Předchozí scéna', nextScene: 'Další scéna', scene: (i: number) => `Scéna ${i}`,
    open: (title: string) => `Otevřít ${title}`, inLandscape: (title: string) => `${title} v krajině`,
  },
  works: {
    heading: 'Díla', open: 'Otevřít', prev: 'Předchozí dílo', next: 'Další dílo',
    tick: (title: string, i: number, n: number) => `${title}, ${i} z ${n}`, openWork: (title: string) => `Otevřít ${title}`,
  },
  detail: {
    label: 'Detailní pohled', close: 'Zavřít', zoom: 'ZOOM', zoomIn: 'Přiblížit', zoomOut: 'Oddálit',
    detailOfArtwork: 'Detail díla', detailOf: (t: string) => `Detail díla ${t}`,
    descriptionToCome: 'Popis bude doplněn.', inquire: 'Mám zájem', priceOnRequest: 'Cena na dotaz',
    toAbout: 'O díle →', toSetting: 'V prostředí →', toPainting: 'Zpět k obrazu →',
    backTo: (p: string) => `Zpět na: ${p}`, thePainting: 'Obraz', aboutTheWork: 'O díle',
    viewFull: 'Zobrazit celý obraz',
  },
  caption: {
    inches: 'palců', framedSize: 'rozměr s rámem', solidOak: 'masivní dubový rám',
    medium: {
      'oil-canvas': 'Olej na plátně', 'acrylic-canvas': 'Akryl na plátně', 'oil-plywood': 'Olej na překližce',
      'oil-paper': 'Olej na papíře', 'oil-acrylic-canvas': 'Olej a akryl na plátně',
    },
    decimal: ',',
  },
  author: {
    name: 'Ota Votoček', lead: 'Autor',
    p1: 'převádí inspiraci do její nejčistší výtvarné podoby. Každé dílo nese svůj vlastní význam a přítomnost a dokáže proměnit prostor a probudit něco v člověku, který se s ním setká.',
    p2: 'Ota tvoří intuitivně a zapisuje si informace, které k němu během tvůrčího procesu přicházejí. Každý obraz provází text, který promlouvá o jeho námětu a odhaluje jeho hlubší význam.',
    quote: '„Dívej se do umění a uvidíš krásu v sobě.“',
    quoteLines: ['„Dívej se', 'do umění a uvidíš', 'krásu', 'v sobě.“'],
    attribution: 'Autor',
  },
  contact: {
    exhibitions: 'Výstavy', exhibitionsTitle: 'Navštivte díla na nadcházejících výstavách.',
    exhibitionsText: 'Zanechte nám svůj e-mail a budeme vám posílat novinky o výstavách a občas inspiraci, myšlenky a zprávy od autora.',
    stripAlt: 'Detail obrazu Oty Votočka',
    privateViewing: 'Soukromá prohlídka', privateViewingTitle: 'Soukromá prohlídka autorovy sbírky.',
    pv1: 'Zájemci o autorovu tvorbu si mohou po domluvě prohlédnout soukromou sbírku stovek originálních děl, s možností setkat se s autorem nebo jeho zástupcem.',
    pv2: 'Soukromé prohlídky jsou určeny těm, kdo chtějí sbírku poznat hlouběji, včetně děl, která lze zakoupit.',
    pv3: 'Pro dotaz na soukromou prohlídku prosím vyplňte formulář níže.',
    inquire: 'Mám zájem →', correspondence: 'Korespondence',
    corrText: 'S dalšími dotazy se na nás neváhejte obrátit přímo e-mailem:',
    representative: 'Nini Shengelia · zástupkyně autora', copyright: '© Ota Votoček · Autorská práva',
  },
  subscribe: {
    email: 'E-mailová adresa', send: 'Odeslat', sendCaps: 'ODESLAT', invalid: 'Zadejte prosím platnou e-mailovou adresu.',
    privacy: 'Respektujeme vaše soukromí. Odběr můžete kdykoli zrušit.', thanks: 'Děkujeme. Ateliér se vám ozve.',
    checkInbox: 'Děkujeme. Potvrďte prosím adresu v e-mailu, který jsme vám právě poslali.',
    unavailable: 'Přihlášení teď není k dispozici. Napište nám prosím na nini@ota.art.',
    dialog: 'Odebírat novinky o výstavách', noted: 'Zaznamenáno',
  },
  inquire: {
    label: 'Mám zájem', title: 'Žádost o soukromou prohlídku', name: 'Jméno', email: 'E-mail', phone: 'Telefon', location: 'Místo, odkud nás kontaktujete',
    whatBrings: 'Co vás ke sbírce přivádí?',
    reasons: [
      'Mám zájem o koupi originálního díla', 'Jsem sběratel umění nebo sběratele zastupuji',
      'Rád(a) bych se osobně setkal(a) s autorem', 'Zastupuji společnost, organizaci nebo instituci',
      'Jsem zástupce médií / tisku',
    ],
    viewingFor: 'Prohlídka je pro:', forOptions: ['Mě osobně', 'Společnost / organizaci', 'Soukromého sběratele, kterého zastupuji'],
    other: 'Jiné', specify: 'Upřesněte prosím',
    interest: 'Napište nám prosím pár slov o svém zájmu o prohlídku sbírky. Co vás vede k tomu, abyste obrazy viděli osobně?',
    when: 'Preferovaný termín / období prohlídky', submit: 'Požádat o soukromou prohlídku',
    note: 'Všechny dotazy vyřizujeme osobně a diskrétně.',
    regarding: (t: string) => `Týká se díla: ${t}`,
    sending: 'Odesíláme…', sent: 'Děkujeme. Vaše žádost dorazila do ateliéru; Nini vám odpoví osobně.',
    error: 'Vyplňte prosím pole označená *.', failed: 'Žádost se nepodařilo odeslat. Napište nám prosím na nini@ota.art.',
    consent: 'Vaše údaje použijeme pouze k vyřízení této žádosti.',
  },
  legal: { appendix: 'Příloha', title: 'Autorská práva a duševní vlastnictví' },
  notFound: { title: 'Tato stránka neexistuje.', back: 'Zpět na díla' },
};

const DICTS: Record<Locale, Dict> = { en, cs };
export const getDict = (l: Locale): Dict => DICTS[l];
