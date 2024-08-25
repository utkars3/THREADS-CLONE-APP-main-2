import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'

const UserHeader = ({ user }) => {                                //we are seeing the profile of this user
  const toast = useToast()                                        //for popping up in bottom
  const currentUser = useRecoilValue(userAtom)                      //logged in user
  const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));        //jiski profile khole ho waha pe jaa rhe hai . aur ye dekh rhe ki ky ham usko follow kar rhe hai ki nhi . agar kar rhe honge to uski followers ki list me to ham honge hi     
 
  const [updating,setUpdating]=useState(false)

  const showToast = useShowToast();
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {       //for copying to clipboard
      toast({
        title: 'Account created.',
        status: 'success',
        description: "Profile link copied",
        duration: 3000,
        isClosable: true,
      })
    })
  }

  const handleFollowUnfollow = async () => {

    if(!currentUser){
      showToast("Error","Please login to follow","error")
      return;
    }
    if(updating)return;           //agar already function chal rha hai to update mat karo
    setUpdating(true)

    try {
      //current user ja ke uski userid ko follow karega
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       
      })
      const data=await res.json()
      if(data.error){
      showToast("Error", data.error, "error")
        return 
      }
      if(following){
      showToast("Success", `Unfollowed ${user.name}`, "success")
      user.followers.pop()        //for decrementing followers.backend me ho gaya hoga but locally bhi kar de rhe h kyuki baar baar user fetch nhi ho rha hai

      }else{
        showToast("Success", `Followed ${user.name}`, "success")
        user.followers.push(currentUser?._id)

      }
  
      setFollowing(!following)

    } catch (error) {
      showToast("Error", error, "error")
    }finally{
      setUpdating(false);
    }
  }
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>threads.net</Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar name={user.name} src={user.profilePic} size={
              {                 //this new object for responsive purpose
                base: "md",
                md: "xl"
              }
            } />
          )}
          {!user.profilePic && (
            <Avatar name={user.name} src="https://bit.ly/broken-link" size={
              {                 //this new object for responsive purpose
                base: "md",
                md: "xl"
              }
            } />
          )}
        </Box>

      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (

        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}> {following ? "Unfollow" : "Follow"}</Button>

      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className='icon-container'>
            {/* // BOX IS LIKE A NORMAL DIV IN HTML */}
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>

                </MenuList>
              </Portal>


            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={"3"} cursor={"pointer"}>
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>

    </VStack>
  )
}

export default UserHeader
