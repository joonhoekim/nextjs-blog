// app/components/Navigation.tsx
import Image from 'next/image'
import Link from 'next/link'

// 타입 정의
type NavItem = {
    label: string
    href: string
}

// 네비게이션 항목들은 컴포넌트 외부에 정의
const navItems: NavItem[] = [
    { label: 'About', href: '/about' },
    { label: 'Posts', href: '/posts' },
]

export default function Navigation() {
    return (
        <nav className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">

                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                    priority
                />

                <span className="font-bold text-xl">BLOG</span>

            </Link>

            {/* Nav Links */}
            <ul className="flex items-center gap-4 list-none m-2 p-2">
                {navItems.map(({ label, href }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}