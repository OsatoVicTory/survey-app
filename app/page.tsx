import Home from "./homePage";

export default async function HomePage(
    { searchParams } : 
    { searchParams: Promise<{ back?: string | undefined }>}
) {
    const { back } = await searchParams;

    return (
        <div className={"w-full h-full"}>
            <Home backPage={back} />
        </div>
    );
};