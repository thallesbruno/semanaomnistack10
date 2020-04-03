const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        //linha para testar conexão console.log(request.query);
        //Buscar todos os devs em um raio de 10km
        //Listar todas as tecnologias

        const { latitude, longitude, techs } = request.query;;

        const techsArray = parseStringAsArray(techs);

        //linha para testar o retorno das tecnologias

        console.log(techsArray);

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                }
            }
        });

        return response.json({ devs });
    }
}