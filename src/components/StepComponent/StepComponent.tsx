import React, { useState } from 'react';
import { hideStr } from '../../service/tokenService';
// Определяем тип для пропсов компонента
interface StepProps {
  stepNumber: number; // Номер шага
  stepTitle: string; // Заголовок шага
  onSubmit: () => Promise<string>; // Функция обратного вызова нажатия на кнопку
  onResponse: (response: string) => void; // Функция обратного вызова для передачи ответа родителю
  children: React.ReactNode; // Вложенные компоненты
  buttonText: string; // Текст кнопки
}

const Step: React.FC<StepProps> = ({ stepNumber, stepTitle, onSubmit, onResponse, children, buttonText }) => {
  const [serverResponse, setServerResponse] = useState<string | null>(null); // Состояние ответа сервера

  const handleSubmit = async () => {
    setServerResponse(''); // Обнуляем ответ сервера
    const response = await onSubmit(); // Ожидаем выполнения запроса
    setServerResponse(response); // Устанавливаем ответ сервера
    onResponse(response); // Вызываем функцию обратного вызова с ответом сервера
  };

  return (
    <div className={`step step-${stepNumber}`}>
    {stepNumber>=2 ? <div><hr></hr></div> : null}
      <h2>{stepTitle}</h2>
      {children}
      <button onClick={handleSubmit}>{serverResponse==="Установлен статус increased" ? 'Зафиксировать статус' :buttonText}</button>
      {serverResponse && <p>Ответ сервера:</p>}
      {stepNumber===2 ? serverResponse && <p>code: {hideStr(serverResponse)}</p> : serverResponse && <p>{serverResponse}</p>}
      
    </div>
  );
};

export default Step;
