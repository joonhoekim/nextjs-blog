import AuthButton from './AuthButton'
import Navigation from './Navigation'

export default function Header() {
    return (
        <header className="shadow-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Navigation />
                <AuthButton />
            </div>
        </header>
    )
}