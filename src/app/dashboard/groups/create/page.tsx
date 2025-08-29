import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import Image from "next/image";

export default function CreateGroupPage() {
    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
             <div>
                <h1 className="text-3xl font-bold font-headline">Create a New Study Group</h1>
                <p className="text-muted-foreground mb-6">Start a new community of learners.</p>
                <CreateGroupForm />
            </div>
             <div className="hidden md:flex justify-center items-center bg-muted rounded-lg p-8">
                <Image 
                    src="https://picsum.photos/500/500"
                    width="500"
                    height="500"
                    alt="Group of people planning"
                    data-ai-hint="team planning"
                    className="rounded-lg"
                />
            </div>
        </div>
    );
}
