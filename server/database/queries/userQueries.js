export const userQueries = {
  //Get user by email
  getByEmail: 'SELECT * FROM appuser WHERE email=$1',

  //Get user by email
  getById: 'SELECT * FROM appuser WHERE id=$1',

  //Create new user
  create:
    'INSERT INTO appuser(fname, lname, email, password) values($1,$2,$3,$4) RETURNING id, email',

  //update user confirmed field
  updateConfirmed: 'UPDATE appuser SET confirmed = true WHERE id=$1 AND email=$2',

  //update user confirmed field
  updatePassword: 'UPDATE appuser SET password = $1 WHERE id=$2',
};
