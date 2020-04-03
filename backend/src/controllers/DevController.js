const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');
//comandos do Controller
//index, show, store, destroy

module.exports = {

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            //console.log(apiResponse.data);
            const { name = login, avatar_url, bio } = apiResponse.data;

            /*if (!name) {
                name  =apiResponse.data.login;
            };*/

            //console.log(name, avatar_url, bio, github_username);

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            // Filtrar as conexões e procurar pelas que atendam aos requisitos (dentro de um raio de 10km e tecnologias informadas)

            const sendSocketMessageTo = findConnections(

                {latitude, longitude}, 
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }
        return response.json(dev);

        //return response.json({message: 'Hello Omnistack 10! Fake Hello World :0 '});  
    }

    //async update(){},

    //async destroy(){},

}