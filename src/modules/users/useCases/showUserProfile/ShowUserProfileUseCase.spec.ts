import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;

let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show an user profile", async () => {
    const user: User = await usersRepositoryInMemory.create({
      name: "User Name",
      email: "useremail@test.com",
      password: "123456"
    });

    const userProfile = await showUserProfileUseCase.execute(user.id ?? '');

    expect(userProfile).toEqual(user);
  });

  it("should not be able show user profile non exist", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('id-non-exist');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
