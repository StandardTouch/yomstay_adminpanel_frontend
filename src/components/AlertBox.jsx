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

function AlertBox({ onDelete, Check, hotelName }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className={`cursor-pointer bg-red-500 hover:bg-red-700 text-white rounded-2xl
                    ${Check === "Hotel" && " py-2 px-2.5 rounded-md absolute bottom-2 right-2"}
                    ${Check === "Faq" && " py-1 px-2.5 text-sm rounded-md absolute top-2 right-2"}
                    ${Check === "Amenity" && "p-0.5 rounded-2xl"}
                    ${Check === "Image" && "p-1 rounded-2xl"}`}>
                    {(Check === "Amenity" || Check === "Image") && <X size={16} />}
                    {(Check === "Hotel" || Check === "Faq") && (`Remove ${Check}`)}
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <div className='text-red-500 font-medium'>{hotelName}</div>
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