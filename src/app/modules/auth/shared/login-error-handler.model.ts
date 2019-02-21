export class LoginErrorHandlerModel {
    static getErrorMessage(error): string {
      console.log(error.code)
        switch (error.code) {
            case ('auth/user-not-found'):
                return 'Пользователь не найден';
            case ('auth/wrong-password'):
                return ('Неверный пароль');
            case ('auth/invalid-email'):
                return 'Некорректный почтовый адрес';
            case ('auth/email-already-in-use'):
                return 'Данный почтовый адрес уже используется';
            default:
                return 'Ошибка';
          }
    }
}
