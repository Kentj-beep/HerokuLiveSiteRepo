import express from 'express';

const router = express.Router();

import { DisplayLoginPage, DisplayRegisterPage, ProcessLoginPage, ProcessLogoutPage, ProcessRegisterPage } from '../Controllers/auth';

/******************************************************* AUTHENTICATION ROUTES  ********************************************************/

/* GET display login page. */
router.get('/login', DisplayLoginPage);

/* POST process login request. */
router.post('/login', ProcessLoginPage);

/* GET display register page. */
router.get('/register', DisplayRegisterPage);

/* POST process register request. */
router.post('/register', ProcessRegisterPage);

/* Process logout request. */
router.get('/logout', ProcessLogoutPage);

export default router;