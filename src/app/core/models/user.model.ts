import { FormControl } from '@angular/forms';

export interface User {
  UserId?: number;
  Username: string;
  Email?: string;
  Password?: string;
}

export interface UserResponse {
  Token: string;
  UserId: number;
  Username: string;
}

export interface LoginValues {
  UsernameOrEmail: string;
  Password: string;
}

export type LoginForm = {
  [K in keyof LoginValues]?: FormControl<LoginValues[K] | null>;
};

export type RegisterValues = Pick<User, 'Username' | 'Password' | 'Email'> & {
  ConfirmPassword: string;
};

export type RegisterForm = {
  [K in keyof RegisterValues]?: FormControl<RegisterValues[K] | null>;
};
