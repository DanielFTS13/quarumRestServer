const { response, request } = require('express');
const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

const usuariosGet = async (req, res = response) => {

        // Abrimos una instancia del puppeteer y accedemos a la url de google
        const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
        const page = await browser.newPage();
    
        const response = await page.goto('https://www.banregio.com/divisas.php');
    
        // Espera a que se ejecuten los scripts que actualizan los td
        await page.evaluate(() => {});
    
        const body = await response.text();
    
        // Creamos una instancia del resultado devuelto por puppeter para parsearlo con jsdom
        const { window: { document } } = new jsdom.JSDOM(body);
        const dolarResultado = {};
        let compraDolar = 0;
        // Seleccionamos el CompraDolar
        document.querySelectorAll('script')
          .forEach(element => {
            const text = element.textContent;
            const match = text.match(/compraDolar/);
            if (match) {
              const startIndex = match.index + 32;
              const endIndex = startIndex + 5;
              const result = text.substring(startIndex, endIndex);
              compraDolar = result;
            }
          });
    
        let ventaDolar = 0;
        // Seleccionamos el VentaDolar
        document.querySelectorAll('script')
          .forEach(element => {
            const text = element.textContent;
            const match = text.match(/ventaDolar/);
            if (match) {
              const startIndex = match.index + 31;
              const endIndex = startIndex + 5;
              const result = text.substring(startIndex, endIndex);
              ventaDolar = result;
            }
          });
    
        //pCompraDolar = compraDolar;
        //pVentaDolar = ventaDolar;
        //difVCDolar =(parseFloat(ventaDolar)+parseFloat(compraDolar))/2;
          
        const promedio = (parseFloat(compraDolar) + parseFloat(ventaDolar)) / 2;

        await browser.close();

        res.json({
            pCompraDolar: compraDolar,
            pVentaDolar: ventaDolar,
            promedio: promedio
        })
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - usuariosPost',
        nombre, 
        edad
    });
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}
