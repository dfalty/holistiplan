export interface UserData {
  email: string;
  password: string;
  username: string;
}

export const VALID_USER: UserData = {
  email: 'someone@holistiplan.com',
  password: 'bfx!wkp3zve3WUX*guq',
  username: 'Someone AtHolistiplan'
};

export const INVALID_CREDENTIALS = [
  {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    description: 'Invalid email'
  },
  {
    email: 'someone@holistiplan.com',
    password: 'wrongpassword',
    description: 'Valid email, wrong password'
  }
];

