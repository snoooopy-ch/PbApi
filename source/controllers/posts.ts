import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import apicache from 'apicache';
var async = require("async");

interface Post {
    id: Number,
    author: String,
    authorId: Number,
    likes: Number,
    popularity: Number,
    reads: Number,
}

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const sorts = ['id', 'reads', 'likes', 'popularity'];
    const directions = ['desc', 'asc'];

    let tags: any = req.query.tags ?? null;
    let sort: any = req.query.sortBy ?? null;
    let direction: any = req.query.direction ?? null;

    if (tags === null) {
        return res.status(400).json({
            error: "Tags parameter is required"
        });
    }

    if ( (sort != null && !sorts.includes(sort)) || (direction != null && !directions.includes(direction)) ) {
        return res.status(400).json({
            error: "sortBy parameter is invalid"
        });
    }

    if (sort === null)
        sort = 'id';
    if (direction === null)
        direction = 'asc';

    tags = tags.split(',');
    
    let promises = tags.map( async (tag: any) => {
        let result: AxiosResponse = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`);
        if (result.status === 200 && result.data !== null) {
            return result.data.posts;
        } else {
            return [];
        }
    });

    let temp: any; 
    await Promise.all(promises).then(result => {
        temp = result.reduce((aac, result) => {
            return aac.concat(result)
        }, [])
    });

    let keys = ['id'];let posts  = temp.filter(
        (s => (o: { [x: string]: any; }) => 
            (k => !s.has(k) && s.add(k))
            (keys.map(k => o[k]).join('|'))
        )
        (new Set)
    );

    switch (sort) {
        case 'id': 
            posts = posts.sort( (a: Post, b: Post) => (a['id'] >= b['id']) ? 1: -1);
            break;
        case 'reads': 
            posts = posts.sort( (a: Post, b: Post) => (a['reads'] >= b['reads']) ? 1: -1);
            break;
        case 'likes': 
            posts = posts.sort( (a: Post, b: Post) => (a['likes'] >= b['likes']) ? 1: -1);
            break;
        case 'popularity': 
            posts = posts.sort( (a: Post, b: Post) => (a['popularity'] >= b['popularity']) ? 1: -1);
            break; 
    }

    if (direction === 'desc') {
        posts = posts.reverse();
    }

    return res.status(200).json({
        posts: posts
    });
};

// trying ping
const getPing = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        success: true
    });
}

export default { getPosts, getPing };