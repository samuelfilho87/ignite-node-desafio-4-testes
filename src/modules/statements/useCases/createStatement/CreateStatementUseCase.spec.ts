import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createStatementUseCase: CreateStatementUseCase;

let usersRepositoryInMemory: InMemoryUsersRepository;

let statementRepositoryInMemory: InMemoryStatementsRepository;

let userId = '';

describe("Create Statement", () => {
  beforeEach(async () => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();

    usersRepositoryInMemory = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);

    const user = await usersRepositoryInMemory.create({
      name: "User Name",
      email: "useremail@test.com",
      password: "123456"
    });

    userId = user.id ?? '';
  });

  it("should be able to deposit", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: userId,
      amount: 1,
      description: "Test",
      type: OperationType.DEPOSIT
    });

    expect(statement.amount).toEqual(1);
  });

  it("should be able to withdraw", async () => {
    await createStatementUseCase.execute({
      user_id: userId,
      amount: 5,
      description: "Test",
      type: OperationType.DEPOSIT
    });

    const statement = await createStatementUseCase.execute({
      user_id: userId,
      amount: 1,
      description: "Test",
      type: OperationType.WITHDRAW
    });

    expect(statement.amount).toEqual(1);
  });

  it("should not be able to withdraw with insufficient funds", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: userId,
        amount: 1,
        description: "Test",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
