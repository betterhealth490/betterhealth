'use client'

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import Link from "next/link"
import { useFieldArray, useForm } from "react-hook-form"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "~/hooks/use-toast"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"

export default function AccountTab(){
    
    function onSubmit() {
        toast({
            title: "Your account was deleted",
        })
    }

    return(
        <div className="mt-10">
            <div className="flex items-center gap-x-2">
                <Button type="submit" variant="destructive" onClick={onSubmit}>Delete Account</Button>
                <Label id="delete" className="text-lg text-red-600">This will permanently delete your account, use caution.</Label>
            </div>
        </div>
    )
}