import express, { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
const db = require('../loaders/db');
import { nanoid } from 'nanoid';
import QuestionService from '../services/QuestionService';
const getJWTtoken = require('../modules/getJWTtoken');

const addQuestion = async (req: Request, res: Response) => {
  let client;
  try {
    client = await db.connect(req);
    const result = await QuestionService.addQuestion(client);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const getQuestion = async (req: Request, res: Response) => {
  const userId: number = req.body.user.id;
  let client;
  try {
    client = await db.connect(req);
    const result = await QuestionService.getQuestion(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const postAnswer = async (req: Request, res: Response) => {
  const userId: number = req.body.user.id;
  const weekId: number = req.body.id;
  const answer: string = req.body.answer;
  let client;
  try {
    client = await db.connect(req);
    const result = await QuestionService.postAnswer(client, userId, weekId, answer);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

export default {
  getQuestion,
  addQuestion,
  postAnswer,
};
