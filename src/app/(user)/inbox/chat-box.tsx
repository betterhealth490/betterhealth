import { SendIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { InboxItem } from "~/entities/inbox";
  
interface ChatBoxProps {
    item: InboxItem;
}

export function ChatBox({item}: ChatBoxProps){
    const [message, setMessage] = useState('')
    var id = 0

    useEffect(() => {
        console.log(item);
    }, []);

    const handleSend = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (message.trim() != "") {
            item.recievedMessages.push(message);
            setMessage("")
        }
    }

    return(
        <div className="w-[98%] h-full">
            <div className="flex flex-col h-full border rounded-[8px]">
                <div className="flex p-6 border-b-2 gap-4">
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
                <div className="flex flex-col p-6 h-[80vh] justify-between">
                    <ScrollArea className="mt-2 border rounded-[8px] h-[90%]">
                        <div className="flex flex-col gap-5 w-full">
                            {item.sentMessages.map((message) => (
                                <span key={id++} className="p-3 border rounded-[8px] bg-muted w-fit max-w-[80%] m-2">
                                    {message}
                                </span>
                            ))}
                            {item.recievedMessages.map((message) => (
                                <div className="flex justify-end m-2">
                                <span key={id++} className="p-3 border rounded-[8px] bg-primary text-white w-fit max-w-[80%]">
                                    {message}
                                </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleSend}>
                        <div className="relative">
                            <Input 
                                type="text" 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Send a message" 
                                className="pl-4"
                            />
                            <button 
                                className="border border-primary bg-primary rounded-full p-1 absolute right-4 top-[7px]"
                                type="button"
                                value="Submit"
                                id="btnsubmit"
                                onClick={handleSend}
                            >
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