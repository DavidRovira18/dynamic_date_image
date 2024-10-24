const express = require('express');
const Jimp = require('jimp');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/image', async (req, res) => {
    const currentDate = new Date();

    //Obtain limit date
    const targetDateQString = req.query.targetDate;
    if(!targetDateQString)
        return res.status(400).send('Target Date required')

    var targetDate;

    try{
        targetDate = new Date(targetDateQString);
        if(isNaN(targetDate.getTime()))
            throw new Error('Invalid date')
    }
    catch(e){
        return res.status(400).send('Invalid Date Format')
    }

    //Compute days remaining
    const daysRemaining = Math.floor((targetDate - currentDate) / (1000 * 60 * 60 * 24));

    //Init dynamic image with white background
    const width = 800;
    const height = 600;
    const image = await Jimp.create(width, height, '#FFFFFF');

    //Generate Image
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    image.print(font, 50, 100, `${daysRemaining}`);

    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
            res.status(500).send('Error generating image');
        } else {
            res.setHeader('Content-Type', 'image/png');
            res.send(buffer);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});