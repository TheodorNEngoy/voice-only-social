export interface components {
  schemas: {
    User: {
      id: string;
      handle: string;
      name: string;
    };
    RegisterRequest: {
      email: string;
      password: string;
      handle: string;
      name: string;
    };
  };
}
export interface paths {}
