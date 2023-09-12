const router = require('express').Router();
const { errHandling, verifyLogin } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserById, updateUsername } = require('../../service/service');

router.use(cookieParser());

const renderData = {};

const jwt = require('jsonwebtoken');

router.get(
	'/csrf-get',
	errHandling(async (req, res) => {
		const { session } = req.cookies;
		const userNotAuthenticated = session == undefined;
		if (userNotAuthenticated) {
			res.render('user-not-authenticated');
			return;
		} 
		const decodedToken = verifyLogin(session);
		if (typeof decodedToken !== 'object') {
			renderData.error = decodedToken;
			res.render('user-not-authenticated', renderData);
			return;
		} 
		const user_id = decodedToken.id_user;
		const { rows } = await getUserById(user_id);
		renderData.username = rows[0].username;
		renderData.user_id = user_id;
		res.render('csrf-get', renderData);
	})
);

router.get(
	'/csrf-get/alterarusername',
	errHandling(async (req, res) => {
		const { id: user_id, novo_username } = req.query;
		const { session } = req.cookies;
		const userNotAuthenticated = session == undefined;
		if (userNotAuthenticated) {             // VERIFICA SE EXISTE SESSÃO ATIVA
		res.render('user-not-authenticated');
		return;
		}
		const decodedToken = verifyLogin(session);
		if (typeof decodedToken !== 'object') { // VERIFICA SE A SESSÃO É VÁLIDA
		renderData.error = decodedToken;
		res.render('user-not-authenticated', renderData);
		return;
		}
		const id_user = decodedToken.id_user.toString();
		// VERIFICA SE O ID PASSADO NA URL É IGUAL AO ID VINCULADO A SESSÃO
		if (user_id !== id_user) {             
		res.status(403).send('Proibido');
		return;
		}
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length === 1;
		if (userExiste) {                      // VERIFICA SE USUÁRIO EXISTE
		const { rows } = await updateUsername(novo_username, user_id);
		renderData.username = rows[0].username;
		res.render('csrf-get', renderData);
		} else {
		renderData.username = 'User_id_not_found';
		res.render('csrf-get', renderData);
		}
	})
);

module.exports = router;
