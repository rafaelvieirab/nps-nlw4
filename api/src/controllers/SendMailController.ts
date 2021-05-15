import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { SurveyRepository } from "../repositories/SurveyRepository";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveyRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const userAlreadyExists = await userRepository.findOne({email});
    if(!userAlreadyExists) {
      response.status(400).json({
        error: 'User does not exists',
      })
    }

    const surveyAlreadyExists = await surveyRepository.findOne({id: survey_id});
    if(!surveyAlreadyExists) {
      response.status(400).json({
        error: 'Survey does not exists',
      })
    }

    const surveyUser = surveyUserRepository.create({
      user_id: userAlreadyExists.id,
      survey_id
    });
    await surveyUserRepository.save(surveyUser);

    return response.status(200).json(surveyUser);
  }
}

export { SendMailController };