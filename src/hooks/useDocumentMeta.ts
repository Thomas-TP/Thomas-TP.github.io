import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function setMeta(selector: string, value: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = value;
}

function setLink(selector: string, value: string) {
  const el = document.querySelector<HTMLLinkElement>(selector);
  if (el) el.href = value;
}

export function useDocumentMeta() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    const isFr = lang.startsWith('fr');
    const canonicalUrl = 'https://thomastp.ch/';

    document.title = t('seo.title');
    document.documentElement.lang = isFr ? 'fr' : 'en';

    setMeta('meta[name="description"]', t('seo.description'));
    setMeta('meta[name="keywords"]', t('seo.keywords', { defaultValue: '' }));
    setMeta('meta[property="og:title"]', t('seo.og_title'));
    setMeta('meta[property="og:description"]', t('seo.og_description'));
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[name="twitter:title"]', t('seo.og_title'));
    setMeta('meta[name="twitter:description"]', t('seo.og_description'));

    const locale = isFr ? 'fr_CH' : 'en_US';
    const altLocale = isFr ? 'en_US' : 'fr_CH';
    setMeta('meta[property="og:locale"]', locale);
    setMeta('meta[property="og:locale:alternate"]', altLocale);

    setLink('link[rel="canonical"]', canonicalUrl);
  }, [t, lang]);
}
