import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUser";

@EntityRepository(SurveyUser)
class SurveyUserRepository extends Repository<SurveyUser> {
  findByUserIdAndNullValue(user_id: string) {
    return this.findOne({
      where: [
        { user_id }, 
        { value: null }
      ],
      relations: ['user', 'survey']
    });
  }
}

export { SurveyUserRepository };
