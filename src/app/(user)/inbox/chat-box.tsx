import { PlaneIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";

interface ChatBoxItem {
    profileImageUrl: string;
    firstName: string;
    lastName: string;
    email: string;
    messages: string[];
    id: number;
}
  
interface ChatBoxProps {
    item: ChatBoxItem;
}

export function ChatBox({item}: ChatBoxProps){
    return(
        <div className="w-full h-full">
            <div className="flex flex-col border rounded-[8px]">
                <div className="flex p-6 border-b-2">
                    <Avatar>
                        <AvatarImage src={item.profileImageUrl} />
                        <AvatarFallback>
                            {item.firstName.charAt(0) + item.lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold capitalize">{item.firstName + " " + item.lastName}</span>
                        <span className="text-xs text-muted-foreground">{item.email}</span>
                    </div>
                </div>
                <line/>
                <div className="flex flex-col p-6 h-[80vh] justify-between">
                    <div>
                        <div className="flex flex-col gap-10">
                            {item.messages.map((message) => (
                                <span className="p-3 border rounded-[8px] w-4/5 bg-muted">
                                    {message}
                                </span>
                            ))}
                        </div>
                    </div>
                    <form>
                        <div className="relative">
                            <Input placeholder="Send a message" className="pl-4"/>
                            <button className="border border-primary bg-primary rounded-full p-1 absolute right-4 top-[7px]">
                                <PlaneIcon
                                color="white"
                                size="16"
                                />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}