import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function setMeta(selector: string, value: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = value;
}

export function useDocumentMeta() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    document.title = t('seo.title');

    setMeta('meta[name="description"]', t('seo.description'));
    setMeta('meta[property="og:title"]', t('seo.og_title'));
    setMeta('meta[property="og:description"]', t('seo.og_description'));
    setMeta('meta[name="twitter:title"]', t('seo.og_title'));
    setMeta('meta[name="twitter:description"]', t('seo.og_description'));

    const locale = lang.startsWith('fr') ? 'fr_FR' : 'en_US';
    const altLocale = lang.startsWith('fr') ? 'en_US' : 'fr_FR';
    setMeta('meta[property="og:locale"]', locale);
    setMeta('meta[property="og:locale:alternate"]', altLocale);
  }, [t, lang]);
}
