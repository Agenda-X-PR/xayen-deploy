# Xayen.tech portfolio

A responsive, interactive, single-page portfolio for a security-focused full-stack developer. Built with React 19, TypeScript, Vite, Tailwind CSS, and ESLint.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Check the project before deployment:

```bash
pnpm lint
pnpm build
pnpm preview
```

## Deploy to Vercel

1. Push this project to a Git repository you control, then import that repository in the Vercel dashboard; or log in to the Vercel CLI and run `pnpm dlx vercel` from this directory.
2. Use the Vite framework preset. `vercel.json` already declares the `pnpm build` command, the `dist` output directory, and a single-page-app rewrite to `/index.html`.
3. Connect `xayen.tech` in Vercel only after the domain is under your control and its DNS is ready.

This is a static website; it needs no server, database, API key, or environment variable.

## Personalize before publishing

- Review project descriptions and technology stacks in `src/data/portfolio.ts` to ensure they match the actual work. Add each verified repository URL to `repoUrl`; missing repository URLs are intentionally not linked.
- Replace the contribution-note prompts with the developer’s actual role and scope.
- Set `contact.linkedin` to a verified LinkedIn URL, or leave it `null`.
- Replace `public/cv/ekundayo-oyinkansola-cv-placeholder.pdf` with the real CV at the same path and set `cvIsPlaceholder` to `false` in `src/data/portfolio.ts`.
- The bundled PDF is explicitly marked as a placeholder and contains no invented résumé details.

The “Run a visual check” control is a local interface animation only; it does not send a security scan or network request.

## Logo

Drop your red X logo at `public/logo.png` (square, transparent background works best). It is used in the nav and the hero panel; if the file is missing, a red X fallback shows. The accent colour is the `--lime` variable in `src/index.css` (now red, `#ff3b30`) - change that one value to match your logo exactly.
