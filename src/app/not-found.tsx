export default function NotFoundPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ae022d] to-[#25161c] text-white">
            <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    404
                </h1>
                <span className="text-xl font-extrabold tracking-tight text-white sm:text-[2rem]">
                    Not found
                </span>
            </div>
        </main>
    );
}
