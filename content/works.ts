// The 19 works, taken from the accepted prototype (live version 1795378873-3709, 23 Nov 2026).
// This file is the content source until the Sanity admin panel is connected; lib/content.ts
// is the only place that reads it, so switching to Sanity changes nothing else.

export type Medium = 'oil-canvas' | 'acrylic-canvas' | 'oil-plywood' | 'oil-paper' | 'oil-acrylic-canvas';

export interface SceneSpot {
  /** photo name without extension, e.g. "scene_01" (phones use "scene_01_m") */
  image: string;
  /** painting position in the photo as fractions [left, top, width, height] */
  box: [number, number, number, number];
  /** focal point used when the photo fills the screen */
  fx: number;
  fy: number;
}

export interface Work {
  /** OBRAZ number, also the image file number (w01 ... w19) */
  n: number;
  slug: string;
  title: { en: string; cs: string };
  medium: Medium;
  /** height x width in cm, or diameter for round works */
  size: { h: number; w: number } | { d: number };
  framed?: { h: number; w: number; frame: 'solid-oak' };
  /** width / height of the scan */
  aspect: number;
  note?: { en: string; cs: string };
  description?: { en: string[]; cs: string[] };
  scene?: SceneSpot;
  availability: 'available' | 'reserved' | 'sold' | 'private-collection';
}

const spot = (image: string, box: SceneSpot['box'], fx: number, fy: number): SceneSpot => ({ image, box, fx, fy });

