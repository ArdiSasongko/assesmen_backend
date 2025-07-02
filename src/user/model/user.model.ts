export class RegisterUser {
  username: string;
  password: string;
}

export class LoginUser {
  username: string;
  password: string;
}

export class UserResponse {
  username?: string;
  access_token?: string;
}
