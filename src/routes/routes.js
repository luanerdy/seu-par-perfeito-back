import connection from "../database.js";
import { auth } from "./auth/auth.js";
import products from "./store/products.js";
import cart from "./store/cart.js";

const routes = (app) => {
    auth(app, connection);
    products(app, connection);
    cart(app, connection);
};

export {routes};
