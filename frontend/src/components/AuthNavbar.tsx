'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppContext } from "@/context/AppContext"
import { useFlash } from "@/context/FlashContext"
import { Skeleton } from "./ui/skeleton"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"

export default function AuthNavbar() {
    const router = useRouter()
    const { token, setToken, user, loading } = useContext(AppContext)
    const { setFlash } = useFlash()

    function handleLogout() {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
        setToken(null)
        setFlash({
            type: 'success',
            title: 'Logout Successful!',
            description: 'You have been logged out successfully.',
        })
        router.push('/')
    }

    if (loading) {
        return (
            <div className="space-x-4 flex items-center">
                <Skeleton className="h-8 w-[80px]" />
                <Skeleton className="h-8 w-[80px]" />
            </div>
        )
    }

    return (
        <div className="space-x-4 flex items-center">
            {token ? (
                <>
                    <span className="capitalize">Welcome, {user?.name || 'User'}</span>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Logout</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will need to sign in again to access your dashboard.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            ) : (
                <>
                    <Button variant="default">
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button variant="primary">
                        <Link href="/sign-up">Sign Up</Link>
                    </Button>
                </>
            )}

        </div>
    )
}
