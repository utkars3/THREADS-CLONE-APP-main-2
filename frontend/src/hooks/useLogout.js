
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from './useShowToast';
const apiUrl = import.meta.env.VITE_API_URL;
const useLogout = () => {
    const setUser=useSetRecoilState(userAtom);
    const showToast=useShowToast()
    const logout=async()=>{
        try {
            const res= await fetch("${apiUrl}/api/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                }
            })
            const data=await res.json();
           

            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            localStorage.removeItem("user-threads");

            //fetch
            setUser(null)

        } catch (error) {
            showToast("Error",error,"error")
        }
    }
    return logout
}

export default useLogout
