import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778763454349 implements MigrationInterface {
    name = 'Init1778763454349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`quiz_attempts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`attemptNumber\` int NOT NULL, \`submittedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, \`quizId\` int NOT NULL, INDEX \`IDX_e37e0bd0ef9292c7150b397ab9\` (\`attemptNumber\`), UNIQUE INDEX \`IDX_08244e7c9ab304266e6b4cca28\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attempt_answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`answerText\` text NULL, \`attemptId\` int NOT NULL, \`questionId\` int NOT NULL, \`questionVersionId\` int NOT NULL, UNIQUE INDEX \`IDX_cbfd5b7084020b42351f8400a4\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attempt_answer_options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`attemptAnswerId\` int NOT NULL, \`questionOptionId\` int NOT NULL, UNIQUE INDEX \`IDX_8d23cdbff94229b2b43ed8508c\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`optionText\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`questionVersionId\` int NOT NULL, \`selectedInAnswersId\` int NULL, UNIQUE INDEX \`IDX_5001341ebb96c8cb46df45ffe8\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_versions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`versionNumber\` int NOT NULL, \`questionText\` text NOT NULL, \`answerType\` enum ('single_select', 'multi_select', 'text') NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`questionId\` int NOT NULL, INDEX \`IDX_cb9f5fc8e3f30f56d98f76a791\` (\`versionNumber\`), INDEX \`IDX_f7347149613faaec5e5df5d487\` (\`isActive\`), UNIQUE INDEX \`IDX_8000c759356795cc12d7f5addc\` (\`publicId\`), UNIQUE INDEX \`IDX_0badc24b42a299ee54d9083e1f\` (\`questionId\`, \`versionNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` int NOT NULL, INDEX \`IDX_956a94a7ff88b6ebf3e0dbe67c\` (\`isDeleted\`), UNIQUE INDEX \`IDX_668f5eb70e40649990ab58f839\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`quizId\` int NOT NULL, \`questionId\` int NOT NULL, UNIQUE INDEX \`IDX_d51e7b1462e5c8df0759aa0b84\` (\`publicId\`), UNIQUE INDEX \`IDX_041c7884328e13eba070ccd988\` (\`quizId\`, \`questionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quizzes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` int NOT NULL, UNIQUE INDEX \`IDX_afcbf19a5c6140f08f104bf394\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`email\` varchar(150) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_9099c98f00a1b5aca6b8f7f04a\` (\`publicId\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`FK_ff7b1d71fabdc7e1f4aff552859\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`FK_23f2bbe9288b221b1b377372782\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` ADD CONSTRAINT \`FK_76e6a7dc4c1894250800077e79b\` FOREIGN KEY (\`attemptId\`) REFERENCES \`quiz_attempts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` ADD CONSTRAINT \`FK_382ef7a450def2331b236e49268\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` ADD CONSTRAINT \`FK_c9d95a252926540d3239baba051\` FOREIGN KEY (\`questionVersionId\`) REFERENCES \`question_versions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` ADD CONSTRAINT \`FK_9e20baebec9eb95e0e2c967bc28\` FOREIGN KEY (\`attemptAnswerId\`) REFERENCES \`attempt_answers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` ADD CONSTRAINT \`FK_8a40691bc6ea890506e15103fc9\` FOREIGN KEY (\`questionOptionId\`) REFERENCES \`question_options\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_options\` ADD CONSTRAINT \`FK_9603921362dc02d60f7e779b6ea\` FOREIGN KEY (\`questionVersionId\`) REFERENCES \`question_versions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_options\` ADD CONSTRAINT \`FK_e0431f656e92bfb6e268da5ba29\` FOREIGN KEY (\`selectedInAnswersId\`) REFERENCES \`attempt_answer_options\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_versions\` ADD CONSTRAINT \`FK_78bb84eef58e712e849d491290d\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_0483ccbf84f12cc70caff7b9075\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` ADD CONSTRAINT \`FK_8889ccc5a40989ea308a588870e\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` ADD CONSTRAINT \`FK_2deb89a4271b6f0e1aa30c2b07a\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_e3eb6001c54316dd29d4ba32de4\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_e3eb6001c54316dd29d4ba32de4\``);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` DROP FOREIGN KEY \`FK_2deb89a4271b6f0e1aa30c2b07a\``);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` DROP FOREIGN KEY \`FK_8889ccc5a40989ea308a588870e\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_0483ccbf84f12cc70caff7b9075\``);
        await queryRunner.query(`ALTER TABLE \`question_versions\` DROP FOREIGN KEY \`FK_78bb84eef58e712e849d491290d\``);
        await queryRunner.query(`ALTER TABLE \`question_options\` DROP FOREIGN KEY \`FK_e0431f656e92bfb6e268da5ba29\``);
        await queryRunner.query(`ALTER TABLE \`question_options\` DROP FOREIGN KEY \`FK_9603921362dc02d60f7e779b6ea\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` DROP FOREIGN KEY \`FK_8a40691bc6ea890506e15103fc9\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` DROP FOREIGN KEY \`FK_9e20baebec9eb95e0e2c967bc28\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` DROP FOREIGN KEY \`FK_c9d95a252926540d3239baba051\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` DROP FOREIGN KEY \`FK_382ef7a450def2331b236e49268\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` DROP FOREIGN KEY \`FK_76e6a7dc4c1894250800077e79b\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP FOREIGN KEY \`FK_23f2bbe9288b221b1b377372782\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempts\` DROP FOREIGN KEY \`FK_ff7b1d71fabdc7e1f4aff552859\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_9099c98f00a1b5aca6b8f7f04a\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_afcbf19a5c6140f08f104bf394\` ON \`quizzes\``);
        await queryRunner.query(`DROP TABLE \`quizzes\``);
        await queryRunner.query(`DROP INDEX \`IDX_041c7884328e13eba070ccd988\` ON \`quiz_questions\``);
        await queryRunner.query(`DROP INDEX \`IDX_d51e7b1462e5c8df0759aa0b84\` ON \`quiz_questions\``);
        await queryRunner.query(`DROP TABLE \`quiz_questions\``);
        await queryRunner.query(`DROP INDEX \`IDX_668f5eb70e40649990ab58f839\` ON \`questions\``);
        await queryRunner.query(`DROP INDEX \`IDX_956a94a7ff88b6ebf3e0dbe67c\` ON \`questions\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP INDEX \`IDX_0badc24b42a299ee54d9083e1f\` ON \`question_versions\``);
        await queryRunner.query(`DROP INDEX \`IDX_8000c759356795cc12d7f5addc\` ON \`question_versions\``);
        await queryRunner.query(`DROP INDEX \`IDX_f7347149613faaec5e5df5d487\` ON \`question_versions\``);
        await queryRunner.query(`DROP INDEX \`IDX_cb9f5fc8e3f30f56d98f76a791\` ON \`question_versions\``);
        await queryRunner.query(`DROP TABLE \`question_versions\``);
        await queryRunner.query(`DROP INDEX \`IDX_5001341ebb96c8cb46df45ffe8\` ON \`question_options\``);
        await queryRunner.query(`DROP TABLE \`question_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_8d23cdbff94229b2b43ed8508c\` ON \`attempt_answer_options\``);
        await queryRunner.query(`DROP TABLE \`attempt_answer_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_cbfd5b7084020b42351f8400a4\` ON \`attempt_answers\``);
        await queryRunner.query(`DROP TABLE \`attempt_answers\``);
        await queryRunner.query(`DROP INDEX \`IDX_08244e7c9ab304266e6b4cca28\` ON \`quiz_attempts\``);
        await queryRunner.query(`DROP INDEX \`IDX_e37e0bd0ef9292c7150b397ab9\` ON \`quiz_attempts\``);
        await queryRunner.query(`DROP TABLE \`quiz_attempts\``);
    }

}
