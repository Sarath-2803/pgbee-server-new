import authorize from "./auth-middleware";
import ErrorHandler, { asyncErrorHandler } from "./error-handler";

export default ErrorHandler;
export { authorize, asyncErrorHandler };
