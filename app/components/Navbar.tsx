import Link from "next/link";
import { Button } from '@/app/components/ui/button';

export default function Navbar() {
    return (
        <header className="bg-transparent border-b border-gray-200">
            <div className="max-w-350 mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center justify-center gap-3">
                    <span className="font-semibold text-xl ">
                        Zona Raiz
                    </span>
                </Link>
                <nav className="hidden md:flex gap-8 text-sm font-medium">
                    <Link href="#">
                        Buy
                    </Link>
                    <Link
                        href="#"
                    >
                        Rent
                    </Link>
                    <Link href="#">
                        Sell
                    </Link>
                    <Link href="#">
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
