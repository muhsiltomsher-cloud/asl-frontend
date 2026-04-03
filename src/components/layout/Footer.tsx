import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { siteConfig, type Locale } from "@/config/site";
import type { Dictionary } from "@/i18n";
import type { SiteSettings, FooterSettings } from "@/types/wordpress";
import { NewsletterForm } from "@/components/common/NewsletterForm";

interface FooterProps {
  locale: Locale;
  dictionary: Dictionary;
  siteSettings?: SiteSettings | null;
  footerSettings?: FooterSettings | null;
}

export function Footer({ locale, dictionary, siteSettings, footerSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const t = (bilingual: { en: string; ar: string }) =>
    locale === "ar" ? bilingual.ar : bilingual.en;

  const quickLinkItems = footerSettings?.quickLinks?.items ?? [];
  const csLinkItems = footerSettings?.customerService?.items ?? [];

  const footerLinks = {
    quickLinks: quickLinkItems.length > 0
      ? quickLinkItems.map((item) => ({
          name: t(item.label),
          href: item.url.startsWith("/") ? `/${locale}${item.url}` : item.url,
        }))
      : [
          { name: dictionary.common.home, href: `/${locale}` },
          { name: dictionary.common.shop, href: `/${locale}/shop` },
          { name: dictionary.common.about, href: `/${locale}/about` },
          { name: dictionary.common.contact, href: `/${locale}/contact` },
          { name: dictionary.footer.storeLocator, href: `/${locale}/store-locator` },
        ],
    customerService: csLinkItems.length > 0
      ? csLinkItems.map((item) => ({
          name: t(item.label),
          href: item.url.startsWith("/") ? `/${locale}${item.url}` : item.url,
        }))
      : [
          { name: dictionary.common.faq, href: `/${locale}/faq` },
          { name: dictionary.footer.shippingInfo, href: `/${locale}/shipping` },
          { name: dictionary.footer.returnPolicy, href: `/${locale}/returns` },
          { name: dictionary.footer.privacyPolicy, href: `/${locale}/privacy` },
          { name: dictionary.footer.termsConditions, href: `/${locale}/terms-and-conditions` },
        ],
  };

  const description = footerSettings?.description
    ? t(footerSettings.description)
    : locale === "ar"
      ? "اكتشف العطور الفاخرة ومنتجات العناية العطرية المصنوعة بعناية في أروماتيك سينتس لاب."
      : (siteSettings?.tagline || "Premium fragrances and aromatic products crafted with care.");

  const social = footerSettings?.social;
  const facebookUrl = social?.facebook || siteConfig.links.facebook;
  const instagramUrl = social?.instagram || siteConfig.links.instagram;
  const twitterUrl = social?.twitter || siteConfig.links.twitter;
  const tiktokUrl = social?.tiktok || "";
  const snapchatUrl = social?.snapchat || "";
  const whatsappUrl = social?.whatsapp || "";

  const newsletterTitle = footerSettings?.newsletter
    ? t(footerSettings.newsletter.title)
    : dictionary.footer.newsletter;
  const newsletterSubtitle = footerSettings?.newsletter
    ? t(footerSettings.newsletter.subtitle)
    : dictionary.footer.subscribeText;
  const newsletterPlaceholder = footerSettings?.newsletter
    ? t(footerSettings.newsletter.placeholder)
    : dictionary.footer.emailPlaceholder;
  const newsletterButton = footerSettings?.newsletter
    ? t(footerSettings.newsletter.buttonText)
    : dictionary.footer.subscribe;

  const copyrightText = footerSettings?.copyright
    ? t(footerSettings.copyright)
    : dictionary.footer.copyright;

  const poweredByText = footerSettings?.poweredBy
    ? t(footerSettings.poweredBy.text)
    : "Powered by";
  const poweredByName = footerSettings?.poweredBy
    ? t(footerSettings.poweredBy.name)
    : "Cadvil Solutions";
  const poweredByUrl = footerSettings?.poweredBy?.url || "https://cadvil.com/";

  const quickLinksHeading = footerSettings?.quickLinks?.heading
    ? t(footerSettings.quickLinks.heading)
    : dictionary.footer.quickLinks;
  const csHeading = footerSettings?.customerService?.heading
    ? t(footerSettings.customerService.heading)
    : dictionary.footer.customerService;

  return (
    <footer className="main-footer border-t border-gray-100 bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {/* Brand section - Full width on mobile */}
          <div className="col-span-2 space-y-4 text-center md:col-span-1 md:text-left">
            <Link href={`/${locale}`} className="inline-block">
              {siteSettings?.logo?.url ? (
                <Image
                  src={siteSettings.logo.url}
                  alt={siteSettings.logo.alt || siteSettings.site_name || "Logo"}
                  width={150}
                  height={110}
                  className="mx-auto md:mx-0"
                  style={{ width: "auto", height: "auto", maxHeight: "70px" }}
                  loading="lazy"
                />
              ) : (
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  {siteSettings?.site_name || "Aromatic Scents Lab"}
                </span>
              )}
            </Link>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="flex justify-center gap-4 md:justify-start">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900"
                  aria-label="X"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.2V11.3a4.85 4.85 0 01-3.58-1.59V6.69h3.58z" />
                  </svg>
                </a>
              )}
              {snapchatUrl && (
                <a
                  href={snapchatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900"
                  aria-label="Snapchat"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.04-.012.06-.012.1-.012.16 0 .319.044.46.12.21.12.33.3.33.5 0 .319-.239.599-.719.839-.254.12-.569.24-.96.36-.12.048-.24.12-.36.18-.24.12-.48.24-.6.48-.12.18-.12.42-.06.66.18.78.48 1.56.84 2.28.42.78.96 1.44 1.56 2.04.18.18.3.42.3.66 0 .48-.36.84-.84 1.08-.66.36-1.44.48-2.16.6-.18.03-.36.06-.54.12-.18.06-.36.18-.48.36-.18.24-.24.54-.3.72-.06.18-.12.36-.24.48a.9.9 0 01-.78.36c-.18 0-.42-.06-.66-.12-.36-.06-.78-.18-1.26-.18-.36 0-.72.06-1.08.12-.48.12-.96.36-1.38.48-.24.06-.42.12-.6.12-.36 0-.6-.18-.78-.42-.12-.12-.18-.3-.24-.48-.06-.18-.12-.48-.3-.72-.12-.18-.3-.3-.48-.36-.18-.06-.36-.09-.54-.12-.72-.12-1.5-.24-2.16-.6-.48-.24-.84-.6-.84-1.08 0-.24.12-.48.3-.66.6-.6 1.14-1.26 1.56-2.04.36-.72.66-1.5.84-2.28.06-.24.06-.48-.06-.66-.12-.24-.36-.36-.6-.48-.12-.06-.24-.12-.36-.18-.42-.12-.72-.24-.96-.36-.48-.24-.72-.48-.72-.84 0-.24.12-.42.33-.54.14-.08.31-.12.46-.12.04 0 .06 0 .1.01.26.09.62.2.92.22.2 0 .33-.05.4-.09l-.03-.51-.003-.06c-.1-1.628-.23-3.654.3-4.848C7.86 1.07 11.216.793 12.206.793z" />
                  </svg>
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900"
                  aria-label="WhatsApp"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links - hidden on mobile, shown in account drawer instead */}
          <div className="hidden md:block">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 md:mb-4">
              {quickLinksHeading}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service - hidden on mobile, shown in account drawer instead */}
          <div className="hidden md:block">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 md:mb-4">
              {csHeading}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 md:mb-4">
              {newsletterTitle}
            </h3>
            <p className="mb-3 text-sm text-gray-600 md:mb-4">
              {newsletterSubtitle}
            </p>
            <NewsletterForm
              locale={locale}
              dictionary={{
                emailPlaceholder: newsletterPlaceholder,
                subscribe: newsletterButton,
              }}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t pt-6 md:mt-12 md:flex-row md:justify-between md:pt-8">
          <p className="text-center text-xs text-gray-600 md:text-left md:text-sm">
            &copy; {currentYear} {siteConfig.name}. {copyrightText}
          </p>
          <p className="text-center text-xs text-gray-500 md:text-right">
            {poweredByText}{" "}
            <a
              href={poweredByUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 underline hover:text-gray-900"
            >
              {poweredByName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
