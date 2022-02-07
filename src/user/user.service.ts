import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['pets'],
    }); // SELECT * from user JOIN pets
  }

  async getOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id); // SELECT * from user WHERE user.id = id
      return user;
    } catch (err) {
      throw err; // handle error
    }
  }

  createUser(name: string): Promise<User> {
    const newUser = this.userRepository.create({ name }); // const newUser = new User(); newUser.name = name;
    return this.userRepository.save(newUser); // INSERT
  }

  async updateUser(id: number, name: string): Promise<User> {
    const user = await this.getOneById(id);
    user.name = name;
    return this.userRepository.save(user); // UPDATE
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getOneById(id);
    return this.userRepository.remove(user); // DELETE
  }
}
