## Notion Link

[TypeORM Notes](https://rich-lettuce-031.notion.site/Type-ORM-0301ae1ef0c74a90a0f25366022a379e) are hosted here for reference.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
## Get in touch

- Bhanu Handa - [https://www.linkedin.com/in/bhanu-handa-1607/](https://www.linkedin.com/in/bhanu-handa-1607/)

---
# Type ORM

## How to connect to Database (inject typeORM into imports)

- `**npm install --save @nestjs/typeorm typeorm sqlite3**`
- add **`TypeOrmModule.forRoot({...})`** to app module’s imports
    - **TypeOrmModule** is imported from ‘**`@nestjs/typeorm`**’

## How to create an Entity (entity = a table)

- `@**Entity`** decorator ****on a class tells that this class will represent the **shape of our User table**
- **`@Column`** decorator will add a varchar type column to the database
- **`@PrimaryGeneratedColumn`** will add an autoincrementing column

```tsx
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Pet, pet => pet.owner)
  pets: Pet[];
}
```

```tsx
@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => User, user => user.pets)
  owner: User;
}
```

## How to handle migrations (`synchronization: false`, `run migrations:generate`)

- instead of **`synchronization: true`** (development friendly)**,** in prod we use **Migrations.**
    - in the ORM config object, sync: false, migrations & cli need to be set.

```jsx
"typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js",
"migration:generate": "npm run build && npm run typeorm migration:generate -- -n"
"migration:run": "npm run build && npm run typeorm migration:run"
```

- *src/db/migrations*
    - **`up()`** - meant for creating migrations
    - **`down()`** - meant for reverting migrations
- for any change into DB
    - update the entity file
    - `**npm run migrate:generate -- UserMigration**`
    - `**npm run migrate:run**`
- if we want any custom migrations, side seeding some data, which can’t be done in entity file, we can create a file in the migrations folder.

## Create Queries (inject repositories into providers)

- inside the service (which is in providers array) - `**constructor(@InjectRepository(User) private userRepository: Repository<User>) {}**`

## Repository API & Querying

- `**find(), findOneOrFail()**`
- using `**save`** & `**remove`** because they return repository objects instead of `**insert`** & `**delete`** which return <insertResult> or <deleteResult>
- `**findOneOrFail`** instead of `**findOne`** to handle errors instead of returning empty result.

```tsx
customQuery(): any {
      return this.userRepository.createQueryBuilder("user").select("name").where(...)
  }
```

## CRUD operations

```tsx
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param() params): Promise<User> {
    return this.userService.getOneById(params.id);
  }

  @Get('/create/:name')
  createUser(@Param() params): Promise<User> {
    return this.userService.createUser(params.name);
  }

  @Get('/alter/:id/:name')
  updateUser(@Param() params): Promise<User> {
    return this.userService.updateUser(params.id, params.name);
  }

  @Get('/delete/:id')
  deleteUser(@Param() params): Promise<User> {
    return this.userService.deleteUser(params.id);
  }
}
```

```tsx
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find(); // SELECT * from user
  }

  async getOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id); 
			// SELECT * from user WHERE user.id = id
      return user;
    } catch (err) {
      throw err; // handle error
    }
  }

  createUser(name: string): Promise<User> {
    const newUser = this.userRepository.create({ name }); 
		// const newUser = new User(); newUser.name = name;
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
```

## Relations

```tsx
@ManyToOne(type => User, user => user.pets)
owner: User;

@OneToMany(type => Pet, pet => pet.owner)
pets: Pet[];

getAll(): Promise<User[]> {
  return this.userRepository.find({
    relations: ['pets'],
  }); // SELECT * from user JOIN pets
}
```
---
## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

Nest is [MIT licensed](LICENSE).
