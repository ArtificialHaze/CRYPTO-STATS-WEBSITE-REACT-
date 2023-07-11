import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { server } from "./index";
import { useParams } from "react-router-dom";
import Error from "./Error";
import Chart from "./Chart";

const CustomBar = ({ high, low }) => {
  return (
    <VStack w={"full"}>
      <Progress value={50} colorScheme="teal" w={"full"} />
      <HStack justifyContent={"space-between"} w={"full"}>
        <Badge children={low} colorScheme="red"></Badge>
        <Text fontSize={"sm"}>24 Hour Range</Text>
        <Badge children={high} colorScheme="green"></Badge>
      </HStack>
    </VStack>
  );
};

const Item = ({ title, value }) => {
  return (
    <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
      <Text fontFamily={"sans-serif"} letterSpacing={"widest"}>
        {title}
      </Text>
      <Text>{value}</Text>
    </HStack>
  );
};

const CoinDetails = () => {
  const [coin, setCoin] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);

  const { id } = useParams();

  const currencySymbol =
    currency === "usd" ? "$" : currency === "eur" ? "E" : "$";

  const btns = ["24h", "7d", "14d", "30d", "1y", "max"];

  const switchChartStats = (value) => {
    switch (value) {
      case "24h":
        setDays("24h");
        setIsLoading(true);
        break;
      case "7d":
        setDays("7d");
        setIsLoading(true);
        break;
      case "14d":
        setDays("14d");
        setIsLoading(true);
        break;
      case "30d":
        setDays("30d");
        setIsLoading(true);
        break;
      case "1y":
        setDays("1y");
        setIsLoading(true);
        break;
      case "max":
        setDays("max");
        setIsLoading(true);
        break;
      default:
        setDays("24h");
        setIsLoading(true);
        break;
    }
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${id}`);

        const { data: chartData } = await axios.get(
          `${server}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
        );

        setCoin(data);
        setChartArray(chartData.prices);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
        console.log(err);
      }
    };

    fetchCoins();
  }, [id, currency, days]);

  if (isError) return <Error message={"Error while fetching data.."} />;

  return (
    <Container maxW={"container.xl"}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>
            <Chart arr={chartArray} currency={currencySymbol} days={days} />
          </Box>
          <HStack p={"4"} overflowX={"auto"}>
            {btns.map((btn, index) => (
              <Button key={index} onClick={() => switchChartStats(btn)}>
                {btn}
              </Button>
            ))}
          </HStack>
          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={4}>
              <Radio value={"usd"}>$ USD</Radio>
              <Radio value={"eur"}>E EUR</Radio>
            </HStack>
          </RadioGroup>
          <VStack spacing={4} p={"16"} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf={"center"} opacity={0.75}>
              Last updated on{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>
            <Image
              src={coin.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            />
            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol} {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>
            <Badge
              fontSize={"2xl"}
              bgColor={"blackAlpha.900"}
              color={"white"}
            >{`#${coin.market_cap_rank}`}</Badge>
            <CustomBar
              high={`${coin.market_data.high_24h[currency]}`}
              low={`${coin.market_data.low_24h[currency]}`}
            />
            <Box w={"full"} p={"4"}>
              <Item title={"Max Supply"} value={coin.market_data.max_supply} />
              <Item
                title={"Circulating Supply"}
                value={coin.market_data.circulating_supply}
              />
              <Item
                title={"Market Cap."}
                value={`${currencySymbol} ${coin.market_data.market_cap[currency]}`}
              />
              <Item
                title={"All time low"}
                value={`${currencySymbol} ${coin.market_data.atl[currency]}`}
              />
              <Item
                title={"All time high"}
                value={`${currencySymbol} ${coin.market_data.ath[currency]}`}
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

export default CoinDetails;
