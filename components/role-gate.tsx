"use client";

import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const router = useRouter()
  const role = useCurrentRole();

  if (!allowedRoles.includes(role!)) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center gap-4">
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>
              You are not authorized to access this page. You need to be a Subscribed Seller to access this page. Go to you settings and request an upgrade.
            </CardDescription>
            <CardFooter className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => router.push("/home/services")}>
                Home Page
              </Button>
              <Button onClick={() => router.push("/settings")}>
                Settings
              </Button>
            </CardFooter>
          </CardHeader>
        </Card>
      </div>
    )
  } else return (
    <div>
      {children}
    </div>
  )
}
