// utils/slugify.ts
export default function slugify(input: string) {
  return (input || '')
    .toString()
    .normalize('NFKD') // separate diacritics
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, '-') // replace invalid chars with -
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}
