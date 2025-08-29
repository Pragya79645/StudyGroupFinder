import { GroupChat } from '@/components/groups/GroupChat';
import { AiAssistant } from '@/components/groups/AiAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Tag } from 'lucide-react';

// In a real app, this data would be fetched from Firestore based on params.groupId
const getGroupData = async (groupId: string) => {
    console.log(`Fetching data for group ${groupId}`);
    return {
        id: groupId,
        groupName: 'Calculus Crew',
        subject: 'Math 101: Calculus II',
        tags: ['Midterm Prep', 'Homework'],
        members: [
            { id: '1', name: 'Alex Doe' },
            { id: '2', name: 'Jane Smith' },
            { id: '3', name: 'Sam Wilson' },
        ],
    };
};

export default async function GroupPage({ params }: { params: { groupId: string } }) {
    const group = await getGroupData(params.groupId);

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <GroupChat groupId={group.id} />
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{group.groupName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{group.subject}</p>
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-wrap gap-2">
                                {group.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                        </div>
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 font-semibold">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <span>Members ({group.members.length})</span>
                            </div>
                            <ul className="space-y-2 pl-2">
                                {group.members.map(member => (
                                    <li key={member.id} className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://avatar.vercel.sh/${member.name}.png`} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{member.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
                <AiAssistant subject={group.subject} />
            </div>
        </div>
    );
}
