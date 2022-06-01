import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;

let usersRepository: InMemoryUsersRepository;

let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    await createUserUseCase.execute({
      name: "Marcelo",
      email: "123",
      password: "123",
    });
  });

  it("should be able to user authenticated", async () => {
    const authenticateUser = await authenticateUserUseCase.execute({
      email: "123",
      password: "123",
    });

    expect(authenticateUser).toHaveProperty("user");
    expect(authenticateUser).toHaveProperty("token");
  });

  it("should not be able user authenticated with invalid e-mail", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({email: 'invalid-email', password: '123456'});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able user authenticated with invalid password", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({email: 'useremail@test.com', password: 'invalid-password'});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
