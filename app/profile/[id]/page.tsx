import Profile from "./profile";

type Params = Promise<{ id: string }>;

export default async function ProfilePageMain({ params } : { params: Params }) {
    const { id } = await params || "";

    return (
        <div className={"w-full h-full"}>
            <Profile id={id} />
        </div>
    );
};