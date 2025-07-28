import { login, signup } from "./user-auth-controller";
import {
  googlelogin,
  googleCallback,
  googleSuccess,
  googleSignout,
} from "./google-auth-controller";

export default {
  login,
  signup,
  googlelogin,
  googleCallback,
  googleSuccess,
  googleSignout,
};
