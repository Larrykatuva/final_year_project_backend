const models = require('../../src/sequelize/index')

const truncate = async () => {
    await models.sequelize.sync ();
    return;
}

module.exports = truncate