type NestedObject = {
  [key: string]:
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | null
    | NestedObject
    | NestedObject[];
};

type SuccessResponse = {
  ok: boolean;
  message: string;
  data: NestedObject | NestedObject[] | Record<string, unknown>;
};

type ErrorResponse = {
  ok: boolean;
  message: string;
  data: null;
};

export type { SuccessResponse, ErrorResponse };
