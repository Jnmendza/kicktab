import Image from "next/image";

interface AuthPageLayoutProps {
  form: React.ReactNode; // Accepts a form component (LoginForm or RegisterForm)
}

export default function AuthPageLayout({ form }: AuthPageLayoutProps) {
  return (
    <div className='flex h-screen w-screen'>
      {/* Left Section: Image with title */}
      <div className='w-3/5'>
        <div className='relative h-full rounded-br-lg'>
          <h1 className='absolute bottom-0 left-0 m-8 text-white text-4xl z-10'>
            Every Match, Every <br /> Moment, One Tab.
          </h1>
          <Image
            src='/assets/loginImage.png'
            alt='Auth Image'
            layout='fill'
            objectFit='cover'
          />
        </div>
      </div>

      {/* Right Section: Form */}
      <div className='w-1/2 flex justify-center'>{form}</div>
    </div>
  );
}
