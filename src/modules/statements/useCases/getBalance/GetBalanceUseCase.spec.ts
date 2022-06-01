import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getBalanceUseCase: GetBalanceUseCase;

let createStatementUseCase: CreateStatementUseCase;

let usersRepositoryInMemory: InMemoryUsersRepository;

let statementRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(async () => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();

    usersRepositoryInMemory = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);

    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory);
  });

  it("should be able to get balance", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User Name",
      email: "useremail@test.com",
      password: "123456"
    });

    await createStatementUseCase.execute({
      user_id: user.id ?? '',
      amount: 1,
      description: "Test",
      type: OperationType.DEPOSIT
    });

    const response = await getBalanceUseCase.execute({ user_id: user.id ?? '' });

    expect(response.balance).toEqual(1);
  });

  it("should not be able to get balance to with invalid user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'invalid-user-id' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
