import { KafkaConsumer } from "node-rdkafka";
import logger from "./logger";
import eventType from "./config/eventType";

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
    const playload = eventType.fromBuffer(data.value as any);
    logger.info(playload);
  });

export default kafkaConsumer;
