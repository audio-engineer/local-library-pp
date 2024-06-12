import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import {
  SequelizeAuthor,
  SequelizeBook,
  SequelizeBookGenreRelation,
  SequelizeCopy,
  SequelizeGenre,
  SequelizeStatus,
} from "../models/sequelize/index.js";

dotenv.config();

export const sequelize = new Sequelize(process.env.MARIADB_URI ?? "", {
  dialect: "mariadb",
  define: {
    freezeTableName: true,
  },
  repositoryMode: true,
});

sequelize.addModels([
  SequelizeAuthor,
  SequelizeBook,
  SequelizeStatus,
  SequelizeCopy,
  SequelizeGenre,
  SequelizeBookGenreRelation,
]);
