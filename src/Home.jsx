import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <Box bgColor={"blackAlpha.900"} w={"full"} h={"85vh"}>
      <motion.div
        style={{ height: "80vh" }}
        animate={{
          translateY: "20px",
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
        }}
      >
        <Image
          src={""}
          w={"full"}
          h={"full"}
          objectFit={"contain"}
          filter={"grayscale(1)"}
        />
        <Text
          fontSize={"6xl"}
          textAlign={"center"}
          fontWeight={"thin"}
          color={"whiteAlpha.700"}
          mt={"-20"}
          userSelect={"none"}
        >
          Cryptonio
        </Text>
      </motion.div>
    </Box>
  );
};

export default Home;
