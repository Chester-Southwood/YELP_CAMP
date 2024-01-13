const cloudinary          = require('cloudinary').v2,
      {CloudinaryStorage} = require('multer-storage-cloudinary');

//https://console.cloudinary.com/pm/c-268adc6833fb25fdf39a6e7b9dfccf/getting-started 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

console.log(process.env);

//https://github.com/affanshahid/multer-storage-cloudinary
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Yelpcamp1',
        allowedFormats: [
            'jpeg',
            'png',
            'jpg'
        ] 
    }
});

module.exports = {
    cloudinary,
    cloudinaryStorage
}