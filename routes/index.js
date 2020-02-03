var express = require('express');
var router = express.Router();
var pictureModel = require('../models/pictures.js');
var cloudinary = require('cloudinary');

('use strict');

const request = require('request');

cloudinary.config({
  cloud_name: 'dke3cg4zn',
  api_key: '858128252578649',
  api_secret: 'Cv5y79kxCYm5QFuqT_xYVkqEkIw'
});

const subscriptionKey = 'cf800a6f100f48d6b24482a8b8849c08';

const uriBase =
  'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST Sign up */
router.post('/upload', async function(req, res, next) {
  console.log('data photo', req.files.photo.uri);

  var randomName = Math.floor(Math.random() * 1000000);
  var photoPath = `/Users/cdous/desktop/picture-${randomName}.jpg`;

  try {
    var svg = await req.files.photo.mv(photoPath);

    cloudinary.v2.uploader.upload(photoPath, async function(error, result) {
      if (result) {
        console.log('This the result -->', result);

        var newPicture = new pictureModel({
          pictureUrl: result.secure_url,
          pictureName: result.original_filename
        });

        var picture = await newPicture.save();
        console.log('PICTURE SAVED IN MY DATABSE --> ' + picture);

        const imageUrl = picture.pictureUrl;

        // API AI
        // Request parameters.
        const params = {
          returnFaceId: 'true',
          returnFaceLandmarks: 'false',
          returnFaceAttributes:
            'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        };

        // API AI
        const options = {
          uri: uriBase,
          qs: params,
          body: '{"url": ' + '"' + imageUrl + '"}',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
          }
        };

        request.post(options, async (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }
          let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');

          var body = JSON.parse(body);
          console.log('body', body);
          if (body.length > 0) {
            console.log('age', body[0].faceAttributes.age);
            picture.gender = body[0].faceAttributes.gender;
            picture.age = body[0].faceAttributes.age;
            picture = await newPicture.save();
            console.log('picture', picture);
          }
        });

        res.json({ result: true, data: picture });
      } else {
        console.log('this is the error --->', error);
        res.json({ result: false, message: 'File not uploaded!' });
      }
    });
  } catch (error) {
    console.log('Erreur catchée', error);
  }
});

module.exports = router;
