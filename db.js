import * as pg from "pg"
import dotenv from 'dotenv'
dotenv.config();



let {Pool} = pg.default

let pool = new Pool ({
    connectionString: `postgresql://postgres:${process.env.PG_PASSWORD}@localhost:5432/checkpoint2`,
})
export {pool};