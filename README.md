# Umbra — portfolio

A fast, static portfolio with no build step, no framework and no cost. Plain HTML, CSS and JavaScript, so it runs on GitHub Pages and works with a free `is-a.dev` subdomain.

## Edit your details (2 minutes)

Open `script.js`. The `CONFIG` block at the top holds your email, GitHub username, social links and the games you're playing. The `PROJECTS` list below it holds your work. Leave a social as `""` to hide it.

If you change the domain from `umbra.is-a.dev`, also update: `CNAME`, `index.html` (the `canonical` and `og:url` lines), `robots.txt`, `sitemap.xml`.

## Go live for free

1. **Create a GitHub repo** (any name, e.g. `portfolio`) and upload everything in this folder, including the hidden `.nojekyll` file.
2. **Turn on Pages**: repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. **Register your subdomain**: fork `is-a-dev/register`, then add `domains/umbra.json` (a template is in `is-a-dev-registration/umbra.json`). Fill in your GitHub username and email, point `CNAME` at `YOUR-USERNAME.github.io`, and open a pull request. File names must be lowercase. If `umbra` is taken, pick another name and rename the file.
4. **Connect the domain**: once the PR is merged, go to repo → Settings → Pages → Custom domain, enter `umbra.is-a.dev`, save, and tick *Enforce HTTPS* when it becomes available. DNS can take a few minutes up to a day.

## Add a project

Copy one object in the `PROJECTS` array in `script.js`. `demo` can be a file in `/demos` or any URL (your Vercel apps work). Category must be `Game`, `Web App`, `Tool` or `Experiment`.

## Files

- `index.html`, `style.css`, `script.js`: the site
- `demos/`: five working demos (a game, a timer, a snippet manager, a weather app and a CSS lab)
- `CNAME`: your custom domain for GitHub Pages
- `404.html`, `robots.txt`, `sitemap.xml`, `icon.svg`: the extras
