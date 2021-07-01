import connection from "../database.js";
import { auth } from "./auth/auth.js";
import products from "./store/products.js";

const routes = (app) => {
    auth(app, connection);
    products(app, connection);
    
};

export {routes};
