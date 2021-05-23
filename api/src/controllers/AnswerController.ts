import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswearController {
  async execute(request: Request, response: Response) {
    console.log('aqui');
    const { value } = request.params;
    const { id } = request.query;

    console.log('aqui');

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(id)
    });

    if(!surveyUser) {
      return response.status(400).json({
        error: "Survey User does not exists!"
      });
    }

    surveyUser.value = Number(value);
    await surveyUserRepository.save(surveyUser);
    return response.status(200).json(surveyUser);
  }
}

export { AnswearController }