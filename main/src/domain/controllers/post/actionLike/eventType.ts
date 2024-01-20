import avro from "avsc";

export default avro.Type.forSchema({
  type: "record",
  name: "Handle",
  fields: [
    {
      name: "event",
      type: { type: "enum", name: "Event", symbols: ["CREATE", "DELETE"] },
    },
    { name: "id", type: ["null", "string"], default: null },
    { name: "user_id", type: ["null", "int"], default: null },
  ],
});
