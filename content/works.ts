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
    scene: spot('scene_01', [0.3506, 0.3692, 0.2878, 0.4517], 0.4945, 0.595), availability: 'available',
    description: {
      en: ['Immortality carries within itself the idea that everything is possible, a profound and deeply human subject, one that is rarely spoken about. The time has come for each of us to think more deeply about the state of immortality, to feel it within ourselves and explore what it might mean.'],
      cs: ['Nesmrtelnost v sobě nese myšlenku, že je možné všechno. Je to hluboké a veskrze lidské téma, o kterém se mluví jen zřídka. Nastal čas, aby se každý z nás hlouběji zamyslel nad stavem nesmrtelnosti, pocítil ho v sobě a zkoumal, co by mohl znamenat.'],
    } },
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
    scene: spot('scene_16', [0.6208, 0.1419, 0.1732, 0.2031], 0.7074, 0.2434), availability: 'available',
    description: {
      en: [
        'I was playing with colour and music, and slowly a dark figure appeared. For me, it became a kind of farewell, leaving behind an old life, childhood, people, relationships and everything that belonged to the past.',
        'Then the image changed. I saw myself rising, with white wings. I started to cry. It was simply a feeling of beauty and freedom.',
      ],
      cs: [
        'Hrál jsem si s barvou a hudbou a pomalu se objevila tmavá postava. Stala se pro mě jakýmsi rozloučením, opuštěním starého života, dětství, lidí, vztahů a všeho, co patřilo minulosti.',
        'Pak se obraz proměnil. Viděl jsem se, jak stoupám vzhůru s bílými křídly. Začal jsem plakat. Byl to prostě pocit krásy a svobody.',
      ],
    } },
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
