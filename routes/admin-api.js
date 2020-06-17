const express = require('express');
const router = express.Router();


const downloadCtrl = require('../server/controllers/DownloadController');
const viewCtrl = require('../server/controllers/ViewController');
const uCtrl = require('../server/controllers/UsersControllers');
const eCtrl = require('../server/controllers/EmployeeControllers');
const sCtrl = require('../server/controllers/SingerController');
const gCtrl = require('../server/controllers/GenreController');
const mCtrl = require('../server/controllers/MusicController');
const pCategoryCtrl = require('../server/controllers/PlaylistCategoryController');
const playlistCtrl = require('../server/controllers/PlaylistController');

const request = require('request');

const Auth = require('../server/middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('API admin');
});

async function checkLink(link) {
    return new Promise(res => {
        request(link, (err, resp, body) => {
            if (err) res(false);
            else res(true);
        })
    })
}

router.post('/checkLink', async function(req, res, next) {
    let { link } = req.body;
    res.send(await checkLink(link));
})

router.post('/download/statistic', [Auth.verifyTokenAdmin.bind(Auth), downloadCtrl.statistic.bind(downloadCtrl)]);

router.post('/views/statistic', [Auth.verifyTokenAdmin.bind(Auth), viewCtrl.statistic.bind(viewCtrl)]);

router.post('/employees/register', [eCtrl.createEmployee]);
router.post('/employees/checkLogin', [eCtrl.checkLogin]);

router.post('/employees/updateUser', [Auth.verifyTokenAdmin.bind(Auth), eCtrl.updateEmployee]);

router.post('/employees/checkToken', [Auth.checkToken]);


router.post('/users/all', [Auth.verifyTokenAdmin.bind(Auth), uCtrl.findAll.bind(uCtrl)]);
router.post('/users/count', [Auth.verifyTokenAdmin.bind(Auth), uCtrl.count.bind(uCtrl)]);


router.post('/singers/add', [Auth.verifyTokenAdmin.bind(Auth), sCtrl.add]);
router.post('/singers/edit', [Auth.verifyTokenAdmin.bind(Auth), sCtrl.edit]);
router.post('/singers/all', [Auth.verifyTokenAdmin.bind(Auth), sCtrl.findAll]);
router.post('/singers/findById', [Auth.verifyTokenAdmin.bind(Auth), sCtrl.findById]);
router.post('/singers/delete', [Auth.verifyTokenAdmin.bind(Auth), sCtrl.delete]);

router.post('/genres/all', [Auth.verifyTokenAdmin.bind(Auth), gCtrl.findAll]);
router.post('/genres/add', [Auth.verifyTokenAdmin.bind(Auth), gCtrl.add]);
router.post('/genres/update', [Auth.verifyTokenAdmin.bind(Auth), gCtrl.update]);
router.post('/genres/delete', [Auth.verifyTokenAdmin.bind(Auth), gCtrl.delete]);


router.post('/musics/findById', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.findById.bind(mCtrl)]);
router.post('/musics/add', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.add.bind(mCtrl)]);
router.post('/musics/all', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.findAll.bind(mCtrl)]);
router.post('/musics/edit', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.edit.bind(mCtrl)]);
router.post('/musics/delete', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.delete.bind(mCtrl)]);
router.post('/musics/count', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.count]);
router.post('/musics/topDownload', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.topDownload]);
router.post('/musics/topListener', [Auth.verifyTokenAdmin.bind(Auth), mCtrl.topListener]);


router.post('/playlistCategory/all', [Auth.verifyTokenAdmin.bind(Auth), pCategoryCtrl.findAll]);
router.post('/playlistCategory/add', [Auth.verifyTokenAdmin.bind(Auth), pCategoryCtrl.add]);
router.post('/playlistCategory/edit', [Auth.verifyTokenAdmin.bind(Auth), pCategoryCtrl.edit]);
router.post('/playlistCategory/delete', [Auth.verifyTokenAdmin.bind(Auth), pCategoryCtrl.delete]);


router.post('/playlist/all', [Auth.verifyTokenAdmin.bind(Auth), playlistCtrl.findAll.bind(playlistCtrl)]);
router.post('/playlist/add', [Auth.verifyTokenAdmin.bind(Auth), playlistCtrl.add.bind(playlistCtrl)]);
router.post('/playlist/edit', [Auth.verifyTokenAdmin.bind(Auth), playlistCtrl.edit.bind(playlistCtrl)]);
router.post('/playlist/delete', [Auth.verifyTokenAdmin.bind(Auth), playlistCtrl.delete.bind(playlistCtrl)]);

module.exports = router;