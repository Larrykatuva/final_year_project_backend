import createError from "http-errors";
import {handleCountyErrors} from '../errors/county'
import {
    registerCounty,
    getCountyById,
    updateCounty,
    activateCounty,
    deactivateCounty,
    checkCountyByName
} from '../helpers/county';

export class CountyController {
    /**
     * Register a new County
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns {object} rea a json response of error, message and county
     */
    static async registerNewCounty(req, res, next){
        const {
            body: {name, location, code, address, region} 
        } = req;
        if(!name){
            return res
                .status(400)
                .send(handleCountyErrors('COR_03', 400, 'name'));
        }
        if(!location){
            return res
                .status(400)
                .send(handleCountyErrors('COR_07', 400, 'location'));
        }
        if(!code){
            return res
                .status(400)
                .send(handleCountyErrors('COR_06', 400, 'code'));
        }
        if(!address){
            return res
                .status(400)
                .send(handleCountyErrors('COR_05', 400, 'address'));
        }
        if(!region){
            return res
                .status(400)
                .send(handleCountyErrors('COR_04', 400, 'region'));
        }
        try {
            const exists = await checkCountyByName(name);
            if(exists){
                return res 
                    .status(400)
                    .send(handleCountyErrors('COR_02', 400, 'name'))
            }
            const county = await registerCounty({name, location, code, address, region})
            if(!county){
                return res 
                    .status(400)
                    .send({
                        error: true,
                        message: "An error occurred!"
                    })
            }
            return res 
                .status(201)
                .send({
                    error: false,
                    message: "County created successfully!",
                    county: county
                })
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }


    /**
     * Update county details by Id
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns {object} res a json response of error and message
     */
    static async updateCountyDetails(req, res, next){
        const {
            body: {name, location, code, address, region},
        } = req;
        const {
            user: {countyId}
        } = req.user

        try {
            const updated =  await updateCounty({name, location, code, address, region, countyId})
            if(!updated){
                return res
                    .status(400)
                    .send({
                        error: true,
                        message: 'An error occurred during update!'
                    })
            }
            return res
                .status(200)
                .send({
                    error: false,
                    message: 'County details updated successfully'
                })
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            });  
        }
    }



    /**
     * Get county details by Id
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns {object} res a json response of error and county details
     */
    static async getCountyDetails(req, res, next){
        const{ 
            user: {countyId}
        } = req.user;

        try {
            const exists = await getCountyById(countyId)
            if(exists){
                return res 
                    .status(400)
                    .send(handleCountyErrors('COR_01', 400, 'CountyId'))
            }
            return res
                .status(200)
                .send({
                    error: false,
                    county
                })
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            });   
        }
    }



    /**
     * Deactivating county
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns {object} res a json response of error and message
     */
    static async archieveCounty(req, res, next){
        const {
            params: {countyId}
        } = req;

        try {
           const exists = await getCountyById(countyId)
            if(exists){
                return res 
                    .status(400)
                    .send(handleCountyErrors('COR_01', 400, 'CountyId'))
            } 
            const archieve = await deactivateCounty(countyId)
            if(!archieve){
                return res
                    .status(400)
                    .send({
                        error: true,
                        message: "Deactivatig county failed!"
                    })
            }
            return res
                .status(200)
                .send({
                    error: false,
                    message: 'County deactivated successfully'
                })
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }


    /**
     * Activating county
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns {object} res a json response of error and message
     */
    static async uArchieveCounty(req, res, next){
        const {
            params: {countyId}
        } = req;

        try {
           const exists = await getCountyById(countyId)
            if(exists){
                return res 
                    .status(400)
                    .send(handleCountyErrors('COR_01', 400, 'CountyId'))
            } 
            const archieve = await activateCounty(countyId)
            if(!archieve){
                return res
                    .status(400)
                    .send({
                        error: true,
                        message: "Activatig county failed!"
                    })
            }
            return res
                .status(200)
                .send({
                    error: false,
                    message: 'County activated successfully'
                })
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }
}