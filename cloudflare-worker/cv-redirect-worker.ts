function preferredCvPath(acceptLanguage: string | null): '/cv-fr.pdf' | '/cv-en.pdf' {
  if (!acceptLanguage) return '/cv-fr.pdf';

  const languages = acceptLanguage
    .split(',')
    .map((entry, index) => {
      const [tagPart, ...params] = entry.trim().split(';');
      const qParam = params.find(param => param.trim().startsWith('q='));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tagPart.toLowerCase(), q: Number.isFinite(q) ? q : 0, index };
    })
    .filter(item => item.tag)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const item of languages) {
    if (item.tag === 'fr' || item.tag.startsWith('fr-')) return '/cv-fr.pdf';
    if (item.tag === 'en' || item.tag.startsWith('en-')) return '/cv-en.pdf';
  }

  return '/cv-fr.pdf';
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    url.pathname = preferredCvPath(request.headers.get('Accept-Language'));
    url.search = '';
    return Response.redirect(url.toString(), 302);
  },
};
