# Contributing

Branching:
- main: protected, always the production-ready branch
- develop: integration branch for feature branches
- feature/*, fix/*, chore/*: create from develop

PR process:
- Open a PR from a feature branch into develop (or develop -> main for releases)
- Ensure CI passes and include at least 1 approving review
- Use descriptive title and link any issues

CI/CD:
- GitHub Actions runs on push and pull_request for main and develop
- Deploy to GitHub Pages occurs when changes are merged into main

Commit messages:
- Use imperative tense: "Add feature", "Fix bug"

CODEOWNERS:
- Add CODEOWNERS at .github/CODEOWNERS to enforce reviews by owners
