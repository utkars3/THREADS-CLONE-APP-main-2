import { useToast } from "@chakra-ui/react"
import { useCallback } from "react";

const useShowToast=()=>{
    const toast=useToast();
    const showToast=useCallback((title,description,status)=>{
        toast({
            title:title,
            description:description,
            status:status,
            duration:3000,
            isClosable:true
        })
    },[toast])                                      //isko use kia hai kyuki userpage me baar baar call hoke crash kar jaiga to baar baar alag stack me fn na dale.infinite loop prblem solve karega

    return showToast
}

export default useShowToast