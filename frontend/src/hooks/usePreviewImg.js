import React, { useState } from 'react'
import useShowToast from './useShowToast'

//since its a custom hook it will not return any object
//whole logic for image choosing and converting it to url
const usePreviewImg = () => {
  const [imgUrl,setImgUrl]=useState(null)
    const showToast=useShowToast()
  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file && file.type.startsWith("image/")){
        const reader=new FileReader()                       //js api hook for file 

        reader.onloadend=()=>{
            setImgUrl(reader.result)
        }

        reader.readAsDataURL(file)
    }else{
        showToast("Invalid file type","Please select an image file","error")
        setImgUrl(null);
    }
  }
  return {handleImageChange,imgUrl,setImgUrl}
}

export default usePreviewImg
