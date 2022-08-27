import express, { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
const db = require('../loaders/db');
import { nanoid } from 'nanoid';
import PhotoService from '../services/PhotoService';
const getJWTtoken = require('../modules/getJWTtoken');

const getPhoto = async (req: Request, res: Response) => {
  let client;
  const userId: number = req.body.user.id;
  try {
    client = await db.connect(req);
    const result = await PhotoService.getPhoto(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

export default {
  getPhoto,
};
