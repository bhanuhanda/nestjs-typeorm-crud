import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import config from '../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config), UserModule, PetModule],
  // config is an object that will be passed to the database driver
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
