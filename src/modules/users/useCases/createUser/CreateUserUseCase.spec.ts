import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;

let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "User Name",
      email: "useremail@test.com",
      password: "123456"
    });

    expect(userCreated).toHaveProperty("id");
  });

  it("should not be able to create a user with exists e-mail", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Name",
        email: "useremail@test.com",
        password: "123456"
      });

      await createUserUseCase.execute({
        name: "User Name",
        email: "useremail@test.com",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
