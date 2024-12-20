export function Boilerplate({
    custom = false,
    children,
}: {
    custom?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
                {custom ? (
                    children
                ) : (
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        {children}
                    </h1>
                )}
            </div>
        </main>
    );
}
