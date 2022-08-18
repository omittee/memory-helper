import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface infoAttributes {
  user_name: string;
  _id: string;
  title: string;
  tags: string;
  question: string;
  content: string;
  isPublic: number;
  createdTime: number;
  lastModified: number;
}

export type infoPk = "_id";
export type infoId = info[infoPk];
export type infoOptionalAttributes = "isPublic";
export type infoCreationAttributes = Optional<infoAttributes, infoOptionalAttributes>;

export class info extends Model<infoAttributes, infoCreationAttributes> implements infoAttributes {
  user_name!: string;
  _id!: string;
  title!: string;
  tags!: string;
  question!: string;
  content!: string;
  isPublic!: number;
  createdTime!: number;
  lastModified!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof info {
    return info.init({
    user_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    _id: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tags: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isPublic: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    createdTime: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    lastModified: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "_id" },
        ]
      },
      {
        name: "_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "_id" },
        ]
      },
    ]
  });
  }
}
