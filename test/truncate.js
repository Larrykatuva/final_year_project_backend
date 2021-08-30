const models = require('../src/sequelize/models/index')

const truncate = async () => {
    await models.sequelize.sync ();
    return;
}

module.exports = truncate