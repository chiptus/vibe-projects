# Some projects deploy separately from the stitched static build

The root build stitches every project into one static `dist/`. A project that needs its own runtime (a Worker with a backend) can't live there, so it sets `"deployedSeparately": true` in its `package.json`: the root build skips it entirely, and its hub entry links to an external URL instead of a subpath. Everything else keeps the single-static-deploy rule.