export const WORKS: Work[] = [
  { n: 1, slug: 'immortality', title: { en: 'Immortality', cs: 'Nesmrtelnost' }, medium: 'oil-canvas', size: { h: 188, w: 80 }, aspect: 0.4208,
    scene: spot('scene_01', [0.3506, 0.3692, 0.2878, 0.4517], 0.4945, 0.595), availability: 'available' },
  { n: 2, slug: 'wedding', title: { en: 'Wedding', cs: 'Svatba' }, medium: 'acrylic-canvas', size: { h: 40, w: 30 }, aspect: 0.7515,
    note: { en: 'Part of a series of four paintings.', cs: 'Součást série čtyř obrazů.' },
    scene: spot('scene_02', [0.4576, 0.5014, 0.0948, 0.1851], 0.505, 0.594), availability: 'available' },
  { n: 3, slug: 'van-gogh', title: { en: 'Van Gogh', cs: 'Van Gogh' }, medium: 'oil-canvas', size: { h: 40, w: 30 }, aspect: 0.7488,
    scene: spot('scene_03', [0.851, 0.29, 0.145, 0.129], 0.9235, 0.3545), availability: 'available' },
  { n: 4, slug: 'putin', title: { en: 'Putin', cs: 'Putin' }, medium: 'oil-canvas', size: { h: 30, w: 25 }, aspect: 0.8529,
    scene: spot('scene_04', [0.6219, 0.7537, 0.1046, 0.1779], 0.6742, 0.8426), availability: 'available' },
  { n: 5, slug: 'orgasm', title: { en: 'Orgasm', cs: 'Orgasmus' }, medium: 'oil-canvas', size: { h: 40, w: 30 }, aspect: 0.8338,
    scene: spot('scene_05', [0.378, 0.6459, 0.2923, 0.2321], 0.5242, 0.762), availability: 'available' },
  { n: 6, slug: 'christ', title: { en: 'Christ', cs: 'Kristus' }, medium: 'oil-canvas', size: { h: 80, w: 188 }, aspect: 2.3697,
    scene: spot('scene_06', [0.3054, 0.5286, 0.3887, 0.287], 0.4997, 0.6721), availability: 'available' },
  { n: 7, slug: 'birth', title: { en: 'Birth', cs: 'Zrození' }, medium: 'oil-plywood', size: { h: 40, w: 60 }, aspect: 1.4981,
    scene: spot('scene_07', [0.3295, 0.4967, 0.341, 0.2233], 0.5, 0.6083), availability: 'available' },
  { n: 8, slug: 'father', title: { en: 'Father', cs: 'Otec' }, medium: 'oil-canvas', size: { h: 100, w: 120 }, aspect: 1.1919,
    scene: spot('scene_08', [0.1368, 0.4649, 0.1162, 0.1728], 0.195, 0.5513), availability: 'available' },
  { n: 9, slug: 'woman-of-my-dreams', title: { en: 'Woman of My Dreams', cs: 'Žena mých snů' }, medium: 'oil-canvas', size: { h: 130, w: 100 }, aspect: 0.772,
    scene: spot('scene_09', [0.757, 0.452, 0.046, 0.1562], 0.78, 0.5301), availability: 'available' },
  { n: 10, slug: 'tantra', title: { en: 'Tantra', cs: 'Tantra' }, medium: 'oil-canvas', size: { d: 72 }, aspect: 1,
    scene: spot('scene_10', [0.32, 0.4449, 0.2154, 0.3385], 0.4276, 0.6142), availability: 'available' },
  { n: 11, slug: 'friendship', title: { en: 'Friendship', cs: 'Přátelství' }, medium: 'acrylic-canvas', size: { h: 140, w: 70 }, aspect: 0.5,
    scene: spot('scene_11', [0.3957, 0.5879, 0.2124, 0.2824], 0.5019, 0.7291), availability: 'available' },
  { n: 12, slug: 'ancestor', title: { en: 'Ancestor', cs: 'Předek' }, medium: 'oil-canvas', size: { h: 120, w: 100 }, aspect: 0.8393,
    scene: spot('scene_12', [0.4244, 0.5746, 0.2737, 0.2167], 0.5613, 0.6829), availability: 'available' },
  { n: 13, slug: 'bumblebee', title: { en: 'Bumblebee', cs: 'Čmelák' }, medium: 'acrylic-canvas', size: { h: 80, w: 80 }, aspect: 1.004,
    scene: spot('scene_13', [0.429, 0.2422, 0.1732, 0.2578], 0.5156, 0.3711), availability: 'available' },
  { n: 14, slug: 'money', title: { en: 'Money', cs: 'Peníze' }, medium: 'oil-acrylic-canvas', size: { h: 70, w: 70 }, aspect: 1.004,
    scene: spot('scene_14', [0.352, 0.3653, 0.2963, 0.2956], 0.5001, 0.5131), availability: 'available' },
  { n: 15, slug: 'the-present-moment', title: { en: 'The Present Moment', cs: 'Přítomný okamžik' }, medium: 'oil-paper', size: { h: 30, w: 40 },
    framed: { h: 37, w: 47, frame: 'solid-oak' }, aspect: 1.2866,
    scene: spot('scene_15', [0.4556, 0.6081, 0.1295, 0.1505], 0.5204, 0.6833), availability: 'available' },
  { n: 16, slug: 'i-bumblebee', title: { en: 'I, Bumblebee', cs: 'Já, čmelák' }, medium: 'oil-paper', size: { h: 30, w: 40 },
    framed: { h: 37, w: 47, frame: 'solid-oak' }, aspect: 1.2821,
    scene: spot('scene_16', [0.6208, 0.1419, 0.1732, 0.2031], 0.7074, 0.2434), availability: 'available' },
  { n: 17, slug: 'passion', title: { en: 'Passion', cs: 'Vášeň' }, medium: 'oil-paper', size: { h: 30, w: 40 },
    framed: { h: 37, w: 47, frame: 'solid-oak' }, aspect: 1.2825,
    scene: spot('scene_17', [0.6196, 0.3962, 0.1774, 0.2069], 0.7083, 0.4996), availability: 'available' },
  { n: 18, slug: 'wolfgang-amadeus-mozart', title: { en: 'Wolfgang Amadeus Mozart', cs: 'Wolfgang Amadeus Mozart' }, medium: 'oil-paper', size: { h: 30, w: 40 },
    framed: { h: 37, w: 47, frame: 'solid-oak' }, aspect: 1.2784,
    scene: spot('scene_18', [0.3696, 0.5181, 0.2604, 0.3057], 0.4998, 0.671), availability: 'available' },
  { n: 19, slug: 'trust', title: { en: 'Trust', cs: 'Důvěra' }, medium: 'oil-paper', size: { h: 30, w: 40 },
    framed: { h: 37, w: 47, frame: 'solid-oak' }, aspect: 1.2715,
    scene: spot('scene_19', [0.5701, 0.4282, 0.1574, 0.1855], 0.6488, 0.5209), availability: 'available' },
];

