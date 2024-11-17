"use client"
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

const LoginLogout = () => {
    const session = useSession()
    return (
        <div className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors">
            {<Button onClick={() => signOut()}>Log Out</Button>}
        </div>
    )
}

export default LoginLogout
