import { UserModel } from '@/models';

export class UserService {
  public static async getAllUsers() {
    return await UserModel.find();
  }
}
