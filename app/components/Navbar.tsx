import Link from "next/link";
import { Button } from '@/app/components/ui/button';

export default function Navbar() {
    return (
        <header className="bg-transparent border-b border-gray-200">
            <div className="max-w-350 mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center justify-center gap-3">
                    <span className="font-semibold text-xl text-white">
                        Zona<span className="text-white">Raiz</span>
                    </span>
                </Link>
                <nav className="hidden md:flex gap-8 text-sm font-medium">
                    <Link href="#" className="text-white hover:text-primary">
                        Buy
                    </Link>
                    <Link
                        href="#"
                        className="text-white relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-1 after:bg-primary after:rounded-full"
                    >
                        Rent
                    </Link>
                    <Link href="#" className="text-white hover:text-primary">
                        Sell
                    </Link>
                    <Link href="#" className="text-white hover:text-primary">
                        Rent out
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Button size={'lg'}>Iniciar sesion</Button>
                </div>
            </div>
        </header>
    );
}
