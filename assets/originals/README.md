# Original images

Full-size source images, kept out of `public/` so they aren't published with
the site. The site serves smaller WebP copies made from them:

- `our-works/` → `public/work/all/` (the Our Works page) and `public/work/featured/`
- `services/` → `public/services/` (the Services section)
- `clients/` → `public/clients/mono` (white logos) and `public/clients/color-dark` (hover colours); `clients/color` is the colour set they were made from

To add a project, put its screenshots here, make 960px and 1600px WebP copies
in `public/work/all/` named `<slug>-<n>-<width>.webp`, and add it to `lib/works.ts`.
