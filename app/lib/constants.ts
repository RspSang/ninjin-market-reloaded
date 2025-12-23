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

// USERNAME
export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MIN_LENGTH_ERROR = 'ユーザーネームが短いです';
export const USERNAME_MAX_LENGTH = 16;
export const USERNAME_MAX_LENGTH_ERROR = 'ユーザーネームが長いです';
export const USERNAME_INVALID_TYPE_ERROR = '文字を入力ください';
export const USERNAME_REQUIRED_ERROR = 'ユーザーネームを入力ください';

// EMAIL
export const EMAIL_REQUIRED_ERROR = 'メールアドレスを入力ください';
export const EMAIL_FORMAT_ERROR = '正しいメールアドレスを入力ください';

// PHONE NUMBER
export const PHONE_FORMAT_ERROR = '正しい電話番号を入力ください'
