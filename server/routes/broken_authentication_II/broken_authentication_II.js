const router = require('express').Router();
const { errHandling, verifyLogin } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserById, updateUsername } = require('../../service/service');

router.use(cookieParser());

const jwt = require('jsonwebtoken');

const renderData = {};

router.get(
	'/broken_authentication_II',
	errHandling(async (req, res) => {
	  const { session } = req.cookies;
	  const userNotAuthenticated = session == undefined;
	  if (userNotAuthenticated) {
		res.render('user-not-authenticated');
	  } else {
		const decodedToken = verifyLogin(session);
		if (typeof decodedToken !== 'object') {
		  renderData.error = decodedToken;
		  res.render('user-not-authenticated', renderData);
		} else {
		  const user_id = decodedToken.id_user;
		  const { rows } = await getUserById(user_id);
		  renderData.username = rows[0].username;
		  renderData.user_id = user_id;
		  res.render('broken_authentication_II', renderData);
		}
	  }
	})
);
router.get(
	'/broken_authentication_II/alterarusername',
	errHandling(async (req, res) => {
		const { novo_username } = req.query;
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
		const user_id = decodedToken.id_user.toString();
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length === 1;
		if (userExiste) {                      // VERIFICA SE USUÁRIO EXISTE
		const { rows } = await updateUsername(novo_username, user_id);
		renderData.username = rows[0].username;
		res.render('broken_authentication_II', renderData);
		} else {
		renderData.username = 'User_id_not_found';
		res.render('broken_authentication_II', renderData);
		}
	})
);

module.exports = router;
