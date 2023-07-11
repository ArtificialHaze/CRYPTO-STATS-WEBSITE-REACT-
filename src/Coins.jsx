import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "./index";
import { Button, Container, HStack, Radio, RadioGroup } from "@chakra-ui/react";
import Loader from "./Loader";
import Error from "./Error";
import Coin from "./Coin";

const Coins = () => {
  const [coins, setcoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("usd");

  const changePage = (page) => {
    setPage(page);
    setIsLoading(true);
  };

  const btns = new Array(132).fill(1);

  const currencySymbol =
    currency === "usd" ? "$" : currency === "eur" ? "E" : "$";

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(
          `${server}/coins/markets?vs_currency=${currency}&page=${page}`
        );
        setcoins(data);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
        console.log(err);
      }
    };

    fetchCoins();
  }, [currency, page]);

  if (isError) return <Error message={"Error while fetching data.."} />;

  return (
    <Container maxW={"container.xl"}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={4}>
              <Radio value={"usd"}>$ USD</Radio>
              <Radio value={"eur"}>E EUR</Radio>
            </HStack>
          </RadioGroup>
          <HStack justifyContent={"space-evenly"} wrap={"wrap"}>
            {coins.map(({ id, current_price, name, image, symbol }, index) => (
              <Coin
                key={index}
                id={id}
                price={current_price}
                symbol={symbol}
                name={name}
                img={image}
                currencySymbol={currencySymbol}
              />
            ))}
          </HStack>
          <HStack w={"full"} overflowX={"auto"} p={"8"}>
            {btns.map((_, index) => (
              <Button
                key={index}
                bgColor={"blackAlpha.900"}
                color={"white"}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Coins;
