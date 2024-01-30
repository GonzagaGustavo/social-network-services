import path from "node:path";
import protobuf from "protobufjs";

const searchProtoFile = path.join(__dirname + "/../proto/search.proto");
const root = protobuf.loadSync(searchProtoFile);
export default root.lookupType("Handle");
