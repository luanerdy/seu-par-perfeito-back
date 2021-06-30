import { login } from "./login.js";
import { signup } from "./signup.js";
import { logout } from "./logout.js";

const auth = (app, connection) => {
    login(app, connection);
    signup(app, connection);
    logout(app, connection);
};

export {auth};
