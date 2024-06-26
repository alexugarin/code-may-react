// App.tsx

import React, { useState } from "react";
import GetRolesComponent from "./components/GetRolesComponent/GetRolesComponent";
import Step from "./components/StepComponent/StepComponent";
import { performFetchA } from "./service/api";
import CustomInput from "./components/CustomInput/CustomInput";
import "./App.css";
import { encodeToBase64, hideStr } from "./service/tokenService";

const App: React.FC = () => {
  // Состояние шага
  const [step, setStep] = useState<number>(1);

  // Ключи для ререндеринга компонентов в случае возврата к предыдущему шагу
  const [keyStepSecond, setKeyStepSecond] = useState<number>(0);
  const [keyStepThird, setKeyStepThird] = useState<number>(0);

  // Функция генерации ключа
  const generateKey = () => {
    return Math.random();
  };

  // Состояния Loader'ов для каждого шага
  const [loadingResponseStepFirst, setLoadingResponseStepFirst] =
    useState<boolean>(false);
  const [loadingResponseStepSecond, setLoadingResponseStepSecond] =
    useState<boolean>(false);
  const [loadingResponseStepThirst, setLoadingResponseStepThirst] =
    useState<boolean>(false);

  // Состояния ошибок для каждого шага
  const [errorResponseStepFirst, setErrorResponseStepFirst] =
    useState<unknown>("");
  const [errorResponseStepSecond, setErrorResponseStepSecond] =
    useState<unknown>("");
  const [errorResponseStepThirst, setErrorResponseStepThirst] =
    useState<unknown>("");

  // Состояния для Email и Token
  const [emailForCode, setEmailForCode] = useState<string>("");
  const [token, setToken] = useState<string>("");

  // Слушатель события выбора роли
  const handleRoleSelect = (role: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ["role"]: role,
    }));
  };

  // Функция обратного вызова для отправки запроса на сервер первого шага
  const onSubmitStepFirst = async () => {
    // Проверка на заполненность полей
    if (
      !formValuesStepFirst.first_name ||
      !formValuesStepFirst.last_name ||
      !formValuesStepFirst.email ||
      !formValuesStepFirst.role
    ) {
      setErrorResponseStepFirst("Заполните все поля");
      return;
    }
    setLoadingResponseStepFirst(true);
    setErrorResponseStepFirst(""); // Сбрасываем ошибку ответа сервера для первого шага
    try {
      // Пробуем получить ответ с сервера
      return await performFetchA({
        endpoint: "api/sign-up",
        method: "POST",
        body: formValuesStepFirst,
      });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setErrorResponseStepFirst(error);
    }
  };

  // Оработка ответа с сервера
  const onResponseStepFirst = (response: string) => {
    setLoadingResponseStepFirst(false);
    if (!errorResponseStepFirst) {
      setStep(2); // Переход к следующему шагу
      setKeyStepSecond(generateKey()); // Генерируем ключ для следующего щага
      setEmailForCode(""); // Обнуляем состояния email и token
      setToken("");
    }
    console.log("ответ сервера: ", response);
    console.log(formValuesStepFirst);
  };

  const onSubmitStepSecond = async () => {
    if (!emailForCode) {
      setErrorResponseStepSecond("Заполните поле Email");
      return;
    }
    setLoadingResponseStepSecond(true);
    setErrorResponseStepSecond("");
    try {
      return await performFetchA({
        endpoint: `api/get-code?email=${emailForCode}`,
        method: "GET",
      });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setErrorResponseStepSecond(error);
    }
  };

  const onResponseStepSecond = (response: string) => {
    setLoadingResponseStepSecond(false);
    if (!errorResponseStepSecond) {
      setStep(3); // Переход к следующему шагу
      setKeyStepThird(generateKey());
    }
    console.log("ответ сервера: ", response);
    setToken(encodeToBase64(emailForCode, response));
  };

  const onSubmitStepThirst = async () => {
    setLoadingResponseStepThirst(true);
    setErrorResponseStepThirst("");

    try {
      return await performFetchA({
        endpoint: `api/set-status`,
        method: "POST",
        body: { token: token, status: "increased" },
      });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setErrorResponseStepThirst(error);
    }
  };

  const onResponseStepThirst = (response: string) => {
    setLoadingResponseStepThirst(false);
    if (!errorResponseStepSecond) setStep(4); // Переход к следующему шагу
    console.log("ответ сервера: ", response);
  };

  // Объект состояния для хранения значений всех полей на первом шаге
  const [formValuesStepFirst, setFormValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  // Функция для обновления конкретного поля в состоянии
  const handleInputChange = (fieldName: string) => (value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
    console.log("данные в форме: ", formValuesStepFirst);
  };
  // Функция слушатель изменения поля Email на втором шаге
  const handleEmailChange = (value: string) => {
    console.log("email:", value);
    setEmailForCode(value);
  };

  return (
    <div className="app-container">
      {step >= 1 && (
        <Step
          stepNumber={1}
          stepTitle="1. Записаться в таблицу кандидатов"
          onSubmit={onSubmitStepFirst}
          onResponse={onResponseStepFirst}
          buttonText="Записаться"
        >
          <GetRolesComponent onSelectRole={handleRoleSelect} />
          <CustomInput
            placeholder="Имя"
            onChange={handleInputChange("first_name")}
          />
          <CustomInput
            placeholder="Фамилия"
            onChange={handleInputChange("last_name")}
          />
          <CustomInput
            placeholder="Email"
            onChange={handleInputChange("email")}
          />
        </Step>
      )}
      {loadingResponseStepFirst ? <p>Загрузка...</p> : null}
      {errorResponseStepFirst ? (
        <p className="error">{errorResponseStepFirst.toString()}</p>
      ) : null}

      {step >= 2 && (
        <Step
          key={`${keyStepSecond}`}
          stepNumber={2}
          stepTitle="2. Получить код"
          onSubmit={onSubmitStepSecond}
          onResponse={onResponseStepSecond}
          buttonText="Получить код"
        >
          <p>Повторите Email: </p>
          <CustomInput placeholder="Email" onChange={handleEmailChange} />
        </Step>
      )}
      {loadingResponseStepSecond ? <p>Загрузка...</p> : null}
      {errorResponseStepSecond ? (
        <p className="error">{errorResponseStepSecond.toString()}</p>
      ) : null}
      {token ? (
        <p>
          token: {hideStr(token)}
          <br></br>email: {emailForCode}
        </p>
      ) : null}

      {step >= 3 && (
        <Step
          key={`${keyStepSecond}-${keyStepThird}`}
          stepNumber={3}
          stepTitle="3. Установить статус записи в таблицу кандидатов"
          onSubmit={onSubmitStepThirst}
          onResponse={onResponseStepThirst}
          buttonText="Установить статус"
        >
          <p>Подтвердите установку статуса: </p>
          {token ? <p>token: {hideStr(token)}</p> : null}
          <p>status: increased</p>
        </Step>
      )}
      {loadingResponseStepThirst ? <p>Загрузка...</p> : null}
      {errorResponseStepThirst ? (
        <p className="error">{errorResponseStepThirst.toString()}</p>
      ) : null}
    </div>
  );
};

export default App;
