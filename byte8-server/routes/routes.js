import { Router } from "express"
import getProducts from "../controllers/getProducts.js";
import registerAccount from "../controllers/registerAccount.js";
import loginAccount from "../controllers/loginAccount.js";
import userAuth from "../controllers/userAuth.js";
import saveProduct from "../controllers/saveProduct.js";
import deleteProduct from "../controllers/deleteProduct.js";
import getBag from "../controllers/getBag.js";
import refreshBag from "../controllers/refreshBag.js";
import cupomApi from "../controllers/cupomApi.js";
import addAddress from "../controllers/addAddress.js";
import deleteAddress from "../controllers/deleteAddress.js";
import processOrder from "../controllers/processOrder.js";

const router = Router()

router.get('/api/products', getProducts);
router.post('/register', registerAccount);
router.post('/login', loginAccount);
router.get('/auth', userAuth);
router.post('/api/save-product', saveProduct);
router.delete('/api/delete-product', deleteProduct);
router.get('/api/get-bag', getBag);
router.put('/api/refresh-bag', refreshBag);
router.post('/api/cupom', cupomApi);
router.post('/api/add-address', addAddress);
router.delete('/api/delete-address', deleteAddress);
router.post('/api/process-order', processOrder);

export default router;