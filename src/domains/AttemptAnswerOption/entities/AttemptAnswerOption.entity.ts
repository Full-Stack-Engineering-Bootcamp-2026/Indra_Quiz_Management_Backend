import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Generated,
} from "typeorm";

import { AttemptAnswer } from "../../AttemptAnswer/entities/AttemptAnswer.entity";
import { QuestionOption } from "../../QuestionOption/entities/QuestionOption.entity";

@Entity("attempt_answer_options")
export class AttemptAnswerOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(
    () => AttemptAnswer,
    (attemptAnswer) => attemptAnswer.selectedOptions,
    {
      nullable: false,
      onDelete: "CASCADE",
    },
  )
  attemptAnswer: AttemptAnswer;

  @ManyToOne(() => QuestionOption, {
    nullable: false,
  })
  questionOption: QuestionOption;
}
