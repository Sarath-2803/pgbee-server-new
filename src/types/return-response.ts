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

type RequestResponse = {
  ok: boolean;
  message: string;
  data: {
    [key: string]: string | number | boolean | NestedObject;
  };
};

export default RequestResponse;
