"use client";

import { X, User, Package, MapPin, Heart, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  };
}

export function AccountDrawer({ isOpen, onClose, locale, dictionary }: AccountDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const isRTL = locale === "ar";

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { icon: Package, label: dictionary.orders, href: `/${locale}/account/orders` },
    { icon: MapPin, label: dictionary.addresses, href: `/${locale}/account/addresses` },
    { icon: Heart, label: dictionary.wishlist, href: `/${locale}/account/wishlist` },
    { icon: Settings, label: dictionary.settings, href: `/${locale}/account/settings` },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300",
          isRTL ? "left-0" : "right-0",
          isOpen
            ? "translate-x-0"
            : isRTL
            ? "-translate-x-full"
            : "translate-x-full"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">{dictionary.myAccount}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isAuthenticated && user ? (
              <>
                <div className="border-b p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {dictionary.welcome}
                      </p>
                      <p className="text-lg font-medium">
                        {user.user_display_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.user_email}</p>
                    </div>
                  </div>
                </div>

                <nav className="p-4">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="border-t p-4">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{dictionary.logout}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <p className="mb-6 text-gray-600">{dictionary.notLoggedIn}</p>
                <div className="flex w-full flex-col gap-3">
                  <Link
                    href={`/${locale}/login`}
                    onClick={onClose}
                    className="w-full rounded-lg bg-black px-6 py-3 text-center font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    {dictionary.login}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    onClick={onClose}
                    className="w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    {dictionary.register}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
