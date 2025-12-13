import {ApplicationRef, EventEmitter, Injectable, Injector} from '@angular/core';
import {CurrentUserService} from '../currentUser/current-user.service';
import {FireDbService} from '../fire-db/fire-db.service';

enum Languages {
  RU = 'RU',
  EN = 'EN',
  UA = 'UA'
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  languageChanged = new EventEmitter<void>();

  private selectedLanguage: Languages = Languages.EN;

  private localization: {[key: string]: {[key: string]: string}} = {
    [Languages.EN]: {
      'header_catalog': 'Catalog',
      'header_storage': 'Storage',
      'header_system': 'System',
      'header_login': 'LogIn',
      'header_logout': 'LogOut',

      'footer_author': 'Author: Hlib Zhukovskyi',

      'home_welcome': 'Welcome!',

      'page_not_found': 'Page not found',

      'error_user_not_found': 'User not found',
      'error_wrong_password': 'Password incorrect',
      'error_invalid_email': 'E-mail is invalid',
      'error_email_in_use': 'This e-mail is already in use',
      'error_error': 'Error',

      'catalog_table_title': 'Title',
      'catalog_table_type': 'Type',
      'catalog_table_description': 'Description',
      'catalog_button_add': 'Add',

      'loading': 'Loading',

      'search_hint': 'Enter part of the item title',
      'search_close': 'Close search',
      'search_button_find': 'Search',

      'pagination_button_prev': 'Previous',
      'pagination_button_prev_hint': 'Previous page',
      'pagination_button_next': 'Next',
      'pagination_button_next_hint': 'Next page',
      'pagination_page': 'Page',
      'pagination_first_page': 'First page',
      'pagination_last_page': 'Last page',
      'pagination_current_page': 'Current page',

      'edit_title': 'Title',
      'edit_title_hint': 'Enter the title',
      'edit_button_edit': 'Edit',
      'edit_title_error_empty': 'Title should not be empty',
      'edit_type': 'Type',
      'edit_type_choose': 'Choose',
      'edit_type_error': 'Type should be chosen',
      'edit_subtype': 'Subtype',
      'edit_subtype_no': 'No',
      'edit_parameters': 'Parameters',
      'edit_parameter_hint': 'Enter value',
      'edit_link': 'More information',
      'edit_link_hint': 'Enter link to scheme',
      'edit_description': 'Description',
      'edit_description_hint': 'Enter description',
      'edit_button_save': 'Save',
      'edit_button_cancel': 'Cancel',
      'edit_button_close': 'Close',

      'storage_storage': 'Storage',
      'storage_storage_hint': 'Enter the title',
      'storage_case': 'Case',
      'storage_button_add_storage': 'Add storage',
      'storage_button_delete': 'Remove',
      'storage_link_more': 'info',
      'storage_empty': 'empty',
      'storage_button_add_case': 'Add case',
      'storage_changes_title': 'Save changes?',
      'storage_changes_hint': 'Changes will be automatically saved when switching to another tab',

      'button_yes': 'Yes',
      'button_no': 'No',
      'add_hint': 'Add',
      'delete_hint': 'Remove',

      'storage_confirm_popup_title': 'Confirm removal',
      'storage_move_left': 'Move left',
      'storage_move_right': 'Move right',
      'storage_confirm_popup_storage': 'Are you sure that you want to remove selected case?',
      'storage_confirm_popup_case': 'Are you sure that you want to remove selected storage?',

      'storage_new_popup_title': 'New case',
      'storage_new_popup_case_title': 'Title',
      'storage_new_popup_case_hint': 'Case title',
      'storage_new_popup_amount': 'Amount',
      'storage_new_popup_add_title': 'Add item',
      'storage_new_popup_add_hint': 'Search by name',
      'storage_new_popup_button_add': 'Add',
      'storage_new_popup_button_cancel': 'Cancel',

      'system_title': 'Types and subtypes settings',
      'system_button_add_type': 'Add type',
      'system_button_add_subtype': 'Add subtype',
      'system_subtypes': 'Subtypes',
      'system_global_parameters': 'Global parameters',
      'system_type_parameters': 'Type parameters',
      'system_subtype_parameters': 'Subtype parameters',
      'system_type_hint': 'Type',
      'system_subtype_hint': 'Subtype',
      'system_parameter_hint': 'Parameter',
      'system_changes_hint': 'Changes will be automatically saved when switching to another tab',
      'system_button_save': 'Save',
      'system_button_cancel': 'Cancel',

      'login_title': 'LogIn',
      'login_email_title': 'E-mail',
      'login_email_hint': 'Enter your e-mail',
      'login_email_error_empty': 'E-mail should not be empty',
      'login_email_error_incorrect': 'E-mail is invalid',
      'login_password_title': 'Password',
      'login_password_hint': 'Enter your password',
      'login_password_error_empty': 'Password should not be empty',
      'login_password_error_short': 'Password should be longer than 5 symbols',
      'login_button_login': 'LogIn',
      'login_button_register': 'Register',

      'register_title': 'Registration',
      'register_name': 'Username',
      'register_name_hint': 'Enter your name',
      'register_name_error_long': 'Username should be longer than 10 symbols',
      'register_name_error_empty': 'Username should not be empty',
      'register_password_repeat': 'Password repeat',
      'register_password_repeat_hint': 'Repeat your password',
      'register_password_error_equal': 'Passwords ot equal',
      'register_button_register': 'Register',
      'register_button_back': 'Back',
    },
    [Languages.RU]: {
      'header_catalog': 'Каталог',
      'header_storage': 'Хранилище',
      'header_system': 'Система',
      'header_login': 'Войти',
      'header_logout': 'Выйти',

      'footer_author': 'Автор: Жуковский Глеб',

      'home_welcome': 'Добро пожаловать',

      'page_not_found': 'Страница не найдена',

      'error_user_not_found': 'Пользователь не найден',
      'error_wrong_password': 'Неверный пароль',
      'error_invalid_email': 'Некорректный почтовый адрес',
      'error_email_in_use': 'Данный почтовый адрес уже используется',
      'error_error': 'Ошибка',

      'catalog_table_title': 'Название',
      'catalog_table_type': 'Тип',
      'catalog_table_description': 'Описание',
      'catalog_button_add': 'Добавить',

      'loading': 'Загрузка',

      'search_hint': 'Введите часть названия детали',
      'search_close': 'Закрыть поиск',
      'search_button_find': 'Поиск',

      'pagination_button_prev': 'Предыдущая',
      'pagination_button_prev_hint': 'Предыдущая страница',
      'pagination_button_next': 'Следующая',
      'pagination_button_next_hint': 'Следущая страница',
      'pagination_page': 'Страница',
      'pagination_first_page': 'Первая страница',
      'pagination_last_page': 'Последняя страница',
      'pagination_current_page': 'Текущая страница',

      'edit_title': 'Название',
      'edit_title_hint': 'Введите название',
      'edit_button_edit': 'Редактировать',
      'edit_title_error_empty': 'Название не должно быть пустым',
      'edit_type': 'Тип',
      'edit_type_choose': 'Выбрать',
      'edit_type_error': 'Тип должен быть выбран',
      'edit_subtype': 'Подтип',
      'edit_subtype_no': 'Нет',
      'edit_parameters': 'Параметры',
      'edit_parameter_hint': 'Введите значение',
      'edit_link': 'Больше информации',
      'edit_link_hint': 'Введите ссылку на схему',
      'edit_description': 'Описание',
      'edit_description_hint': 'Введите описание',
      'edit_button_save': 'Сохранить',
      'edit_button_cancel': 'Отмена',
      'edit_button_close': 'Закрыть',

      'storage_storage': 'Хранилище',
      'storage_storage_hint': 'Введите название',
      'storage_case': 'Ячейка',
      'storage_button_add_storage': 'Добавить хранилище',
      'storage_button_delete': 'Удалить',
      'storage_link_more': 'подробнее',
      'storage_empty': 'пусто',
      'storage_button_add_case': 'Добавить ячейку',
      'storage_changes_title': 'Сохранить изменения?',
      'storage_changes_hint': 'Изменения будут автоматически сохранены при переходе на другую вкладку',

      'button_yes': 'Да',
      'button_no': 'Нет',
      'add_hint': 'Добавить',
      'delete_hint': 'Удалить',

      'storage_confirm_popup_title': 'Подтвердить удаление',
      'storage_move_left': 'Переместить влево',
      'storage_move_right': 'Переместить вправо',
      'storage_confirm_popup_storage': 'Вы уверены, что хотите удалить выбранную ячейку',
      'storage_confirm_popup_case': 'Вы уверены, что хотите удалить выбранное хранилище',

      'storage_new_popup_title': 'Новая ячейка',
      'storage_new_popup_case_title': 'Название',
      'storage_new_popup_case_hint': 'Название ячейки',
      'storage_new_popup_amount': 'Количество',
      'storage_new_popup_add_title': 'Добавить деталь',
      'storage_new_popup_add_hint': 'Поиск по названию',
      'storage_new_popup_button_add': 'Добавить',
      'storage_new_popup_button_cancel': 'Отмена',

      'system_title': 'Настройки типов и параметров',
      'system_button_add_type': 'Добавить тип',
      'system_button_add_subtype': 'Добавить подтип',
      'system_subtypes': 'Подтипы',
      'system_global_parameters': 'Глобальные параметры',
      'system_type_parameters': 'Параметры типа',
      'system_subtype_parameters': 'Параметры подтипа',
      'system_type_hint': 'Тип',
      'system_subtype_hint': 'Подтип',
      'system_parameter_hint': 'Параметр',
      'system_changes_hint': 'Изменения будут автоматически сохранены при переходе на другую вкладку',
      'system_button_save': 'Сохранить',
      'system_button_cancel': 'Отмена',

      'login_title': 'Войти',
      'login_email_title': 'E-mail адрес',
      'login_email_hint': 'Введите ваш e-mail',
      'login_email_error_empty': 'Почтовый адрес не должен быть пустым',
      'login_email_error_incorrect': 'Почтовый адрес введен неверно',
      'login_password_title': 'Пароль',
      'login_password_hint': 'Введите ваш пароль',
      'login_password_error_empty': 'Пароль не должен быть пустым',
      'login_password_error_short': 'Пароль не должен быть короче 6 символов',
      'login_button_login': 'Войти',
      'login_button_register': 'Регистрация',

      'register_title': 'Регистрация',
      'register_name': 'Имя пользователя',
      'register_name_hint': 'Введите ваше имя',
      'register_name_error_long': 'Имя не должно быть длиннее 10 символов',
      'register_name_error_empty': 'Имя пользователя не должно быть пустым',
      'register_password_repeat': 'Подтверждение пароля',
      'register_password_repeat_hint': 'Повторите ваш пароль',
      'register_password_error_equal': 'Пароли не совпадают',
      'register_button_register': 'Зарегистрировать',
      'register_button_back': 'Назад',
    },
    [Languages.UA]: {
      'header_catalog': 'Каталог',
      'header_storage': 'Сховище',
      'header_system': 'Система',
      'header_login': 'Увійти',
      'header_logout': 'Вийти',

      'footer_author': 'Автор: Жуковський Гліб',

      'home_welcome': 'Ласкаво просимо!',

      'page_not_found': 'Сторінку не знайдено',

      'error_user_not_found': 'Користувача не знайдено',
      'error_wrong_password': 'Невірний пароль',
      'error_invalid_email': 'Некоректна електронна адреса',
      'error_email_in_use': 'Ця електронна адреса вже використовується',
      'error_error': 'Помилка',

      'catalog_table_title': 'Назва',
      'catalog_table_type': 'Тип',
      'catalog_table_description': 'Опис',
      'catalog_button_add': 'Додати',

      'loading': 'Завантаження',

      'search_hint': 'Введіть частину назви деталі',
      'search_close': 'Закрити пошук',
      'search_button_find': 'Пошук',

      'pagination_button_prev': 'Попередня',
      'pagination_button_prev_hint': 'Попередня сторінка',
      'pagination_button_next': 'Наступна',
      'pagination_button_next_hint': 'Наступна сторінка',
      'pagination_page': 'Сторінка',
      'pagination_first_page': 'Перша сторінка',
      'pagination_last_page': 'Остання сторінка',
      'pagination_current_page': 'Поточна сторінка',

      'edit_title': 'Назва',
      'edit_title_hint': 'Введіть назву',
      'edit_button_edit': 'Редагувати',
      'edit_title_error_empty': 'Назва не повинна бути порожньою',
      'edit_type': 'Тип',
      'edit_type_choose': 'Обрати',
      'edit_type_error': 'Тип має бути обраний',
      'edit_subtype': 'Підтип',
      'edit_subtype_no': 'Ні',
      'edit_parameters': 'Параметри',
      'edit_parameter_hint': 'Введіть значення',
      'edit_link': 'Більше інформації',
      'edit_link_hint': 'Введіть посилання на схему',
      'edit_description': 'Опис',
      'edit_description_hint': 'Введіть опис',
      'edit_button_save': 'Зберегти',
      'edit_button_cancel': 'Скасувати',
      'edit_button_close': 'Закрити',

      'storage_storage': 'Сховище',
      'storage_storage_hint': 'Введіть назву',
      'storage_case': 'Комірка',
      'storage_button_add_storage': 'Додати сховище',
      'storage_button_delete': 'Видалити',
      'storage_link_more': 'детальніше',
      'storage_empty': 'порожньо',
      'storage_button_add_case': 'Додати комірку',
      'storage_changes_title': 'Зберегти зміни?',
      'storage_changes_hint': 'Зміни будуть автоматично збережені при переході на іншу вкладку',

      'button_yes': 'Так',
      'button_no': 'Ні',
      'add_hint': 'Додати',
      'delete_hint': 'Видалити',

      'storage_confirm_popup_title': 'Підтвердити видалення',
      'storage_move_left': 'Перемістити вліво',
      'storage_move_right': 'Перемістити вправо',
      'storage_confirm_popup_storage': 'Ви впевнені, що хочете видалити обрану комірку?',
      'storage_confirm_popup_case': 'Ви впевнені, що хочете видалити обране сховище?',

      'storage_new_popup_title': 'Нова комірка',
      'storage_new_popup_case_title': 'Назва',
      'storage_new_popup_case_hint': 'Назва комірки',
      'storage_new_popup_amount': 'Кількість',
      'storage_new_popup_add_title': 'Додати деталь',
      'storage_new_popup_add_hint': 'Пошук за назвою',
      'storage_new_popup_button_add': 'Додати',
      'storage_new_popup_button_cancel': 'Скасувати',

      'system_title': 'Налаштування типів та параметрів',
      'system_button_add_type': 'Додати тип',
      'system_button_add_subtype': 'Додати підтип',
      'system_subtypes': 'Підтипи',
      'system_global_parameters': 'Глобальні параметри',
      'system_type_parameters': 'Параметри типу',
      'system_subtype_parameters': 'Параметри підтипу',
      'system_type_hint': 'Тип',
      'system_subtype_hint': 'Підтип',
      'system_parameter_hint': 'Параметр',
      'system_changes_hint': 'Зміни будуть автоматично збережені при переході на іншу вкладку',
      'system_button_save': 'Зберегти',
      'system_button_cancel': 'Скасувати',

      'login_title': 'Увійти',
      'login_email_title': 'Електронна пошта',
      'login_email_hint': 'Введіть вашу електронну пошту',
      'login_email_error_empty': 'Електронна адреса не повинна бути порожньою',
      'login_email_error_incorrect': 'Електронна адреса введена невірно',
      'login_password_title': 'Пароль',
      'login_password_hint': 'Введіть ваш пароль',
      'login_password_error_empty': 'Пароль не повинен бути порожнім',
      'login_password_error_short': 'Пароль має бути довшим за 5 символів',
      'login_button_login': 'Увійти',
      'login_button_register': 'Реєстрація',

      'register_title': 'Реєстрація',
      'register_name': "Ім'я користувача",
      'register_name_hint': "Введіть ваше ім'я",
      'register_name_error_long': "Ім'я не повинно бути довшим за 10 символів",
      'register_name_error_empty': "Ім'я користувача не повинно бути порожнім",
      'register_password_repeat': 'Підтвердження пароля',
      'register_password_repeat_hint': 'Повторіть ваш пароль',
      'register_password_error_equal': 'Паролі не збігаються',
      'register_button_register': 'Зареєструватися',
      'register_button_back': 'Назад',
    }
  };

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  private get currentUserService(): CurrentUserService {
    return this.injector.get(CurrentUserService);
  }

  private get fireDbService(): FireDbService {
    return this.injector.get(FireDbService);
  }

  byId(id: string): string {
    return this.localization[this.selectedLanguage][id] || '!' + id + '!';
  }

  setLanguage(lang: Languages): void {
    this.selectedLanguage = lang;
    this.languageChanged.emit();
    this.appRef.tick();

    try {
      const uid = this.currentUserService.uid;
      if (uid) {
        this.fireDbService.saveUserLanguage(uid, lang).subscribe();
      }
    } catch (e) { }
  }

  loadUserLanguage(): void {
    const uid = this.currentUserService.uid;
    if (uid) {
      this.fireDbService.getUserLanguage(uid).subscribe(language => {
        if (language && this.langList.includes(language as Languages)) {
          this.setLanguage(language as Languages);
        }
      });
    }
  }

  get lang(): Languages {
    return this.selectedLanguage;
  }

  get langList(): Languages[] {
    return [Languages.EN, Languages.RU, Languages.UA];
  }
}
