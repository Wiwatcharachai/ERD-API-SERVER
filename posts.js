import { Router } from "express";
import { pool } from "./db.js"; 

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const status = req.query.status || "";
  const keywords = req.query.keywords || "";
  const page = req.query.page || 1;

  let PAGE_SIZE = 5;
  let offset = (page - 1) * PAGE_SIZE;

  let query = "";
  let values =[];
  
  if (status && keywords) {
    query = `select * from posts
    where image=$1
    and title i $2
    limit $3
    offset $4`;
    values = [status, keywords, PAGE_SIZE, offset];
  } else if (keywords) {
    query = `select * from posts
    where title ilike $1
    limit $2
    offset $3`;
    values = [keywords, PAGE_SIZE, offset];
  } else if (status) {
    query = `select * from posts
    where status=$1
    limit $2
    offset $3`;
    values = [status, PAGE_SIZE, offset];
  } else {
    query = `select * from posts
    limit $1
    offset $2`;
    values = [PAGE_SIZE, offset];
  }


let results = await pool.query(query, values)

  return res.json({
    data: results.rows,
  });
});

postRouter.get("/", async (req, res) => {
  const postId = req.params.postId;
  let results = await pool.query(`select * from posts where post_id=$1`, [postId])

  return res.json({
    data: results.row[0],
  });
});

postRouter.post("/", async (req, res) => {
  const hasPublished = req.body.status === "published";
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  await pool.query(`insert into posts
  (user_id, title, content, status, likes, category, created_at, updated_at, published_at)`,  
  [
    newPost.user_id,
    newPost.title,
    newPost.content,
    newPost.image,
    newPost.video,
    newPost.category_at,
    newPost.updated_at,
    newPost.published_at

  ]);

  return res.json({
    message: "Post has been created.",
  });
});

postRouter.put("/:id", async (req, res) => {
  const hasPublished = req.body.status === "published";


  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };
  const postId = req.params.id;

  await pool.query(`update posts set user_id=$1, title=$2, content=$3,
  image=$4, video=$5, category=$6, updated_at=$7,
  published_at=$8 where post_id=$9`,
  [
    updatedPost.user_id,
    updatedPost.title,
    updatedPost.content,
    updatedPost.image,
    updatedPost.video,
    updatedPost.category_at,
    updatedPost.updated_at,
    updatedPost.published_at

]);

  return res.json({
    message: `Post ${postId} has been updated.`,
  });
});

postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;

await pool.query(`delete from posts where posts_id=$1`,[postId])

  return res.json({
    message: `Post ${postId} has been deleted.`,
  });
});

export default postRouter;
