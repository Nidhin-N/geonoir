import Image from "next/image";
import Link from "next/link";


//Home page component
export default function Home() {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen w-full p-8 pb-20 gap-16 sm:p-20 bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/homebg.png')", backgroundSize: 'cover' }}>
            {/*Main Content*/}
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Image
                    src="/geonoir.svg"
                    alt="geonoir logo"
                    width={250}
                    height={40}
                    priority
                />
                {/* Play and Settings buttons */}
                <div className="w-full flex justify-center gap-10">
                    <Link
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        href="demo"
                    >
                        Play
                    </Link>
                    <Link
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        href="settings"
                    >
                        Settings
                    </Link>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <p>Nidhin Naijo 2025</p>
            </footer>
        </div>
    );
}
