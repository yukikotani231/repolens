# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RepoLens is a GitHub PR Review Tool that allows users to authenticate with GitHub OAuth, view their accessible pull requests, and review them with a custom UI. The app is built with Next.js 15 and deployed on Vercel.

**Repository**: https://github.com/yukikotani231/repolens
**Production URL**: https://repolens-woad.vercel.app

## Quick Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment
```bash
vercel --prod --yes  # Deploy to Vercel production
vercel env ls        # List environment variables
vercel env add       # Add/update environment variables
```

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5 + GitHub OAuth
- **Hosting**: Vercel (serverless)
- **Build Tool**: Turbopack (for faster dev startup)

### Key Architectural Decisions

1. **Authentication**: NextAuth.js v5 with GitHub OAuth provider
   - Located in `src/auth.ts`
   - Configured with GitHub OAuth scopes: `read:user repo`
   - JWT callback stores access token for API calls
   - Session callback exposes access token to authenticated pages

2. **API Integration**: Custom GitHub API wrapper in `src/lib/github.ts`
   - Handles both public and authenticated requests
   - Caches responses for 1 hour (via `next: { revalidate: 3600 }`)
   - Custom error class `GitHubAPIError` for better error handling
   - Fetches PR data, diffs, files, and comments

3. **Diff Display**: Side-by-side diff viewer implementation
   - `src/lib/diff-parser.ts` parses unified diff format from GitHub API
   - Converts diff patch to structured `DiffLine` objects with type information
   - `createDiffLinePairs()` pairs deletion/addition lines for side-by-side display
   - `DiffViewer.tsx` renders left (old) and right (new) code in parallel columns
   - Color-coded additions (green), deletions (red), and context lines
   - Dark mode support with appropriate color schemes

4. **Dynamic Pages**: Server-rendered pages for authenticated content
   - `/dashboard` - Lists user's accessible PRs
   - `/pr/[owner]/[repo]/[number]` - PR detail with side-by-side diff display
   - These use `getServerSideProps`-like patterns with server components

5. **Static Disabled**: SSG (`output: 'export'`) is disabled because:
   - API Routes needed for NextAuth.js callback
   - Server-rendered dynamic routes required for user data
   - Vercel's Serverless Functions handle routing automatically

## File Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page with GitHub OAuth button
│   ├── layout.tsx                        # Root layout
│   ├── dashboard/page.tsx                # PR list dashboard (authenticated)
│   ├── pr/[owner]/[repo]/[number]/page.tsx # PR detail page (authenticated)
│   ├── user/[username]/page.tsx          # Public user profile page
│   ├── repo/[owner]/[repo]/page.tsx      # Public repo detail page
│   └── api/auth/[...nextauth]/route.ts   # NextAuth API handler
├── auth.ts                               # NextAuth configuration
├── lib/
│   ├── github.ts                         # GitHub API client functions
│   └── diff-parser.ts                    # Unified Diff parser & side-by-side formatter
├── types/
│   └── github.ts                         # TypeScript interfaces for GitHub data
└── components/
    ├── DiffViewer.tsx                    # Side-by-side diff display component
    ├── RepositoryCard.tsx
    ├── UserProfile.tsx
    ├── LanguageStats.tsx
    ├── RepositoryList.tsx
    └── UserSearchForm.tsx
```

## Authentication Flow

1. User visits landing page (`/`)
2. Click "Sign in with GitHub" button
3. Redirect to GitHub OAuth authorization endpoint
4. User approves scope permissions
5. GitHub redirects back to `/api/auth/callback/github`
6. NextAuth.js exchanges code for access token
7. User session created with access token
8. Redirect to `/dashboard`

### Environment Variables (Required)

**Development** (`.env.local`):
```
GITHUB_CLIENT_ID=<dev-oauth-app-client-id>
GITHUB_CLIENT_SECRET=<dev-oauth-app-client-secret>
AUTH_SECRET=<random-secret-key>
NEXTAUTH_URL=http://localhost:3000
```

**Production** (Vercel dashboard):
Same as above but using production OAuth app credentials.

**OAuth App Configuration**:
- GitHub OAuth Apps can only have ONE callback URL per app
- Development and production must use separate OAuth apps
- Callback URL must match exactly: `{NEXTAUTH_URL}/api/auth/callback/github`

## Important Notes

### Codebase Language
- User-facing documentation (README.md) is in Japanese
- Code comments in `src/lib/diff-parser.ts` are in Japanese
- CLAUDE.md and code logic use English for AI assistant compatibility
- Component names and function names are in English

### Why Two OAuth Apps?
GitHub OAuth Apps do not support multiple callback URLs. Therefore:
- Development app uses `http://localhost:3000/api/auth/callback/github`
- Production app uses `https://repolens-woad.vercel.app/api/auth/callback/github`

