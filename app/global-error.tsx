"use client"
import Error500 from '@/assets/error-500.svg'
import Image from 'next/image'

const GlobalError = () => {
    return (
          <div className=' h-screen flex flex-col items-center justify-center gap-4'>
            <Image
                width={500}
                height={500}
                src={Error500}
                alt='Error-400'
            />
            <h1 className=' text-3xl' >Something went wrong</h1>
        </div>
    );
};

export default GlobalError;