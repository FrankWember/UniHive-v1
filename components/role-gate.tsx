"use client";

import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Instagram } from "lucide-react"
import { useRouter } from "next/navigation";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const router = useRouter();
  const role = useCurrentRole();

  if (!allowedRoles.includes(role!)) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-muted">
        <Card className="w-full max-w-lg shadow-xl border border-border p-6">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">Access Restricted</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              To <span className="font-semibold">offer services</span> on Dormbiz,
              you can upgrade your account for free.
            </CardDescription>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>
                Contact <span className="font-medium text-foreground">Frank Wember</span> at:
              </p>
              <p>Email: <span className="text-foreground font-semibold">fwember@siue.edu</span></p>
              <p>Phone: <span className="text-foreground font-semibold">+1 (650) 283-4228</span></p>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Stay updated — follow us on Instagram:
              </p>
              <p>
               <a
                  href="https://instagram.com/dormbiz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                >
                  <Instagram className="w-4 h-4" /> @dormbiz
                </a>
              </p>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => router.push("/home/services")}>
              Home Page
            </Button>
            <Button onClick={() => router.push("/home/settings")}>
              Account Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
