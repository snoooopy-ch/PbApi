import express, { Express } from 'express';
import controller from '../controllers/posts';
import apicache from 'apicache';

const router: Express = express();
const cache = apicache.middleware;

router.get('/api/posts', cache('5 minutes'), controller.getPosts);
router.get('/api/ping', controller.getPing);
router.get('/add', function (req, res) {
    res.json({"error": false, "message":"Hello!"})
})

export = router;