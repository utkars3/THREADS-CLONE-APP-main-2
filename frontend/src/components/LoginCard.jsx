import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom); //for updating state
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    //for storing current values of username and password in login

    username: "",
    password: "",
  });
  const setUser = useSetRecoilState(userAtom);

  const showToast = useShowToast();

  //for handling the login when a user click on login button
  // const handleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(inputs),
  //     });
  //     const data = await res.json();
  //     if (data.error) {
  //       showToast("Error", data.error, "error");
  //       return;
  //     }
  //     localStorage.setItem("user-threads", JSON.stringify(data));
  //     setUser(data);
  //   } catch (error) {
  //     showToast("Error", error, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://threads-clone-app-main-2.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      
      const data = await res.json();
      console.log(data)
      if (data.error) {
        showToast("Error", data.error, "error");
        setLoading(false); // Reset loading state if there's an error
        return;
      }
      localStorage.setItem('user-threads', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px", //smaller screen and above
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                type="text"
                value={inputs.username}
                onChange={(e) =>
                  setInputs((inputs) => ({
                    ...inputs,
                    username: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((inputs) => ({
                      ...inputs,
                      password: e.target.value,
                    }))
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                New User ?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => setAuthScreen("signup")}
                >
                  Signup
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
