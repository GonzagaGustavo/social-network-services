// use avro_rs::{types::Value, Error, Reader, Schema};

// pub fn read(input: Vec<u8>) -> Result<Vec<Value>, Error> {
//     let reader_raw_schema = r#"
//     {
//         "type": "record",
//         "name": "Handle",
//         "fields": [
//           {
//             "name": "event",
//             "type": { "type": "enum", "name": "Event", "symbols": ["CREATE", "DELETE"] }
//           },
//           { "name": "id", "type": ["null", "string"], "default": null },
//           { "name": "user_id", "type": ["null", "int"], "default": null }
//         ]
//     }"#;

//     let reader_schema = Schema::parse_str(reader_raw_schema)?;
//     let reader = Reader::with_schema(&reader_schema, &input[..])?;

//     let records: Vec<Value> = reader.map(|record| record.unwrap()).collect();

//     Ok(records)
// }
