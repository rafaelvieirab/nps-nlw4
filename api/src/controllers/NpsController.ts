import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const totalAnswers = surveyUser.length;

    let detractor = 0;
    let promoters = 0;
    let passive = 0;

    surveyUser.forEach(({value}) => {
      if(value >= 0 && value <= 6) 
        detractor++;
      else if(value >= 9 && value <= 10) 
        promoters++;
      else 
        passive ++;
    });
    
    const npsCalculate = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
    );

    return response.status(200).json({
      totalAnswers,
      nps: npsCalculate,
      detractor,
      promoters,
      passive
    });
  }
}

export { NpsController }