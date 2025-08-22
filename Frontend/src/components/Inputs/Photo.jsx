    import React, { useRef, useState } from 'react'
    import {LuUser, LuUpload, LuTrash} from 'react-icons/lu'

    const Photo = ({Image, setImage, preview, setPreview}) => {
        const inputRef = useRef();
        const [previewURL, setpreviewURL] = useState(null);
        const handleImageChange = (event)=>{
            const file = event.target.files[0];
            if(file) {
                setImage(file);
                const preview = URL.createObjectURL(file);
                if(setPreview) {
                    setPreview(preview);
                }
                setpreviewURL(preview);
            }
        }

        const handleRemovedImage = ()=>{
            setImage(null);
            setpreviewURL(null);
            if(setPreview) {
                setPreview(null)
            }
        }

        const onChooseFile = ()=> {
            inputRef.current.click();
        }

    return (
        <div className='flex justify-center mb-2'>
            <input className='hidden' type="file" accept='image/*' ref={inputRef} onChange={handleImageChange} />
            {!Image ? (<div className='w-15 h-15 flex items-center justify-center bg-orange-50 rounded-full relative cursor-pointer'>
                <LuUser className='text-4xl text-orange-500'/>
                <button type='button' className='w-8 h-8 flex items-center justify-center bg-linear-to-r from-orange-500/85 to-orange-600 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer' onClick={onChooseFile}><LuUpload/></button>
            </div>
            ) : (
                <div className='relative'>
                    <img src={preview || previewURL || null} alt="Profile Photo" className='w-15 h-15 rounded-full object-cover' />
                    <button type='button' className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer' onClick={handleRemovedImage}><LuTrash/></button>
                </div>
            )}
        </div>
    )
    }

    export default Photo