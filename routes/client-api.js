const express = require('express');
const router = express.Router();

const uCtrl = require('../server/controllers/UsersControllers');

const downloadCtrl = require('../server/controllers/DownloadController');
const viewCtrl = require('../server/controllers/ViewController');
const pCtrl = require('../server/controllers/PlaylistController');
const pCategoryCtrl = require('../server/controllers/PlaylistCategoryController');
const mCtrl = require('../server/controllers/MusicController');
const messCtrl = require('../server/controllers/MessageController');
const friendCtrl = require('../server/controllers/FriendControllers');
const sCtrl = require('../server/controllers/SingerController');
const publicChatCtrl = require('../server/controllers/PublicChatController');

const Auth = require('../server/middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('API client');
});

router.post('/publicChat/chat', [Auth.verifyTokenClient.bind(Auth), publicChatCtrl.chat.bind(publicChatCtrl)])
router.post('/publicChat/find', [Auth.verifyTokenClient.bind(Auth), publicChatCtrl.findAll.bind(publicChatCtrl)])

router.post('/download/userDownload', [Auth.verifyTokenClient.bind(Auth), downloadCtrl.userDownload.bind(downloadCtrl)]);

router.post('/views/userVisit', [Auth.verifyTokenClient.bind(Auth), viewCtrl.userVisit.bind(viewCtrl)]);
router.post('/views/statistic', [Auth.verifyTokenClient.bind(Auth), viewCtrl.statistic.bind(viewCtrl)]);

router.post('/singer/findById', [Auth.verifyTokenClient.bind(Auth), sCtrl.findById]);
router.post('/singer/edit', [Auth.verifyTokenClient.bind(Auth), sCtrl.edit]);

router.post('/playlist/findOne', [Auth.verifyTokenClient.bind(Auth), pCtrl.findOne]);
router.post('/playlist/likePlaylist', [Auth.verifyTokenClient.bind(Auth), pCtrl.likePlaylist.bind(pCtrl)]);

router.post('/playlistCategory/find', [Auth.verifyTokenClient.bind(Auth), pCategoryCtrl.find.bind(pCategoryCtrl)]);
router.post('/playlistCategory/findById', [Auth.verifyTokenClient.bind(Auth), pCategoryCtrl.findById]);

router.post('/music/findInList', [Auth.verifyTokenClient.bind(Auth), mCtrl.findInList]);
router.post('/music/findOne', [Auth.verifyTokenClient.bind(Auth), mCtrl.findOne]);
router.post('/music/like', [Auth.verifyTokenClient.bind(Auth), mCtrl.like]);
router.post('/music/comment', [Auth.verifyTokenClient.bind(Auth), mCtrl.commentInMusic]);
router.post('/music/getCommentByMusicId', [Auth.verifyTokenClient.bind(Auth), mCtrl.getCommentByMusicId]);
router.post('/music/updateListenerToMusic', [Auth.verifyTokenClient.bind(Auth), mCtrl.updateListenerToMusic]);

router.post('/message/send', [Auth.verifyTokenClient.bind(Auth), messCtrl.sendMessage]);
router.post('/message/getMessage', [Auth.verifyTokenClient.bind(Auth), messCtrl.getMessage]);

router.post('/friend/sendRequest', [Auth.verifyTokenClient.bind(Auth), friendCtrl.sendRequest]);
router.post('/friend/getInteraction', [Auth.verifyTokenClient.bind(Auth), friendCtrl.getInteraction]);
router.post('/friend/updateInteraction', [Auth.verifyTokenClient.bind(Auth), friendCtrl.updateInteraction]);
router.post('/friend/cancelInteraction', [Auth.verifyTokenClient.bind(Auth), friendCtrl.cancelInteraction]);
/* Start Users router */



router.post('/users/register', [uCtrl.createUser]);
router.post('/users/checkLogin', [uCtrl.checkLogin]);

router.post('/users/updateUser', [Auth.verifyTokenClient.bind(Auth), uCtrl.updateUser.bind(uCtrl)]);
router.post('/users/updatePassword', [Auth.verifyTokenClient.bind(Auth), uCtrl.updatePassword.bind(uCtrl)]);

router.post('/users/checkToken', [Auth.checkToken]);

router.post('/users/checkInfor', [Auth.verifyTokenClient.bind(Auth), uCtrl.checkInfor.bind(uCtrl)]);

router.post('/users/getSuggest', [Auth.verifyTokenClient.bind(Auth), uCtrl.getSuggest.bind(uCtrl)])

router.post('/users/search', [Auth.verifyTokenClient.bind(Auth), uCtrl.search.bind(uCtrl)])
    /* End users router */
module.exports = router;