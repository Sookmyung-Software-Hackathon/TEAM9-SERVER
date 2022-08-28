import express, { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { nanoid } from 'nanoid';
import QuestionService from '../services/QuestionService';
const getJWTtoken = require('../modules/getJWTtoken');
const db = require('../loaders/db');

const addQuestion = async (req: Request, res: Response) => {
  let client;
  try {
    client = await db.connect(req);
    await QuestionService.addQuestion(client);
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS));
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
    console.log(userId);
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

const postQuestion = async (req: Request, res: Response) => {
  const userId: number = req.body.user.id;
  const question: string = req.body.question;
  let client;
  try {
    client = await db.connect(req);
    const result = await QuestionService.postQuestion(client, userId, question);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const getWeekList = async (req: Request, res: Response) => {
  const userId: number = req.body.user.id;
  let client;
  try {
    client = await db.connect(req);
    const result = await QuestionService.getWeekList(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const addPhoto = async (req: Request, res: Response) => {
  let client;
  if (!req.file) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
  const { originalname, location } = image;
  const userId: number = req.body.user.id;
  const week: number = req.params.week as unknown as number;
  try {
    client = await db.connect(req);
    const data = await QuestionService.addPhoto(client, userId, location, week);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const getWeekQuestion = async (req: Request, res: Response) => {
  const userId: number = req.body.user.id;
  const week: number = req.params.week as unknown as number;
  let client;
  try {
    client = await db.connect(req);
    const result = await QuestionService.getWeekQuestion(client, userId, week);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
const getDayAnswer = async (req: Request, res: Response) => {
  const userId: number = req.body.user.id;
  const week: number = req.params.week as unknown as number;
  const day: number = req.params.day as unknown as number;
  let client;
  try {
    client = await db.connect(req);
    const result = await QuestionService.getDayAnswer(client, userId, week, day);
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
  postQuestion,
  getWeekList,
  addPhoto,
  getWeekQuestion,
  getDayAnswer,
};
