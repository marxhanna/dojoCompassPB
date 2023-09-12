const router = require('express').Router();
const { errHandling, verifyLogin } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { query } = require('express');
const { getNotasByUserId } = require('../../service/service');

router.use(cookieParser());

const jwt = require('jsonwebtoken');

const renderData = {};

router.get(
	'/broken_authentication_III',
	errHandling(async (req, res) => {
		const { session } = req.cookies;
		const usuarioNaoAutenticado = session == undefined;
		if (usuarioNaoAutenticado) {
			res.redirect('/user-not-authenticated');
			return;
		} 
		const decodedToken = verifyLogin(session);
		if (typeof decodedToken !== 'object') {
			renderData.error = decodedToken;
			res.render('user-not-authenticated', renderData);
			return;
		}
		const user_id = decodedToken.id_user;
		res.redirect(`broken_authentication_III/notas/${user_id}`);
	})
);

router.get(
	'/broken_authentication_III/notas/*',
	errHandling(async (req, res) => {
		const user_id = req.originalUrl.split('/')[3]; const { session } = req.cookies;
		const userNotAuthenticated = session == undefined;
		if (userNotAuthenticated) {// VERIFICA SE EXISTE SESSÃO ATIVA
		res.render('user-not-authenticated');
		return;
		}
		const decodedToken = verifyLogin(session);
		if (typeof decodedToken !== 'object') {// VERIFICA SE A SESSÃO É VÁLIDA
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
		if (!isNaN(parseInt(user_id))) {
			const { rows } = await getNotasByUserId(user_id);
			renderData.posts = rows;
			res.render('broken_authentication_III', renderData);
			return
		} 
		res.redirect('/user-not-authenticated');
	})
);

module.exports = router;
