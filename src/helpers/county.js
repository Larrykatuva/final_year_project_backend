const County = require("../sequelize/models").County;


/**
 * Registering a new County 
 * @param {Object} payload 
 * @returns {Object} res a newly created county object
 */
export const registerCounty = async (payload) => {
    const {name, location, code, address, region} = payload;
    try {
        return await County.create({
            name,
            code,
            address, 
            location,
            region,
            is_active: true
        })
    } catch (error) {
        throw error;
    }
}


/**
 * Getting county details by Id
 * @param {number} countyId 
 * @returns {Object} res a county object macthing queyr id
 */
export const getCountyById = async (countyId) => {
    try {
        return await County.findOne({where: {countyId}});
    } catch (error) {
        throw error
    }
}



/**
 * Updating county details by Id
 * @param {Object} payload 
 * @returns {boolean} true or false
 */
export const updateCounty = async(payload) => {
    const {name, location, code, address, region, countyId} = payload;
    try {
        return await County.update({
            name:name,
            code: code,
            address: address,
            location: location,
            region: region 
        }, {
            where: {countyId}
        })
    } catch (error) {
        return Promise.reject(error);
    }
}



/**
 *  Activating inactive county by id
 * @param {number} countyId 
 * @returns {boolean} true or false
 */
export const activateCounty = async (countyId) => {
    try {
        return await County.update({is_active: true},{
            where: {countyId}
        })
    } catch (error) {
        throw error
    }
}


/**
 * Deactivating active county by Id
 * @param {number} countyId 
 * @returns {boolean} true or false
 */
export const deactivateCounty = async (countyId) => {
    try {
        return await County.update({is_active: false},{
            where: {countyId}
        })
    } catch (error) {
        throw error
    }
}



/**
 * Get a county by name
 * @param {String} name 
 * @returns {object} res a json object of the county matching query name
 */
export const checkCountyByName = async (name) => {
    try {
        return await County.findOne({
            where: {name}
        })
    } catch (error) {
        throw error
    }
}
