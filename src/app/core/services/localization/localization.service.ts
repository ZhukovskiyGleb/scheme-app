import {ChangeDetectorRef, EventEmitter, Injectable, Injector} from '@angular/core';

enum Languages {
  RU = 'РУ',
  EN = "EN"
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  languageChanged = new EventEmitter<void>();

  private selectedLanguage: Languages = Languages.RU;

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
      'storage_link_more': 'more',
      'storage_empty': 'empty',
      'storage_button_add_case': 'Add case',
      'storage_changes_title': 'Save changes?',
      'storage_changes_hint': 'Changes will be automatically saved when switching to another tab',

      'button_yes': 'Yes',
      'button_no': 'No',
      'add_hint': 'Add',
      'delete_hint': 'Remove',

      'storage_confirm_popup_title': 'Confirm removal',
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
    }
  };

  constructor() { }

  byId(id: string): string {
    return this.localization[this.selectedLanguage][id] || '!' + id + '!';
  }

  setLanguage(lang: Languages): void {
    this.selectedLanguage = lang;
    this.languageChanged.emit();
  }

  get lang(): Languages {
    return this.selectedLanguage;
  }

  get langList(): Languages[] {
    return [Languages.EN, Languages.RU];
  }
}
