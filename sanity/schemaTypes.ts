// Admin panel structure for Sanity Studio (next step, once the Sanity account exists under nini@ota.art).
// Not part of the website build (excluded in tsconfig). It mirrors content/works.ts field for field,
// so moving the 19 works into Sanity is a one-off import and lib/content.ts switches its source.
// Every visible text has one field per language; adding a language = adding one entry to LANGS.

import { defineField, defineType } from 'sanity';

const LANGS = [{ id: 'en', title: 'English' }, { id: 'cs', title: 'Czech' }];

const localeString = (name: string, title: string, required = false) =>
  defineField({
    name, title, type: 'object',
    fields: LANGS.map((l) => defineField({ name: l.id, title: l.title, type: 'string', validation: (r) => (required && l.id === 'en' ? r.required() : r) })),
  });
const localeText = (name: string, title: string) =>
  defineField({ name, title, type: 'object', fields: LANGS.map((l) => defineField({ name: l.id, title: l.title, type: 'text', rows: 6 })) });

export const work = defineType({
  name: 'work', title: 'Work', type: 'document',
  fields: [
    defineField({ name: 'number', title: 'OBRAZ number', type: 'number', validation: (r) => r.required().integer().positive() }),
    localeString('title', 'Title', true),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'title.en' }, validation: (r) => r.required() }),
    defineField({ name: 'medium', title: 'Medium', type: 'string', options: { list: [
      { value: 'oil-canvas', title: 'Oil on canvas' }, { value: 'acrylic-canvas', title: 'Acrylic on canvas' },
      { value: 'oil-acrylic-canvas', title: 'Oil and acrylic on canvas' }, { value: 'oil-plywood', title: 'Oil on plywood' },
      { value: 'oil-paper', title: 'Oil on paper' },
    ] }, validation: (r) => r.required() }),
    defineField({ name: 'heightCm', title: 'Height (cm)', type: 'number' }),
    defineField({ name: 'widthCm', title: 'Width (cm)', type: 'number' }),
    defineField({ name: 'diameterCm', title: 'Diameter (cm), round works only', type: 'number' }),
    defineField({ name: 'framed', title: 'Framed', type: 'object', fields: [
      defineField({ name: 'heightCm', title: 'Framed height (cm)', type: 'number' }),
      defineField({ name: 'widthCm', title: 'Framed width (cm)', type: 'number' }),
      defineField({ name: 'frame', title: 'Frame', type: 'string', options: { list: [{ value: 'solid-oak', title: 'Solid oak' }] } }),
    ] }),
    defineField({ name: 'year', title: 'Year', type: 'number' }),
    defineField({ name: 'availability', title: 'Availability', type: 'string', initialValue: 'available', options: { list: [
      { value: 'available', title: 'Available' }, { value: 'reserved', title: 'Reserved' },
      { value: 'sold', title: 'Sold' }, { value: 'private-collection', title: 'Private collection' },
    ], layout: 'radio' } }),
    localeString('note', 'Note (e.g. part of a series)'),
    localeText('description', 'Description (the artist’s text)'),
    defineField({ name: 'scan', title: 'Painting scan (zoom view)', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'wallImage', title: 'Image on the Works wall', type: 'image' }),
    defineField({ name: 'detail', title: 'Close-up detail (About the work)', type: 'image' }),
    defineField({ name: 'scene', title: 'In its setting (Salome’s photo)', type: 'object', fields: [
      defineField({ name: 'desktop', title: 'Photo, horizontal (desktop)', type: 'image' }),
      defineField({ name: 'phone', title: 'Photo, vertical (phones)', type: 'image' }),
      defineField({ name: 'box', title: 'Painting position in the photo [left, top, width, height] as fractions', type: 'array', of: [{ type: 'number' }], validation: (r) => r.length(4) }),
      defineField({ name: 'focus', title: 'Focal point [x, y]', type: 'array', of: [{ type: 'number' }] }),
      defineField({ name: 'video', title: 'Living photo (muted looping MP4)', type: 'file', options: { accept: 'video/mp4' } }),
    ] }),
    defineField({ name: 'worksOrder', title: 'Position on the Works page', type: 'number' }),
    defineField({ name: 'onLandingDesktop', title: 'Show on landing (desktop)', type: 'boolean' }),
    defineField({ name: 'onLandingPhone', title: 'Show on landing (phones)', type: 'boolean' }),
  ],
  orderings: [{ title: 'Works page order', name: 'order', by: [{ field: 'worksOrder', direction: 'asc' }] }],
  preview: { select: { title: 'title.en', subtitle: 'number', media: 'wallImage' }, prepare: (s) => ({ title: s.title, subtitle: `OBRAZ ${s.subtitle}`, media: s.media }) },
});

export const exhibition = defineType({
  name: 'exhibition', title: 'Exhibition', type: 'document',
  fields: [
    localeString('title', 'Title', true),
    defineField({ name: 'venue', title: 'Venue', type: 'string' }),
    defineField({ name: 'city', title: 'City', type: 'string' }),
    defineField({ name: 'start', title: 'Opens', type: 'date' }),
    defineField({ name: 'end', title: 'Closes', type: 'date' }),
    defineField({ name: 'works', title: 'Works shown', type: 'array', of: [{ type: 'reference', to: [{ type: 'work' }] }] }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image' }] }),
    localeText('text', 'Text'),
    defineField({ name: 'published', title: 'Show on the website', type: 'boolean', initialValue: false }),
  ],
});

export const author = defineType({
  name: 'author', title: 'Author page', type: 'document',
  fields: [
    defineField({ name: 'photo', title: 'Photo', type: 'image' }),
    localeText('paragraph1', 'First paragraph'), localeText('paragraph2', 'Second paragraph'),
    localeString('quote', 'Quote'),
  ],
});

export const page = defineType({
  name: 'page', title: 'Text page (contact, privacy, terms, copyright)', type: 'document',
  fields: [
    defineField({ name: 'key', title: 'Page', type: 'string', options: { list: ['contact', 'privacy', 'terms', 'copyright'] } }),
    localeString('title', 'Title'), localeText('body', 'Text'),
  ],
});

export const settings = defineType({
  name: 'settings', title: 'Site settings', type: 'document',
  fields: [
    defineField({ name: 'contactEmail', title: 'Contact email', type: 'string', initialValue: 'nini@ota.art' }),
    localeText('newsletterText', 'Newsletter pop-up text'),
    defineField({ name: 'popupDelaySeconds', title: 'Pop-up delay (seconds)', type: 'number', initialValue: 45 }),
  ],
});

export const schemaTypes = [work, exhibition, author, page, settings];
