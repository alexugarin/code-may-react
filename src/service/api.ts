// Тип для структуры параметров запроса
interface FetchOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

const performFetchA = async ({ endpoint, method, body}: FetchOptions) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const url = new URL(`http://193.19.100.32:7000/${endpoint}`);

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };
  console.log(config)
  try {
    const response = await fetch(url.toString(), config);
    console.log(response)
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    throw error;
  }
};


export { performFetchA };