// app/profile/ProfileForm.tsx
'use client'

import { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { updateProfile } from './actions'
import { User } from '@prisma/client'

interface ProfileFormProps {
    user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [handle, setHandle] = useState(user.handle || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateProfile(handle)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
        }
    }

    if (!isEditing) {
        return (
            <div className="flex items-center gap-4">
                <p>Your handle: {user.handle}</p>
                <Button
                    label="Edit"
                    icon="pi pi-pencil"
                    onClick={() => setIsEditing(true)}
                />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 items-center">
                <label htmlFor="handle">Handle:</label>
                <InputText
                    id="handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-64"
                />
            </div>
            <div className="flex gap-2">
                <Button
                    type="submit"
                    label="Save"
                    icon="pi pi-check"
                />
                <Button
                    type="button"
                    label="Cancel"
                    icon="pi pi-times"
                    severity="secondary"
                    onClick={() => setIsEditing(false)}
                />
            </div>
        </form>
    )
}