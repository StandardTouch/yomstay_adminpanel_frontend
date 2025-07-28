import React from 'react'
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

function AddButton({buttonValue, onAdd}) {
    return (
        <Button className="gap-2 cursor-pointer" onClick={onAdd} >
            <Plus size={16} />{buttonValue}
        </Button>
    )
}

export default AddButton