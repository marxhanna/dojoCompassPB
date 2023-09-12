const {
	getUserByName,
	getUserById,
	updateUsername,
	getNotasByUserId,
} = require('../data/data');

exports.getUserByName = async nome => {
	nome = nome.replace(/<[^>]*>/g, '');
	return await getUserByName(nome);
};

exports.updateUsername = async (novo_username, user_id) => {
	novo_username = novo_username.replace(/<[^>]*>/g, '');
	return await updateUsername(novo_username, user_id);
};

exports.getUserById = async user_id => {
	return await getUserById(user_id);
};

exports.getNotasByUserId = async user_id => {
	return await getNotasByUserId(user_id);
};
