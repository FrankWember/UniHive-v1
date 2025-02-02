import { DataTable } from '@/components/ui/data-table'
import { getAllUsers } from '@/utils/user'
import { ColumnFilter } from '@tanstack/react-table'
import React from 'react'
import { UsersColumnDef } from './_components/columns'
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'

const AdminPage = async () => {
    const allUsers = await getAllUsers()
    const customFilter: ColumnFilter = {id: 'email', value: 'Email'}

    return (
        <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
            <div className='flex flex-col min-h-screen w-screen p-4 md:p-10'>
                <DataTable data={allUsers} columns={UsersColumnDef} filter={customFilter} />
            </div>
        </RoleGate>
    )
}

export default AdminPage