/**
 * Painting texts. English: Nini's Google Doc "List of Paintings with the TEXT" (26 Nov 2026),
 * dashes replaced by commas or colons. Czech: translation, 26 Nov 2026, to be checked by Nini.
 * Works 11 (Friendship), 12 (Ancestor) and 14 (Money) have no text yet.
 */
const DESCRIPTIONS: Record<number, { en: string[]; cs: string[] }> = {
  1: {
    en: [
      'Immortality carries within itself the idea that everything is possible, a profound and deeply human subject, one that is rarely spoken about.',
      'The time has come for each of us to think more deeply about the state of immortality, to feel it within ourselves and explore what it might mean.',
    ],
    cs: [
      'Nesmrtelnost v sobě nese myšlenku, že je možné všechno. Je to hluboké a veskrze lidské téma, o kterém se mluví jen zřídka.',
      'Nastal čas, aby se každý z nás hlouběji zamyslel nad stavem nesmrtelnosti, pocítil ho v sobě a zkoumal, co by mohl znamenat.',
    ],
  },
  2: {
    en: [
      'A search for oneself through the harmony of feminine love, through immersion in the surrounding world and nature.',
      'It is truly an earthly paradise.',
    ],
    cs: [
      'Hledání sebe sama skrze harmonii ženské lásky, skrze ponoření do okolního světa a přírody.',
      'Je to skutečný ráj na zemi.',
    ],
  },
  3: {
    en: [
      'An extraordinary man, overflowing with self-love, impulsive, fleeing from everything that restricted him. Through his painting, he expressed his very essence, believing that one day it would bring him fame.',
      "Make generous decisions for the greater good. Don't leave anything to chance.",
    ],
    cs: [
      'Výjimečný muž, přetékající láskou k sobě samému, impulzivní, prchající přede vším, co ho omezovalo. Svou malbou vyjádřil samu svou podstatu a věřil, že mu jednoho dne přinese slávu.',
      'Dělejte velkorysá rozhodnutí pro větší dobro. Nenechávejte nic náhodě.',
    ],
  },
  4: {
    en: [
      'From the dark green of the jungle, two eyes appear, creating a connection through seeing.',
      'The sun. The earth. A man kneeling on the ground.',
      'The sunlight passes through him and connects with the earth. A beautiful feeling in the body. It simply happened.',
      "A woman's breasts, a flow of energy, the sun, the body, the earth: all connected as one energy of the world.",
      'It happened.',
    ],
    cs: [
      'Z temné zeleně džungle se vynořují dvě oči a vytvářejí spojení skrze pohled.',
      'Slunce. Země. Muž klečící na zemi.',
      'Sluneční světlo jím prochází a spojuje se se zemí. Krásný pocit v těle. Prostě se to stalo.',
      'Ženská ňadra, proud energie, slunce, tělo, země: vše propojené v jednu energii světa.',
      'Stalo se to.',
    ],
  },
  5: {
    en: ['It shines. It is a release, rising above everything. It heals all. It is transparent, a healing energy that exists within every body. It is a release beyond the mind. It is a painting of rest.'],
    cs: ['Září. Je to uvolnění, povznesení se nade vše. Léčí všechno. Je průzračný, léčivá energie, která existuje v každém těle. Je to uvolnění za hranicemi mysli. Je to obraz klidu.'],
  },
  6: {
    en: [
      'He is here with us, within us, but we do not see Him or hear Him.',
      'We need to learn to listen, to see, and to truly perceive what is around us. To become more aware of ourselves and of the world.',
      'The realization that He is within us slowly rises to the surface. It awakens, fills the world with light, and opens our understanding.',
    ],
    cs: [
      'Je tady s námi, v nás, ale nevidíme Ho ani Ho neslyšíme.',
      'Musíme se naučit naslouchat, vidět a skutečně vnímat, co je kolem nás. Více si uvědomovat sebe i svět.',
      'Poznání, že je v nás, pomalu vystupuje na povrch. Probouzí se, naplňuje svět světlem a otevírá naše porozumění.',
    ],
  },
  7: {
    en: ['The First Painting. A sense of calm came over me, and everything began to happen on its own. Since then, I have had faith in myself. I am the first to see what emerges from my hands. As I look at the painting, I discover more and more. It takes my breath away to see what has come into being through me. The White Angel: a great challenge.'],
    cs: ['První obraz. Přišel na mě klid a všechno se začalo dít samo. Od té doby věřím sám sobě. Jsem první, kdo vidí, co vzniká pod mýma rukama. Když se na obraz dívám, objevuji v něm stále víc. Bere mi dech vidět, co skrze mě vzniklo. Bílý anděl: velká výzva.'],
  },
  8: {
    en: [
      'A father as a strong, remarkable presence: wise, capable, talented and full of life. A man who knows how to find his way, overcome difficulties and move towards his goal.',
      'The shimmering colours carry a feeling of joy, confidence and energy. At the heart of the painting is a simple idea: the strength to find a way, to create and to overcome is already within him.',
    ],
    cs: [
      'Otec jako silná, pozoruhodná osobnost: moudrý, schopný, talentovaný a plný života. Muž, který dokáže najít cestu, překonat překážky a jít za svým cílem.',
      'Třpytivé barvy nesou pocit radosti, sebedůvěry a energie. V srdci obrazu je prostá myšlenka: síla najít cestu, tvořit a překonávat je už v něm.',
    ],
  },
  9: {
    en: [
      'While painting this picture, intuition emerged. It came out from deep within: a drop, a wolf in the sea, and it became destiny. The sea simply knows!',
      'The sea is a mysterious universe, where everything remains unknown, where even a thought can drown, and truth eventually rises to the surface.',
      'The sea is destiny! A destiny that exists in infinity.',
      'It feeds on itself.',
    ],
    cs: [
      'Při malování tohoto obrazu se vynořila intuice. Vyšla z hloubi nitra: kapka, vlk v moři, a stal se z toho osud. Moře to prostě ví!',
      'Moře je tajemný vesmír, kde vše zůstává neznámé, kde se může utopit i myšlenka a pravda nakonec vyplave na povrch.',
      'Moře je osud! Osud, který existuje v nekonečnu.',
      'Živí se sám sebou.',
    ],
  },
  10: {
    en: [
      'Being aware of the other person and being fully present with them. Through touch, tantra brings people closer together all around the world.',
      'A circular painting drawn from life. Tantra brings a moment together. Surrender yourself to it. Tantra releases inhibitions.',
    ],
    cs: [
      'Vnímat druhého člověka a být s ním plně přítomen. Skrze dotek tantra sbližuje lidi po celém světě.',
      'Kruhový obraz čerpaný ze života. Tantra spojuje okamžik. Odevzdejte se mu. Tantra uvolňuje zábrany.',
    ],
  },
  13: {
    en: [
      'The bumblebee flies from flower to flower, simply and effortlessly. As it takes flight, the space around us opens up: the divine world, the forest, the spirit of the forest.',
      'There is something vast and immense all around us.',
    ],
    cs: [
      'Čmelák létá z květu na květ, prostě a bez námahy. Když vzlétne, prostor kolem nás se otevře: božský svět, les, duch lesa.',
      'Všude kolem nás je něco nesmírného a obrovského.',
    ],
  },
  15: {
    en: [
      "I have an image before my eyes, and I perceive. I look within myself without even being aware of it. I don't look elsewhere. I look, I gaze, and it begins to reveal itself to me. It absorbs me completely, with everything it holds.",
      'I see simplicity in life, modesty.',
    ],
    cs: [
      'Mám před očima obraz a vnímám. Dívám se do sebe, aniž bych si to uvědomoval. Nedívám se jinam. Dívám se, hledím a on se mi začíná odhalovat. Zcela mě pohltí, se vším, co v sobě nese.',
      'Vidím v životě jednoduchost, skromnost.',
    ],
  },
  16: {
    en: [
      'I was playing with colour and music, and slowly a dark figure appeared. For me, it became a kind of farewell, leaving behind an old life, childhood, people, relationships and everything that belonged to the past.',
      'Then the image changed. I saw myself rising, with white wings. I started to cry. It was simply a feeling of beauty and freedom.',
    ],
    cs: [
      'Hrál jsem si s barvou a hudbou a pomalu se objevila tmavá postava. Stala se pro mě jakýmsi rozloučením, opuštěním starého života, dětství, lidí, vztahů a všeho, co patřilo minulosti.',
      'Pak se obraz proměnil. Viděl jsem se, jak stoupám vzhůru s bílými křídly. Začal jsem plakat. Byl to prostě pocit krásy a svobody.',
    ],
  },
  17: {
    en: [
      'Passion, an inner strength, an invitation to live. It perceives you and makes you whole. Passion has the power to dissolve negativity. It brings health and reconciliation. Living passion is knowing yourself beyond everything! It shines.',
      'Passion is a state of goodwill and nourishes the body.',
    ],
    cs: [
      'Vášeň, vnitřní síla, pozvání k životu. Vnímá vás a činí vás celistvými. Vášeň má moc rozpustit negativitu. Přináší zdraví a smíření. Žít vášeň znamená znát sebe sama nade vše! Září.',
      'Vášeň je stav dobré vůle a vyživuje tělo.',
    ],
  },
  18: {
    en: [
      'A man immersed in music and awareness. He smiles, rejoices and surrenders to the moment, allowing the music to flow through him.',
      'As he becomes absorbed in the music, the boundaries of the self begin to dissolve. He becomes free, open, and connected to the experience of music itself.',
    ],
    cs: [
      'Muž ponořený do hudby a vědomí. Usmívá se, raduje se a odevzdává se okamžiku, nechává hudbu proudit skrze sebe.',
      'Jak se do hudby noří, hranice jeho já se začínají rozpouštět. Stává se svobodným, otevřeným a spojeným se samotným prožitkem hudby.',
    ],
  },
  19: {
    en: [
      'A dead end, an illusion, a sign of nothing good. It binds the heart, holds you back and makes things up.',
      "Free yourself from it. Gain your freedom, enjoy life, and don't torment yourself with foolishness.",
      "The painting says the exact opposite: don't trust blindly, don't look elsewhere. Look into me and enjoy yourself.",
      "The painting cries out: let go of everything. Don't trust what enslaves you.",
      'It invites you to escape, to run from superstition. Beauty awaits you, beauty!',
      'Enjoy being yourself, on your own. In doing so, you will gain depth and freedom, and give that freedom to others.',
    ],
    cs: [
      'Slepá ulička, iluze, znamení ničeho dobrého. Svazuje srdce, drží vás zpátky a vymýšlí si.',
      'Osvoboďte se od ní. Získejte svobodu, užívejte si život a netrapte se hloupostmi.',
      'Obraz říká pravý opak: nedůvěřujte slepě, nedívejte se jinam. Podívejte se do mě a užívejte si.',
      'Obraz volá: pusťte všechno. Nedůvěřujte tomu, co vás zotročuje.',
      'Zve vás k útěku, k útěku před pověrami. Čeká na vás krása, krása!',
      'Užívejte si, že jste sami sebou, sami za sebe. Tím získáte hloubku a svobodu a tu svobodu dáte i druhým.',
    ],
  },
};
for (const w of WORKS) if (DESCRIPTIONS[w.n]) w.description = DESCRIPTIONS[w.n];

/** Works page order (OBRAZ numbers), Sophia 17 Nov 2026 */
export const WORKS_ORDER = [6, 3, 17, 2, 8, 10, 5, 11, 14, 16, 18, 4, 9, 15, 12, 1, 13, 19, 7];

/** Landing scenes: desktop shows horizontal photos, phones vertical ones (work numbers) */
export const LANDING = {
  desktop: [6, 18, 4, 16, 2, 8, 10, 15, 13, 19, 17],
  phone: [1, 14, 7, 5, 9, 12, 3, 11],
};

/** Living photos: a muted looping video laid exactly over the scene photo (22-23 Nov 2026) */
export const LIVING: Record<string, string> = {
  scene_02: 'scene_02.mp4', scene_02_m: 'scene_02.mp4',
  scene_18: 'scene_18.mp4', scene_18_m: 'scene_18.mp4',
  scene_01: 'scene_01c.mp4', scene_01_m: 'scene_01c.mp4',   // 23 Nov timing (on and off every 4 s) on phones too
};
