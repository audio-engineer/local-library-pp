import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique,
} from "sequelize-typescript";

@Table({ tableName: "author", underscored: true })
export class SequelizeAuthor extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  private readonly firstName = "";

  @AllowNull(false)
  @Column(DataType.STRING)
  private readonly lastName = "";

  @AllowNull(false)
  @Column(DataType.DATE)
  private readonly dateOfBirth = new Date();

  @Column(DataType.DATE)
  private readonly dateOfDeath = null;
}

@Table({ tableName: "book", underscored: true })
export class SequelizeBook extends Model {
  @ForeignKey(() => SequelizeAuthor)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  private readonly authorId = 0;

  @AllowNull(false)
  @Column(DataType.STRING)
  private readonly title = "";

  @AllowNull(false)
  @Column(DataType.STRING)
  private readonly summary = "";

  @AllowNull(false)
  @Column(DataType.STRING)
  private readonly isbn = "";
}

@Table({ tableName: "status", underscored: true })
export class SequelizeStatus extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  private readonly name = "";
}

@Table({ tableName: "copy", underscored: true })
export class SequelizeCopy extends Model {
  @ForeignKey(() => SequelizeBook)
  @Column(DataType.INTEGER)
  private readonly bookId = 0;

  @ForeignKey(() => SequelizeStatus)
  @Column(DataType.INTEGER)
  private readonly statusId = 0;

  @Column(DataType.STRING)
  private readonly imprint = "";

  @Column(DataType.DATE)
  private readonly dueBack = null;
}

@Table({ tableName: "genre", underscored: true })
export class SequelizeGenre extends Model {
  @Column(DataType.STRING)
  private readonly name = "";
}

@Table({ tableName: "book_genre_relation", underscored: true })
export class SequelizeBookGenreRelation extends Model {
  @ForeignKey(() => SequelizeBook)
  @Unique("genreId")
  @Column(DataType.INTEGER)
  private readonly bookId = 0;

  @ForeignKey(() => SequelizeGenre)
  @Unique("bookId")
  @Column(DataType.INTEGER)
  private readonly genreId = 0;
}
