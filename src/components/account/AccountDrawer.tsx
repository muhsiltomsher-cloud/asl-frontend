"use client";

import { User, Package, MapPin, Heart, Settings, LogOut, X, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/common/Button";
import { localeConfig, currencies, type Locale, type Currency } from "@/config/site";
import { getPathWithoutLocale } from "@/lib/utils";

interface AccountDrawerProps {
  locale: string;
  dictionary: {
    myAccount: string;
    orders: string;
    addresses: string;
    wishlist: string;
    settings: string;
    logout: string;
    welcome: string;
    login: string;
    register: string;
    notLoggedIn: string;
    profile?: string;
    more?: string;
  };
}

interface MenuItem {
  icon: typeof User;
  label: string;
  href: string;
}

export function AccountDrawer({
  locale,
  dictionary,
}: AccountDrawerProps) {
  const { user, isAuthenticated, logout, isAccountDrawerOpen, setIsAccountDrawerOpen } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const pathname = usePathname();
  const isRTL = locale === "ar";

  const onClose = () => setIsAccountDrawerOpen(false);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleCurrencyChange = (code: Currency) => {
    setCurrency(code);
  };

  const alternateLocale: Locale = locale === "en" ? "ar" : "en";
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const alternateHref = `/${alternateLocale}${pathWithoutLocale}`;

  const menuItems: MenuItem[] = [
    {
      icon: User,
      label: dictionary.profile || "Profile",
      href: `/${locale}/account/profile`,
    },
    {
      icon: Package,
      label: dictionary.orders,
      href: `/${locale}/account/orders`,
    },
    {
      icon: MapPin,
      label: dictionary.addresses,
      href: `/${locale}/account/addresses`,
    },
    {
      icon: Heart,
      label: dictionary.wishlist,
      href: `/${locale}/account/wishlist`,
    },
    {
      icon: Settings,
      label: dictionary.settings,
      href: `/${locale}/account`,
    },
  ];

  const renderAuthenticatedContent = () => (
    <>
      <div className="border-b p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">{dictionary.welcome}</p>
            <p className="text-lg font-semibold text-gray-900 truncate">
              {user?.user_display_name}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.user_email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.slice(0, 3).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98]"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4 space-y-2">
        <Link
          href={`/${locale}/account`}
          onClick={onClose}
          className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98]"
        >
          <span className="font-medium">{dictionary.more || "More"}</span>
          <ChevronRight className={`h-5 w-5 flex-shrink-0 ${isRTL ? "rotate-180" : ""}`} />
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition-all hover:bg-red-50 active:scale-[0.98]"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{dictionary.logout}</span>
        </button>
      </div>
    </>
  );

  const renderGuestContent = () => (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
        <User className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {dictionary.myAccount}
      </h3>
      <p className="mb-8 text-gray-500">{dictionary.notLoggedIn}</p>
      <div className="flex w-full flex-col gap-3">
        <Button asChild variant="primary" size="lg" className="w-full">
          <Link href={`/${locale}/login`} onClick={onClose}>
            {dictionary.login}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href={`/${locale}/register`} onClick={onClose}>
            {dictionary.register}
          </Link>
        </Button>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="border-t bg-gray-50 p-4">
      <div className="space-y-3">
        {/* Language Switcher */}
        <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {locale === "en" ? "Language" : "اللغة"}
            </span>
          </div>
          <Link
            href={alternateHref}
            onClick={onClose}
            className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            hrefLang={localeConfig[alternateLocale].hrefLang}
          >
            {localeConfig[alternateLocale].name}
          </Link>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center text-sm font-bold text-gray-500">$</span>
            <span className="text-sm font-medium text-gray-700">
              {locale === "en" ? "Currency" : "العملة"}
            </span>
          </div>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
            className="rounded-md border-0 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

    return (
      <MuiDrawer
        anchor={isRTL ? "left" : "right"}
        open={isAccountDrawerOpen}
        onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 320 },
          maxWidth: "100%",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <User className="h-5 w-5" />
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {dictionary.myAccount}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="Close drawer"
            sx={{ color: "text.secondary" }}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div className="flex flex-1 flex-col">
            {isAuthenticated && user
              ? renderAuthenticatedContent()
              : renderGuestContent()}
          </div>
          {renderSettingsSection()}
        </Box>
      </Box>
    </MuiDrawer>
  );
}
