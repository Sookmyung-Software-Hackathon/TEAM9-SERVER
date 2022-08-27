import express, { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
const db = require('../loaders/db');
import { nanoid } from 'nanoid';
import FamilyService from '../services/FamilyService';
const getJWTtoken = require('../modules/getJWTtoken');

const createFamily = async (req: Request, res: Response) => {
  let client;
  try {
    client = await db.connect(req);
    const code = nanoid();
    const result = await FamilyService.createFamily(client, code);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

export default {
  createFamily,
};
