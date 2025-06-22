import Survey from "./survey";

type Params = Promise<{ id: string }>;

export default async function SurveyPage({ params } : { params: Params }) {
    const { id } = await params || "";

    return (
        <div className={`w-full h-full`}>
            <Survey id={id} />
        </div>
    );
};