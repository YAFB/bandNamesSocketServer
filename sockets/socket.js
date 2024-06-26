const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('One Direction'));
bands.addBand(new Band('BTS'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Mana'));

// console.log(bands);

// Mensajes de sockets
io.on('connection', client => {
    console.log("Cliente conectado");

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log("Cliente desconectado");
    });

    client.on('mensaje', (payload) => {
        console.log("mensaje", payload.nombre);
        io.emit('mensaje', {
            admin: "nuevo mensaje",
        });
    });

    client.on('vote-band', (payload) => {
        // console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        // console.log(payload);
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        // console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('emitir-mensaje', (payload) => {
        // io.emit('emitir-mensaje', payload);
        // console.log(payload);
        client.broadcast.emit('nuevo-mensaje', payload);
    });
});