import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Menu } from "lucide-react";

export default function AppLayout({ children, auth }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold">Laravel + shadcn/ui</h1>
          <div className="hidden sm:flex items-center space-x-4">
            {auth.user ? (
              <>
                <Link href={route("purchases.index")} className="text-gray-700 hover:text-gray-900">
                  Purchases
                </Link>
                <Link href={route("dashboard")} className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
              </>
            ) : (
              <Link href={route("login")}>
                <Button>Log in</Button>
              </Link>
            )}
          </div>
          <div className="sm:hidden">
            <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <div className="flex flex-col space-y-4 mt-4">
                  {auth.user ? (
                    <>
                      <Link
                        href={route("purchases.index")}
                        className="text-gray-700 hover:text-gray-900 text-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Purchases
                      </Link>
                      <Link
                        href={route("dashboard")}
                        className="text-gray-700 hover:text-gray-900 text-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={route("login")}
                      className="text-gray-700 hover:text-gray-900 text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}