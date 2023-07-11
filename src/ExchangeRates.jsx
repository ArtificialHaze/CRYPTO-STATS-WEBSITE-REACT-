import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "./index";
import { Container, HStack } from "@chakra-ui/react";
import Loader from "./Loader";
import Exchange from "./Exchange";
import Error from "./Error";

const ExchangeRates = () => {
  const [exchanges, setExchanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const { data } = await axios.get(`${server}/exchanges`);
        setExchanges(data);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
        console.log(err);
      }
    };

    fetchExchangeRates();
  }, []);

  if (isError) return <Error message={"Error while fetching data.."} />;

  return (
    <Container maxW={"container.xl"}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <HStack
            justifyContent={"center"}
            display={"grid"}
            gridTemplateColumns={"repeat(4,1fr)"}
          >
            {exchanges.map((exchange, index) => (
              <Exchange
                key={index}
                name={exchange.name}
                img={exchange.image}
                rank={exchange.trust_score_rank}
                url={exchange.url}
              />
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default ExchangeRates;
