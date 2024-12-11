"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Session } from 'next-auth';
import { User } from '@prisma/client';

interface UserCTAProps {
    handle: string | null;
}

const UserCTA = ({ handle }: UserCTAProps) => {
    if (!handle) {
        return (
            <h1>login first</h1>
        )
    }



    return (
        <Card className="m-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
                    <p className="text-gray-600">YOUR HOME</p>
                </div>

                <Link href={`/@${handle}`} >
                    <Button
                        label="USER_HOME"
                        icon="pi pi-user"
                        severity="info"
                        raised
                        className="p-button-lg"
                    />
                </Link>
            </div>
        </Card>
    );
};

export default UserCTA;