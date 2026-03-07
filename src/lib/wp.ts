const WP_API = 'https://academiadental.cl/admin/wp-json/wp/v2';

export async function getCursos(params: Record<string, string> = {}) {
  try {
    const query = new URLSearchParams({ per_page: '100', _embed: '1', ...params });
    const res = await fetch(`${WP_API}/curso?${query}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCursoBySlug(slug: string) {
  try {
    const res = await fetch(`${WP_API}/curso?slug=${slug}&_embed=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getCursoById(id: number) {
  try {
    const res = await fetch(`${WP_API}/curso/${id}?_embed=1`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getDocentes(params: Record<string, string> = {}) {
  try {
    const query = new URLSearchParams({ per_page: '100', _embed: '1', ...params });
    const res = await fetch(`${WP_API}/docente?${query}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getDocenteBySlug(slug: string) {
  try {
    const res = await fetch(`${WP_API}/docente?slug=${slug}&_embed=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getDocenteById(id: number) {
  try {
    const res = await fetch(`${WP_API}/docente/${id}?_embed=1`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getCategoriasCurso() {
  try {
    const res = await fetch(`${WP_API}/curso_categoria?per_page=50`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function getFeaturedImage(post: any): string {
  return post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/placeholder-course.jpg';
}
