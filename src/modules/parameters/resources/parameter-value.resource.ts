import { Injectable } from '@nestjs/common';

@Injectable()
export class ParametersValueResource {
  public static collect(model: Array<any>) {
    const data = {};
    if (model) {
      model.map((item) => {
        const paramName = item?.parameter?.name;
        data[paramName.toLowerCase()] = item?.value;
      });
    }
    return data;
  }
}
