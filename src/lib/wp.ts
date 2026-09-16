const WP_API = 'https://academiadental.cl/admin/wp-json/wp/v2';

// Siempre datos frescos: evita respuestas cacheadas del hosting/CDN durante el build
function wpFetch(url: string) {
  const sep = url.includes('?') ? '&' : '?';
  return fetch(`${url}${sep}_cb=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } });
}

// Si a un post le falta _embedded (p. ej. respuesta parcial de WP), resuelve la imagen destacada por su ID
async function ensureFeaturedMedia(posts: any[]): Promise<any[]> {
  await Promise.all(posts.map(async (p) => {
    const has = p?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    if (has || !p?.featured_media) return;
    try {
      const r = await wpFetch(`${WP_API}/media/${p.featured_media}?_fields=id,source_url`);
      if (!r.ok) return;
      const m = await r.json();
      if (m?.source_url) {
        p._embedded = p._embedded ?? {};
        p._embedded['wp:featuredmedia'] = [{ id: m.id, source_url: m.source_url }];
      }
    } catch {}
  }));
  return posts;
}

export async function getCursos(params: Record<string, string> = {}) {
  try {
    const query = new URLSearchParams({ per_page: '100', _embed: '1', ...params });
    const res = await wpFetch(`${WP_API}/curso?${query}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? ensureFeaturedMedia(data) : [];
  } catch {
    return [];
  }
}

export async function getCursoBySlug(slug: string) {
  try {
    const res = await wpFetch(`${WP_API}/curso?slug=${slug}&_embed=1`);
    if (!res.ok) return null;
    const data = await res.json();
    const one = data[0] ?? null;
    if (one) await ensureFeaturedMedia([one]);
    return one;
  } catch {
    return null;
  }
}

export async function getCursoById(id: number) {
  try {
    const res = await wpFetch(`${WP_API}/curso/${id}?_embed=1`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getDocentes(params: Record<string, string> = {}) {
  try {
    const query = new URLSearchParams({ per_page: '100', _embed: '1', orderby: 'menu_order', order: 'asc', ...params });
    const res = await wpFetch(`${WP_API}/docente?${query}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getDocenteBySlug(slug: string) {
  try {
    const res = await wpFetch(`${WP_API}/docente?slug=${slug}&_embed=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getDocenteById(id: number) {
  try {
    const res = await wpFetch(`${WP_API}/docente/${id}?_embed=1`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getCategoriasCurso() {
  try {
    const res = await wpFetch(`${WP_API}/curso_categoria?per_page=50`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function getFeaturedImage(post: any): string {
  return post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/placeholder-course.jpg';
}

export function toParagraphs(text: string): string {
  if (!text) return '';
  // Si ya contiene bloques HTML (p. ej. campos WYSIWYG), devolver tal cual
  if (/<p[\s>]/i.test(text)) return text;
  return text
    .split(/\r\n\r\n|\n\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\r\n|\n/g, '<br>')}</p>`)
    .join('');
}
