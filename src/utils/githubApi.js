const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const README_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Helper to generate request headers.
 */
function getHeaders(token) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    headers['Authorization'] = `token ${token.trim()}`;
  }
  return headers;
}

/**
 * Read from localStorage cache if valid.
 */
function getCache(key, maxAge) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < maxAge) {
      return data;
    }
  } catch (e) {
    console.error('Failed to read cache:', e);
  }
  return null;
}

/**
 * Write to localStorage cache.
 */
function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Failed to set cache:', e);
  }
}

/**
 * Fetch GitHub user profile.
 */
export async function fetchGitHubProfile(username, token) {
  const cacheKey = `gh_profile_${username}`;
  const cachedData = getCache(cacheKey, CACHE_DURATION_MS);
  if (cachedData) return cachedData;

  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url, { headers: getHeaders(token) });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`GitHub user "${username}" not found.`);
    }
    if (res.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please add an Access Token in settings to bypass.');
    }
    throw new Error(`Failed to fetch profile: ${res.statusText}`);
  }

  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch GitHub user repositories.
 */
export async function fetchGitHubRepos(username, token) {
  const cacheKey = `gh_repos_${username}`;
  const cachedData = getCache(cacheKey, CACHE_DURATION_MS);
  if (cachedData) return cachedData;

  // We want to fetch up to 100 repositories.
  // By default, GitHub returns 30 per page. Let's request per_page=100.
  const url = `https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`;
  const res = await fetch(url, { headers: getHeaders(token) });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please add an Access Token in settings to bypass.');
    }
    throw new Error(`Failed to fetch repositories: ${res.statusText}`);
  }

  const data = await res.json();
  // Filter out forks if desired, or let the UI handle it. We'll return everything and let UI handle filtering.
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch repository README markdown content.
 */
export async function fetchRepoReadme(username, repoName, token) {
  const cacheKey = `gh_readme_${username}_${repoName}`;
  const cachedData = getCache(cacheKey, README_CACHE_DURATION_MS);
  if (cachedData) return cachedData;

  const url = `https://api.github.com/repos/${username}/${repoName}/readme`;
  const res = await fetch(url, { headers: getHeaders(token) });

  if (!res.ok) {
    if (res.status === 404) {
      return 'No README.md found for this repository.';
    }
    throw new Error(`Failed to fetch README: ${res.statusText}`);
  }

  const data = await res.json();
  
  // The content is usually base64 encoded.
  if (data.content && data.encoding === 'base64') {
    // Decode base64, handling UTF-8 characters correctly.
    const binaryString = atob(data.content.replace(/\s/g, ''));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decodedContent = new TextDecoder('utf-8').decode(bytes);
    setCache(cacheKey, decodedContent);
    return decodedContent;
  }

  const text = data.content || 'No README.md content.';
  setCache(cacheKey, text);
  return text;
}

/**
 * Clear the cache for a specific user to force refresh.
 */
export function clearUserCache(username) {
  localStorage.removeItem(`gh_profile_${username}`);
  localStorage.removeItem(`gh_repos_${username}`);
  // We can also clear readmes if needed
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`gh_readme_${username}_`)) {
      localStorage.removeItem(key);
      i--; // adjust index after removal
    }
  }
}
