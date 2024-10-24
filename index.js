const express = require('express');
const sharp = require('sharp');
const TextToSVG = require('text-to-svg');

async function main() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.get('/image', async (req, res) => {
        const currentDate = new Date();

        // Obtener la fecha límite
        const targetDateQString = req.query.targetDate;
        if (!targetDateQString) return res.status(400).send('Target Date required');

        let targetDate;

        try {
            targetDate = new Date(targetDateQString);
            console.log("Target Date: ")
            console.log(targetDate)

            if (isNaN(targetDate.getTime())) throw new Error('Invalid date');
        } catch (e) {
            return res.status(400).send('Invalid Date Format');
        }

        // Calcular los días restantes
        const daysRemaining = Math.floor((targetDate - currentDate) / (1000 * 60 * 60 * 24));
        console.log("Current date: ")
        console.log(currentDate)
        console.log("Days Remaining: ")
        console.log(daysRemaining)

        // Crear un SVG con el texto
        const textToSVG = TextToSVG.loadSync();
        const svgOptions = { x: 0, y: 0, fontSize: 64, anchor: 'top', attributes: { fill: 'blue', stroke:'blue'} };
        const svgText = textToSVG.getSVG(`${daysRemaining}`, svgOptions);

        // Convertir el SVG a una imagen PNG usando sharp
        const svgBuffer = Buffer.from(svgText);
        sharp({
            create: {
                width: 160,
                height: 120,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            }
        })
        .composite([{ input: svgBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer()
        .then(buffer => {
            res.setHeader('Content-Type', 'image/png');
            res.send(buffer);
        })
        .catch(err => {
            res.status(500).send('Error generating image');
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

main();
