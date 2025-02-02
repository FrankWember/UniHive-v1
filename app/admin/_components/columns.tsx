"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { User, UserRole } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronsUpDown } from "lucide-react"
import { changeUserRole } from "@/actions/user"
import { useToast } from "@/hooks/use-toast"

export const UsersColumnDef: ColumnDef<User>[] = [
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const { toast } = useToast()
            const userId = row.original.id
            const role = row.original.role
            const [currentRole, setCurrentRole] = React.useState(role)

            async function handleRoleChange(value: UserRole) {
                try {
                    await changeUserRole(userId, value)
                    setCurrentRole(value)
                        toast({
                            title: 'Role Changed',
                            description: 'Role has been changed successfully.',
                        })
                } catch (err) {
                    toast({
                        title: 'Error',
                        description: "Failed to change role.",
                        variant: 'destructive'
                    })
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2 items-center">
                            {currentRole}
                            <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Roles</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={currentRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
                            <DropdownMenuRadioItem value={UserRole.STUDENT}>{UserRole.STUDENT}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={UserRole.SELLER}>{UserRole.SELLER}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={UserRole.ADMIN}>{UserRole.ADMIN}</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
