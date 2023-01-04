import { POSSIBLE_ARGS } from "./constants";

export type Args = {
  [key in typeof POSSIBLE_ARGS[number]]?: string;
};
