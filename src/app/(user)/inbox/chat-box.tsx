import { PlaneIcon, SendIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { InboxItem } from "./page";
import { useEffect } from "react";
  
interface ChatBoxProps {
    item: InboxItem;
}

export function ChatBox({item}: ChatBoxProps){

    useEffect(() => {
        console.log(item);
    }, []);

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
                <div className="flex flex-col p-6 h-[75vh] justify-between">
                    <ScrollArea className="mt-2 border rounded-[8px] h-5/6">
                        <div className="flex flex-col gap-10">
                            {item.messages.map((message) => (
                                <span key={item.id} className="p-3 border rounded-[8px] w-4/5 bg-muted">
                                    {message}
                                </span>
                            ))}
                        </div>
                    </ScrollArea>
                    <form>
                        <div className="relative">
                            <Input placeholder="Send a message" className="pl-4"/>
                            <button className="border border-primary bg-primary rounded-full p-1 absolute right-4 top-[7px]">
                                <SendIcon
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