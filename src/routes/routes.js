import connection from "../database.js";
import { auth } from "./auth/auth.js";
import products from "./store/products.js";
import cart from "./store/cart.js";
import checkout from "./store/checkout.js";

const routes = (app) => {
    auth(app, connection);
    products(app, connection);
    cart(app, connection);
    checkout(app, connection);
};

export {routes};
