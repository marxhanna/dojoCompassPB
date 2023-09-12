const router = require('express').Router();
const { errHandling, getVulnType } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserById } = require('../../service/service');
router.use(cookieParser());

const jwt = require('jsonwebtoken');


const renderData = {};


//RENDERIZA A PÁGINA inicial
router.get(
	'/',
	errHandling(async (req, res) => {
		const { session } = req.cookies;
		const usuarioAutenticado = session != undefined;
		vulnType = getVulnType()
		renderData.vulnType = vulnType;

		if (usuarioAutenticado) {
			renderData.hasUsers = 'true';
		} else {
			renderData.hasUsers = 'false';
		}
		res.render('initial_page', renderData);
	})
);

// const cookies = { sameSite: 'none', secure: false, httpOnly: false };
//const cookies = { sameSite: 'none', secure: true, httpOnly: false };
// const cookies = { sameSite: 'strict', secure: false, httpOnly: false };
const cookies = { sameSite: 'strict', secure: true, httpOnly: true };
// const cookies = { sameSite: 'lax', secure: false, httpOnly: false };

//REALIZA O LOGIN - SET COOKIES
router.get(
	'/login',
	errHandling(async (req, res) => {
	  const user_id = 1;
	  const { rows } = await getUserById(user_id);
	  const user = rows[0];
	// CRIA OBJETO COM APENAS OS QUATRO PRIMEIRO VALROES DE USER
	  const userSubset = {
		id_user: user.id_user,
		nome: user.nome,
		username: user.username,
		email: user.email,
	  };
	  // USA PARA CRIAR O TOKEN DE SESSÃO
	  const token = jwt.sign(userSubset, process.env.JWT_SECRET, { expiresIn: '1m' });
	  console.log(token);
	  renderData.username = user.username;
	  vulnType = getVulnType();
	  renderData.vulnType = vulnType;
	  renderData.hasUsers = 'true';
	  res.cookie('session', token, cookies).render('initial_page', renderData);
	})
);

//REALIZA O LOGOUT - CLEAR COOKIES
router.get(
	'/logout',
	errHandling(async (req, res) => {
		vulnType = getVulnType()
		renderData.vulnType = vulnType;
		renderData.hasUsers = 'false';
		res.clearCookie('session').render('initial_page', renderData);
	})
);

router.get(
	'/user-not-authenticated',
	errHandling(async (req, res) => {
		res.render('user-not-authenticated', renderData);
	})
);

module.exports = router;