### Environment Variable Gotchas
- When using CLI to set env vars, use `printf` or `echo -n` to avoid adding newlines
- Newlines in Client ID break GitHub OAuth flow (URL encodes to `%0A`)
- Better to set env vars via Vercel dashboard than CLI

### Turbopack Note
Dev script uses `--turbo` flag for faster development startup with Turbopack (built-in to Next.js 15).

### API Caching
GitHub API responses are cached for 1 hour in development. Change `revalidate` value in `src/lib/github.ts` for different cache durations.

## Deployment Notes

### Vercel Setup
- Repository auto-connected to Vercel during first `vercel --prod` deploy
- Automatic redeploy on every push to main branch
- Environment variables must be set in Vercel project settings

### Production Considerations
- Vercel serverless functions have a 10-second timeout (suitable for this app)
- Static pages are served via edge network, dynamic routes via serverless functions
- No custom domain configured (currently using `repolens-woad.vercel.app`)

## GitHub API Endpoints Used

Key functions in `src/lib/github.ts`:
- `getUserProfile(username)` - GET `/users/{username}`
- `getUserRepositories(username)` - GET `/users/{username}/repos`
- `getRepositoryLanguages(owner, repo)` - GET `/repos/{owner}/{repo}/languages`
- `getUserPullRequests(accessToken)` - GET `/issues?filter=all` (filtered for PRs)
- `getPullRequest(owner, repo, number, accessToken)` - GET `/repos/{owner}/{repo}/pulls/{number}`
- `getPullRequestFiles(owner, repo, number, accessToken)` - GET `/repos/{owner}/{repo}/pulls/{number}/files`
- `getPullRequestComments(owner, repo, number, accessToken)` - GET `/repos/{owner}/{repo}/pulls/{number}/comments`

## Type Definitions

### GitHub API Types (`src/types/github.ts`)
- `GitHubUser` - User profile data
- `GitHubRepository` - Repository metadata
- `GitHubLanguageStats` - Language distribution
- `GitHubPullRequest` - PR metadata
- `GitHubPRFile` - File changes in PR with patch content
- `GitHubReviewComment` - PR review comments

### Diff Parser Types (`src/lib/diff-parser.ts`)
- `DiffLine` - Single line in a diff with type (addition/deletion/context/hunk/header)
- `DiffLinePair` - Pair of old/new lines for side-by-side rendering

## Diff Display Implementation Details

### Parsing Logic (`src/lib/diff-parser.ts`)
The diff parser handles GitHub's unified diff format:
1. `parseDiffPatch()` splits patch text into typed lines (addition/deletion/context/hunk/header)
2. `createDiffLinePairs()` pairs deletion/addition lines for side-by-side display
   - Consecutive deletion+addition lines are paired (representing line modifications)
   - Standalone deletions appear only on left side
   - Standalone additions appear only on right side
   - Context and hunk headers appear on both sides
3. Helper functions provide Tailwind color classes for each line type

### Rendering (`src/components/DiffViewer.tsx`)
- Client component using grid layout for two-column display
- `DiffLineCell` component renders each side independently
- Empty cells rendered for unpaired lines (e.g., deletion-only on left)
- Indicators (+/-/space) shown before each line
- Dark mode colors automatically applied via Tailwind's `dark:` variants

## Future Improvements

Based on README.md roadmap:
- Syntax highlighting (language-specific code highlighting)
- Line numbers display
- Search/filter within diffs
- Code folding functionality
- Inline comment creation (for code review)
- Review status changes (Approve/Request Changes)
- PR filtering and sorting in dashboard
- Dark mode toggle UI
- Keyboard shortcuts
- Performance optimization for large diffs (virtual scrolling)
