import { redirect } from "next/navigation";
import type { Locale } from "@/config/site";

export const revalidate = 300;

interface BuildYourOwnSetPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BuildYourOwnSetPage({
  params,
}: BuildYourOwnSetPageProps) {
  const { locale } = await params;
  
  // Redirect to the product page for Build Your Own Set
  // The bundle product is managed through the standard product page with WCPA addons
  redirect(`/${locale as Locale}/product/build-your-own-set`);
}
