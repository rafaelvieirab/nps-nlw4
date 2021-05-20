import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import path from 'path';

import { SurveyRepository } from "../repositories/SurveyRepository";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveyRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const user = await userRepository.findOne({email});
    if(!user) {
      response.status(400).json({
        error: 'User does not exists',
      });
    }

    const survey = await surveyRepository.findOne({id: survey_id});
    if(!survey) {
      response.status(400).json({
        error: 'Survey does not exists',
      });
    }

    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL,
    };

    // const surveyUserAlreadyExists = await surveyUserRepository.findOne({
    //   where: [{ user_id: user.id }, { value: null }],
    // });
    const surveyUserAlreadyExists = await surveyUserRepository.findByUserIdAndNullValue(user.id);

    if(surveyUserAlreadyExists) {
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists);
    } else {
      const surveyUser = surveyUserRepository.create({
        user_id: user.id,
        survey_id
      });
      await surveyUserRepository.save(surveyUser);
      
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.status(200).json(surveyUser);
    }
  }
}

export { SendMailController };