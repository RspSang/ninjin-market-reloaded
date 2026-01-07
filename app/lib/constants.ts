// PASSWORD
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/;
export const PASSWORD_REGEX_ERROR =
  'パスワードは英字大小文字、数字、特殊文字が必要です';
export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_MIN_LENGTH_ERROR = 'パスワードが短いです';
export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORD_MAX_LENGTH_ERROR = 'パスワードが長いです';
export const PASSWORD_CHECK_ERROR = 'パスワードが一致していません';
export const PASSWORD_REQUIRED_ERROR = 'パスワードを入力ください';
export const PASSWORD_INVALID_TYPE_ERROR =
  '正しい形式のパスワードを入力ください';

// USERNAME
export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MIN_LENGTH_ERROR = 'ユーザーネームが短いです';
export const USERNAME_MAX_LENGTH = 16;
export const USERNAME_MAX_LENGTH_ERROR = 'ユーザーネームが長いです';
export const USERNAME_INVALID_TYPE_ERROR =
  '正しい形式のユーザーネームを入力ください';
export const USERNAME_REQUIRED_ERROR = 'ユーザーネームを入力ください';
export const USERNAME_UNIQUE_ERROR =
  'ユーザーネームはすでに使われています';

// EMAIL
export const EMAIL_REQUIRED_ERROR = 'メールアドレスを入力ください';
export const EMAIL_FORMAT_ERROR = '正しいメールアドレスを入力ください';
export const EMAIL_INVALID_CHARACTER_ERROR =
  'メールアドレスはすでに使われています';
export const EMAIL_UNIQUE_ERROR = 'メールアドレスはすでに使われています';
// PHONE NUMBER
export const PHONE_FORMAT_ERROR = '正しい電話番号を入力ください';

// TOKEN
export const TOKEN_MIN_LENGTH = 100000;
export const TOKEN_MAX_LENGTH = 999999;
export const TOKEN_REQUIRED_ERROR = 'トークンを入力ください';
export const TOKEN_FORMAT_ERROR = 'トークンが正しくありません';
