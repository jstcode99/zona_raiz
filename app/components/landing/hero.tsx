import hero from '@/public/landing/hero/hero.jpg'
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Combobox } from '@/app/components/ui/combobox';
import { Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { SliderInput } from '../ui/slider-input';

export function Hero() {
    const propertyTypes = [
        { value: 'casa', label: 'Casa' },
        { value: 'apartamento', label: 'Apartamento' },
        { value: 'lote', label: 'Lote' },
        { value: 'oficina', label: 'Oficina' },
    ];
    const departments = [
        { value: 'antioquia', label: 'Antioquia' },
        { value: 'cundinamarca', label: 'Cundinamarca' },
        { value: 'valle_del_cauca', label: 'Valle del Cauca' },
        { value: 'santander', label: 'Santander' },
    ];
    const cities = [
        { value: 'bogota', label: 'Bogotá' },
        { value: 'medellin', label: 'Medellín' },
        { value: 'cali', label: 'Cali' },
        { value: 'barranquilla', label: 'Barranquilla' },
    ];

    return (
        <section className="relative flex items-center flex-col pb-48 text-sm text-white max-md:px-2 ">
            <div className="
                absolute -translate-y-16 top-0 
                brightness-60 w-full -z-10 
                h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${hero.src})` }}
            />
            <div className='mx-14 mt-48 max-w-6xl flex justify-between space-x-2'>
                <div className='space-x-1'>
                    <Badge variant="secondary">Casas</Badge>
                    <Badge variant="secondary">Lotes</Badge>
                    <Badge variant="secondary">Apartamentos</Badge>
                    <h1 className="leading-16 space-x-0 font-light text-6xl max-w-3xl">
                        Propiedades En Venta, Arriendo En Colombia.
                    </h1>
                </div>
                <p className="text-lg mt-16 max-w-md">
                    Encuentra tu hogar ideal con nosotros.
                    al mejor lugar para comprar, vender o arrendar propiedades.
                </p>
            </div>
            <form className="grid gap-4 px-8 py-4 mt-20 h-auto max-w-6xl mx-14 w-full rounded-lg border text-black bg-white">
                <h4 className="w-full text-2xl text-left mb-4">Busca propiedades</h4>
                <div className='flex flex-wrap space-x-4'>
                    <Combobox
                        label="Tipo de propiedad"
                        value=""
                        placeholder="Seleccione ..."
                        options={propertyTypes}
                        onChange={(value) => console.log('Selected property type:', value)}
                    />
                    <Combobox
                        label="Departamentos"
                        value=""
                        placeholder="Seleccione ..."
                        options={departments}
                        onChange={(value) => console.log('Selected department:', value)}
                    />
                    <Combobox
                        label="Ciudades"
                        value=""
                        placeholder="Seleccione ..."
                        options={cities}
                        onChange={(value) => console.log('Selected location:', value)}
                    />
                    <Field className='w-22'>
                        <FieldLabel htmlFor="n-rooms">
                            Habitaciones
                        </FieldLabel>
                        <Input
                            id="n-rooms"
                            placeholder="0"
                            required
                        />
                    </Field>
                    <Field className='w-22'>
                        <FieldLabel htmlFor="n-bathrooms">
                            Banos
                        </FieldLabel>
                        <Input
                            id="n-bathrooms"
                            placeholder="0"
                            required
                        />
                    </Field>
                    <SliderInput
                        label="Rango de precio"
                        description="Establece el rango de tu precio ($0 - $1000)"
                        value={[200, 800]}
                        onChange={(value) => console.log('Selected price range:', value)}
                    />
                </div>
                <div className="flex flex-wrap w-full gap-x-4 gap-y-3 justify-start md:justify-start">
                    <Button size={'lg'}>Buscar propiedades</Button>
                </div>
            </form>
        </section>
    )

}