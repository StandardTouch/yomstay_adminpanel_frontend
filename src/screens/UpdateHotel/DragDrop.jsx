import React from 'react'
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";

function DragDrop({ image, setImage, setAddAmenity, addAmenity }) {

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
            setAddAmenity({ ...addAmenity, icon: URL.createObjectURL(file) });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow drop
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col justify-between items-center w-full ">
                <label htmlFor="icon" className="w-full h-full flex flex-col gap-2 p-2 rounded-md cursor-pointer dark:bg-slate-800 bg-slate-300 ">
                    {!image ? <div>
                        <p className=" w-full">Upload a File</p>
                        <p className="text-xs w-full ">Select a file to Upload and click the add button</p>
                    </div> : <div className="relative flex flex-col gap-2 items-center">
                        <div>
                        <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} className="overflow-auto h-40 rounded" />
                        </div>
                        <Button className="w-full cursor-pointer" variant="destructive" onClick={() => { setImage(null); setAddAmenity({ ...addAmenity, icon: "" }) }}>Remove</Button>
                    </div>}
                    {!image && <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onChange={() => setAddAmenity({ ...addAmenity, icon: image })}
                        className="border-2 border-dashed rounded-md p-5 text-center cursor-pointer border-gray-600 dark:border-gray-300"
                    >
                        <div className="w-full flex flex-col items-center justify-center py-8">
                            <Upload size={25} />
                            <p className="text-xs">Click to Upload or drag and drop</p>
                            <p className="text-xs">SVG, PNG, JPG or GIF ( max. 800x400px )</p>
                        </div>
                    </div>}
                </label>
                <input type="file" className="w-full p-3 hidden" id="icon" required
                    onChange={e => {
                        setAddAmenity({ ...addAmenity, icon: URL.createObjectURL(e.target.files[0]) });
                        setImage(URL.createObjectURL(e.target.files[0]))
                    }} />
            </div>
        </div>
    )
}

export default DragDrop