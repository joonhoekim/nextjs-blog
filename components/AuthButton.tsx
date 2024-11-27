// app/components/AuthButton.tsx
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import ThemeSelector from './ThemeSelector'

export default function AuthButton() {
    const { data: session, status } = useSession()
    const menuRef = useRef<Menu>(null)
    const router = useRouter()

    const userMenuItems: MenuItem[] = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: (e) => {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                router.push('/profile');
            }
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: (e) => {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                router.push('/settings');
            }
        },
        {
            separator: true
        },
        {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: (e) => {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                signOut();
            }
        }
    ]

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        menuRef.current?.toggle(e);
    };

    return (
        <div className="flex items-center h-[40px]">
            <ThemeSelector />
            {status === 'loading' ? (
                <i className="pi pi-spin pi-spinner text-2xl" />
            ) : session?.user ? (
                <>
                    <Avatar
                        image={session.user.image || '/default-avatar.png'}
                        shape="circle"
                        className="cursor-pointer"
                        onClick={handleAvatarClick}
                    />
                    <Menu
                        model={userMenuItems}
                        popup
                        ref={menuRef}
                        className="w-48"
                    />
                </>
            ) : (
                <Button
                    label="Sign In"
                    icon="pi pi-sign-in"
                    onClick={() => signIn('google')}
                    className="p-button-primary"
                />
            )}
        </div>
    )
}