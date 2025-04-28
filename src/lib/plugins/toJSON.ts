import { Schema, ToObjectOptions, Document } from "mongoose";

function toJSON(schema: Schema, options?: Partial<ToObjectOptions>) {
  const transformFunction = (_doc: Document, ret: any, _opts: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  };

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false, // Removes __v
    transform: transformFunction,
    ...options,
  });
  schema.set("toObject", {
    virtuals: true,
    versionKey: false,
    transform: transformFunction,
    ...options,
  });
}

export default toJSON;
