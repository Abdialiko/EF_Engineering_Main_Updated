# API Routes Summary

## Base URL
```
https://api.efengineering-architect.com/api/
```

## All API Endpoints Used

### ✅ Main Resources
- `GET /services` - Get all services
- `GET /services/:id` - Get service detail
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project detail
- `GET /news` - Get all news items
- `GET /news/:id` - Get news detail
- `GET /teams` - Get all team members
- `GET /teams/:id` - Get team member detail
- `GET /clients` - Get all clients
- `GET /galleries` - Get all gallery items
- `GET /jobs` - Get all job vacancies
- `GET /jobs/:id` - Get job detail
- `GET /categories` - Get all project categories

## File Path Handling

### Image Path Formats Supported
1. **Full URL**: `https://api.efengineering-architect.com/...`
2. **Absolute Path**: `/api/...` or `/...`
3. **Relative Path**: `path/to/image.jpg`
4. **Photos Array**: `photos[0].path` or `photos[0].url` or `photos[0].src`
5. **Single Image Fields**: `image_url`, `image`, `photo`, `path`

### Image URL Resolution
All image paths are normalized to use the API base URL:
- If path starts with `http` → Use as-is
- If path starts with `/api/` → Prepend `https://api.efengineering-architect.com`
- If path starts with `/` → Prepend `https://api.efengineering-architect.com`
- Otherwise → Prepend base URL

## API Response Format Handling

### Array Responses
```typescript
// Direct array
const data = await response.json() // [item1, item2, ...]

// Wrapped in data property
const data = await response.json() // { data: [item1, item2, ...] }
```

### Single Item Responses
```typescript
// Direct object
const data = await response.json() // { id: 1, title: "..." }

// Wrapped in data property
const data = await response.json() // { data: { id: 1, title: "..." } }
```

## Pages Using API Calls

### Static Pages (Client-side fetching)
- `/about` - Teams API
- `/services` - Services API
- `/projects` - Projects & Categories API
- `/news` - News API
- `/teams` - Teams API
- `/clients` - Clients API
- `/partners` - Clients API
- `/collaborators` - Clients API
- `/gallery` - Galleries API
- `/vacancy` - Jobs API
- `/application/[id]` - Jobs API

### Dynamic Pages (Server-side fetching)
- `/services/[id]` - Services API
- `/projects/[id]` - Projects, Services API
- `/news/[id]` - News, Services API
- `/teams/[id]` - Teams API
- `/vacancy/detail/[id]` - Jobs API

## Components Using API Calls
- `ServicesSection` - Services API (axios)
- `ProjectsSection` - Projects API (axios)
- `NewsSection` - News API (fetch)
- `ClientsSection` - Clients API (fetch)

## Cache Strategy
- **Client Components**: `cache: 'no-store'` for fresh data
- **Server Components**: `cache: 'no-store'` for dynamic content
- **Static Pages**: No cache option (uses Next.js default)

## Error Handling
All API calls include:
- Try-catch blocks
- Loading states
- Error states
- Fallback values for missing data

## Notes
- All API calls use the same base URL: `https://api.efengineering-architect.com/api/`
- Image paths are normalized to ensure correct display
- Response data is handled for both array and object formats
- API calls are optimized with `Promise.all()` where possible

