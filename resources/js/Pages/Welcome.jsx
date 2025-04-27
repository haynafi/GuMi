import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/Layouts/AppLayout";

export default function Welcome({ auth }) {
  return (
    <AppLayout auth={auth}>
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-8 sm:mt-16">
        <Card className="w-full max-w-lg sm:max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">Welcome to the App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm sm:text-base">
              This is a simple landing page built with Laravel, React, and shadcn/ui. Log in to explore more!
            </p>
            {!auth.user && (
              <Link href={route("login")} className="mt-4 inline-block">
                <Button className="w-full sm:w-auto">Get Started</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}