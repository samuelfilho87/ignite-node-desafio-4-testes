import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getStatementOperationUseCase: GetStatementOperationUseCase;

let createStatementUseCase: CreateStatementUseCase;

let usersRepositoryInMemory: InMemoryUsersRepository;

let statementRepositoryInMemory: InMemoryStatementsRepository;

let user: User;

let statement: Statement;

describe("Get Balance", () => {
  beforeEach(async () => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();

    usersRepositoryInMemory = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);

    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepositoryInMemory);

    user = await usersRepositoryInMemory.create({
      name: "User Name",
      email: "useremail@test.com",
      password: "123456"
    });

    statement = await createStatementUseCase.execute({
      user_id: user.id ?? '',
      amount: 1,
      description: "Test",
      type: OperationType.DEPOSIT
    });
  });

  it("should be able to get balance", async () => {
    const response = await getStatementOperationUseCase.execute({ user_id: user.id ?? '', statement_id: statement.id ?? '' });

    expect(response.amount).toEqual(1);
  });

  it("should not be able to get statement with invalid user ID", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: 'invalid-user-id', statement_id: statement.id ?? '' });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement with invalid statement ID", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: user.id ?? '', statement_id: 'invalid-statement-id' });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
