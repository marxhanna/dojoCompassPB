const router = require('express').Router();
const { errHandling } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const csurf = require('csurf'); // Importando o modulo csurf 
const { getUserById, updateUsername } = require('../../service/service');

// Cria uma instância de token armazenado em cookie.
const csrfProtection = csurf({ cookie: true });

router.use(cookieParser());
router.use(csrfProtection); // Aplica o middleware de proteção CSRF a todas as rotas definidas após esta linha

const renderData = {};
router.get(
	'/csrf-post',
	errHandling(async (req, res) => {
		const { user_id } = req.cookies;
		const usuarioNaoAutenticado = user_id == undefined;

		if (usuarioNaoAutenticado) {
			res.render('user-not-authenticated');
		} else {
			const { rows } = await getUserById(user_id);
			renderData.username = rows[0].username;
			renderData.csrfToken = req.csrfToken() // Adicionar o token no objeto
			res.render('csrf-post', renderData); // Renderiza a página 
		}
	})
);

router.post(
	'/csrf-post/alterarusername',
	errHandling(async (req, res) => {
		//CRIA A VARIAVEI COM BASE NO QUE VEIO NA URL
		const { novo_username } = req.body;
		//CRIA A VARIAVEI COM BASE NO QUE ESTA NOS COOKIES
		const { user_id } = req.cookies;
		//BUSCA NO BANCO DE DADOS SE O USUARIO EXISTE
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length == 1;
		if (userExiste) {
			const { rows } = await updateUsername(novo_username, user_id);
			renderData.username = rows[0].username;
			res.render('csrf-post', renderData);
		} else {
			renderData.username = 'User_id_not_found';
			res.render('csrf-post', renderData);
		}
	})
);

module.exports = router;
