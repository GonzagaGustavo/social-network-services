import { KafkaConsumer } from "node-rdkafka";
import logger from "./logger";

const kafkaConsumer = new KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": "localhost:9092",
  },
  {}
);

kafkaConsumer
  .on("ready", () => {
    kafkaConsumer.subscribe(["Search"]);
    kafkaConsumer.consume();
  })
  .on("data", (data) => {
    logger.info(data);
  });

export default kafkaConsumer;
