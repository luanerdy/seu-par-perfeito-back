import connection from "../database.js";
import { auth } from "./auth/auth.js";

const routes = (app) => {
    auth(app, connection);
};

export {routes};
