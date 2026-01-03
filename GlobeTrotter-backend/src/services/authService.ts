
interface SessionUser {
  userId: string;
  email: string;
  roles: string[];
}

export function createSession(
  user: SessionUser,
  req: any
) {
  req.session.user = {
    userId: user.userId,
    email: user.email,
    roles: user.roles
  };
}

export function getSession(req: any) {
  return req.session.user ?? null;
}
