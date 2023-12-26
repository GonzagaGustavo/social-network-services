import { KafkaConsumer } from "node-rdkafka";
import logger from "./logger";
import eventType from "./config/eventType";
import consumer from "./consumers";

type HandleMessage = {
  event: "CREATE" | "DELETE" | "UPDATE";
  id?: string;
  user_id?: number;
  search: string;
  sort?: number;
};

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
    const playload: HandleMessage = eventType.fromBuffer(data.value as any);

    switch (playload.event) {
      case "CREATE":
        consumer.create(playload);
      case "DELETE":
        consumer.delete(playload);

      default:
        return;
    }
  });

export default kafkaConsumer;
