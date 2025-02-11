"use client"
import Error400 from '@/assets/error-400.svg'
import Image from 'next/image'
const NotFound = () => {
    return (
        <div className=' h-screen flex flex-col items-center justify-center gap-4'>
            <Image
                width={500}
                height={500}
                src={Error400}
                alt='Error-400'
            />
            <h1 className=' text-3xl' > 404 | Page not found</h1>
        </div>
    );
};

export default NotFound;