import React from 'react'
import { X } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AlertBox({ onDelete, Check }) {
    return (
        <AlertDialog>
            {Check === "hotel" && <AlertDialogTrigger><div className=" py-0.5 px-1.5 bg-red-500 hover:bg-red-700 text-white rounded-md cursor-pointer absolute bottom-2 right-2">Remove Hotel</div></AlertDialogTrigger>}
            {Check === "amenity" && <AlertDialogTrigger><div className="cursor-pointer bg-red-500 hover:bg-red-700 text-white p-0.5 rounded-2xl"><X size={16} /></div></AlertDialogTrigger>}
            {Check === "faq" && <AlertDialogTrigger><div className=" py-0.5 px-1.5 text-sm bg-red-500 hover:bg-red-700 text-white rounded-md cursor-pointer absolute top-2 right-2">Remove</div></AlertDialogTrigger>}
            {Check === "Image" && <AlertDialogTrigger><div className="cursor-pointer w-fit p-1 rounded-2xl h-fit bg-red-500 hover:bg-red-700 text-white">
                <X size={20} />
            </div></AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your {Check}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-700 text-white cursor-pointer" onClick={onDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertBox