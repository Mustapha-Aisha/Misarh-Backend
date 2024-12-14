// import { Processor, Process } from '@nestjs/bull';
// import { Job } from 'bull';
// import { Logger } from '@nestjs/common';
// import { Config } from '../../../libs/config';
// import { Repository } from 'typeorm';
// import { UserEntity } from 'src/modules/user/entity/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';


// @Processor(Config.CREATE_MONGO_USER)
// export class CreateMongoUserConsumer {
//   private readonly logger = new Logger(CreateMongoUserConsumer.name);
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//   ) {}
//   @Process()
//   async transcode(job: Job<unknown>) {
//     this.logger.debug('Start saving user to mongo db');
//     try {
//       // const res = await this.userRepo.create(job.data['user']);
//       // if (res) {
//         //update userRepository with the user id
//         await this.userRepository.update(
//           { user_id: job.data['user']['user_id'] },
//           {
//             mongo_id: res._id,
//           },
//         );
//       // }
//     } catch (e) {
//       console.log(e);
//     }
//     this.logger.debug('User saved to mongo db');
//   }
// }

