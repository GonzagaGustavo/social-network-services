import path from "path";
import { HttpRequest, ResponseObject } from "../../../../interfaces/controller";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import MicroServiceController from "../../../../interfaces/controller/microservice";

export default class SearchHistoryController extends MicroServiceController {
  async GET(httpRequest: HttpRequest): Promise<ResponseObject> {
    const userId = httpRequest.query.userId;

    const protoObject = loadSync(path.resolve(__dirname, "search.proto"));
    const SearchClient: any = loadPackageDefinition(protoObject);

    const client = new SearchClient.Search(
      "localhost:5000",
      credentials.createInsecure()
    );

    let data;
    let err;
    const call = client.get({}, (e, newData) => {
      console.log(newData);
      data = newData;
      err = e;
    });

    // call.on("data", function (feature) {
    //   console.log(feature);
    //   data = feature;
    // });
    // call.on("end", function () {
    //   console.log("end");
    //   // The server has finished sending
    // });
    // call.on("error", function (e) {
    //   err = e;
    //   console.log("error", e);
    //   // An error has occurred and the stream has been closed.
    // });
    // call.on("status", function (status) {
    //   console.log("status", status);
    //   // process status
    // });

    if (err) return this.res.serverError(err);

    return this.res.ok(data);
  }

  async POST(httpRequest: HttpRequest): Promise<ResponseObject> {
    return this.res.ok("teste");
  }

  async PUT(httpRequest: HttpRequest): Promise<ResponseObject> {
    return this.res.ok("teste");
  }

  async DELETE(httpRequest: HttpRequest): Promise<ResponseObject> {
    return this.res.ok("teste");
  }
}
