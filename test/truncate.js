import models from '../src/sequelize/models/index';

export const truncate = async () => {
    await models.sequelize.sync ();
    return;
}
